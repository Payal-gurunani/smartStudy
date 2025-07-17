import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiEdit3,
  FiLayers,
  FiClock,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive ? "bg-slate-700 font-semibold" : "hover:bg-slate-700"
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
        />
      )}

      <aside
        className={`h-[calc(100vh-5rem)] w-60 bg-slate-900 text-white transition-transform duration-300
          fixed top-16 left-0 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:block`}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex justify-end p-4">
          <button onClick={onClose}>
            <FiX className="text-white text-2xl" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 px-4">
          <NavLink to="/" className={navItemClass}>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/notes/view" className={navItemClass}>
            <FiBook /> Notes
          </NavLink>
          <NavLink to="/quizzes" className={navItemClass}>
            <FiEdit3 /> Quizzes
          </NavLink>
          <NavLink to="/flashcards" className={navItemClass}>
            <FiLayers /> Flashcards
          </NavLink>
          <NavLink to="/reminders" className={navItemClass}>
            <FiClock /> Reminders
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
