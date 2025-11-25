import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAddressById, updateAddress } from '../api/addressApi';

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
        setForm(res); // Backend'ten gelen isDefault değeri direkt doldurulur
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
        <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">
          Adresi Düzenle
        </h2>

        {/* FULL NAME */}
        <div>
          <label className="text-sm font-medium text-black">Tam Ad</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="text-black w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium text-black">Telefon</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="text-black w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm font-medium text-black">Adres</label>
          <input
            type="text"
            name="addressLine"
            value={form.addressLine}
            onChange={handleChange}
            className="text-black w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* CITY & POSTAL CODE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-black">Şehir</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Posta Kodu</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="text-black w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>

        {/* COUNTRY */}
        <div>
          <label className="text-sm font-medium text-black">Ülke</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="text-black w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* IS DEFAULT */}
        <div className="flex items-center gap-2 text-black mt-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            id="isDefault"
            className="h-4 w-4"
          />
          <label htmlFor="isDefault" className="text-sm font-medium">
            Varsayılan Adres Yap
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={() => navigate("/addresses")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
          >
            İptal
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
