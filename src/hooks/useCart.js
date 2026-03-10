import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * useCart Hook
 * CartContext'e kolay erişim sağlar
 * 
 * @returns {object} - { cart, loading, addToCart, removeItem, updateQuantity, clearCart, loadCart }
 * 
 * Kullanım:
 * const { cart, addToCart } = useCart();
 * addToCart(jewelryId, quantity);
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};

export default useCart;
