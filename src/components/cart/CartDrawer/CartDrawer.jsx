import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CartDrawer({ open, setOpen }) {
    const navigate = useNavigate();
    const { cart, removeItem, updateQuantity, loading } = useCart();

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-50">
            {/* BACKDROP */}
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/60 transition-opacity duration-300 ease-out data-closed:opacity-0"
            />

            {/* DRAWER CONTAINER */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    {/* Drawer panel slides from the right */}
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-300 data-closed:translate-x-full"
                        >
                            {/* CONTENT */}
                            <div className="flex h-full flex-col bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl border-l border-slate-700">

                                {/* HEADER */}
                                <div className="flex items-start justify-between px-6 py-6 border-b border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-500/20 p-2 rounded-lg">
                                            <ShoppingBagIcon className="size-6 text-amber-400" />
                                        </div>
                                        <DialogTitle className="text-xl font-bold text-white">
                                            Shopping Cart
                                        </DialogTitle>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                                        onClick={() => setOpen(false)}
                                    >
                                        <XMarkIcon className="size-6" />
                                    </motion.button>
                                </div>

                                {/* ITEMS */}
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                    {loading && (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-pulse">
                                                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        </div>
                                    )}

                                    {!loading && (!cart?.items || cart.items.length === 0) && (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <ShoppingBagIcon className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
                                            <p className="text-gray-400">
                                                Your cart is empty.
                                            </p>
                                        </div>
                                    )}

                                    {!loading && cart?.items?.map((item, index) => {
                                        const jewelry = item.jewelry || {};
                                        const image = jewelry.mainImageUrl || jewelry.galleryImages?.[0];

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex gap-4 pb-6 mb-6 border-b border-slate-700 last:border-b-0"
                                            >
                                                {/* IMAGE */}
                                                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-700">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={jewelry.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            <ShoppingBagIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* INFO */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-white font-semibold">{jewelry.name || "Unknown Item"}</h3>
                                                        <div className="flex gap-1 text-xs text-gray-400 mt-1">
                                                            {jewelry.categoryName && <span>{jewelry.categoryName}</span>}
                                                            {jewelry.materialName && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{jewelry.materialName}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <p className="text-amber-400 font-semibold mt-2">{jewelry.price} TL</p>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-1">
                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() =>
                                                                    item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)
                                                                }
                                                                disabled={item.quantity <= 1}
                                                                className="px-2 py-1 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                                                            >
                                                                −
                                                            </motion.button>

                                                            <span className="text-gray-300 w-6 text-center text-sm">{item.quantity}</span>

                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() =>
                                                                    updateQuantity(item.id, item.quantity + 1)
                                                                }
                                                                className="px-2 py-1 hover:bg-slate-600 text-gray-300 rounded transition"
                                                            >
                                                                +
                                                            </motion.button>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition"
                                                            title="Remove"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* FOOTER */}
                                {cart?.items && cart.items.length > 0 && (
                                    <div className="border-t border-slate-700 px-6 py-6 bg-slate-900/50 backdrop-blur">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-400">Subtotal</p>
                                            <p className="text-gray-300">{(cart.totalPrice || 0).toFixed(2)} TL</p>
                                        </div>

                                        <p className="text-xs text-gray-500 mb-4">
                                            Shipping and taxes calculated at checkout.
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setOpen(false);
                                                navigate("/checkout");
                                            }}
                                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition font-semibold shadow-lg mb-3"
                                        >
                                            Checkout
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setOpen(false)}
                                            className="w-full text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 py-2 rounded-lg transition text-sm font-medium"
                                        >
                                            Continue Shopping →
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
