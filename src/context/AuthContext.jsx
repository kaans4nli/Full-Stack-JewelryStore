import React, { createContext, useState, useEffect } from "react";
import { setupInterceptors } from "../api/axiosClient";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // token set et
  const setToken = (token) => {
    setAccessToken(token);
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  };

  // sayfa yenilenince localStorage’dan token al
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) setAccessToken(savedToken);
  }, []);

  // interceptors aktif et
  useEffect(() => {
    setupInterceptors(() => accessToken, setToken, navigate);
  }, [accessToken]);

  // token varsa profil çek
  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getProfile();
        setUser(data);
      } catch (err) {
        console.error("Profil yüklenemedi:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [accessToken]);

  // LOGIN
  const handleLogin = async (username, password) => {
    const res = await authApi.login(username, password);
    const token = res.accessToken;

    setToken(token);

    const profile = await authApi.getProfile();
    setUser(profile);

    // ROLE routing
    if (profile.role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/profile", { replace: true });
  };

  // REGISTER
  const handleRegister = async (username, email, password) => {
    await authApi.register(username, email, password);
    navigate("/login");
  };

  // LOGOUT
  const handleLogout = async () => {
    await authApi.logout();
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, setToken, user, loading, handleLogin, handleRegister, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
