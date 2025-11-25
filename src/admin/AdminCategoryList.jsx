import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../api/categoryApi";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Kategori Yönetimi</h2>

      <button
        onClick={() => navigate("/admin/categories/new")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Yeni Kategori
      </button>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-black">ID</th>
              <th className="border px-2 py-1 text-black">Ad</th>
              <th className="border px-2 py-1 text-black">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="border px-2 py-1 text-black">{cat.id}</td>
                <td className="border px-2 py-1 text-black">{cat.name}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}
                    className="bg-yellow-500 text-white px-3 rounded"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
