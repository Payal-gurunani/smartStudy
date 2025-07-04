import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { Link } from "react-router-dom";
import { endpoints } from "../../api/endPoints";
const Quizzess = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const res = await apiRequest({
                    method: endpoints.getAllQuizStatus.method,
                    url: endpoints.getAllQuizStatus.url,
                });
                setQuizzes(res);
            } catch (err) {
                console.error("Failed to load quiz list");
            }finally{
                setLoading(false);
            }
        })();
    }, []);
    if (loading) return <p className="text-center mt-10">Loading quizzes...</p>;

    if (quizzes.length === 0)
        return <p className="text-center mt-10 text-gray-500">No quizzes available.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Quizzes</h2>

            {quizzes.map((q) => (
                <div key={q.noteId} className="border rounded-lg p-4 mb-4 shadow">
                    <p className="font-semibold">Note: {q.title}</p>
                    <p>Status: {q.attempted ? "Attempted" : "Not Attempted"}</p>
                    {q.attempted && (
                        <>
                            <p>Last Score: <span className="font-semibold text-green-600">{q.lastScore}%</span></p>
                            <p className="text-sm text-gray-500">
                                Attempted on: {new Date(q.lastAttemptedAt).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })
                                }
                            </p>
                        </>
                    )}
                    <div className="mt-2 flex gap-4">
                        <Link to={`/quizzes/${q.noteId}/attempt`}>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                {q.attempted ? "Retake Quiz" : "Start Quiz"}
                            </button>
                        </Link>
                        {q.attempted && (
                            <Link to={`/quizzes/result/${q.resultId}`}>
                                <button className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">
                                    View Result
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Quizzess;
