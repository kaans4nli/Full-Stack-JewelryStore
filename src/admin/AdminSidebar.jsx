import React from "react";
import { useNavigate } from "react-router-dom";
import { Boxes, Settings, FolderTree, Users } from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 gap-4">
      <h2 className="text-xl font-bold mb-4">Admin Menu</h2>

      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
      >
        <Settings size={20} />
        Dashboard
      </button>

      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
      >
        <Users size={20} />
        Users
      </button>

      <button
        onClick={() => navigate("/admin/jewelry-items")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
      >
        <Boxes size={20} />
        Jewelry Items
      </button>

      <button
        onClick={() => navigate("/admin/categories")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
      >
        <FolderTree size={20} />
        Categories
      </button>

      <button
        onClick={() => navigate("/admin/materials")}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
      >
        <FolderTree size={20} />
        Materials
      </button>
    </div>
  );
}

export default AdminSidebar;
