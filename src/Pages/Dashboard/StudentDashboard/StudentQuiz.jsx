import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentQuiz() {
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch("/api/quiz", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load quizzes");
        }

        setQuiz(data?.data || []);
      } catch (err) {
        console.log(err);
        setQuiz([]);
      }
    };

    fetchQuiz();
  }, []);

  const startQuiz = (q) => {
    navigate(`/student/quiz/${q._id}`);
  };

  return (
    <div className="ml-60 min-h-screen bg-gradient-to-r from-[#0f3c52] to-[#7fa9a8] p-10">
      <h2 className="mb-10 text-2xl font-bold text-blue-500">Quizzes</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {quiz?.length > 0 ? (
          quiz.map((q) => (
            <div
              key={q._id}
              className="relative z-10 rounded-xl bg-white p-5 shadow-lg"
            >
              <h3 className="text-lg font-bold">{q?.title}</h3>

              <p className="mt-2 text-gray-600">
                {q?.instructions || "No instructions"}
              </p>

              <button
                onClick={() => startQuiz(q)}
                className="relative z-20 mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Start Quiz
              </button>
            </div>
          ))
        ) : (
          <p className="text-white">No quizzes available</p>
        )}
      </div>
    </div>
  );
}

export default StudentQuiz;
