import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jewelryApi } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductGrid from '../../components/product/ProductGrid';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category');
  const filter = searchParams.get('filter');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let productsData;
        if (search) {
          productsData = await jewelryApi.search(search);
        } else {
          productsData = await jewelryApi.getAll();
        }

        // Normalize backend product shape to frontend shape used by ProductCard
        const normalized = (productsData || []).map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.mainImageUrl || "https://via.placeholder.com/400x500?text=No+Image",
          hover_image_url: item.hoverImageUrl || null,
          category: item.category,
          material: item.material,
          stock_quantity: item.stockQuantity || 0,
          is_new: item.isNew || false,
          discount_percent: item.discountPercent || 0,
          // keep original payload for advanced usage
          __raw: item
        }));

        let filteredProducts = normalized;

        // Category filter
        if (category) {
          filteredProducts = filteredProducts.filter(
            p => p.category?.toLowerCase() === category.toLowerCase()
          );
        }

        // Sort filter
        if (filter === 'new') {
          filteredProducts = filteredProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (filter === 'bestsellers') {
          filteredProducts = filteredProducts.sort((a, b) => b.sales - a.sales);
        }

        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, filter, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {filter === 'new' ? 'Yeni Gelenler' : 
           filter === 'bestsellers' ? 'En Çok Satanlar' : 
           category ? `${category} Koleksiyonu` : 
           'Tüm Ürünler'}
        </h1>
        <p className="mt-2 text-gray-600">
          {products.length} ürün bulundu
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
