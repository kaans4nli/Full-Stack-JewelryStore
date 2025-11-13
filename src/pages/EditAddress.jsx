import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAddressById, updateAddress } from '../api/api';

export default function EditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await getAddressById(id);
        setForm(res);
      } catch (err) {
        console.error("Adres yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAddress();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAddress(id, form);
      navigate("/addresses");
    } catch (err) {
      console.error("Adres güncellenemedi:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Yükleniyor...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">Adresi Düzenle</h2>

        <div>
          <label htmlFor="fullName" className="label-field">
            Tam Ad
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="label-field">
            Telefon
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="addressLine" className="label-field">
            Adres
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-black block text-sm font-medium mb-1">Şehir</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-black block text-sm font-medium mb-1">Posta Kodu</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="country" className="label-field">
            Ülke
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="text-black flex items-center space-x-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            id="isDefault"
          />
          <label htmlFor="isDefault" className="text-sm font-medium">
            Varsayılan Adres Yap
          </label>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={() => navigate("/addresses")}>
            İptal
          </button>
          <button type="submit">Kaydet</button>
        </div>
      </form>
    </div>
  );
}
