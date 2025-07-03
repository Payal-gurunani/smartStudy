import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Notes() {
  const noteRoutes = [
    { path: "/notes/create", label: "➕ Create Note", desc: "Add a new note manually" },
    { path: "/notes/upload", label: "📄 Upload PDF", desc: "Convert a PDF into notes" },
    { path: "/notes/view", label: "📚 View All Notes", desc: "Browse all your notes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">📓 Notes Dashboard</h1>
        <p className="text-slate-300 mt-2 text-sm sm:text-base">
          Manage, upload, and view your notes with ease
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
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
        {noteRoutes.map(({ path, label, desc }) => (
          <motion.div
            key={path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-blue-500/30 transition duration-200"
          >
            <Link to={path} className="flex flex-col h-full justify-between space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">{label}</h2>
                <p className="text-sm text-slate-300">{desc}</p>
              </div>
              <div className="pt-2 text-blue-400 text-sm font-medium hover:underline">
                Go &rarr;
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
