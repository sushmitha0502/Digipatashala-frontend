import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import teachingImg from "../Images/Grammar-correction.svg";

function Signup() {
  const navigate = useNavigate();

  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [Subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select Student or Teacher");
      return;
    }

    try {
      const url =
        userType === "student"
          ? "/api/student/register"
          : "/api/teacher/register";

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Firstname,
          Lastname,
          Email,
          Password,
          Subject,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        alert("Server returned invalid response");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful");

      const user = data.data?.user || data.data;

      if (!user || !user._id) {
        alert("User ID missing from response");
        return;
      }

      if (userType === "student") {
        navigate(`/StudentDocument/${user._id}`);
      } else {
        navigate(`/TeacherDocument/${user._id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#0f2d3c] to-[#6fa3a5] min-h-screen flex items-center justify-center">
      <div className="bg-[#0c2d44] p-10 rounded-2xl w-[400px] text-white shadow-xl">
        <h1 className="text-2xl text-center mb-3 font-semibold">WELCOME</h1>

        <p className="text-center mb-6 text-gray-300">join us today !!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Firstname"
            value={Firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-400 outline-none"
          />

          <input
            type="text"
            placeholder="Lastname"
            value={Lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-400 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-400 outline-none"
          />

          <div className="flex gap-6 mb-4">
            <label>
              <input
                type="radio"
                name="user"
                value="student"
                onChange={() => setUserType("student")}
              />{" "}
              Student
            </label>

            <label>
              <input
                type="radio"
                name="user"
                value="teacher"
                onChange={() => setUserType("teacher")}
              />{" "}
              Teacher
            </label>
          </div>

          {userType === "teacher" && (
            <select
              value={Subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg text-black"
            >
              <option value="">Select Subject</option>
              <option value="math">Math</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="computer">Computer</option>
            </select>
          )}

          <p className="text-sm mb-4">
            Already have an account?{" "}
            <span
              className="text-green-400 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              login
            </span>
          </p>

          <button className="w-full bg-[#1f7a7a] py-3 rounded-lg hover:bg-[#155e5e]">
            Signup
          </button>
        </form>
      </div>

      <div className="hidden md:block ml-20">
        <img src={teachingImg} alt="illustration" width={400} />
      </div>
    </div>
  );
}

export default Signup;
