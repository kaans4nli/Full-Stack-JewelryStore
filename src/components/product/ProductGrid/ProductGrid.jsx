import React, { useState } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { useCart } from '../../../hooks';
import { useFavorites } from '../../../hooks';

/**
 * ProductGrid Component
 * Ürünleri responsive grid formatında gösterir
 * 
 * @param {array} products - Gösterilecek ürünler
 * @param {number} columns - Grid sütun sayısı (default: 4)
 * @param {function} onProductClick - Ürüne tıklama callback
 */
const ProductGrid = ({ 
  products = [], 
  columns = 4,
  onProductClick 
}) => {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10m8-12L4 7m0 0v10m0 0l8 4m0 0l8-4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
          <p className="text-gray-500">
            Gösterilecek ürün yok. Lütfen farklı bir kategori seçin.
          </p>
        </div>
      </div>
    );
  }

  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product.id);
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  return (
    <div className="w-full">
      {/* Grid */}
      <div
        className={`
          grid 
          ${gridColsMap[columns] || gridColsMap[4]}
          gap-4
          sm:gap-6
          lg:gap-8
        `}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleToggleFavorite}
            onQuickView={handleQuickView}
            isFavorite={isFavorite(product.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">
            Bu kategoride ürün bulunmamaktadır.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
