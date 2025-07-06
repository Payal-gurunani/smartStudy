import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams ,useLocation} from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const GenrateQuiz = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const calledRef = useRef(false); 
const location = useLocation();
  useEffect(() => {
    if (calledRef.current) return; 
    calledRef.current = true;

    let called = false;

    (async () => {
      if (called) return;
      called = true;

      try {
        // Step 1: Fetch note to check if quiz exists
        const { method, url } = endpoints.getNote(noteId);
        const note = await apiRequest({ method, url });

        if (note?.quiz && note.quiz.length > 0) {
          const userWantsNew = window.confirm(
            "A quiz is already generated for this note. Do you want to generate a new quiz with different questions?"
          );

          if (!userWantsNew) {
            // Use existing quiz
            localStorage.setItem(`quiz-${noteId}`, JSON.stringify(note.quiz));
            toast.info("Using previously generated quiz.");
            navigate(`/quizzes/${noteId}/attempt`,{
                state: { from: location.state?.from || "/notes"}
               },

            );
            
            return;
          }
        }

        // Step 2: Generate new quiz
        const res = await apiRequest(endpoints.generateQuiz(noteId));
        localStorage.setItem(`quiz-${noteId}`, JSON.stringify(res));
        toast.success(" New quiz generated!");
        navigate(`/quizzes/${noteId}/attempt`);
      } catch (err) {
        toast.error(err.response?.data?.message || " Quiz generation failed");
        setLoading(false);
      }
    })();
  }, [noteId, navigate]);

  return (
    <div className="grid h-[70vh] place-items-center text-xl text-gray-600">
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-6 h-6" />
          Generating your quiz…
        </div>
      ) : (
        <p>Failed to generate quiz. Please try again.</p>
      )}
    </div>
  );
};

export default GenrateQuiz;
