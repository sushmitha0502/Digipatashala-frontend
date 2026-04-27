import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentQuizPage() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Quiz not found");
        }

        setQuiz(data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionIndex, optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionText,
    }));
    setResult(null);
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const total = quiz.questions.length;
    const correct = quiz.questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    setResult({ total, correct });
  };

  const handleClear = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-10 text-red-500">Quiz not found</div>;
  }

  return (
    <div className="ml-60 min-h-screen bg-gradient-to-r from-[#0f3c52] to-[#7fa9a8] p-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">{quiz.title}</h1>

      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-6 rounded bg-[#042439] p-4">
          <h3 className="mb-3 font-semibold">
            {index + 1}. {q.questionText}
          </h3>

          {q.options.map((opt, i) => (
            <div key={i} className="mb-2">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name={`q${index}`}
                  className="h-4 w-4 text-blue-500"
                  checked={answers[index] === opt}
                  onChange={() => handleAnswer(index, opt)}
                />
                <span>{opt}</span>
              </label>
            </div>
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white shadow-inner">
            Score: <span className="font-bold">{result.correct}</span> / <span>{result.total}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentQuizPage;
