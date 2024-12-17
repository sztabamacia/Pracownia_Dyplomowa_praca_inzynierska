import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const navigate = useNavigate();

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
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;