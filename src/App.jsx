import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useContext } from "react";

// Layouts
import Navbar from "./components/Navbar";
import AdminLayout from "./admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Addresses from "./pages/Addresses";
import NewAddress from "./pages/NewAddress";
import EditAddress from "./pages/EditAddress";

// Admin Pages
import AdminHome from "./admin/AdminHome";
import AdminUserList from "./admin/AdminUserList";
import AdminUserForm from "./admin/AdminUserForm";
import AdminJewelryList from "./admin/AdminJewelryList";
import AdminJewelryForm from "./admin/AdminJewelryForm";
import AdminCategoryList from "./admin/AdminCategoryList";
import AdminCategoryForm from "./admin/AdminCategoryForm";
import AdminMaterialList from "./admin/AdminMaterialList";
import AdminMaterialForm from "./admin/AdminMaterialForm";


// ---------------- ROUTE GUARDS ----------------

// ProtectedRoute → login zorunlu
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// AuthRoute → login olan kullanıcı login/register göremez
function AuthRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/profile" replace />;
  }

  return children;
}

// AdminRoute → admin olmayan giremez
function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}


// ---------------- MAIN ROUTES ----------------

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");
  return (
    <>
      {/* Admin sayfalarında normal Navbar görünmesin */}
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetail />} />

          {/* Auth Pages */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

          {/* User Protected Pages */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="/addresses/new" element={<ProtectedRoute><NewAddress /></ProtectedRoute>} />
          <Route path="/addresses/edit/:id" element={<ProtectedRoute><EditAddress /></ProtectedRoute>} />

          {/* ADMIN PANEL */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminHome />} />

            <Route path="users" element={<AdminUserList />} />
            <Route path="users/new" element={<AdminUserForm />} />
            <Route path="users/edit/:id" element={<AdminUserForm />} />

            <Route path="jewelry-items" element={<AdminJewelryList />} />
            <Route path="jewelry-items/new" element={<AdminJewelryForm />} />
            <Route path="jewelry-items/edit/:id" element={<AdminJewelryForm />} />

            <Route path="categories" element={<AdminCategoryList />} />
            <Route path="categories/new" element={<AdminCategoryForm />} />
            <Route path="categories/edit/:id" element={<AdminCategoryForm />} />

            <Route path="materials" element={<AdminMaterialList />} />
            <Route path="materials/new" element={<AdminMaterialForm />} />
            <Route path="materials/edit/:id" element={<AdminMaterialForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
