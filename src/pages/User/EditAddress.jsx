import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAddressById, updateAddress } from '../../api/addressApi';
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function EditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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
        console.error("Address load failed:", err);
        setError("Failed to load address.");
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
    setSubmitting(true);
    setError("");
    try {
      await updateAddress(id, form);
      navigate("/addresses");
    } catch (err) {
      console.error("Address update failed:", err);
      setError("Failed to update address.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-12 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/addresses")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Addresses
          </button>
          <h1 className="font-primary text-4xl font-bold text-white mb-2">Edit Address</h1>
          <p className="text-gray-400">Update your delivery address details</p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-8 shadow-2xl"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-white font-medium text-sm mb-3">Full Name</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-white font-medium text-sm mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              Phone Number
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Address Line */}
          <div className="mb-6">
            <label className="block text-white font-medium text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Street Address
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-medium text-sm mb-3">City</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-white font-medium text-sm mb-3">Postal Code</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>
          </div>

          {/* Country */}
          <div className="mb-6">
            <label className="block text-white font-medium text-sm mb-3">Country</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          {/* Default Address Checkbox */}
          <label className="flex items-center gap-3 mb-8 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer accent-amber-500"
            />
            <span className="text-gray-300 font-medium">Set as default address</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/addresses")}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg transition font-semibold"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                submitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg"
              }`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
