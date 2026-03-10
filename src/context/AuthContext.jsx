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

    let mounted = true;

    const loadProfile = async () => {
      try {
        if (mounted) setUserLoaded(false);
        const data = await authApi.getProfile();
        if (!mounted) return;
        setUser(data);
      } catch (err) {
        console.info("Profile load failed:", err?.response?.status || err.message || err);
        clearAuth();
      } finally {
        if (mounted) setUserLoaded(true);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  useEffect(() => {
    if (!userLoaded || !user) return;

    if (user.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/profile", { replace: true });
    }
  }, [userLoaded, user]);

  const handleLogin = async (username, password) => {
    setUser(null);
    setUserLoaded(false);

    try {
      const res = await authApi.login(username, password);

      console.debug("Login response:", res);

      if (res && res.accessToken) {
        setToken(res.accessToken);
        // profile will be loaded by effect
      } else {
        // No accessToken in response — maybe backend uses cookie auth.
        // Try loading profile directly.
        try {
          const data = await authApi.getProfile();
          setUser(data);
          setUserLoaded(true);
        } catch (err) {
          console.error("Login succeeded but profile fetch failed:", err);
          clearAuth();
          setUserLoaded(true);
          throw err;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setUserLoaded(true);
      throw err;
    }
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
