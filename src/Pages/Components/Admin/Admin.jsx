import React, { useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import logo from "../../Images/Logo.jpg";

const Admin = () => {
  const { data } = useParams();
  const navigator = useNavigate();

  const [studentData, setStudentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [courseReq, setCourseReq] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [allMsg, setAllMsg] = useState([]);
  const [openMessages, setOpenMessages] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("pending");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchData = async () => {
    try {
      setError("");

      const [pendingRes, usersRes, courseRes, recordedRes, quizRes, msgRes] = await Promise.all([
        fetch(`/api/admin/${data}/approve`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`/api/admin/${data}/users`, {
          credentials: "include",
        }),
        fetch(`/api/admin/${data}/approve/course`, {
          credentials: "include",
        }),
        fetch(`/api/admin/${data}/recorded-classes`, {
          credentials: "include",
        }),
        fetch(`/api/admin/${data}/quizzes`, {
          credentials: "include",
        }),
        fetch(`/api/admin/messages/all`, {
          credentials: "include",
        }),
      ]);

      const pendingData = await pendingRes.json();
      const usersData = await usersRes.json();
      const courseData = await courseRes.json();
      const recordedData = await recordedRes.json();
      const quizData = await quizRes.json();
      const msgData = await msgRes.json();

      if (!pendingRes.ok) throw new Error(pendingData?.message || "Failed to load pending approvals");
      if (!usersRes.ok) throw new Error(usersData?.message || "Failed to load users");
      if (!courseRes.ok) throw new Error(courseData?.message || "Failed to load course approvals");
      if (!recordedRes.ok) console.warn(recordedData?.message || "Failed to load recorded classes");
      if (!quizRes.ok) throw new Error(quizData?.message || "Failed to load quizzes");
      if (!msgRes.ok) throw new Error(msgData?.message || "Failed to load messages");

      setStudentData(usersData?.data?.students || pendingData?.data?.studentsforApproval || []);
      setTeacherData(usersData?.data?.teachers || pendingData?.data?.teachersforApproval || []);
      setCourseReq(courseData?.data || []);
      setRecordedClasses(recordedData?.data?.recordedClasses || []);
      setQuizzes(quizData?.data || []);
      setAllMsg(msgData?.data || []);
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const handleLogout = async () => {
    try {
      await fetch(`/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }

    navigator("/");
  };

  const docDetails = (type, id) => {
    navigator(`/VarifyDoc/${type}/${data}/${id}`);
  };

  const handleCourseDecision = async (courseID, approved, info) => {
    try {
      const response = await fetch(`/api/admin/${data}/approve/course/${courseID}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Isapproved: approved,
          email: info.Email,
          Firstname: info.Firstname,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update course");
      }

      await fetchData();
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to update course");
    }
  };

  const openEditUser = (type, user) => {
    const docs = type === "student" ? user.Studentdetails : user.Teacherdetails;

    setEditingUser({ type, userId: user._id, docsId: docs?._id || null });
    setEditForm({
      Firstname: user.Firstname || "",
      Lastname: user.Lastname || "",
      Email: user.Email || "",
      Isapproved: user.Isapproved || "pending",
      Remarks: user.Remarks || "",
      Subject: user.Subject || "",
      Phone: docs?.Phone || "",
      Address: docs?.Address || "",
      Experience: docs?.Experience || "",
      Highesteducation: docs?.Highesteducation || "",
      SecondarySchool: docs?.SecondarySchool || "",
      HigherSchool: docs?.HigherSchool || "",
      UGcollege: docs?.UGcollege || "",
      PGcollege: docs?.PGcollege || "",
      SecondaryMarks: docs?.SecondaryMarks || "",
      HigherMarks: docs?.HigherMarks || "",
      UGmarks: docs?.UGmarks || "",
      PGmarks: docs?.PGmarks || "",
    });
  };

  const saveUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `/api/admin/${data}/users/${editingUser.type}/${editingUser.userId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update user");
      }

      setEditingUser(null);
      await fetchData();
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to update user");
    }
  };

  const renderUserCard = (type, user) => {
    const docs = type === "student" ? user.Studentdetails : user.Teacherdetails;

    return (
      <div key={user._id} className="rounded-2xl bg-gray-800 p-5 text-gray-100 shadow-[0_0_10px_rgba(255,255,255,0.15)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">
              {user.Firstname} {user.Lastname}
            </h3>
            <p className="text-sm text-gray-300">{user.Email}</p>
            {type === "teacher" && (
              <p className="mt-1 text-sm text-blue-300 capitalize">
                Subject: {user.Subject || "-"}
              </p>
            )}
          </div>

          <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold capitalize">
            {user.Isapproved}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-gray-300">
          <p>Phone: {docs?.Phone || "-"}</p>
          <p>Address: {docs?.Address || "-"}</p>
          {type === "student" ? (
            <p>Highest Education: {docs?.Highesteducation || "-"}</p>
          ) : (
            <p>Experience: {docs?.Experience ?? "-"}</p>
          )}
          <p>Remarks: {user.Remarks || "-"}</p>
        </div>

        <div className="mt-4 flex gap-3">
          {docs?._id && (
            <button
              onClick={() => docDetails(type, user._id)}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
            >
              View Documents
            </button>
          )}
          <button
            onClick={() => openEditUser(type, user)}
            className="rounded bg-green-600 px-3 py-2 text-sm text-white"
          >
            Edit Details
          </button>
        </div>
      </div>
    );
  };

  const sections = [
    { key: "pending", label: "Pending Docs" },
    { key: "courses", label: "Course Approvals" },
    { key: "recorded", label: "Recorded Approvals" },
    { key: "quizzes", label: "Quizzes" },
    { key: "students", label: "Students" },
    { key: "teachers", label: "Teachers" },
  ];

  const handleRecordedApproval = async (courseId, recordId) => {
    try {
      const response = await fetch(
        `/api/admin/${data}/recorded-classes/${courseId}/${recordId}/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to approve recorded class");
      }

      setRecordedClasses((prev) =>
        prev.map((record) =>
          record.recordId === recordId ? { ...record, approvedByAdmin: true } : record
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to approve recorded class");
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="flex h-24 w-full items-center justify-between bg-[#042439] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <NavLink to="/">
          <div className="flex items-center gap-4">
            <img src={logo} alt="logo" className="w-14" />
            <h1 className="text-2xl font-bold text-[#4E84C1]">Digipatashala</h1>
          </div>
        </NavLink>

        <div className="flex items-center">
          <div
            className="relative mr-4 cursor-pointer"
            onClick={() => setOpenMessages((prev) => !prev)}
          >
            <IoIosNotificationsOutline className="h-8 w-8 text-white" />
            <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-red-500"></span>
          </div>
          <button onClick={handleLogout} className="rounded-md bg-blue-500 px-4 py-2 text-white">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 md:p-10">
        <div className="mb-6 flex flex-wrap gap-3">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeSection === section.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {openMessages && (
          <div className="mb-6 rounded-2xl bg-gray-700 p-5 text-gray-100">
            <h3 className="mb-4 text-lg font-bold">Unread Messages</h3>
            <div className="grid gap-3">
              {allMsg.length > 0 ? (
                allMsg.map((msg, index) => (
                  <div key={index} className="rounded bg-gray-600 p-3">
                    <p>Name: <span className="text-white">{msg.name}</span></p>
                    <p>Email: <span className="text-white">{msg.email}</span></p>
                    <p>Message: <span className="text-white">{msg.message}</span></p>
                  </div>
                ))
              ) : (
                <p>No unread messages.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === "pending" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Student Documents</h2>
              <div className="grid gap-4">
                {studentData.filter((student) => student.Isapproved === "pending").map((student) =>
                  renderUserCard("student", student)
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Teacher Documents</h2>
              <div className="grid gap-4">
                {teacherData.filter((teacher) => teacher.Isapproved === "pending").map((teacher) =>
                  renderUserCard("teacher", teacher)
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "courses" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courseReq.map((req) => (
              <div key={req._id} className="rounded-2xl bg-gray-800 p-5 text-gray-100">
                <h3 className="text-lg font-bold text-yellow-400">{req.coursename?.toUpperCase()}</h3>
                <p className="mt-2 text-sm">{req.description}</p>
                <p className="mt-2 text-sm">
                  Teacher: {req.enrolledteacher?.Firstname} {req.enrolledteacher?.Lastname}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                    onClick={() =>
                      handleCourseDecision(req._id, true, {
                        Email: req.enrolledteacher?.Email,
                        Firstname: req.enrolledteacher?.Firstname,
                      })
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                    onClick={() =>
                      handleCourseDecision(req._id, false, {
                        Email: req.enrolledteacher?.Email,
                        Firstname: req.enrolledteacher?.Firstname,
                      })
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "recorded" && (
          <div className="grid gap-4">
            {recordedClasses.length > 0 ? (
              recordedClasses.map((record) => (
                <div key={`${record.courseId}-${record.recordId}`} className="rounded-2xl bg-gray-800 p-5 text-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#82b1ff]">{record.coursename?.toUpperCase()}</p>
                      <h3 className="text-lg font-bold">{record.title}</h3>
                      <p className="mt-2 text-sm text-gray-300">{record.description || "No description provided."}</p>
                      <p className="mt-2 text-xs text-gray-400">Uploaded by: {record.teacherName || record.teacherEmail}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Status: {record.approvedByAdmin ? "Approved" : "Pending approval"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={record.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                      >
                        View Recording
                      </a>
                      {!record.approvedByAdmin && (
                        <button
                          onClick={() => handleRecordedApproval(record.courseId, record.recordId)}
                          className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No recorded classes are waiting for approval.</p>
            )}
          </div>
        )}

        {activeSection === "quizzes" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz._id} className="rounded-2xl bg-gray-800 p-5 text-gray-100">
                  <h3 className="text-lg font-bold text-yellow-400">{quiz.title}</h3>
                  <p className="mt-2 text-sm">{quiz.instructions}</p>
                  <p className="mt-3 text-sm">Questions: {quiz.questions?.length || 0}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Created: {quiz.createdAt?.slice(0, 10) || "-"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white">No quizzes available.</p>
            )}
          </div>
        )}

        {activeSection === "students" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {studentData.map((student) => renderUserCard("student", student))}
          </div>
        )}

        {activeSection === "teachers" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teacherData.map((teacher) => renderUserCard("teacher", teacher))}
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Edit {editingUser.type === "student" ? "Student" : "Teacher"}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded bg-gray-100 px-3 py-2 text-sm text-gray-600"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Firstname",
                "Lastname",
                "Email",
                "Isapproved",
                "Remarks",
                "Phone",
                "Address",
                editingUser.type === "student" ? "Highesteducation" : "Subject",
                editingUser.type === "teacher" ? "Experience" : "SecondarySchool",
                "HigherSchool",
                "SecondaryMarks",
                "HigherMarks",
                editingUser.type === "teacher" ? "UGcollege" : null,
                editingUser.type === "teacher" ? "PGcollege" : null,
                editingUser.type === "teacher" ? "UGmarks" : null,
                editingUser.type === "teacher" ? "PGmarks" : null,
              ]
                .filter(Boolean)
                .map((field) => (
                  <div key={field}>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      {field}
                    </label>
                    <input
                      value={editForm[field] ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="rounded border px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
