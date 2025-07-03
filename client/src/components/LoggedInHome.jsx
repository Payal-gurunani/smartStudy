import { Link } from "react-router-dom";    
import { motion } from "framer-motion";
export default function LoggedInHome({ user }) {
  const sections = [
    { path: "/dashboard", icon: "📊", title: "Dashboard", desc: "Your study stats" },
    { path: "/notes", icon: "📝", title: "Notes", desc: "Manage all your notes" },
    { path: "/flashcards", icon: "🧠", title: "Flashcards", desc: "Quick revision" },
    { path: "/quizzes", icon: "❓", title: "Quizzes", desc: "Test your knowledge" },
    { path: "/reminders", icon: "⏰", title: "Reminders", desc: "Stay on schedule" },
    { path: "/progress", icon: "📈", title: "Progress", desc: "Track improvement" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold">
          Welcome back, {user?.name || "Scholar"} 🎓
        </h1>
        <p className="text-slate-400 text-sm mt-1">Let’s keep growing your knowledge!</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
        {sections.map(({ path, icon, title, desc }) => (
          <motion.div
            key={path}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <Link to={path} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{icon}</span>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-slate-300">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
