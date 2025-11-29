import React, { useEffect, useState } from "react";
import { getAllJewelryItemsPublic } from "../api/jewelryApi";
import { Link } from "react-router-dom";

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllJewelryItemsPublic()
      .then((res) => {
        // API'den gelen veri array mi kontrol et
        if (Array.isArray(res)) setItems(res);
        else if (res?.content) setItems(res.content); // Page objesi gelirse
        else setItems([]);
      })
      .catch((err) => {
        console.error("Jewelry fetch error:", err);
        setItems([]);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Ürünler
        </h2>

        {/* Grid */}
        <div
          className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10
          sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {items.length === 0 ? (
            <p>Ürün bulunamadı.</p>
          ) : (
            items.map((item) => (
              <Link key={item.id} to={`/item/${item.id}`} className="group">
                {/* Resim */}
                <img
                  src={
                    item.mainImageUrl
                      ? item.mainImageUrl // artık direkt backend URL geliyor
                      : "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.description || item.name}
                  className="aspect-square w-full rounded-lg bg-gray-200
                  object-cover group-hover:opacity-75 xl:aspect-7/8"
                />

                {/* İsim */}
                <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>

                {/* Fiyat */}
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {item.price} ₺
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
