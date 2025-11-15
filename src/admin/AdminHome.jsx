import React from "react";
import { Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h2>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/admin/jewelry-items")}
        className="cursor-pointer p-4 border border-gray-300 rounded-xl 
                   flex items-center gap-4 bg-white shadow hover:bg-gray-50 transition w-96"
      >
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          <Boxes size={24} />
        </div>

        <div className="text-left">
          <h3 className="font-semibold text-lg text-black">Ürünlerim</h3>
          <p className="text-sm text-gray-600">
            Ürünleri görüntüle, ekle veya düzenle.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminHome;
