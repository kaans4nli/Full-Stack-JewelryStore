import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAddress } from '../api/addressApi';

export default function NewAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createAddress(form);
      navigate("/addresses"); // adres listesine dön
    } catch (err) {
      console.error(err);
      setError("Adres ekleme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-2"
      >
        <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">Yeni Adres Ekle</h2>

        {error && <p className="text-red-500">{error}</p>}

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
              required
              className="text-black w-full mb-4 p-2 border rounded"
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
              required
              className="text-black w-full mb-4 p-2 border rounded"
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
              required
              className="text-black w-full mb-4 p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="label-field">
            Şehir
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="text-black w-full mb-4 p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="postalCode" className="label-field">
            Posta Kodu
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="text-black w-full mb-4 p-2 border rounded"
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
              required
              className="text-black w-full mb-4 p-2 border rounded"
            />
          </div>
        </div>

        <label className="text-black flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Varsayılan adres olarak ayarla
        </label>

        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={() => navigate("/addresses")}>
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Kaydediliyor..." : "Adres Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}
