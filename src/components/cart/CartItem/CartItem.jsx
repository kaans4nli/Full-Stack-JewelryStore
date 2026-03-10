import React, { useState } from 'react';
import { useCart } from '../../../hooks';

/**
 * CartItem Component
 * Sepet içinde bir ürünü gösteren bileşen
 * 
 * @param {object} item - Sepet öğesi (id, name, price, image_url, quantity)
 */
const CartItem = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item.id);
    } catch (err) {
      console.error('Ürün kaldırılamadı:', err);
      setIsRemoving(false);
    }
  };

  const itemTotal = (item.price || 0) * quantity;

  return (
    <div
      className={`
        flex gap-4 p-4 border-b border-gray-200 last:border-b-0
        transition-opacity duration-200
        ${isRemoving ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.image_url || '/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        
        <p className="text-sm text-gray-600 mb-3">
          ${(item.price || 0).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || isRemoving}
            className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Azalt"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isRemoving}
            className="w-12 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            aria-label="Miktar"
          />

          <button
            onClick={handleIncrement}
            disabled={isRemoving}
            className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Artır"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Total Price & Remove Button */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Sepetten kaldır"
        >
          {isRemoving ? 'Kaldırılıyor...' : 'Kaldır'}
        </button>

        <div className="text-right">
          <p className="text-sm text-gray-600">Toplam</p>
          <p className="text-lg font-semibold text-gray-900">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
