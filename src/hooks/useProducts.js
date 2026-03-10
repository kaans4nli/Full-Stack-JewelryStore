import { useState, useEffect, useCallback } from 'react';
import { jewelryApi } from '../api';

/**
 * useProducts Hook
 * Ürünleri API'den yükler ve yönetir
 * 
 * @param {object} options - { search, category, filter, limit, sortBy }
 * @returns {object} - { products, loading, error, total, refresh }
 * 
 * Kullanım:
 * const { products, loading } = useProducts({ category: 'necklace' });
 */
export const useProducts = (options = {}) => {
  const {
    search = null,
    category = null,
    filter = null,
    limit = null,
    sortBy = 'name',
  } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Ürünleri yükle
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // Arama sorgusu varsa
      if (search) {
        response = await jewelryApi.search(search);
      } else {
        // Standar GET
        response = await jewelryApi.getAll();
      }

      let data = response.data || [];

      // Kategori filtresi
      if (category) {
        data = data.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );
      }

      // Durum filtresi
      if (filter === 'new') {
        data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filter === 'bestsellers') {
        data = data.sort((a, b) => b.sales - a.sales);
      } else if (filter === 'price-low-high') {
        data = data.sort((a, b) => a.price - b.price);
      } else if (filter === 'price-high-low') {
        data = data.sort((a, b) => b.price - a.price);
      }

      // Sıralama
      if (sortBy && sortBy !== 'name') {
        data = data.sort((a, b) => {
          if (sortBy === 'price') {
            return a.price - b.price;
          } else if (sortBy === 'rating') {
            return b.rating - a.rating;
          }
          return 0;
        });
      }

      // Limit
      if (limit) {
        data = data.slice(0, limit);
      }

      setTotal(data.length);
      setProducts(data);
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err);
      setError(err.response?.data?.message || 'Ürünler yüklenemedi');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, filter, limit, sortBy]);

  // Dependencies değiştiğinde yeniden yükle
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    refresh: fetchProducts,
  };
};

export default useProducts;
