import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getAddresses, createAddress } from "../../api/addressApi";
import checkoutApi from "../../api/checkoutApi";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { OrderSummary } from "../../components/checkout/OrderSummary";

export default function Checkout() {
    const { user } = useAuth();
    const { cart, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        addressLine: "",
        city: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);
    useEffect(() => {
        getAddresses().then((data) => {
            setAddresses(data);
            const def = data.find((a) => a.isDefault);
            if (def) setSelectedAddress(def);
        });
    }, []);

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error("Lütfen bir adres seçin");
            return;
        }
        if (!stripe || !elements) {
            toast.error("Stripe yükleniyor...");
            return;
        }
        setLoading(true);
        try {
            const order = await checkoutApi.createOrder({
                userId: user.id,
                addressId: selectedAddress.id,
                items: cart.items.map((item) => ({
                    jewelryId: item.jewelry.id,
                    quantity: item.quantity,
                    price: item.jewelry.price,
                })),
            });
            const paymentRes = await checkoutApi.createPaymentIntent({ orderId: order.id });
            const clientSecret = paymentRes.clientSecret;
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });
            if (result.error) {
                toast.error(result.error.message);
                navigate("/checkout/failed");
                setLoading(false);
                return;
            }
            if (result.paymentIntent.status === "succeeded") {
                toast.success("Ödeme başarılı 🎉");
                await clearCart();
                navigate("/checkout/success");
            } else {
                toast.error("Ödeme tamamlanamadı");
                navigate("/checkout/failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ödeme sırasında bir hata oluştu");
            navigate("/checkout/failed");
        }
        setLoading(false);
    };
    const handleAddressCreate = async () => {
        const res = await createAddress(newAddress);
        setAddresses((prev) => [...prev, res]);
        setSelectedAddress(res);
        setShowAddAddress(false);
        setNewAddress({ fullName: "", addressLine: "", city: "", country: "", phone: "" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-12 px-2">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 shadow-2xl rounded-3xl bg-white/10 backdrop-blur-md p-0 lg:p-8">
                {/* SOL BLOK: Adres ve ödeme */}
                <div className="lg:col-span-2 flex flex-col gap-10 p-6 lg:p-0">
                    {/* Adresler */}
                    <div className="bg-white/90 rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Teslimat Adresi</h2>
                            <button
                                className="text-amber-600 hover:text-amber-700 font-semibold text-base"
                                onClick={() => setShowAddAddress(true)}
                            >
                                + Yeni Adres
                            </button>
                        </div>
                        <div className="space-y-4">
                            {addresses.length === 0 && (
                                <div className="text-gray-500 italic">Kayıtlı adres yok.</div>
                            )}
                            {addresses.map((addr) => (
                                <label
                                    key={addr.id}
                                    className={`flex items-start border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? "border-amber-500 bg-amber-50/40" : "border-slate-200 bg-white/70 hover:border-amber-300"}`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddress?.id === addr.id}
                                        onChange={() => setSelectedAddress(addr)}
                                        className="mt-1 accent-amber-500"
                                    />
                                    <div className="ml-4">
                                        <p className="font-semibold text-slate-900">{addr.fullName}</p>
                                        <p className="text-sm text-slate-700">{addr.addressLine}</p>
                                        <p className="text-sm text-slate-700">{addr.city}, {addr.country}</p>
                                        <p className="text-xs text-slate-500">{addr.phone}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Ödeme */}
                    <div className="bg-white/90 rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Ödeme Yöntemi</h2>
                        <div className="border-2 border-slate-200 rounded-xl p-6 bg-white/80">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={loading || !selectedAddress}
                            className="mt-8 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            {loading ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
                        </button>
                    </div>
                </div>
                {/* SAĞ BLOK: Sipariş Özeti */}
                <div className="p-6 lg:p-0">
                    <OrderSummary
                        cart={cart}
                        onRemoveItem={removeItem}
                        onUpdateQuantity={updateQuantity}
                    />
                </div>
            </div>
            {/* Adres Ekle Modalı */}
            <Dialog open={showAddAddress} onClose={() => setShowAddAddress(false)}>
                <div className="fixed inset-0 bg-black/40 z-40" />
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Yeni Adres</h2>
                        <div className="space-y-3">
                            {Object.entries(newAddress).map(([k, v]) => (
                                <input
                                    key={k}
                                    className="w-full border-2 border-slate-200 rounded-lg p-3 text-black focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                                    placeholder={k}
                                    value={v}
                                    onChange={(e) => setNewAddress({ ...newAddress, [k]: e.target.value })}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowAddAddress(false)}
                                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 font-semibold transition"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddressCreate}
                                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 font-semibold transition"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}