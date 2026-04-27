import React, { useEffect, useState } from "react";
import teachingImg from "../../Images/Teaching.svg";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import logo from "../../Images/Logo.jpg";

function StudentDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/student/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (resData.statusCode === 200) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/student/StudentDocument/${ID}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const user = await response.json();

        if (!response.ok) {
          const message = user?.message || "Failed to fetch student data";
          if (message.toLowerCase().includes("unauthorized")) {
            navigate("/login");
            return;
          }
          throw new Error(message);
        }

        setData(user.data);
      } catch (fetchError) {
        console.log(fetchError);
        setError(fetchError.message);
      }
    };

    getData();
  }, [ID, navigate]);

  return (
    <>
      <nav className="flex items-center justify-between bg-[#04253A] px-10 py-3">
        <NavLink to="/">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-14" alt="logo" />
            <h1 className="text-2xl font-bold text-[#4E84C1]">Digipatashala</h1>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="rounded-full bg-[#0D199D] px-5 py-2 text-white"
        >
          Logout
        </button>
      </nav>

      <div className="relative overflow-hidden bg-gradient-to-r from-[#008280] to-[#04253A] px-6 py-10 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Welcome back, <span className="text-[#f8fafc]">{data?.Firstname || "Student"}</span>
            </h1>
            <h3 className="text-xl text-white/90">
              {data?.Firstname} {data?.Lastname}
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Explore teachers, manage enrolled courses, join classes, and take quizzes.
            </p>
            {error && <p className="mt-3 text-sm text-red-100">{error}</p>}
          </div>

          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <img src={teachingImg} alt="teaching" className="w-full rounded-[2rem] shadow-2xl" />
          </div>
        </div>
      </div>

      <div className="fixed left-0 top-[5.5rem] z-10 h-[calc(100vh-5.5rem)] w-56 bg-[#071645] shadow-xl">
        <div className="mb-10 mt-8 flex flex-col items-center gap-5 text-xl text-white">
          <img
            src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
            alt="profile"
            width={50}
          />
          <p>
            {data?.Firstname} {data?.Lastname}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <NavLink
            to={`/Student/Dashboard/${ID}/Search`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Teacher
          </NavLink>

          <NavLink
            to={`/Student/Dashboard/${ID}/Classes`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Classes
          </NavLink>

          <NavLink
            to={`/Student/Dashboard/${ID}/Courses`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Courses
          </NavLink>

          <NavLink
            to={`/Student/Dashboard/${ID}/Quiz`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Quiz
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
