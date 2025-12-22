import React, { createContext, useState, useEffect, useRef } from "react";
import { setupInterceptors } from "../api/axiosClient";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { getTokenExpiration } from "../utils/tokenUtils";

export const AuthContext = createContext();

const REFRESH_BUFFER = 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    clearTimeout(refreshTimeoutRef.current);
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
  }, [accessToken]);

  // Profil yükleme
  useEffect(() => {
    if (!accessToken) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await authApi.getProfile();
        setUser(data);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [accessToken]);

  const handleLogin = async (username, password) => {
    setUser(null);
    const res = await authApi.login(username, password);
    setToken(res.accessToken);
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
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
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
