import React from 'react';
import './Button.css';

/**
 * Button Component
 * Lüks takı sitesi için özelleştirilmiş buton komponenti
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Yükleme durumu
 * @param {boolean} disabled - Devre dışı durumu
 * @param {React.ReactNode} children - Buton içeriği
 * @param {React.ReactNode} leftIcon - Sol taraf ikonu
 * @param {React.ReactNode} rightIcon - Sağ taraf ikonu
 * @param {function} onClick - Tıklama olayı
 * @param {string} className - Ek CSS sınıfları
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const loadingClass = loading ? 'btn-loading' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="spinner" aria-label="Yükleniyor..."></span>
      )}
      {!loading && leftIcon && (
        <span className="btn-icon-left">{leftIcon}</span>
      )}
      {!loading && <span className="btn-text">{children}</span>}
      {!loading && rightIcon && (
        <span className="btn-icon-right">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
