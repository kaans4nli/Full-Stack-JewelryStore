import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * AuthContext'e kolay erişim sağlar
 * 
 * @returns {object} - { user, accessToken, loading, setToken, clearAuth }
 * 
 * Kullanım:
 * const { user, loading, setToken } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default useAuth;
