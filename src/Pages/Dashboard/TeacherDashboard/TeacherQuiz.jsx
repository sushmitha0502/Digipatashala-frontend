import React, { useState } from "react";

function TeacherQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", ""], correctAnswer: "" },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], correctAnswer: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Enter quiz title");
      return;
    }

    if (!questions.length) {
      alert("Add at least one question");
      return;
    }

    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          questions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Quiz created successfully");
        setTitle("");
        setQuestions([
          { questionText: "", options: ["", ""], correctAnswer: "" },
        ]);
      } else {
        alert(data.message || "Failed to create quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-[#0b3142] via-[#11495a] to-[#7fa8a8] px-4 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] bg-gradient-to-r from-[#0b6a6c] via-[#0a505f] to-[#082c3f] px-6 py-8 shadow-2xl md:px-8">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Teacher Quiz
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Create Quiz</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Build a quiz for your learners by adding questions, options, and the
            correct answers below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[2rem] border border-white/10 bg-black/15 p-6 backdrop-blur-sm"
        >
          <input
            type="text"
            placeholder="Quiz Title"
            className="mb-5 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-black outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {questions.map((q, index) => (
            <div key={index} className="mb-5 rounded-2xl bg-[#042439] p-4">
              <input
                type="text"
                placeholder="Question"
                className="mb-2 w-full rounded-lg p-3 text-black"
                value={q.questionText}
                onChange={(e) =>
                  handleChange(index, "questionText", e.target.value)
                }
              />

              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="mb-2 w-full rounded-lg p-3 text-black"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, i, e.target.value)}
                />
              ))}

              <button
                type="button"
                onClick={() => addOption(index)}
                className="mt-1 rounded-lg bg-gray-500 px-3 py-2"
              >
                + Add Option
              </button>

              <input
                type="text"
                placeholder="Correct Answer"
                className="mt-3 w-full rounded-lg p-3 text-black"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleChange(index, "correctAnswer", e.target.value)
                }
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addQuestion}
              className="rounded-xl bg-blue-500 px-4 py-3 font-semibold"
            >
              Add Question
            </button>

            <button
              type="submit"
              className="rounded-xl bg-green-500 px-4 py-3 font-semibold"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherQuiz;
