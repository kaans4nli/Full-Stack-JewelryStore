import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getAddresses, createAddress } from "../api/addressApi";
import checkoutApi from "../api/checkoutApi";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
    const { user } = useAuth();
    const { cart, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    // Address modal
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        addressLine: "",
        city: "",
        country: "",
        phone: "",
    });

    // Login guard
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    // Fetch addresses
    useEffect(() => {
        getAddresses().then((data) => {
            setAddresses(data);
            const def = data.find((a) => a.isDefault);
            if (def) setSelectedAddress(def);
        });
    }, []);

    // ✅ CHECKOUT FLOW
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
            // 1️⃣ ORDER OLUŞTUR (PENDING)
            const order = await checkoutApi.createOrder({
                userId: user.id,
                addressId: selectedAddress.id,
                items: cart.items.map((item) => ({
                    jewelryId: item.jewelry.id,
                    quantity: item.quantity,
                    price: item.jewelry.price,
                })),
            });

            // 2️⃣ PAYMENT INTENT
            const paymentRes = await checkoutApi.createPaymentIntent({
                orderId: order.id,
            });

            const clientSecret = paymentRes.clientSecret;

            // 3️⃣ STRIPE CONFIRM
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
                setLoading(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                toast.success("Ödeme başarılı 🎉");
                await clearCart();
                navigate("/checkout-success");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ödeme sırasında bir hata oluştu");
        }

        setLoading(false);
    };

    // ADD ADDRESS
    const handleAddressCreate = async () => {
        const res = await createAddress(newAddress);
        setAddresses((prev) => [...prev, res]);
        setSelectedAddress(res);
        setShowAddAddress(false);
        setNewAddress({
            fullName: "",
            addressLine: "",
            city: "",
            country: "",
            phone: "",
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
                {/* ADDRESSES */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-black">
                            Teslimat Adresi
                        </h2>
                        <button
                            className="text-indigo-600"
                            onClick={() => setShowAddAddress(true)}
                        >
                            + Yeni Adres
                        </button>
                    </div>

                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <label
                                key={addr.id}
                                className="flex items-start border p-4 rounded-lg cursor-pointer text-black"
                            >
                                <input
                                    type="radio"
                                    checked={selectedAddress?.id === addr.id}
                                    onChange={() => setSelectedAddress(addr)}
                                />
                                <div className="ml-3">
                                    <p className="font-medium">{addr.fullName}</p>
                                    <p className="text-sm">{addr.addressLine}</p>
                                    <p className="text-sm">
                                        {addr.city}, {addr.country}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {addr.phone}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* PAYMENT */}
                <div className="text-black">
                    <h2 className="text-xl font-semibold mb-4">
                        Ödeme Yöntemi
                    </h2>
                    <div className="border p-6 rounded-lg">
                        <CardElement options={{ hidePostalCode: true }} />
                    </div>
                </div>
            </div>

            {/* RIGHT – SUMMARY */}
            <div className="text-black bg-white border rounded-lg p-6 shadow-sm sticky top-10 h-fit">
                <h2 className="text-xl font-semibold mb-4 text-black">
                    Sipariş Özeti
                </h2>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 border-b pb-4"
                        >
                            <div className="w-20 h-20 overflow-hidden border rounded">
                                <img
                                    src={item.jewelry.galleryImages?.[0]}
                                    alt={item.jewelry.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-medium">
                                        {item.jewelry.name}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between mt-2">
                                    <p>{item.jewelry.price} TL</p>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(
                                                item.id,
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {[...Array(8)].map((_, i) => (
                                            <option key={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                        <p>Toplam</p>
                        <p>{cart.totalPrice} TL</p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded"
                    >
                        {loading ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
                    </button>
                </div>
            </div>

            {/* ADD ADDRESS MODAL */}
            <Dialog open={showAddAddress} onClose={setShowAddAddress}>
                <div className="fixed inset-0 bg-black/40" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Yeni Adres
                        </h2>

                        {Object.entries(newAddress).map(([k, v]) => (
                            <input
                                key={k}
                                className="w-full border p-2 mb-2"
                                placeholder={k}
                                value={v}
                                onChange={(e) =>
                                    setNewAddress({
                                        ...newAddress,
                                        [k]: e.target.value,
                                    })
                                }
                            />
                        ))}

                        <button
                            onClick={handleAddressCreate}
                            className="w-full bg-indigo-600 text-white py-2 rounded"
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>

    );
}
