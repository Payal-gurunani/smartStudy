// src/pages/FlashcardList.jsx
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import FlashcardCard from "../flashcards/Flashcard";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { Loader2 } from "lucide-react";

const FlashcardList = () => {
  /* ───────── State ───────── */
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", subject: "" });
  const [manualSearch, setManualSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ───────── Fetch ───────── */
  const fetchFlashcards = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams(
        Object.entries(filters).reduce((acc, [k, v]) => {
          if (v.trim()) acc[k] = v;
          return acc;
        }, {})
      ).toString();

      const res = await apiRequest({
        method: "GET",
        url: `${endpoints.searchFlashcards.url}?${queryParams}`,
      });

      setFlashcards(res);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to fetch flashcards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!manualSearch) fetchFlashcards();
    setManualSearch(false);
  }, [filters]);

  /* ───────── Debounce ───────── */
  const debouncedQuery = useCallback(
    debounce((val) =>
      setFilters((prev) => ({
        ...prev,
        query: val,
      }))
    , 500),
    []
  );

  /* ───────── Group by subject ───────── */
  const grouped = flashcards.reduce((acc, fc) => {
    const subject = fc.subject || "Uncategorized";
    (acc[subject] = acc[subject] || []).push(fc);
    return acc;
  }, {});

  /* ───────── JSX ───────── */
  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main */}
      <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 sm:ml-60">
        <div className="mx-auto max-w-6xl">
          {/* Mobile Top Bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
            <h2 className="text-lg font-semibold">Flashcards</h2>
          </div>

          {/* Heading */}
          <h2 className="hidden sm:block text-2xl font-bold mb-6">
            Your Flashcards
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <input
              type="text"
              placeholder="Search…"
              defaultValue={filters.query}
              className="flex-1 min-w-[10rem] rounded-lg px-3 py-2
                         bg-white/5 text-white placeholder-white/40
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => debouncedQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchFlashcards();
                  setManualSearch(true);
                }
              }}
            />

            <input
              type="text"
              placeholder="Subject"
              value={filters.subject}
              className="flex-1 min-w-[8rem] rounded-lg px-3 py-2
                         bg-white/5 text-white placeholder-white/40
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFilters((p) => ({ ...p, subject: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchFlashcards();
                  setManualSearch(true);
                }
              }}
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid h-[50vh] place-items-center">
              <span className="flex items-center gap-2 text-white/80">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading flashcards…
              </span>
            </div>
          ) : flashcards.length === 0 ? (
            <div className="grid h-[50vh] place-items-center">
              <p className="text-white/60 text-lg">
                📇 No flashcards found.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([subject, cards]) => (
              <section key={subject} className="mb-12">
                <h3 className="text-xl font-semibold mb-4 text-orange-300">
                  📘 {subject}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((fc) => (
                    <FlashcardCard key={fc._id} flashcard={fc} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FlashcardList;
