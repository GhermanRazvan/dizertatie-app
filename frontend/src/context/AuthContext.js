import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.1.13:5000/api/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificăm dacă există un token salvat la pornirea aplicației
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Login failed', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'A apărut o eroare la autentificare.');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(API_URL, { name, email, password });
      const token = response.data.token;
      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Registration failed', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'A apărut o eroare la înregistrare.');
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizat pentru a folosi contextul mai ușor
export const useAuth = () => {
  return useContext(AuthContext);
};
