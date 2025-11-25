import { useEffect, useState } from "react";
import { getJewelryItems, deleteJewelryItem } from "../api/jewelryApi";
import { useNavigate } from "react-router-dom";

export default function AdminJewelryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10); // sayfa başı ürün
  const [totalPages, setTotalPages] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getJewelryItems({ keyword, page, size });
      setItems(data.content); // Spring Page'den content alıyoruz
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [page, keyword]);

  const handleDelete = async (id) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
    await deleteJewelryItem(id);
    fetchItems();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Ürün Yönetimi</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ara..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-2 py-1 text-black"
        />
        <button onClick={() => setPage(0)} className="bg-blue-500 text-white px-3 rounded">
          Ara
        </button>
        <button
          onClick={() => navigate("/admin/jewelry-items/new")}
          className="bg-green-500 text-white px-3 rounded"
        >
          Yeni Ürün
        </button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-black">ID</th>
              <th className="border px-2 py-1 text-black">Ad</th>
              <th className="border px-2 py-1 text-black">Kategori</th>
              <th className="border px-2 py-1 text-black">Malzeme</th>
              <th className="border px-2 py-1 text-black">Fiyat</th>
              <th className="border px-2 py-1 text-black">Stok</th>
              <th className="border px-2 py-1 text-black">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="border px-2 py-1 text-black">{item.id}</td>
                <td className="border px-2 py-1 text-black">{item.name}</td>
                <td className="border px-2 py-1 text-black">{item.categoryId}</td>
                <td className="border px-2 py-1 text-black">{item.materialId}</td>
                <td className="border px-2 py-1 text-black">{item.price}</td>
                <td className="border px-2 py-1 text-black">{item.stockQuantity}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/jewelry-items/edit/${item.id}`)}
                    className="bg-yellow-500 text-white px-2 rounded"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-2 mt-4 text-black">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-2 rounded disabled:opacity-50 text-black"
        >
          Önceki
        </button>
        <span>Sayfa {page + 1} / {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-2 rounded disabled:opacity-50 text-black"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
