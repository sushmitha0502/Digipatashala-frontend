import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AddClass({ onClose }) {
  const { ID } = useParams();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    date: "",
    time: "",
    endTime: "",
    link: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");

        const res = await fetch(`/api/course/teacher/${ID}/enrolled`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load courses");
        }

        const availableCourses = data?.data || [];

        setCourses(availableCourses);

        if (availableCourses.length > 0) {
          setForm((current) => ({
            ...current,
            courseId: availableCourses.some(
              (course) => course._id === current.courseId
            )
              ? current.courseId
              : availableCourses[0]._id,
          }));
        } else {
          setForm((current) => ({
            ...current,
            courseId: "",
          }));
          setError(
            "No courses found for this teacher. Please create or join a course first."
          );
        }
      } catch (err) {
        console.log(err);
        setCourses([]);
        setForm((current) => ({
          ...current,
          courseId: "",
        }));
        setError("Unable to load your courses right now.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [ID]);

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleChange = (key) => (e) => {
    setError("");
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a class title");
      return;
    }

    if (!form.courseId) {
      setError("Please select a course");
      return;
    }

    if (!form.date) {
      setError("Please select a class date");
      return;
    }

    if (!form.time) {
      setError("Please select a start time");
      return;
    }

    if (!form.endTime) {
      setError("Please select an end time");
      return;
    }

    const startMinutes = convertToMinutes(form.time);
    const endMinutes = convertToMinutes(form.endTime);

    if (endMinutes <= startMinutes) {
      setError("End time must be after start time");
      return;
    }

    if (!form.link.trim()) {
      setError("Please enter a meeting link");
      return;
    }

    const payload = {
      title: form.title.trim(),
      date: form.date,
      timing: startMinutes,
      endTiming: endMinutes,
      link: form.link.trim(),
      status: "upcoming",
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `/api/course/${form.courseId}/teacher/${ID}/add-class`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "invalid access token") {
          throw new Error("Your session expired. Please log in again.");
        }

        throw new Error(data?.message || "Something went wrong");
      }

      onClose();
    } catch (err) {
      console.log(err);
      setError(err.message || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-[2rem] bg-white p-7 text-black shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1671D8]">
              Live Class
            </p>
            <h2 className="mt-2 text-3xl font-bold">Schedule Class</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add a live session and choose the full time window yourself.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Class Title
            </label>
            <input
              type="text"
              placeholder="Newton's Laws of Motion"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#1671D8]"
              value={form.title}
              onChange={handleChange("title")}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Course
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#1671D8] disabled:cursor-not-allowed disabled:bg-gray-100"
              value={form.courseId}
              onChange={handleChange("courseId")}
              required
              disabled={loadingCourses || courses.length === 0}
            >
              <option value="">
                {loadingCourses ? "Loading courses..." : "Choose a course"}
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.coursename}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Class Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#1671D8]"
                value={form.date}
                onChange={handleChange("date")}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#1671D8]"
                value={form.time}
                onChange={handleChange("time")}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                End Time
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#1671D8]"
                value={form.endTime}
                onChange={handleChange("endTime")}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Meeting Link
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#1671D8]"
              value={form.link}
              onChange={handleChange("link")}
              required
            />
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#1671D8] px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={loadingCourses || courses.length === 0 || submitting}
          >
            {submitting ? "Scheduling..." : "Add Class"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClass;
