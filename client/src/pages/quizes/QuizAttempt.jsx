import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { confirmToast } from "../../utils/confirmToast"; // ⬅️ new
const QuizAttemptPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      const stored = localStorage.getItem(`quiz-${noteId}`);
      if (stored) {
        setQuiz(JSON.parse(stored));
      } else {
        try {
          const { method, url } = endpoints.getNote(noteId);
          const res = await apiRequest({ method, url });
          setNoteTitle(res.title);


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

  const handleOption = (key) => {
    setAnswers((prev) => ({ ...prev, [current]: key }));
  };

  const handleSubmit = async () => {
    const payload = {
      noteId,
      answers: Object.entries(answers).map(([_, selected]) => ({
        selectedAnswer: selected,
      })),
    };

    try {
      await apiRequest({
        method: endpoints.submitQuiz.method,
        url: endpoints.submitQuiz.url,
        data: payload,
      });

      toast.success("Quiz submitted successfully 🎉");
      localStorage.removeItem(`quiz-${noteId}`);
      navigate("/quizzes/results");
    } catch (err) {
      toast.error("Submission failed ");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading quiz...</p>;
  if (!quiz || quiz.length === 0) return <p className="text-center text-red-500">Quiz not available.</p>;

  const q = quiz[current];
  

  const selected = answers[current];
  const percent = ((current + 1) / quiz.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mt-6 text-center">
            <button
              onClick={async () => {
                const confirmExit =  await confirmToast({
                  title: "Exit Quiz",
                  message: "Are you sure you want to end the test? Your progress will be lost.",
                  confirmLabel: "Yes, End Test",  
                  cancelLabel: "No, Continue",
                });

                if (confirmExit) {
                  localStorage.removeItem(`quiz-${noteId}`);
                  navigate("/quizzes");
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
            >
              End Test
            </button>
          </div>

<h1 className="text-2xl sm:text-3xl font-bold mb-1 overflow-hidden">Quiz: {noteTitle}</h1>
          <p className="text-sm text-blue-400 mb-4">
            Question {current + 1} of {quiz.length}
          </p>

      
          <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Question */}
          <p className="text-lg mb-6 text-slate-100">{q.question}</p>

          {/* Options */}
          <div className="space-y-3">
            {Object.entries(q.options).map(([key, text]) => (
              <label
                key={key}
                className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-all
                ${selected === key
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${current}`}
                  className="mr-3 h-5 w-5 text-blue-400 accent-blue-500"
                  checked={selected === key}
                  onChange={() => handleOption(key)}
                />
                <span className="text-sm sm:text-base">{key}. {text}</span>
              </label>
            ))}
          </div>
          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((prev) => prev - 1)}
              className="bg-slate-600 hover:bg-slate-500 cursor-pointer text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {current === quiz.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded cursor-pointer"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrent((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-6 rounded"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;
