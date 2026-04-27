import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddClass from "./AddClass";

function TeacherClasses() {
  const { ID } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [recordForm, setRecordForm] = useState({ title: "", description: "", link: "" });
  const [recordError, setRecordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);

        const [teacherRes, classesRes, coursesRes] = await Promise.all([
          fetch(`/api/teacher/teacherdocument/${ID}`, {
            credentials: "include",
          }),
          fetch(`/api/course/classes/teacher/${ID}`, {
            credentials: "include",
          }),
          fetch(`/api/course/teacher/${ID}/courses`, {
            credentials: "include",
          }),
        ]);

        const teacherData = await teacherRes.json();
        const classesData = await classesRes.json();
        const coursesData = await coursesRes.json();

        if (!teacherRes.ok) {
          throw new Error(teacherData?.message || "Failed to load teacher details");
        }

        if (!classesRes.ok) {
          throw new Error(classesData?.message || "Failed to load classes");
        }

        if (!coursesRes.ok) {
          throw new Error(coursesData?.message || "Failed to load course list");
        }

        setTeacher(teacherData?.data || null);
        setClasses(classesData?.data?.classes?.[0]?.liveClasses || []);
        setTeacherCourses(coursesData?.data?.teacherCourses || []);
        setRecordedClasses(
          (coursesData?.data?.teacherCourses || []).flatMap((courseItem) =>
            (courseItem.recordedClasses || []).map((item) => ({
              courseId: courseItem._id,
              coursename: courseItem.coursename,
              title: item.title,
              description: item.description,
              link: item.link,
              uploadedAt: item.uploadedAt,
              approvedByAdmin: item.approvedByAdmin,
            }))
          )
        );

        setError("");
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to load class schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [ID, showPopup]);

  useEffect(() => {
    if (teacherCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(teacherCourses[0]._id);
      setCourseTitle(teacherCourses[0].coursename);
    }
  }, [teacherCourses, selectedCourseId]);

  const formatTime = (minutes) => {
    if (minutes === undefined || minutes === null) return "";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRecordedUpload = async () => {
    setRecordError("");

    if (!selectedCourseId || !courseTitle.trim()) {
      setRecordError("Course is not available.");
      return;
    }

    if (!recordForm.title.trim() || !recordForm.link.trim()) {
      setRecordError("Title and Google Drive link are required.");
      return;
    }

    try {
      const response = await fetch(
        `/api/course/teacher/${ID}/add-recorded-class`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...recordForm,
            courseTitle: courseTitle.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to upload recorded class");
      }

      setRecordForm({ title: "", description: "", link: "" });
      setCourseTitle("");
      const updatedCourse = result?.data?.course;
      if (updatedCourse?.recordedClasses) {
        const updatedRecorded = updatedCourse.recordedClasses.map((item) => ({
          courseId: updatedCourse._id,
          coursename: updatedCourse.coursename,
          title: item.title,
          description: item.description,
          link: item.link,
          uploadedAt: item.uploadedAt,
          approvedByAdmin: item.approvedByAdmin,
        }));
        setRecordedClasses((prev) => [
          ...prev.filter((item) => item.courseId !== updatedCourse._id),
          ...updatedRecorded,
        ]);
      }
      setError("");
      setRecordError("");
    } catch (err) {
      setRecordError(err.message || "Failed to upload recorded class");
      console.log(err);
    }
  };

  const getClassDateTime = (classItem) => {
    if (!classItem?.date) return null;

    const classDate = new Date(classItem.date);

    if (Number.isNaN(classDate.getTime())) {
      return null;
    }

    if (typeof classItem.timing === "number") {
      classDate.setHours(
        Math.floor(classItem.timing / 60),
        classItem.timing % 60,
        0,
        0
      );
    }

    return classDate;
  };

  const getClassEndDateTime = (classItem) => {
    const classDate = getClassDateTime(classItem);

    if (!classDate) return null;

    const endDate = new Date(classDate);
    const endTiming =
      typeof classItem.endTiming === "number"
        ? classItem.endTiming
        : classItem.timing + 60;

    endDate.setHours(
      Math.floor(endTiming / 60),
      endTiming % 60,
      0,
      0
    );

    return endDate;
  };

  const now = new Date();

  const present = classes.filter((classItem) => {
    const classDate = getClassDateTime(classItem);
    const classEnd = getClassEndDateTime(classItem);

    if (!classDate || !classEnd) return false;

    return now >= classDate && now < classEnd;
  });

  const upcoming = classes.filter((classItem) => {
    const classDate = getClassDateTime(classItem);
    return classDate && classDate > now;
  });

  const past = classes.filter((classItem) => {
    const classEnd = getClassEndDateTime(classItem);
    if (!classEnd) return false;
    return now >= classEnd;
  });

  const renderClassCard = (classItem, tone) => {
    const toneStyles = {
      present: "border-emerald-300 bg-emerald-50 text-emerald-950",
      upcoming: "border-sky-200 bg-white text-slate-900",
      past: "border-slate-200 bg-slate-100 text-slate-700",
    };

    return (
      <div
        key={`${classItem.coursename}-${classItem.title}-${classItem.date}-${classItem.timing}`}
        className={`rounded-2xl border p-5 shadow-sm ${toneStyles[tone]}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1671D8]">
              {classItem.coursename}
            </p>
            <h3 className="mt-2 text-xl font-bold">{classItem.title}</h3>
            <p className="mt-2 text-sm">
              {formatDate(classItem.date)} at {formatTime(classItem.timing)} -{" "}
              {formatTime(
                typeof classItem.endTiming === "number"
                  ? classItem.endTiming
                  : classItem.timing + 60
              )}
            </p>
          </div>

          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {tone}
          </span>
        </div>

        {classItem.link && (
          <a
            href={classItem.link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#1671D8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Open Meeting Link
          </a>
        )}
      </div>
    );
  };

  const renderSection = (title, items, tone, emptyText) => (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
          {items.length} {items.length === 1 ? "class" : "classes"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-5 text-white/70">
          {emptyText}
        </p>
      ) : (
        <div className="grid gap-4">
          {items.map((classItem) => renderClassCard(classItem, tone))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-[#0b3142] via-[#11495a] to-[#7fa8a8] px-4 py-8 text-white md:px-8 md:py-10">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #020617 inset !important;
          box-shadow: 0 0 0 1000px #020617 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
        }
      `}</style>
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] bg-gradient-to-r from-[#0b6a6c] via-[#0a505f] to-[#082c3f] px-8 py-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                Teacher Classes
              </p>
              <h1 className="mt-3 text-4xl font-bold">
                Welcome back, {teacher?.Firstname || "Teacher"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/75">
                Schedule new live classes and keep track of present, upcoming,
                and past sessions from one place.
              </p>
            </div>

            <button
              onClick={() => setShowPopup(true)}
              className="rounded-full bg-[#43a047] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#35853a]"
            >
              + Schedule Class
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Teacher Name
              </p>
              <p className="mt-2 text-lg font-semibold">
                {teacher ? `${teacher.Firstname} ${teacher.Lastname}` : "Loading..."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Email
              </p>
              <p className="mt-2 text-lg font-semibold break-all">
                {teacher?.Email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Subject
              </p>
              <p className="mt-2 text-lg font-semibold capitalize">
                {teacher?.Subject || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Approval Status
              </p>
              <p className="mt-2 text-lg font-semibold capitalize">
                {teacher?.Isapproved || "Pending"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">Present Classes</p>
            <p className="mt-2 text-4xl font-bold text-white">{present.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">Upcoming Classes</p>
            <p className="mt-2 text-4xl font-bold text-white">{upcoming.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">Past Classes</p>
            <p className="mt-2 text-4xl font-bold text-white">{past.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">Total Scheduled</p>
            <p className="mt-2 text-4xl font-bold text-white">{classes.length}</p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dashed border-white/20 bg-black/15 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Schedule Class</h2>
              <p className="mt-2 text-sm text-white/70">
                Create a new live class and it will appear automatically in the
                correct section below.
              </p>
            </div>

            <button
              onClick={() => setShowPopup(true)}
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Open Schedule Form
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dashed border-white/20 bg-black/15 p-6 backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white">Recorded Classes</h2>
              <p className="mt-2 text-sm text-white/70">
                Upload a Google Drive recording and track its admin approval status.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm text-white/80">Course</label>
                <input
                  type="text"
                  value={courseTitle || "Course not available"}
                  disabled
                  className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-3 text-white placeholder:text-slate-400 focus:border-[#43a047] focus:outline-none focus:ring-2 focus:ring-[#43a047]/25 disabled:cursor-not-allowed disabled:opacity-100"
                  style={{
                    backgroundColor: "#020617",
                    color: "#ffffff"
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Title</label>
                <input
                  value={recordForm.title}
                  onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                  className="w-full rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/25"
                  placeholder="Recorded lesson title"
                  style={{
                    backgroundColor: "#020617",
                    color: "#ffffff",
                    caretColor: "#ffffff"
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Drive Link</label>
                <input
                  value={recordForm.link}
                  onChange={(e) => setRecordForm({ ...recordForm, link: e.target.value })}
                  className="w-full rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/25"
                  placeholder="Google Drive shareable link"
                  style={{
                    backgroundColor: "#020617",
                    color: "#ffffff",
                    caretColor: "#ffffff"
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Description</label>
                <textarea
                  value={recordForm.description}
                  onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                  className="w-full rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/25"
                  rows={3}
                  placeholder="Optional summary of the recording"
                  style={{
                    backgroundColor: "#020617",
                    color: "#ffffff",
                    caretColor: "#ffffff"
                  }}
                />
              </div>

              {recordError && (
                <p className="text-sm text-red-300">{recordError}</p>
              )}

              <button
                onClick={handleRecordedUpload}
                disabled={teacherCourses.length === 0}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition ${teacherCourses.length === 0 ? "bg-slate-600 cursor-not-allowed" : "bg-[#43a047] hover:bg-[#35853a]"}`}
              >
                Upload Recording
              </button>
            </div>
          </div>

          {recordedClasses.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Your Uploaded Recordings</h3>
              <div className="grid gap-4">
                {recordedClasses.map((item) => (
                  <div key={`${item.courseId}-${item.title}`} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-white">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#82b1ff]">{item.coursename}</p>
                        <h4 className="mt-2 text-lg font-bold">{item.title}</h4>
                        <p className="mt-1 text-sm text-white/70">{item.description || "No description provided."}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.approvedByAdmin ? "bg-emerald-500 text-black" : "bg-yellow-400 text-slate-950"}`}>
                        {item.approvedByAdmin ? "Approved" : "Pending approval"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#1671D8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Recording
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-300/40 bg-red-500/10 px-5 py-4 text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/15 p-6 text-white/70 backdrop-blur-sm">
            Loading classes...
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {renderSection(
              "Present Classes",
              present,
              "present",
              "No class is live right now."
            )}
            {renderSection(
              "Upcoming Classes",
              upcoming,
              "upcoming",
              "No upcoming classes scheduled yet."
            )}
            {renderSection(
              "Past Classes",
              past,
              "past",
              "No past classes available."
            )}
          </div>
        )}

        {showPopup && <AddClass onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
}

export default TeacherClasses;
