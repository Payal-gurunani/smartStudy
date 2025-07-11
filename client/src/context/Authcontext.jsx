// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { endpoints } from "../api/endPoints";
import { useLocation } from "react-router-dom";
const publicPaths = ["/", "/register"];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,           setUser]             = useState(null);
  const [loading,        setLoading]          = useState(true);
const location = useLocation()
 

  useEffect(() => {
     if (publicPaths.includes(location.pathname)) {
      setLoading(false);    
      return;
    }
    (async () => {
      try {
        const res = await axiosInstance(endpoints.checkLogin);  
        if (res.data.success) {
          setIsAuthenticated(true);
          setUser(res.data.data.user);
        }
        
        
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
