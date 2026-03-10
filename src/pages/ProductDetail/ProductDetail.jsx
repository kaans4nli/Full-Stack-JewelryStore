import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJewelryItemByIdPublic } from "../../api/jewelryApi";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const reviews = { average: 4, totalCount: 117 };

export default function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getJewelryItemByIdPublic(id)
      .then((res) => setItem(res))
      .catch((err) => {
        console.error("Item detail fetch error:", err);
        toast.error("Ürün yüklenirken bir hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen={true} size="lg" label="Ürün detayları hazırlanıyor..." />;
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl text-gray-600 font-primary">Ürün bulunamadı.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-secondary hover:underline font-medium"
        >
          Koleksiyona Geri Dön
        </button>
      </div>
    );
  }

  const allImages = item.galleryImages?.length > 0 ? item.galleryImages : [item.mainImageUrl || "https://via.placeholder.com/600"];

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Lütfen önce giriş yapın.");
      navigate("/login");
      return;
    }

    if (item.stockQuantity === 0) {
      toast.error("Bu ürün stokta kalmadı.");
      return;
    }

    try {
      await addToCart(item.id);
      toast.success(`${item.name} sepetinize eklendi!`);
    } catch (err) {
      toast.error("Sepete eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="bg-white font-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Breadcrumb - Navigasyon Yolu */}
        <nav className="mb-8 flex text-sm text-gray-500">
          <Link to="/" className="hover:text-secondary transition-colors">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-secondary transition-colors">Koleksiyon</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{item.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

          {/* Sol Kolon: Resim Galerisi */}
          <div className="flex flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
              <img
                src={allImages[current]}
                alt={item.name}
                className="h-full w-full object-cover object-center transition-opacity duration-500"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrent((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition-all"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrent((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition-all"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Listesi */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={classNames(
                    "relative h-24 overflow-hidden rounded-lg border-2 transition-all",
                    current === index ? "border-secondary shadow-gold-sm" : "border-transparent hover:border-gray-200"
                  )}
                >
                  <img src={img} className="h-full w-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: Ürün Bilgileri */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-primary text-4xl font-bold tracking-tight text-gray-900 uppercase">{item.name}</h1>
                <div className="mt-3 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(reviews.average > rating ? "text-secondary" : "text-gray-200", "h-5 w-5 flex-shrink-0")}
                      />
                    ))}
                  </div>
                  <p className="ml-3 text-sm text-gray-500 underline">{reviews.totalCount} değerlendirme</p>
                </div>
              </div>
              {item.stockQuantity < 5 && item.stockQuantity > 0 && (
                <span className="badge badge-warning">Son {item.stockQuantity} Ürün!</span>
              )}
            </div>

            <div className="mt-6">
              <h2 className="sr-only">Ürün Bilgisi</h2>
              <p className="text-3xl font-semibold tracking-tight text-gray-900 font-primary">
                {item.price?.toLocaleString('tr-TR')} ₺
              </p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest font-primary">Açıklama</h3>
              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Özellikler Tablosu */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-gray-100 py-6">
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wider">Kategori</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{item.categoryName || "Genel"}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wider">Materyal</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{item.materialName || "Belirtilmemiş"}</dd>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={item.stockQuantity === 0}
                className={classNames(
                  "btn btn-lg flex-1 gap-3",
                  item.stockQuantity === 0 ? "bg-gray-200 cursor-not-allowed text-gray-500" : "btn-primary"
                )}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {item.stockQuantity === 0 ? "Stokta Yok" : "Sepete Ekle"}
              </button>
            </div>

            {/* Ek Bilgiler (Trust Badges mantığında) */}
            <div className="mt-10 grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Ücretsiz Kargo</span>
              </div>
              <div className="flex flex-col items-center border-x border-gray-100 px-2">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Sertifikalı Ürün</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}