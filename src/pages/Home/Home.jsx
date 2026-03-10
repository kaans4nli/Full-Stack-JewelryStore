import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJewelryItemsPublic } from "../../api/jewelryApi";
import { useCart } from "../../hooks";
import { useFavorites } from "../../hooks";
import toast from "react-hot-toast";

// Components
import { HeroSection } from '../../components/home/HeroSection/HeroSection';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { TrustBadges } from '../../components/home/TrustBadges';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllJewelryItemsPublic()
      .then((res) => {
        if (Array.isArray(res)) setItems(res);
        else if (res?.content) setItems(res.content);
        else setItems([]);
      })
      .catch((err) => {
        console.error("Jewelry fetch error:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Zamansız Zarafet"
        subtitle="2024 Koleksiyonu"
        description="Her anınıza değer katan, özenle seçilmiş takı koleksiyonumuzu keşfedin."
        backgroundImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop"
        ctaText="Koleksiyonu Keşfet"
        ctaLink="/products"
        secondaryCtaText="Yeni Gelenler"
        secondaryCtaLink="/products?filter=new"
      />

      {/* Kategoriler */}
      <CategoryGrid />

      {/* Öne Çıkan Ürünler */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-primary text-4xl font-semibold text-gray-900 mb-2">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-gray-600 text-lg">
                En çok tercih edilen takılarımız
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Tümünü Gör
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz ürün eklenmemiş
              </h3>
              <p className="text-gray-600">
                Yakında harika ürünlerle karşınızda olacağız!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.slice(0, 8).map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image_url: item.mainImageUrl || "https://via.placeholder.com/400x500?text=No+Image",
                    category: item.category,
                    material: item.material,
                    stock_quantity: item.stockQuantity || 0,
                    is_new: item.isNew || false,
                    discount_percent: item.discountPercent || 0
                  }}
                  onAddToCart={(product) => {
                    try {
                      addToCart(product.id, 1);
                      toast.success(`${product.name} sepete eklendi!`);
                    } catch (err) {
                      toast.error('Sepete eklenemedi');
                    }
                  }}
                  onAddToFavorites={(product) => {
                    toggleFavorite(product.id);
                    const isFav = isFavorite(product.id);
                    toast.success(isFav ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı');
                  }}
                  isFavorite={isFavorite(item.id)}
                  onQuickView={(product) => {
                    navigate(`/item/${product.id}`);
                  }}
                />
              ))}
            </div>
          )}

          {/* Tümünü Gör - Mobile */}
          {items.length > 0 && (
            <div className="mt-8 text-center md:hidden">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Tümünü Gör
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Güven Göstergeleri */}
      <TrustBadges />

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-primary text-3xl font-semibold text-gray-900 mb-4">
              Kampanyalardan Haberdar Olun
            </h2>
            <p className="text-gray-600 mb-8">
              Yeni koleksiyonlar, özel indirimler ve kampanyalardan ilk siz haberdar olun.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': 'var(--color-secondary)' }}
              />
              <button
                type="submit"
                className="px-8 py-3 text-gray-900 font-medium rounded-lg transition-all hover:shadow-md whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)'
                }}
              >
                Abone Ol
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
