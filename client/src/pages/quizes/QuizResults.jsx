import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const QuizResults = () => {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(false);

  /* ───────────────────────────────── fetch once ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest({
          method: endpoints.getQuizResults.method,
          url:    endpoints.getQuizResults.url,
        });
        // sort newest‑first for readability
        setResults([...(res || [])].sort(
          (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
        ));
      } catch (err) {
        setError(true);
        toast.error("Could not load quiz results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ──────────────────────────────── UI states ──────────────────────────────── */
  if (loading) {
    return (
      <div className="grid h-[70vh] place-items-center text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading your quiz results…
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Something went wrong. Please refresh the page.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No attempts yet.</p>
    );
  }

  /* ─────────────────────────────── rendered list ───────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Quiz Results</h1>

      {results.map((r) => {
        const scoreColor =
          r.score >= 80 ? "text-green-600"
        : r.score >= 50 ? "text-yellow-600"
        :                 "text-red-600";

        return (
          <Link
            to={`/quizzes/result/${r._id}`}
            key={r._id}
            className="block hover:bg-gray-50 rounded-lg transition"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 mb-4 shadow"
            >
              <p>
                <span className="font-semibold">Quiz Title:</span>{" "}
                {r.title || "Untitled Quiz"}
              </p>

              <p>
                Score:{" "}
                <span className={`font-semibold ${scoreColor}`}>
                  {r.score}%
                </span>
              </p>

              <p>
                Correct:{" "}
                <span className="font-semibold">
                  {r.correct}/{r.total}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Attempted on:{" "}
                {new Date(r.attemptedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuizResults;
