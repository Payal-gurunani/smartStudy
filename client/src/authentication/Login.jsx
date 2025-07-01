// src/pages/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../api/auth";


const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      console.log("Login successful:", res);
      
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
     
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-8 py-10"
      >
        <motion.h1
          variants={childVariants}
          className="text-3xl font-bold text-white mb-8 text-center"
        >
          Sign in to Smart Study
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transform transition hover:scale-[1.02] duration-200"
            >
              Sign In
            </button>
          </motion.div>
        </form>

        <motion.p
          variants={childVariants}
          className="mt-6 text-center text-sm text-slate-400"
        >
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
