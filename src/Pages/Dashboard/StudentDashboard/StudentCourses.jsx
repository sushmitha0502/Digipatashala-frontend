import React, { useEffect, useState } from "react";
import Popup from "./Popup";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/all`);
        const user = await response.json();

        if (!response.ok) {
          throw new Error(user?.message || "Failed to load courses");
        }

        const approvedCourses = (user?.data || []).filter((course) => course.isapproved);

        const uniqueCourses = Object.values(
          approvedCourses.reduce((acc, course) => {
            if (!acc[course.coursename]) {
              acc[course.coursename] = {
                _id: course._id,
                coursename: course.coursename,
                description: course.description,
              };
            }

            return acc;
          }, {})
        );

        setCourses(uniqueCourses);
      } catch (error) {
        console.log(error);
        setCourses([]);
      }
    };

    getData();
  }, []);

  const openPopup = async (course) => {
    try {
      const response = await fetch(`/api/course/${course.coursename}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to load teachers");
      }

      setSelectedCourse(course);
      setTeacherCourses(result?.data || []);
      setPopup(true);
    } catch (error) {
      console.log(error);
      setSelectedCourse(course);
      setTeacherCourses([]);
      setPopup(true);
    }
  };

  return (
    <>
      <div className="ml-60 min-h-screen bg-gradient-to-r from-[#0f3c52] to-[#7fa9a8] p-10">
        <h2 className="mb-10 text-2xl font-bold text-blue-500">
          Courses
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                onClick={() => openPopup(course)}
                className="cursor-pointer rounded-xl bg-white p-5 shadow-lg transition hover:scale-105"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {course?.coursename?.toUpperCase()}
                </h3>

                <p className="mt-2 text-sm text-gray-600">{course?.description}</p>

                <button className="mt-4 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">
                  View Teachers & Classes
                </button>
              </div>
            ))
          ) : (
            <p className="text-white">No courses available</p>
          )}
        </div>
      </div>

      {popup && selectedCourse && (
        <Popup
          onClose={() => setPopup(false)}
          course={selectedCourse}
          teacherCourses={teacherCourses}
        />
      )}
    </>
  );
}

export default StudentCourses;
