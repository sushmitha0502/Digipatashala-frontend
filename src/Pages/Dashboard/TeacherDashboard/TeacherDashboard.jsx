import React, { useEffect, useState } from 'react'
import teachingImg from '../../Images/Teaching.svg'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import logo from '../../Images/Logo.jpg'

function TeacherDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();


  // ================= LOGOUT =================
  const Handlelogout = async () => {
    try {
      const response = await fetch(`/api/teacher/logout`, {
        method: 'POST',
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const res = await response.json();

      if (res.statusCode === 200) navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  // ================= FETCH TEACHER =================
  const [teacher, setTeacher] = useState(null);

useEffect(() => {
  const fetchTeacher = async () => {
    try {
      const res = await fetch(`/api/teacher/teacherdocument/${ID}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load teacher details");
      }

      setTeacher(data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchTeacher();
}, [ID]);
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between bg-[#04253A] px-10 py-3">
        <NavLink to="/">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-14" alt="logo" />
            <h1 className="text-2xl font-bold text-[#4E84C1]">Digipatashala</h1>
          </div>
        </NavLink>

        <button
          onClick={Handlelogout}
          className="rounded-full bg-[#0D199D] px-5 py-2 text-white"
        >
          Logout
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#008280] to-[#04253A] px-6 py-10 lg:pl-72">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Welcome back, <span className="text-[#f8fafc]">{teacher?.Firstname || "Teacher"}</span>
            </h1>
            <h3 className="text-xl text-white/90">
              {teacher?.Firstname} {teacher?.Lastname}
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Manage your classes, courses & quizzes
            </p>
          </div>

          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <img src={teachingImg} alt="teaching" className="w-full rounded-[2rem] shadow-2xl" />
          </div>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="fixed left-0 top-[5.5rem] z-10 h-[calc(100vh-5.5rem)] w-56 bg-[#071645] shadow-xl">
        <div className="mb-10 mt-8 flex flex-col items-center gap-5 text-xl text-white">
          <img
            src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
            alt="profile"
            width={50}
          />
          <p>
            {teacher?.Firstname} {teacher?.Lastname}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <NavLink
            to={`/Teacher/Dashboard/${ID}/Home`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Classes`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Classes
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Courses`}
            className={({ isActive }) =>
              isActive
                ? "bg-white p-3 text-center font-semibold text-[#4E84C1]"
                : "p-3 text-center font-semibold text-[#4E84C1]"
            }
          >
            Courses
          </NavLink>

          <NavLink
            to={`/Teacher/Dashboard/${ID}/Quiz`}
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

export default TeacherDashboard;
