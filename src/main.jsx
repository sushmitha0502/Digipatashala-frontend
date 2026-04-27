import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import Landing from "./Pages/Home/Landing/Landing";
import About from "./Pages/Home/About/About";
import Contact from "./Pages/Home/Contact/Contact";
import Courses from "./Pages/Home/Courses/Courses";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import AdminLogin from "./Pages/Login/AdminLogin";
import {
  RouterProvider,
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout";
import StudentDocument from "./Pages/Components/DocumentVerification/StudentDocument";
import TeacherDocument from "./Pages/Components/DocumentVerification/TeacherDocument";
import Rejected from "./Pages/Response/Rejected";
import Pending from "./Pages/Response/Pending";
import Admin from "./Pages/Components/Admin/Admin";
import VarifyDoc from "./Pages/Components/Admin/VarifyDoc";
import TeacherLayout from "./Pages/Dashboard/TeacherDashboard/TeacherLayout";
import StudentLayout from "./Pages/Dashboard/StudentDashboard/StudentLayout";
import SearchTeacher from "./Pages/Dashboard/StudentDashboard/SearchTeacher";
import StudentClasses from "./Pages/Dashboard/StudentDashboard/StudentClasses";
import StudentCourses from "./Pages/Dashboard/StudentDashboard/StudentCourses";
import StudentQuiz from "./Pages/Dashboard/StudentDashboard/StudentQuiz";
import DashboardTeacher from "./Pages/Dashboard/TeacherDashboard/DashboardTeacher";
import TeacherClasses from "./Pages/Dashboard/TeacherDashboard/TeacherClasses";
import TeacherCourses from "./Pages/Dashboard/TeacherDashboard/TeacherCourses";
import TeacherQuiz from "./Pages/Dashboard/TeacherDashboard/TeacherQuiz";
import SearchData from "./Pages/Home/Search/Search";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Forgetpassword from "./Pages/ForgetPassword/Forgetpassword";
import ResetPassword from "./Pages/ForgetPassword/ResetPassword";
import { Toaster } from "react-hot-toast";
import ResetTeacher from "./Pages/ForgetPassword/ResetTeacher";
import Course from "./Pages/Components/Admin/Course";
import StudentQuizPage from "./Pages/Dashboard/StudentDashboard/StudentQuizPage";
import OfflineLessons from "./Pages/OfflineLessons";
import DigitalLiteracy from "./Pages/DigitalLiteracy";
import { LanguageProvider } from "./context/LanguageContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Search/:subject" element={<SearchData />} />
      <Route path="/StudentDocument/:Data" element={<StudentDocument />} />
      <Route path="/TeacherDocument/:Data" element={<TeacherDocument />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/adminLogin/" element={<AdminLogin />} />
      <Route path="/rejected/:user/:ID" element={<Rejected />} />
      <Route path="/pending" element={<Pending />} />
      <Route path="/admin/:data" element={<Admin />} />
      <Route path="/admin/course/:data" element={<Course />} />
      <Route path="/VarifyDoc/:type/:adminID/:ID" element={<VarifyDoc />} />
      <Route path="/offline-lessons" element={<OfflineLessons />} />
      <Route path="/digital-literacy" element={<DigitalLiteracy />} />

      <Route path="/Student/Dashboard/:ID" element={<StudentLayout />}>
        <Route index element={<Navigate to="Search" replace />} />
        <Route path="Search" element={<SearchTeacher />} />
        <Route path="Classes" element={<StudentClasses />} />
        <Route path="Courses" element={<StudentCourses />} />
        <Route path="Quiz" element={<StudentQuiz />} />
      </Route>

      <Route path="/student/quiz/:id" element={<StudentQuizPage />} />

      <Route path="/Teacher/Dashboard/:ID" element={<TeacherLayout />}>
        <Route index element={<Navigate to="Home" replace />} />
        <Route path="Home" element={<DashboardTeacher />} />
        <Route path="Classes" element={<TeacherClasses />} />
        <Route path="Courses" element={<TeacherCourses />} />
        <Route path="Quiz" element={<TeacherQuiz />} />
      </Route>

      <Route path="/forgetPassword" element={<Forgetpassword />} />
      <Route path="/student/forgetPassword/:token" element={<ResetPassword />} />
      <Route path="/teacher/forgetPassword/:token" element={<ResetTeacher />} />

      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <Toaster />
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>
);
