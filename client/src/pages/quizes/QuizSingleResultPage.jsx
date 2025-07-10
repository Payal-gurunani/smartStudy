import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
const QuizSingleResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading quiz result...</p>;
  if (!quiz) return <p className="text-center text-red-500">Quiz not found.</p>;

  const totalQuestions = quiz.questions.length;
  const correctAnswers = quiz.questions.filter(q => q.selectedAnswer === q.correctAnswer).length;
  const accuracy = `${correctAnswers}/${totalQuestions}`;
  const timeTaken = quiz.timeTaken || "--";

  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-4 py-6 sm:px-10 sm:py-10 w-full">

         <div className="sm:hidden mb-6 flex justify-between items-center">
                  <button onClick={() => setIsSidebarOpen(true)}>
                    <FiMenu className="text-2xl text-white" />
                  </button>
                  <h2 className="text-lg font-semibold">Upload PDF</h2>
                </div>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-1">Quiz Results</h2>
            <p className="text-sm text-blue-400 mb-6">Your performance on the '{quiz.noteId?.title}' quiz</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-3xl font-bold text-white">{quiz.score}%</p>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold text-white">{accuracy}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Review Answers</h3>
            <div className="space-y-6 mb-10">
              {quiz.questions.map((q, idx) => {
                let optionsObj = {};
                try {
                  if (Array.isArray(q.options) && typeof q.options[0] === "string") {
                    optionsObj = Function('"use strict";return (' + q.options[0] + ')')();
                  } else {
                    optionsObj = q.options;
                  }
                } catch {
                  optionsObj = q.options || {};
                }
                return (
                  <div key={q._id || idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <p className="font-semibold mb-2">Question {idx + 1}: {q.question}</p>
                    <div className="space-y-2">
                      {Object.entries(optionsObj).map(([optKey, text]) => {
                        const isSelected = q.selectedAnswer === optKey;
                        const isCorrect = q.correctAnswer === optKey;
                        return (
                          <div
                            key={optKey}
                            className={`p-3 rounded-md border text-sm ${
                              isSelected
                                ? isCorrect
                                  ? "bg-green-700/30 border-green-400"
                                  : "bg-red-700/30 border-red-400"
                                : isCorrect
                                ? "bg-green-800/30 border-green-500"
                                : "bg-slate-700 border-slate-600"
                            }`}
                          >
                            <span className="font-semibold mr-1">{optKey}.</span> {text}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm mt-2 text-slate-400">
                      Your Answer: <span className="text-white font-medium">{q.selectedAnswer || "None"}</span> | Correct: <span className="text-green-400 font-medium">{q.correctAnswer}</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/quizzes/${quiz.noteId?._id || quiz.noteId}/attempt`)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/quizzes")}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-full font-semibold"
              >
                Back to Quizzes
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default QuizSingleResultPage;
