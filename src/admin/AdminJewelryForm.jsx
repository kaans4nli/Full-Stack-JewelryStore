import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createJewelryItem,
  updateJewelryItem,
  getJewelryItemById,
} from "../api/jewelryApi";
import { getCategories } from "../api/categoryApi";
import { getMaterials } from "../api/materialApi";

export default function AdminJewelryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

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
    galleryImages: [],
  });

  // Yeni yüklenen dosyalar (backend'e gönderilecek)
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Var olan + yeni eklenen görüntülerin tamamının önizlemesi
  const [galleryPreview, setGalleryPreview] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getMaterials().then(setMaterials);

    if (id) {
      getJewelryItemById(id).then((data) => {
        setForm({
          ...data,
        });
        if (data.galleryImages) {
          setGalleryPreview(data.galleryImages);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryPreview((prev) => {
          const newPreview = [...prev, reader.result];
          // EĞER şu an hiç ana resim yoksa, ilk yüklenen bu dosyayı ana resim yap
          if (!form.mainImageUrl && newPreview.length === 1) {
            setForm(f => ({ ...f, mainImageUrl: reader.result }));
          }
          return newPreview;
        });
        setGalleryFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const removedImg = galleryPreview[index];
    const isMainBeingRemoved = form.mainImageUrl === removedImg;

    // 1. Gallery listelerini güncelle (URL veya Dosya ayrımı)
    if (!removedImg.startsWith("data:image")) {
      setForm(prev => ({
        ...prev,
        galleryImages: prev.galleryImages.filter(url => url !== removedImg)
      }));
    } else {
      // Yeni dosyalardan silerken index kaymasını hesapla
      const fileIndex = index - (galleryPreview.length - galleryFiles.length);
      setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    // 2. Preview listesinden kaldır
    const updatedPreview = galleryPreview.filter((_, i) => i !== index);
    setGalleryPreview(updatedPreview);

    // 3. İPUCU: Eğer silinen resim ANA RESİM ise, yeni bir tane ata
    if (isMainBeingRemoved) {
      setForm(prev => ({
        ...prev,
        mainImageUrl: updatedPreview.length > 0 ? updatedPreview[0] : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // 2. Kritik Nokta: Form içindeki galleryImages'ı güncel tutarak gönderiyoruz
      // galleryPreview içindeki SADECE string (URL) olanları ayıklayıp form'a koyalım
      const currentGalleryUrls = galleryPreview.filter(img => !img.startsWith("data:image"));

      const updatedForm = {
        ...form,
        galleryImages: currentGalleryUrls
      };

      formData.append(
        "item",
        new Blob([JSON.stringify(updatedForm)], { type: "application/json" })
      );

      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (id) {
        await updateJewelryItem(id, formData);
      } else {
        await createJewelryItem(formData);
      }

      navigate("/admin/jewelry-items");
    } catch (err) {
      console.error("Jewelry create/update error:", err);
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {id ? "Ürünü Düzenle" : "Yeni Ürün"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="label-field">Ürün Adı</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        <label className="label-field">Açıklama</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        <label className="label-field">Fiyat</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        <label className="label-field">Stok</label>
        <input
          type="number"
          name="stockQuantity"
          value={form.stockQuantity}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        />

        <label className="label-field">Kategori</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        >
          <option value="">Kategori seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="label-field">Malzeme</label>
        <select
          name="materialId"
          value={form.materialId}
          onChange={handleChange}
          className="border px-2 py-1 w-full text-black"
        >
          <option value="">Malzeme seçin</option>
          {materials.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name}
            </option>
          ))}
        </select>

        <label className="label-field">Galeri Resimleri</label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer bg-white"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-600">
            Resimleri buraya sürükleyin veya tıklayın
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {galleryPreview.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} className="w-full h-24 object-cover rounded shadow" />
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
