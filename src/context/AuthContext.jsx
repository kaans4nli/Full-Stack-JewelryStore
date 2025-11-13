import React, { createContext, useState, useEffect } from 'react';
import api, { setupInterceptors, getProfile as fetchProfile } from '../api/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Token saklama ve güncelleme
  const setToken = (token) => {
    setAccessToken(token);
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  };

  // ✅ Token'ı localStorage'dan al (sayfa yenilenince)
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) setAccessToken(savedToken);
  }, []);

  // ✅ Interceptor her token değiştiğinde güncellensin
  useEffect(() => {
    setupInterceptors(() => accessToken, setToken, navigate);
  }, [accessToken, navigate]);

  // ✅ Token varsa kullanıcı profilini yükle
  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchProfile();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [accessToken]);

  // ✅ Login işlemi
  const handleLogin = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data.accessToken;

      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const userData = await fetchProfile();
      setUser(userData);

      navigate('/profile', { replace: true });
    } catch (err) {
      throw err; // Login.jsx yakalayacak
    }
  };

  // ✅ Register işlemi
  const handleRegister = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    navigate('/login');
  };

  // ✅ Logout işlemi
  const handleLogout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ accessToken, setToken, user, loading, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
