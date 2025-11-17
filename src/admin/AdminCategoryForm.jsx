import { useState, useEffect } from "react";
import { createCategory, updateCategory, getCategoryById } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      getCategoryById(id).then((data) => setName(data.name));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateCategory(id, { name });
    else await createCategory({ name });

    navigate("/admin/categories");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">{id ? "Kategori Düzenle" : "Yeni Kategori"}</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="label-field">Kategori Adı</label>
        <input
          className="border px-2 py-1 w-full text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={() => navigate("/admin/categories")}>
            İptal
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
