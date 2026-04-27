import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function Popup({ onClose, course, teacherCourses }) {
  const navigate = useNavigate();
  const { ID } = useParams();
  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  const formatTime = (minutes) =>
    `${Math.floor(minutes / 60)}:${minutes % 60 === 0 ? "00" : minutes % 60}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1671D8]">
              Course Details
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {course?.coursename?.toUpperCase()}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Available teachers and the classes they have posted for this
              course.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-[#f5f8ff] p-5">
          <p className="text-sm font-semibold text-[#1671D8]">Course Overview</p>
          <p className="mt-2 text-gray-700">{course?.description}</p>
          <p className="mt-3 text-sm text-gray-600">
            Monthly fee: Rs. {price[course?.coursename] || 0} per student
          </p>
        </div>

        <div className="grid gap-5">
          {teacherCourses.length > 0 ? (
            teacherCourses.map((teacherCourse) => (
              <div
                key={teacherCourse._id}
                className="rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {teacherCourse?.enrolledteacher?.Firstname}{" "}
                      {teacherCourse?.enrolledteacher?.Lastname}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {teacherCourse?.enrolledteacher?.Email}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#1671D8] px-3 py-1 text-xs font-semibold text-white">
                    {teacherCourse?.liveClasses?.length || 0} posted classes
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    Posted Classes
                  </p>

                  {teacherCourse?.liveClasses?.length > 0 ? (
                    <div className="grid gap-3">
                      {teacherCourse.liveClasses.map((liveClass, index) => (
                        <div
                          key={`${teacherCourse._id}-${index}`}
                          className="rounded-xl bg-[#f8fafc] p-4"
                        >
                          <p className="font-semibold text-gray-900">
                            {liveClass.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {liveClass.date?.slice(0, 10)} |{" "}
                            {formatTime(liveClass.timing)} -{" "}
                            {formatTime(
                              typeof liveClass.endTiming === "number"
                                ? liveClass.endTiming
                                : liveClass.timing + 60
                            )}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 capitalize">
                            Status: {liveClass.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      This teacher has not posted any live classes yet.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/Student/Dashboard/${ID}/Classes`)}
                    className="mt-4 rounded-xl bg-[#1671D8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Scheduled Classes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-[#f8fafc] p-5 text-sm text-gray-500">
              No teachers are available for this course right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
