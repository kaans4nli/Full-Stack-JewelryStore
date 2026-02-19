import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CategoryGrid Component
 * Ana sayfada kategori kartlarını gösterir
 */
const CategoryGrid = ({ categories = [] }) => {
  // Default kategoriler (eğer prop gelmezse)
  const defaultCategories = [
    {
      name: "Kolyeler",
      href: "/products?category=necklace",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
      count: 12
    },
    {
      name: "Yüzükler",
      href: "/products?category=ring",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
      count: 18
    },
    {
      name: "Küpeler",
      href: "/products?category=earring",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
      count: 24
    },
    {
      name: "Bileklikler",
      href: "/products?category=bracelet",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
      count: 15
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-primary text-4xl font-semibold text-gray-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Size en uygun takıyı bulmak için koleksiyonlarımıza göz atın
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-primary text-2xl font-semibold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {category.count} ürün
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
