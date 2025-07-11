import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/Authcontext";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { apiRequest } from "../api/apiRequest";
import { endpoints } from "../api/endPoints";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors]       = useState({});   // field errors
  const [generalError, setGenErr] = useState("");   // banner error
  const [submitting, setSubmitting] = useState(false);

  /* go home if already logged-in */
  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated]);

  /* handle change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined })); // clear field error when typing
    setGenErr("");
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGenErr("");

    try {
      await apiRequest({
        method: endpoints.register.method,
        url: endpoints.register.url,
        data: formData,
      });
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
if (data?.fieldErrors) setErrors(data.fieldErrors);
        console.log(err);
        
      setGenErr(
      data?.message ||
      err.response?.statusText ||
      err.message ||
      "Something went wrong. Please try again."
    );

      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-8 py-10"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create account
        </h2>

        {/* general error banner */}
        {generalError && (
          <div className="bg-red-600/20 text-red-400 text-sm rounded-lg p-3 mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* username */}
          <Input
            icon={FaUser}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          {/* email */}
          <Input
            icon={FaEnvelope}
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* password */}
          <Input
            icon={FaLock}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {/* submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg
                       hover:from-sky-600 hover:to-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>

        {/* social + footer (unchanged) */}
        {/* … */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/10"></div>
          <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-white/10"></div>
        </div>

        <div className="flex justify-between">
          <SocialBtn href="/auth/google" icon={<FaGoogle className="text-red-400" />} />
          <SocialBtn href="/auth/github" icon={<FaGithub />} />
          <SocialBtn href="/auth/twitter" icon={<FaTwitter className="text-sky-400" />} />
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-sky-400 hover:underline cursor-pointer">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

/* —— small helpers ——————————————————— */

function Input({ icon: Icon, error, ...rest }) {
  return (
    <div className="relative">
      <input
        {...rest}
        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border
          ${error ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-sky-400"}
          focus:outline-none focus:ring-2`}
      />
      <Icon className="absolute left-3 top-3.5 text-gray-400" />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SocialBtn({ href, icon }) {
  return (
    <a
      href={href}
      className="w-full p-3 flex items-center justify-center border border-white/10 bg-white/5
                 hover:bg-white/10 text-white rounded-lg transition mx-1"
    >
      {icon}
    </a>
  );
}
