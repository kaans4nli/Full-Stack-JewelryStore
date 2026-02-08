import React, { createContext, useState, useEffect, useRef } from "react";
import { setupInterceptors, clearAuthHeader } from "../api/axiosClient";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { getTokenExpiration } from "../utils/tokenUtils";

export const AuthContext = createContext();

const REFRESH_BUFFER = 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);

  const refreshTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    clearTimeout(refreshTimeoutRef.current);
    clearAuthHeader(); // 🔥 ŞART
  };

  const refreshToken = async () => {
    try {
      const res = await authApi.refresh();
      setToken(res.accessToken);
    } catch {
      clearAuth();
      navigate("/login");
    }
  };

  useEffect(() => {
    console.log("🟢 AUTH STATE CHANGE", {
      accessToken,
      user,
      userLoaded,
    });
  }, [accessToken, user, userLoaded]);

  const scheduleRefresh = (token) => {
    clearTimeout(refreshTimeoutRef.current);

    const expTime = getTokenExpiration(token);
    if (!expTime) return;

    const delay = expTime - Date.now() - REFRESH_BUFFER;

    if (delay <= 0) {
      refreshToken();
      return;
    }

    refreshTimeoutRef.current = setTimeout(refreshToken, delay);
  };

  const setToken = (token) => {
    setAccessToken(token);

    if (token) {
      localStorage.setItem("accessToken", token);
      scheduleRefresh(token);
    } else {
      clearAuth();
    }
  };

  // Sayfa yenilenince token yükle
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setAccessToken(savedToken);
      scheduleRefresh(savedToken);
    }
    setLoading(false);
  }, []);

  // Axios interceptor
  useEffect(() => {
    setupInterceptors(
      () => accessToken,
      setToken,
      clearAuth,
      navigate
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Profil yükleme
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setUserLoaded(true);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setUser(data);
      } catch {
        clearAuth();
      } finally {
        setUserLoaded(true);
      }
    };

    setUserLoaded(false);
    loadProfile();
  }, [accessToken]);

  useEffect(() => {
    if (!userLoaded || !user) return;

    if (user.role === "ADMIN") {
      console.log("➡️ NAVIGATE ADMIN");
      navigate("/admin", { replace: true });
    } else {
      console.log("➡️ NAVIGATE PROFILE");
      navigate("/profile", { replace: true });
    }
  }, [userLoaded, user]);

  const handleLogin = async (username, password) => {
    console.log("🔵 LOGIN START");

    setUser(null);
    setUserLoaded(false);

    const res = await authApi.login(username, password);
    console.log("🟢 TOKEN RECEIVED", res.accessToken);

    setToken(res.accessToken);
    // ❗ profil + redirect BURADA BİTTİ
  };

  const handleRegister = async (username, email, password) => {
    await authApi.register(username, email, password);
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { }

    clearAuth();
    setUserLoaded(false); // 👈 EKLE
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        userLoaded,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
