
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { endpoints } from "../api/endPoints";
import { useLocation } from "react-router-dom";
const publicPaths = ["/login", "/register"];
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setIsAuthenticated(false);
          setUser(null);
        } else {
          console.error("Auth check error:", error);
        }
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