import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const newErrors = {};

    if (!Email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = "Invalid email format";
    }

    if (!Password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!userType) {
      newErrors.userType = "Select user type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`/api/${userType}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email,
          Password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data?.message || "Login failed" });
        return;
      }

      setSuccess("Login successful");

      const user = data.data;

      if (userType === "student") {
        navigate(`/Student/Dashboard/${user._id}`);
      } else {
        navigate(`/Teacher/Dashboard/${user._id}`);
      }
    } catch (error) {
      console.log(error);
      setErrors({ api: "Server error" });
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#0f2d3c] to-[#6fa3a5] min-h-screen flex items-center justify-center">
      <div className="bg-[#0c2d44] p-10 rounded-2xl w-[400px] text-white shadow-xl">
        <h1 className="text-2xl text-center mb-5 font-semibold">
          WELCOME BACK!
        </h1>

        <p className="text-center mb-6 text-gray-300">
          Please Log Into Your Account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
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

          <p className="text-sm mb-2">
            Don't have an account?{" "}
            <span className="text-yellow-400 cursor-pointer">signup</span>
          </p>

          <p className="text-yellow-400 mb-4 cursor-pointer">
            Forget Password?
          </p>

          <button className="w-full bg-[#1f7a7a] py-3 rounded-lg hover:bg-[#155e5e]">
            Log In
          </button>

          {success && <p className="text-green-400 mt-3">{success}</p>}
          {errors?.api && <p className="text-red-400 mt-3">{errors.api}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
