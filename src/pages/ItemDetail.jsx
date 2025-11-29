import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJewelryItemByIdPublic } from "../api/jewelryApi";
import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const reviews = { average: 4, totalCount: 117 };

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        getJewelryItemByIdPublic(id)
            .then((res) => setItem(res))
            .catch((err) => {
                console.error("Item detail fetch error:", err);
                setItem(null);
            });
    }, [id]);

    if (!item)
        return <p className="text-center py-10 text-lg">Ürün bulunamadı.</p>;

    // Tüm görselleri hazırla, item null değilken
    const allImages = [...(item.galleryImages || [])];

    const nextImage = () => {
        setCurrent((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrent((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="bg-white">
            <div className="pt-6">
                {/* IMAGE SLIDER */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-5xl lg:px-8">
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-200">
                        <img
                            src={allImages[current]}
                            alt="Ürün görseli"
                            className="w-full h-full object-contain"
                        />

                        {/* Sol ok */}
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 
                 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                        >
                            ‹
                        </button>

                        {/* Sağ ok */}
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 
                 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                        >
                            ›
                        </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex gap-3 mt-4 justify-center">
                        {allImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setCurrent(index)}
                                className={`w-20 h-20 object-cover rounded-md border cursor-pointer 
                   ${current === index ? "border-indigo-600" : "border-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Product info */}
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16
          sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 
          lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 
          lg:pt-16 lg:pb-24">

                    {/* Ürün başlık */}
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {item.name}
                        </h1>
                    </div>

                    {/* Sağ sütun */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <p className="text-3xl tracking-tight text-gray-900">
                            {item.price} ₺
                        </p>

                        {/* Reviews */}
                        <div className="mt-6">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                reviews.average > rating
                                                    ? "text-gray-900"
                                                    : "text-gray-200",
                                                "size-5 shrink-0"
                                            )}
                                        />
                                    ))}
                                </div>
                                <a
                                    href="#"
                                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {reviews.totalCount} değerlendirme
                                </a>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="mt-10 flex w-full items-center justify-center 
              rounded-md bg-indigo-600 px-8 py-3 text-base 
              font-medium text-white hover:bg-indigo-700"
                        >
                            Sepete Ekle
                        </button>
                    </div>

                    {/* Açıklama */}
                    <div className="py-10 lg:col-span-2 lg:col-start-1 
            lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">

                        <div>
                            <h3 className="sr-only">Açıklama</h3>
                            <div className="space-y-6">
                                <p className="text-base text-gray-900">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {(item.categoryName || item.materialName) && (
                            <div className="mt-10">
                                <h2 className="text-sm font-medium text-gray-900">
                                    Detaylar
                                </h2>
                                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                                    {item.categoryName && (
                                        <p className="text-sm text-gray-600">
                                            {item.categoryName}
                                        </p>
                                    )}
                                    <p>,</p>
                                    {item.materialName && (
                                        <p className="text-sm text-gray-600">
                                            {item.materialName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
