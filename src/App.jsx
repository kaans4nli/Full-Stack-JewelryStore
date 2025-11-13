import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Addresses from "./pages/Addresses";
import NewAddress from "./pages/NewAddress";
import EditAddress from "./pages/EditAddress";
import { useContext } from "react";

// ProtectedRoute: kullanıcı yoksa login sayfasına yönlendir
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// AuthRoute: kullanıcı varsa login/register sayfasını engelle
function AuthRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (user) return <Navigate to="/profile" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="/addresses/new" element={<ProtectedRoute><NewAddress /></ProtectedRoute>} />
          <Route path="/addresses/edit/:id" element={<ProtectedRoute><EditAddress /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
