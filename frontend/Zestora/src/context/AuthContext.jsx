import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          email: decodedToken.sub,
          role: decodedToken.role,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout();
      }
    }
  }, [token, handleLogout]);

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:10000/auth-app/login-check', credentials);
      const { token } = response.data;

      if (token) {
        const decodedToken = jwtDecode(token);
        const user = {
          email: decodedToken.sub,
          role: decodedToken.role,
        };

        setToken(token);
        localStorage.setItem('token', token);
        setUser(user);

        // Navigation logic based on user role
        if (user.role === 'CUSTOMER') {
          navigate('/');
        } else if (user.role === 'OWNER' || user.role === 'ADMIN') {
          navigate('/');
        } else {
          console.error('Unknown user role:', user.role);
          throw new Error('Invalid role');
        }
      } else {
        console.error('No token received');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider }; // Export AuthProvider
export default AuthContext;