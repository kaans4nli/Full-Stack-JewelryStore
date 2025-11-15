import { useState, useEffect } from "react";
import { createJewelryItem, updateJewelryItem, getJewelryItemById } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminJewelryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: null,
    materialId: null,
    mainImageUrl: "",
    galleryImages: []
  });

  useEffect(() => {
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

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">{id ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" placeholder="Ürün Adı" value={form.name} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input name="description" placeholder="Açıklama" value={form.description} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input type="number" name="price" placeholder="Fiyat" value={form.price} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input type="number" name="stockQuantity" placeholder="Stok" value={form.stockQuantity} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input type="number" name="categoryId" placeholder="Kategori ID" value={form.categoryId} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input type="number" name="materialId" placeholder="Malzeme ID" value={form.materialId} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <input name="mainImageUrl" placeholder="Ana Resim URL" value={form.mainImageUrl} onChange={handleChange} className="border px-2 py-1 w-full"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{id ? "Güncelle" : "Oluştur"}</button>
      </form>
    </div>
  );
}
