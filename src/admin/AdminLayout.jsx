import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6">
          <Outlet /> 
          {/* Burada admin sayfasının içeriği gösterilir */}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
