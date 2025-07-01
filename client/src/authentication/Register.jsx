// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agree: false,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
   try {
     const res = await registerUser(formData)
     navigate("/");
    console.log("Form Data:", res);
   } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    
   }
    // TODO: Connect with backend
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-8 py-10"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:from-sky-600 hover:to-blue-700 transition"
          >
            Create account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/10"></div>
          <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-white/10"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-between">
          <a
            href="/auth/google"
            className="w-full p-3 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-lg mr-2 transition"
          >
            <FaGoogle className="text-red-400" />
          </a>
          <a
            href="/auth/github"
            className="w-full p-3 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-lg mx-2 transition"
          >
            <FaGithub />
          </a>
          <a
            href="/auth/twitter"
            className="w-full p-3 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-lg ml-2 transition"
          >
            <FaTwitter className="text-sky-400" />
          </a>
        </div>

        {/* Already have account */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
