import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import AuthPromptModal from '../components/AuthPromptModal';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session on application start
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
        (error.message === 'Network Error' || !error.response
          ? 'Unable to connect to backend API server. Please check your connection or backend URL.'
          : 'Login failed. Please try again.');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const registerUserAction = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
        (error.message === 'Network Error' || !error.response
          ? 'Unable to connect to backend API server. Please check your connection or backend URL.'
          : 'Registration failed. Please try again.');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({});

  const openAuthModal = (config = {}) => {
    setAuthModalConfig(config);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const requireAuth = (callback, config = {}) => {
    if (user) {
      if (typeof callback === 'function') callback();
      return true;
    }
    openAuthModal(config);
    return false;
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    registerUserAction,
    logout,
    openAuthModal,
    closeAuthModal,
    requireAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthPromptModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        title={authModalConfig.title}
        message={authModalConfig.message}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
