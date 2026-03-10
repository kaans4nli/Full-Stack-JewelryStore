import { useEffect, useState } from "react";
import { getAddresses, deleteAddress, setDefaultAddress } from '../../api/addressApi';
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Star, MapPin, ArrowLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-primary text-4xl font-bold text-white mb-2">My Addresses</h1>
              <p className="text-gray-400">Manage your delivery addresses</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/addresses/new")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-amber-600 hover:to-amber-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </motion.button>
          </div>
        </motion.div>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg mb-4">You haven't added any addresses yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/addresses/new")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Address
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-slate-800 to-slate-700 border rounded-2xl p-6 transition ${
                  address.isDefault || address.default
                    ? "border-amber-500/50 ring-2 ring-amber-500/20"
                    : "border-slate-600 hover:border-amber-500/50"
                }`}
              >
                {/* Default Badge */}
                {(address.isDefault || address.default) && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3 py-1 rounded-lg text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    Default
                  </div>
                )}

                {/* Address Info */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-lg mb-3">{address.fullName}</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>{address.addressLine}</p>
                    <p>{address.postalCode} {address.city}</p>
                    <p>{address.country}</p>
                    <p className="text-gray-400">{address.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/addresses/${address.id}/edit`)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </motion.button>
                  {!(address.isDefault || address.default) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Set Default
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(address.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}