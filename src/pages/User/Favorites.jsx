import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid/ProductGrid';
import { useFavorites } from '../../hooks/useFavorites';
import { getJewelryItemByIdPublic } from '../../api/jewelryApi';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { favorites, loading: favLoading, clearFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      if (!favorites || favorites.length === 0) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const items = await Promise.all(
          favorites.map((id) => getJewelryItemByIdPublic(id).catch(() => null))
        );

        if (!mounted) return;
        const normalized = items
          .filter(Boolean)
          .map((item) => ({
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
            __raw: item
          }));

        setProducts(normalized);
      } catch (err) {
        console.error('Favori ürünler yüklenemedi:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [favorites]);

  if (favLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-12 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-primary text-4xl font-bold text-white mb-2">My Favorites</h1>
              <p className="text-gray-400">{favorites.length} item{favorites.length !== 1 ? 's' : ''} in your wishlist</p>
            </div>
            {favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFavorites}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg transition"
              >
                Clear All
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg mb-6">You haven't added any favorites yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div>
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <ProductGrid products={products} columns={4} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
