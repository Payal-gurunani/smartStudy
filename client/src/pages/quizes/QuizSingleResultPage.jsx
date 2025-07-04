import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { motion } from "framer-motion";

const QuizSingleResultPage = () => {
  const { id } = useParams(); // quiz result _id
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { method, url } = endpoints.getQuizResultById(id);
        const res = await apiRequest({ method, url });
        setQuiz(res);
      } catch (err) {
        console.error("Failed to load quiz result", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading quiz result...</p>;
  if (!quiz) return <p className="text-center text-red-500">Quiz not found.</p>;

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-2">
        Review: <span className="text-blue-600">{quiz.noteId?.title || "Untitled"}</span>
      </h2>
      <p className="mb-1 text-lg">
        Score: <span className="font-semibold text-green-600">{quiz.score}%</span>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Attempted on:{" "}
        {quiz.attemptedAt
          ? new Date(quiz.attemptedAt).toLocaleString()
          : "Date not available"}
      </p>

      {quiz.questions.map((q, idx) => {
        let optionsObj = {};

        try {
          if (Array.isArray(q.options) && typeof q.options[0] === "string") {
            optionsObj = Function('"use strict";return (' + q.options[0] + ')')();
          } else {
            optionsObj = q.options;
          }
        } catch (err) {
          console.error(`Failed to parse options for question ${idx + 1}`, err);
        }

        return (
          <div key={q._id || idx} className="mb-6 border border-gray-300 p-4 rounded-lg shadow-sm">
            <p className="font-medium mb-3">
              <span className="text-gray-700">Q{idx + 1}:</span> {q.question}
            </p>

            {optionsObj && Object.entries(optionsObj).map(([optKey, text]) => {
              const isSelected = q.selectedAnswer === optKey;
              const isCorrect = q.correctAnswer === optKey;

              return (
                <p
                  key={optKey}
                  className={`p-2 rounded-md mb-1 border ${
                    isSelected
                      ? isCorrect
                        ? "bg-green-100 border-green-500"
                        : "bg-red-100 border-red-500"
                      : isCorrect
                      ? "bg-green-50 border-green-300"
                      : "border-gray-200"
                  }`}
                >
                  <strong>{optKey}.</strong> {text}
                </p>
              );
            })}

            <p className="text-sm mt-2 text-gray-600">
              Your Answer:{" "}
              <span className="font-medium">{q.selectedAnswer || "None"}</span> | Correct:{" "}
              <span className="font-medium text-green-700">{q.correctAnswer}</span>
            </p>
          </div>
        );
      })}
    </motion.div>
  );
};

export default QuizSingleResultPage;
