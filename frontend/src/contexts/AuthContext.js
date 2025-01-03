import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const storedUserID = decodedToken.sub;
      setToken(storedToken);
      setUserID(storedUserID);
      setIsLoggedIn(true);
      console.log('User is logged in:', storedUserID);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 1000 * 60); // Odświeżaj token co minutę
    return () => clearInterval(interval);
  }, [token]);

  const refreshAccessToken = async () => {
    try {
      const response = await authService.refreshToken(token);
      const newToken = response.access_token;
      const decodedToken = jwtDecode(newToken);
      const userID = decodedToken.sub;
      Cookies.set('token', newToken, { expires: 7 });
      setToken(newToken);
      setUserID(userID);
      setIsLoggedIn(true);
      console.log('Token refreshed:', userID);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    const userID = decodedToken.sub;
    Cookies.set('token', token, { expires: 7 }); // Przechowuj token w ciasteczkach przez 7 dni
    setToken(token);
    setUserID(userID);
    setIsLoggedIn(true);
    console.log('User logged in:', userID);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUserID(null);
    setIsLoggedIn(false);
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;