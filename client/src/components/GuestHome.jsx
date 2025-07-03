import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function GuestHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-xl"
      >
        <h1 className="text-4xl font-bold tracking-tight">SmartStudy Assistant</h1>
        <p className="text-slate-300 text-sm">
          Prepare smarter, not harder. Create notes, generate flashcards, and take quizzes — all powered by AI.
        </p>

        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg text-white font-semibold shadow"
          >
            Get Started
          </Link>
          <Link
            to="/"
            className="border border-white/20 hover:bg-white/10 px-6 py-2 rounded-lg text-white font-medium"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
