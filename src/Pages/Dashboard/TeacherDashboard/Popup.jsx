import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Popup({ onClose, subject }) {
  const [desc, setDesc] = useState("");
  const { ID } = useParams();

  const weekdays = [
    { key: "mon", label: "Mon", index: 1 },
    { key: "tue", label: "Tue", index: 2 },
    { key: "wed", label: "Wed", index: 3 },
    { key: "thu", label: "Thu", index: 4 },
    { key: "fri", label: "Fri", index: 5 },
  ];

  const [selectedDays, setSelectedDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
  });

  const [timeValues, setTimeValues] = useState({
    mon: { start: "", end: "" },
    tue: { start: "", end: "" },
    wed: { start: "", end: "" },
    thu: { start: "", end: "" },
    fri: { start: "", end: "" },
  });

  const handleCheckboxChange = (dayName) => {
    setSelectedDays((prevDay) => ({
      ...prevDay,
      [dayName]: !prevDay[dayName],
    }));
  };

  const handleTimeChange = (dayName, field, value) => {
    setTimeValues((prev) => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        [field]: value,
      },
    }));
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const addCourse = async () => {
    const selectedSchedule = weekdays
      .filter((day) => selectedDays[day.key])
      .map((day) => ({
        day: day.index,
        starttime: timeValues[day.key].start
          ? convertTimeToMinutes(timeValues[day.key].start)
          : null,
        endtime: timeValues[day.key].end
          ? convertTimeToMinutes(timeValues[day.key].end)
          : null,
      }));

    if (selectedSchedule.length === 0) {
      alert("Please select at least one weekday.");
      return;
    }

    const hasMissingTime = selectedSchedule.some(
      (schedule) => schedule.starttime === null || schedule.endtime === null
    );

    if (hasMissingTime) {
      alert("Please enter both start time and end time for all selected days.");
      return;
    }

    const invalidTimeRange = selectedSchedule.some((schedule) => {
      if (schedule.starttime >= schedule.endtime) {
        alert("End time must be greater than start time.");
        return true;
      }
      return false;
    });

    if (invalidTimeRange) {
      return;
    }

    if (!desc.trim()) {
      alert("Fill the description.");
      return;
    }

    const data = {
      coursename: subject.toLowerCase(),
      description: desc.trim(),
      schedule: selectedSchedule,
    };

    const response = await fetch(`/api/course/${subject}/create/${ID}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData?.message === "invalid access token") {
        alert("Your teacher session expired. Please log in again.");
        return;
      }

      alert(responseData?.message || "Failed to create course");
      return;
    }

    alert(responseData?.message || "Course created successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="mt-1 h-fit w-[30rem] rounded-md bg-[#008280] py-4">
        <div
          className="absolute m-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white"
          onClick={onClose}
        >
          x
        </div>
        <div className="my-10 text-center text-3xl font-semibold text-white">
          <p>{subject}</p>
        </div>
        <div className="m-5 flex flex-col gap-4 text-xl text-white">
          <div>
            <label>Coursename: </label>
            <input
              type="text"
              className="w-52 rounded-md border-0 bg-[#32B0AE] p-2 outline-0"
              value={subject}
              readOnly
            />
          </div>

          <label>Timing: </label>
          {weekdays.map((day) => (
            <div
              key={day.key}
              className="flex items-center justify-center gap-3"
            >
              <input
                type="checkbox"
                checked={selectedDays[day.key]}
                onChange={() => handleCheckboxChange(day.key)}
              />
              <label className="w-12">{day.label}</label>
              <input
                className="w-[7rem] rounded-sm pl-2 text-black placeholder:text-gray"
                type="time"
                value={timeValues[day.key].start}
                onChange={(e) =>
                  handleTimeChange(day.key, "start", e.target.value)
                }
                disabled={!selectedDays[day.key]}
              />
              <input
                className="w-[7rem] rounded-sm pl-2 text-black placeholder:text-gray"
                type="time"
                value={timeValues[day.key].end}
                onChange={(e) =>
                  handleTimeChange(day.key, "end", e.target.value)
                }
                disabled={!selectedDays[day.key]}
              />
            </div>
          ))}

          <div>
            <label>Description: </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="ml-3 w-52 rounded-md border-0 bg-[#32B0AE] p-2 outline-0"
            />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center">
          <span
            onClick={addCourse}
            className="cursor-pointer rounded-md bg-[#335699] px-10 py-3 text-xl text-white"
          >
            Create Course
          </span>
        </div>
      </div>
    </div>
  );
}

export default Popup;
