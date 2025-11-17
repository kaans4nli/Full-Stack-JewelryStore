import { useEffect, useState } from "react";
import { getMaterials, deleteMaterial } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminMaterialList() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu malzemeyi silmek istediğine emin misin?")) return;
    await deleteMaterial(id);
    fetchMaterials();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Malzeme Yönetimi</h2>

      <button
        onClick={() => navigate("/admin/materials/new")}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Yeni Malzeme
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
            {materials.map((mat) => (
              <tr key={mat.id}>
                <td className="border px-2 py-1">{mat.id}</td>
                <td className="border px-2 py-1">{mat.name}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/materials/edit/${mat.id}`)}
                    className="bg-yellow-500 text-white px-3 rounded"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(mat.id)}
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
