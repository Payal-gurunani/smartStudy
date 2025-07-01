import axios from "./axiosInstance";

// Register User
export const registerUser = (data) => axios.post("/users/register", data);

// Login User
export const loginUser = (data) => axios.post("/users/login", data);

// Logout
export const logoutUser = () => axios.post("/users/logout");
