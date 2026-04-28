import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const _resolveUser = async () => {
    const res = await api.get('/api/users/me');
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/api/users/login', { email, password });
    const jwt = res.data;
    localStorage.setItem('token', jwt);
    const currentUser = await _resolveUser();
    localStorage.setItem('user', JSON.stringify(currentUser));
    setToken(jwt);
    setUser(currentUser);
    return currentUser;
  };

  const register = async (userData) => {
    const res = await api.post('/api/users/register', userData);
    const jwt = res.data;
    localStorage.setItem('token', jwt);
    const currentUser = await _resolveUser();
    localStorage.setItem('user', JSON.stringify(currentUser));
    setToken(jwt);
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
