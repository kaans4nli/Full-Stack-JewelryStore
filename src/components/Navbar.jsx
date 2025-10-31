import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "underline" : "";

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl hover:text-gray-200">MyApp</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/profile" className={`${isActive("/profile")} hover:underline`}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${isActive("/login")} hover:underline`}>
              Login
            </Link>
            <Link to="/register" className={`${isActive("/register")} hover:underline`}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
