import { useState, useEffect, useCallback } from 'react';

/**
 * useFavorites Hook
 * LocalStorage'de favorileri yönetir
 * 
 * @returns {object} - { favorites, toggleFavorite, isFavorite, clearFavorites }
 * 
 * Kullanım:
 * const { favorites, toggleFavorite, isFavorite } = useFavorites();
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = 'jewelry_favorites';

  // LocalStorage'dan load et
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Favoriler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // LocalStorage'a kaydet
  const saveFavorites = useCallback((newFavorites) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (err) {
      console.error('Favoriler kaydedilemedi:', err);
    }
  }, []);

  // Favoriye ekle/çıkar
  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // Favoride mi kontrol et
  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId);
  }, [favorites]);

  // Tüm favorileri temizle
  const clearFavorites = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFavorites([]);
    } catch (err) {
      console.error('Favoriler temizlenemedi:', err);
    }
  }, []);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};

export default useFavorites;
