import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import { Button } from '../../components/common/Button';

const Cart = () => {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sepetiniz Boş
          </h2>
          <p className="text-gray-600 mb-8">
            Harika ürünlerimizi incelemek için başlamaya hazır mısınız?
          </p>
          <Link to="/products">
            <Button>Ürünleri Gözat</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Alışveriş Sepeti
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Sipariş Özeti
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Vergi</span>
                <span>${(total * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 text-lg font-semibold">
              <span>Toplam</span>
              <span>${(total * 1.18).toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <Button className="w-full">Ödemeye Geç</Button>
            </Link>

            <Link 
              to="/products" 
              className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
