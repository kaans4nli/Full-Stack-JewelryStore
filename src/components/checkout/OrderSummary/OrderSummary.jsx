import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function OrderSummary({ cart, onRemoveItem, onUpdateQuantity }) {
  const totalPrice =
    cart?.totalPrice ??
    cart?.items?.reduce(
      (sum, item) => sum + item.jewelry.price * item.quantity,
      0
    ) ??
    0;

  return (
    <div className="sticky top-10 h-fit bg-gradient-to-br from-slate-800 via-slate-900 to-slate-700 rounded-3xl shadow-2xl border border-slate-700 p-7 text-white">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-amber-400 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#f59e0b" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
        Sipariş Özeti
      </h2>

      <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
        {cart.items?.length === 0 && (
          <div className="text-slate-400 italic text-center py-8">Sepetiniz boş.</div>
        )}
        {cart.items?.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-white/10 border border-slate-700 rounded-xl p-3 items-center shadow-sm"
          >
            <div className="w-16 h-16 overflow-hidden rounded-lg border border-slate-600 bg-slate-900 flex items-center justify-center">
              <img
                src={item.jewelry.galleryImages?.[0]}
                alt={item.jewelry.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2">
                <p className="font-semibold truncate text-white">{item.jewelry.name}</p>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition"
                  title="Ürünü kaldır"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2 gap-2">
                <span className="text-amber-400 font-bold">{item.jewelry.price} TL</span>
                <select
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                  className="border border-slate-600 rounded px-2 py-1 bg-slate-800 text-white focus:border-amber-500 focus:ring-amber-200"
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 mt-6 pt-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Toplam</span>
          <span className="text-amber-400">{totalPrice} TL</span>
        </div>
      </div>
    </div>
  );
}
