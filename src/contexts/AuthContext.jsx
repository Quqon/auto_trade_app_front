import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Axios 전역 설정 (쿠키 항상 포함)
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 백엔드에서 쿠키를 이용해 사용자 정보를 가져옴
  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/user/me');
      if (typeof response.data === 'string' && response.data.includes('<html')) {
        setUser(null);
      } else {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (loginData) => {
    const response = await axios.post('/api/auth/login', loginData);
    await checkAuth(); // 로그인 성공 시 유저 정보 즉시 갱신
    return response;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
