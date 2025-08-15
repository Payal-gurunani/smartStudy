import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL || "http://localhost:3000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};