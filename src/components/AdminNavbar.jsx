import React from "react";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminNavbar() {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-700">Admin Panel</h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

export default AdminNavbar;
