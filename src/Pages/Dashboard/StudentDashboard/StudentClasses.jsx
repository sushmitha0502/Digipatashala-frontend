import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentClasses() {
  const { ID } = useParams();
  const [data, setData] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const [classesResponse, recordedResponse] = await Promise.all([
          fetch(`/api/course/classes/student/${ID}`, {
            credentials: "include",
          }),
          fetch(`/api/course/recorded-classes`, {
            credentials: "include",
          }),
        ]);

        const classesJson = await classesResponse.json();
        const recordedJson = await recordedResponse.json();

        if (!classesResponse.ok) {
          throw new Error(classesJson?.message || "Failed to load classes");
        }

        if (!recordedResponse.ok) {
          console.warn(recordedJson?.message || "Failed to load recorded classes");
        }

        const liveClasses =
          classesJson?.data?.liveClasses ||
          classesJson?.data?.classes?.[0]?.liveClasses ||
          [];
        setData(liveClasses);
        setRecordedClasses(recordedJson?.data?.recordedClasses || []);
      } catch (fetchError) {
        console.log(fetchError);
        setError(fetchError.message || "Failed to load classes");
        setData([]);
        setRecordedClasses([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [ID]);

  const parseClassDate = (dateValue) => {
    if (!dateValue) return null;

    if (typeof dateValue === "string") {
      return dateValue.includes("T")
        ? new Date(dateValue)
        : new Date(`${dateValue}T00:00:00`);
    }

    return new Date(dateValue);
  };

  const getClassDateTime = (classItem) => {
    if (!classItem?.date) return null;
    const classDate = parseClassDate(classItem.date);
    if (Number.isNaN(classDate.getTime())) return null;

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

  const canJoinClass = (classItem) => {
    const classStart = getClassDateTime(classItem);
    const classEnd = getClassEndDateTime(classItem);
    if (!classStart || !classEnd || !classItem.link) return false;

    const tenMinutesBefore = new Date(classStart.getTime() - 10 * 60 * 1000);
    return new Date() >= tenMinutesBefore && new Date() <= classEnd;
  };

  const now = new Date();
  const present = data.filter((classItem) => {
    const classDate = getClassDateTime(classItem);
    const classEnd = getClassEndDateTime(classItem);
    if (!classDate || !classEnd) return false;
    return now >= classDate && now < classEnd;
  });

  const upcoming = data.filter((classItem) => {
    const classDate = getClassDateTime(classItem);
    return classDate && classDate > now;
  });

  const past = data.filter((classItem) => {
    const classEnd = getClassEndDateTime(classItem);
    return classEnd && now >= classEnd;
  });

  const formatTime = (minutes) => {
    if (minutes === undefined || minutes === null) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:
${String(mins).padStart(2, "0")}`.replace("\n", "");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    const parsedDate = parseClassDate(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Date not available";
    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderClassCard = (classItem, tone) => {
    const toneStyles = {
      present: "border-emerald-300 bg-emerald-50 text-emerald-950",
      upcoming: "border-blue-300 bg-blue-50 text-blue-950",
      past: "border-slate-200 bg-slate-100 text-slate-700",
    };

    const showJoinLink = canJoinClass(classItem);

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
            <h3 className="mt-2 text-xl font-bold">{classItem.title || "Untitled class"}</h3>
            <p className="mt-2 text-sm">
              {formatDate(classItem.date)} at {formatTime(classItem.timing)} - {formatTime(
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

        {showJoinLink && (
          <a
            href={classItem.link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#0d47a1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#083e8a]"
          >
            Join class
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
        <div className="grid gap-4">{items.map((classItem) => renderClassCard(classItem, tone))}</div>
      )}
    </section>
  );

  const renderRecordedClasses = () => (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm shadow-lg shadow-slate-950/20">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recorded Classes</h2>
          <p className="mt-1 text-sm text-white/70">Watch approved recordings from your courses anytime.</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
          {recordedClasses.length} {recordedClasses.length === 1 ? "recording" : "recordings"}
        </span>
      </div>

      {recordedClasses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-5 text-white/70">
          No recorded classes available yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {recordedClasses.map((record) => (
            <div key={`${record.courseId}-${record.title}`} className="rounded-3xl border border-white/10 bg-slate-950/20 p-6 text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-1">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#82b1ff]">{record.coursename}</p>
                  <h3 className="mt-2 text-xl font-bold">{record.title}</h3>
                  <p className="mt-2 text-sm text-white/75">{record.description || "No description provided."}</p>
                </div>
                <a
                  href={record.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-to-r from-[#0d47a1] to-[#1e40af] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Watch
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="ml-60 min-h-screen bg-gradient-to-br from-[#0b3142] via-[#11495a] to-[#7fa8a8] px-10 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] bg-gradient-to-r from-[#0b6a6c] via-[#0a505f] to-[#082c3f] px-8 py-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                Student Classes
              </p>
              <h1 className="mt-3 text-4xl font-bold">Your class schedule</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/75">
                View all enrolled live classes with present, upcoming, and past sessions in one place.
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
            <p className="mt-2 text-4xl font-bold text-white">{data.length}</p>
          </div>
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
            {renderRecordedClasses()}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentClasses;
