import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { apiRequest } from "../../api/apiRequest.js";
import { endpoints } from "../../api/endPoints.js";
import FlashcardCard from "../flashcards/Flashcard.jsx";

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", subject: "", tag: "" });
  const [manualSearch, setManualSearch] = useState(false);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, val]) => {
          if (val.trim()) acc[key] = val;
          return acc;
        }, {})
      ).toString();

      const res = await apiRequest({
        method: "GET",
        url: `${endpoints.searchFlashcards.url}?${queryParams}`,
      });

      setFlashcards(res);
    } catch (error) {
      console.error("Failed to fetch flashcards", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!manualSearch) fetchFlashcards();
    setManualSearch(false);
  }, [filters]);

  const debouncedQuery = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, query: value }));
    }, 500),
    []
  );

  // Group flashcards by subject
  const groupedBySubject = flashcards.reduce((acc, fc) => {
    const subject = fc.subject || "Uncategorized";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(fc);
    return acc;
  }, {});

  return (
    <div className="p-6  mx-auto bg-gray-950 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Flashcards</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 p-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400"
          defaultValue={filters.query}
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
          className="flex-1 p-2 border border-gray-300 rounded text-white bg-gray-800 placeholder-gray-400"
          value={filters.subject}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, subject: e.target.value }))
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
        <p className="text-center mt-10 text-white">Loading flashcards...</p>
      ) : flashcards.length === 0 ? (
        <p className="text-center mt-10 text-gray-400">No flashcards found.</p>
      ) : (
        Object.entries(groupedBySubject).map(([subject, cards]) => (
          <div key={subject} className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">
              📘 {subject}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((fc) => (
                <FlashcardCard key={fc._id} flashcard={fc} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FlashcardList;
