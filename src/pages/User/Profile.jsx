import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react"; // ikon
import { motion } from "framer-motion";

function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-black">
      <h2 className="text-2xl font-bold mt-6 ml-6">Profil {user.username}</h2>
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center mt-6 ml-6">
        
        {/* 🧭 Adres kutusu */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/addresses")}
          className="cursor-pointer p-4 border border-gray-300 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition"
        >
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <MapPin size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Adreslerim</h3>
            <p className="text-sm text-gray-600">
              Teslimat adreslerini görüntüle, ekle veya düzenle.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
