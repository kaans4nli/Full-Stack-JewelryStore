import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useAuth } from "../../../context/AuthContext";

/**
 * ProductCard Component
 * Takı ürünlerini göstermek için özel tasarlanmış kart komponenti
 * 
 * @param {object} product - Ürün bilgileri
 * @param {function} onAddToCart - Sepete ekleme fonksiyonu
 * @param {function} onAddToFavorites - Favorilere ekleme fonksiyonu
 * @param {boolean} isFavorite - Favori durumu
 * @param {function} onQuickView - Hızlı görünüm fonksiyonu
 */
export const ProductCard = ({
  product,
  onAddToCart,
  onAddToFavorites,
  isFavorite = false,
  onQuickView,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    id,
    name,
    price,
    image_url,
    hover_image_url, // İkinci görsel (hover için)
    category,
    material,
    stock_quantity,
    is_new,
    discount_percent
  } = product;

  const isOutOfStock = stock_quantity === 0;
  const hasDiscount = discount_percent > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount_percent / 100) : null;

  const handleAddToCart = (e) => {
    if (!user) {
      navigate("/login");
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToFavorites) {
      onAddToFavorites(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="product-badges">
        {is_new && <span className="badge badge-new">Yeni</span>}
        {hasDiscount && <span className="badge badge-discount">-{discount_percent}%</span>}
        {isOutOfStock && <span className="badge badge-stock">Tükendi</span>}
      </div>

      {/* Favorite Button */}
      <button
        className={`product-favorite ${isFavorite ? 'active' : ''}`}
        onClick={handleToggleFavorite}
        aria-label="Favorilere ekle"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 17.5L8.825 16.45C4.4 12.45 1.5 9.85 1.5 6.75C1.5 4.35 3.35 2.5 5.75 2.5C7.1 2.5 8.4 3.15 9.25 4.15H10.75C11.6 3.15 12.9 2.5 14.25 2.5C16.65 2.5 18.5 4.35 18.5 6.75C18.5 9.85 15.6 12.45 11.175 16.45L10 17.5Z" />
        </svg>
      </button>

      {/* Image Container */}
      <Link to={`/item/${id}`} className="product-image-link">
        <div className="product-image-container">
          {!imageLoaded && <div className="skeleton product-image-skeleton"></div>}
          
          <img
            src={image_url}
            alt={name}
            className={`product-image product-image-main ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {hover_image_url && (
            <img
              src={hover_image_url}
              alt={`${name} - alternatif görünüm`}
              className={`product-image product-image-hover ${isHovered ? 'visible' : ''}`}
              loading="lazy"
            />
          )}

          {/* Quick Actions - Hover'da görünür */}
          <div className={`product-quick-actions ${isHovered ? 'visible' : ''}`}>
            <button
              className="quick-action-btn"
              onClick={handleQuickView}
              aria-label="Hızlı görünüm"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            </button>
            
            {!isOutOfStock && (
              <button
                className="quick-action-btn"
                onClick={handleAddToCart}
                aria-label="Sepete ekle"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v12a2 2 0 002 2h10a2 2 0 002-2V6l-3-4z" />
                  <line x1="10" y1="9" x2="10" y2="14" />
                  <line x1="7.5" y1="11.5" x2="12.5" y2="11.5" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-info">
        {/* Category & Material */}
        <div className="product-meta">
          <span className="product-category">{category?.name}</span>
          {material && (
            <>
              <span className="product-meta-separator">•</span>
              <span className="product-material">{material?.name}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/item/${id}`} className="product-name">
          <h3>{name}</h3>
        </Link>

        {/* Price */}
        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="price-discounted">{discountedPrice?.toLocaleString('tr-TR')} ₺</span>
              <span className="price-original">{price?.toLocaleString('tr-TR')} ₺</span>
            </>
          ) : (
            <span className="price-current">{price?.toLocaleString('tr-TR')} ₺</span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!isOutOfStock && (
          <button
            className="btn btn-primary btn-sm product-add-to-cart"
            onClick={handleAddToCart}
          >
            Sepete Ekle
          </button>
        )}
        
        {isOutOfStock && (
          <button className="btn btn-secondary btn-sm" disabled>
            Stokta Yok
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
