import { useState, useEffect } from "react";
import {
  createJewelryItem,
  updateJewelryItem,
  getJewelryItemById,
  getCategories,
  getMaterials
} from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";

export default function AdminJewelryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: "",
    materialId: "",
    mainImageUrl: "",
    galleryImages: []
  });

  const fileInputRef = useRef(null);

  // Kategoriler ve malzemeler yüklenir
  useEffect(() => {
    getCategories().then(setCategories);
    getMaterials().then(setMaterials);

    if (id) {
      getJewelryItemById(id).then(setForm);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) await updateJewelryItem(id, form);
    else await createJewelryItem(form);

    navigate("/admin/jewelry-items");
  };

  // Dosya seçimi
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Dosyaları işleme
  const processFiles = (files) => {
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result);

        // Tüm dosyalar okunduğunda setState
        if (newImages.length === files.length) {
          setForm((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file); // Base64 olarak okuyor
    });
  };

  // Resim silme
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {id ? "Ürünü Düzenle" : "Yeni Ürün"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Ürün Adı */}
        <label className="label-field">Ürün Adı</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        {/* Açıklama */}
        <label className="label-field">Açıklama</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        {/* Fiyat */}
        <label className="label-field">Fiyat</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        {/* Stok */}
        <label className="label-field">Stok</label>
        <input
          type="number"
          name="stockQuantity"
          value={form.stockQuantity}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        {/* Kategori Dropdown */}
        <label className="label-field">Kategori</label>
        <select
          name="categoryId"
          value={form.categoryId || ""}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        >
          <option value="">Kategori seçin</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Malzeme Dropdown */}
        <label className="label-field">Malzeme</label>
        <select
          name="materialId"
          value={form.materialId || ""}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        >
          <option value="">Malzeme seçin</option>
          {materials.map(mat => (
            <option key={mat.id} value={mat.id}>
              {mat.name}
            </option>
          ))}
        </select>

        {/* Ana Resim */}
        <label className="label-field">Ana Resim URL</label>
        <input
          name="mainImageUrl"
          value={form.mainImageUrl}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        {/* Galeri Resimleri */}
        <label className="label-field">Galeri Resimleri</label>

        {/* Drag & Drop Alanı */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer bg-white"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-600">Resimleri buraya sürükleyin veya tıklayın</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* Önizlemeler */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {form.galleryImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt="gallery"
                className="w-full h-24 object-cover rounded shadow"
              />

              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                onClick={() => removeImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* Butonlar */}
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={() => navigate("/admin/jewelry-items")}>
            İptal
          </button>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {id ? "Güncelle" : "Oluştur"}
          </button>
        </div>

      </form>
    </div>
  );
}
