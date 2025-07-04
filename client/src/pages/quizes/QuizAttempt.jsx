import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const QuizAttemptPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      const stored = localStorage.getItem(`quiz-${noteId}`);
      if (stored) {
        setQuiz(JSON.parse(stored));
      } else {
        try {
          const { method, url } = endpoints.getNote(noteId);
          const res = await apiRequest({ method, url });

          if (res.quiz && res.quiz.length > 0) {
            setQuiz(res.quiz);
          } else {
            toast.error("No quiz found for this note.");
            navigate("/quizzes");
          }
        } catch (err) {
          toast.error("Failed to load quiz.");
          console.error(err);
        }
      }
      setLoading(false);
    };

    loadQuiz();
  }, [noteId, navigate]);

  const handleOption = (key) =>
    setAnswers((prev) => ({ ...prev, [current]: key }));

  const handleSubmit = async () => {
    const payload = {
      noteId,
      answers: Object.entries(answers).map(([_, selected]) => ({
        selectedAnswer: selected,
      })),
    };

    try {
      const res = await apiRequest({
        method: endpoints.submitQuiz.method,
        url: endpoints.submitQuiz.url,
        data: payload,
      });

      toast.success("Submitted successfully 🏆");
      localStorage.removeItem(`quiz-${noteId}`);
      navigate("/quizzes/results");
    } catch (err) {
      toast.error("Failed to submit quiz ❌");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading quiz...</p>;
  if (!quiz || quiz.length === 0) return <p className="text-center text-red-500">Quiz not available.</p>;

  const q = quiz[current];
  const selected = answers[current];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-xl p-6"
      >
        <h2 className="text-lg font-bold mb-4">
          Question {current + 1} of {quiz.length}
        </h2>

        <p className="mb-6 text-gray-800">{q.question}</p>

        {Object.entries(q.options).map(([key, text]) => (
          <label
            key={key}
            className={`block border rounded p-2 mb-2 cursor-pointer transition-all ${
              selected === key
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name={`question-${current}`}
              className="mr-2"
              checked={selected === key}
              onChange={() => handleOption(key)}
            />
            {key}. {text}
          </label>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrent((prev) => prev - 1)}
            disabled={current === 0}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Previous
          </button>

          {current === quiz.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrent((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizAttemptPage;
