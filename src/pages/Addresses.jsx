import { useEffect, useState } from "react";
import { getAddresses, deleteAddress, setDefaultAddress } from '../api/addressApi';
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Star } from "lucide-react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await getAddresses();
      setAddresses(res);
    } catch (err) {
      console.error("Adresler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu adresi silmek istediğine emin misin?")) return;
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
    } catch (err) {
      console.error("Varsayılan adres hatası:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Yükleniyor...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-black">
      <h2 className="text-2xl font-bold mt-6 ml-6">Adreslerim</h2>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={() => navigate("/addresses/new")}
          >
            Yeni Adres Ekle
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-600">Henüz bir adres eklemediniz.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-300 bg-white rounded-xl shadow-sm">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="flex justify-between gap-x-6 py-5 px-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col space-y-1">
                  <p className="font-semibold text-lg">{address.fullName}</p>
                  <p className="text-sm text-gray-600">{address.addressLine}</p>
                  <p className="text-sm text-gray-600">{address.postalCode}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.country}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {address.isDefault || address.default ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <Star size={16} fill="green" color="green" />
                        Varsayılan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center gap-1 text-black-500 hover:text-black transition"
                      >
                        <Star size={16} />
                        Varsayılan yap
                      </button>
                    )}
                  </p>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => navigate(`/addresses/edit/${address.id}`)}
                      className="text-black-500 hover:text-blue-700"
                      title="Düzenle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
