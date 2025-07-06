import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const alreadyVisited = localStorage.getItem("visitedBefore");
    if (alreadyVisited) {
      setIsFirstTime(true);
    } else {
      localStorage.setItem("visitedBefore", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl">
            <FiUser />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
            {isFirstTime
              ? `Welcome, ${user?.username || "Student"}!`
              : `Welcome back, ${user?.username || "Student"}!`}
          </h1>
        </div>
        <p className="text-sm text-slate-300">Your learning tools at one place 🚀</p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {[
          { path: "/notes", label: "📚 My Notes", desc: "Store your learning notes" },
          { path: "/flashcards", label: "🧠 Flashcards", desc: "Quick memory boosters" },
          { path: "/quizzes", label: "📝 Take Quiz", desc: "Test your knowledge" },
          { path: "/reminders", label: "⏰ Study Reminders", desc: "Never miss a topic" },
          { path: "/profile", label: "📈 Progress Tracker", desc: "Track your growth" },
        ].map(({ path, label, desc }) => (
          <DashboardCard key={path} to={path} title={label} subtitle={desc} />
        ))}
      </motion.div>
    </div>
  );
}

function DashboardCard({ to, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
    >
      <Link to={to} className="flex flex-col items-center space-y-3">
        <h2 className="text-3xl">{title}</h2>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </Link>
    </motion.div>
  );
}
