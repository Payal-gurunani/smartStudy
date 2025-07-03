import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, { setAuthToken } from "../api/axiosInstance.js";
import { apiRequest } from "../api/apiRequest.js";
import { endpoints } from "../api/endPoints.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token); 

      try {
        const res = await apiRequest({
          method: endpoints.checkLogin.method,
          url: endpoints.checkLogin.url,
        });

        setIsAuthenticated(true);
        setUser(res.user); 
      } catch (err) {
        console.error("Check login failed:", err.message);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
