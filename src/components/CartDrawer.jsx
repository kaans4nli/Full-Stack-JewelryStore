import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, setOpen }) {
    const { cart, removeItem, updateQuantity, loading } = useCart();

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-50">
            {/* BACKDROP */}
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out data-closed:opacity-0"
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
                            <div className="flex h-full flex-col bg-white shadow-xl">

                                {/* HEADER */}
                                <div className="flex items-start justify-between px-4 py-6 border-b">
                                    <DialogTitle className="text-lg font-medium text-gray-900">
                                        Shopping Cart
                                    </DialogTitle>
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setOpen(false)}
                                    >
                                        <XMarkIcon className="size-6" />
                                    </button>
                                </div>

                                {/* ITEMS */}
                                <div className="flex-1 overflow-y-auto px-4 py-6">
                                    {loading && (
                                        <p className="text-center text-gray-500">Loading cart...</p>
                                    )}

                                    {!loading && cart?.items?.length === 0 && (
                                        <p className="text-center text-gray-500 mt-20">
                                            Sepetiniz boş.
                                        </p>
                                    )}

                                    {!loading && cart?.items?.map((item) => {
                                        const jewelry = item.jewelry;
                                        const image = jewelry.galleryImages?.[0];

                                        return (
                                            <div key={item.id} className="flex py-6 border-b -my-6 divide-y divide-gray-200">
                                                {/* IMAGE */}
                                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <img
                                                        src={image}
                                                        alt={jewelry.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                {/* INFO */}
                                                <div className="ml-4 flex flex-1 flex-col justify-between">
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{jewelry.name}</h3>
                                                        <p>{jewelry.price} TL</p>
                                                    </div>
                                                    <div className="flex gap-1 text-sm text-gray-600">
                                                        <p className="mt-1 text-sm text-gray-500">{jewelry.categoryName}</p>
                                                        <p className="mt-1 text-sm text-gray-500">,</p>
                                                        <p className="mt-1 text-sm text-gray-500">{jewelry.materialName}</p>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(item.id, item.quantity - 1)
                                                                }
                                                                disabled={item.quantity <= 1}
                                                                className="px-2 py-1 border rounded disabled:opacity-50"
                                                            >
                                                                -
                                                            </button>

                                                            <span className="text-gray-700">{item.quantity}</span>

                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(item.id, item.quantity + 1)
                                                                }
                                                                className="px-2 py-1 border rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <div className="flex">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* FOOTER */}
                                {cart && cart.items?.length > 0 && (
                                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Total</p>
                                            <p>{cart.totalPrice} TL</p>
                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Shipping and taxes calculated at checkout.
                                        </p>

                                        <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
                                            Checkout
                                        </button>

                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="text-indigo-600 hover:text-indigo-500 text-sm"
                                            >
                                                Continue Shopping →
                                            </button>
                                        </div>
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
