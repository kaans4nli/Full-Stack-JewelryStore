import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Contexts
import { AuthContext } from "./context/AuthContext";

// Layouts
import { Layout } from "./components/layout";
import AdminLayout from "./admin/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// User Pages
import Profile from "./pages/User/Profile";
import Settings from "./pages/User/Settings";
import Notifications from "./pages/User/Notifications";
import Addresses from "./pages/User/Addresses";
import NewAddress from "./pages/User/NewAddress";
import EditAddress from "./pages/User/EditAddress";
import Favorites from "./pages/User/Favorites";
import Checkout from "./pages/Checkout/Checkout";
import CheckoutSuccess from "./pages/Checkout/CheckoutSuccess";
import CheckoutFailed from "./pages/Checkout/CheckoutFailed";
import Orders from "./pages/User/Orders";

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

// Stripe Configuration
import { stripePromise } from "./lib/stripe";

// ============== ROUTE GUARDS ==============

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/profile" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  return children;
}

// ============== LAYOUT WRAPPER ==============
function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function ProtectedLayoutWrapper() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

// ============== ROUTES COMPONENT ==============
export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* ========== PUBLIC ROUTES (with Layout) ========== */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/item/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        </Route>

        {/* ========== USER PROTECTED ROUTES (with Layout) ========== */}
        <Route element={<ProtectedLayoutWrapper />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/addresses/new" element={<NewAddress />} />
          <Route path="/addresses/:id/edit" element={<EditAddress />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<Orders />} />

          {/* Checkout with Stripe */}
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failed" element={<CheckoutFailed />} />
        </Route>

        {/* ========== ADMIN ROUTES (with AdminLayout) ========== */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHome />} />

          {/* Users */}
          <Route path="users" element={<AdminUserList />} />
          <Route path="users/new" element={<AdminUserForm />} />
          <Route path="users/:id" element={<AdminUserForm />} />

          {/* Jewelry */}
          <Route path="jewelry-items" element={<AdminJewelryList />} />
          <Route path="jewelry-items/new" element={<AdminJewelryForm />} />
          <Route path="jewelry-items/:id/edit" element={<AdminJewelryForm />} />

          {/* Categories */}
          <Route path="categories" element={<AdminCategoryList />} />
          <Route path="categories/new" element={<AdminCategoryForm />} />
          <Route path="categories/:id/" element={<AdminCategoryForm />} />

          {/* Materials */}
          <Route path="materials" element={<AdminMaterialList />} />
          <Route path="materials/new" element={<AdminMaterialForm />} />
          <Route path="materials/:id/" element={<AdminMaterialForm />} />
        </Route>

        {/* ========== 404 NOT FOUND ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

