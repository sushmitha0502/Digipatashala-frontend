import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DashboardTeacher() {
  const { ID } = useParams();
  const [data, setData] = useState(null);
  const [editPopup, setEditPopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editForm, setEditForm] = useState({
    Firstname: "",
    Lastname: "",
    Phone: "",
    Address: "",
    Experience: "",
  });

  const fetchTeacher = async () => {
    const response = await fetch(`/api/teacher/teacherdocument/${ID}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const user = await response.json();

    if (!response.ok) {
      throw new Error(user?.message || "Failed to fetch teacher data");
    }

    setData(user.data);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setErrorMsg("");
        await fetchTeacher();
      } catch (error) {
        console.log(error);
        setErrorMsg(error.message || "Failed to load teacher dashboard");
      }
    };

    loadDashboard();
  }, [ID]);

  const openEdit = () => {
    setEditForm({
      Firstname: data?.Firstname || "",
      Lastname: data?.Lastname || "",
      Phone: data?.Teacherdetails?.Phone || "",
      Address: data?.Teacherdetails?.Address || "",
      Experience: data?.Teacherdetails?.Experience || "",
    });
    setErrorMsg("");
    setEditPopup(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/teacher/update/${ID}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Update failed");
      }

      setData(result.data);
      setSuccessMsg("Profile updated successfully!");
      setEditPopup(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-50 p-6 md:p-8">
      {successMsg && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
              alt="profile"
              className="h-16 w-16 rounded-full border-2 border-[#4E84C1]"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {data?.Firstname} {data?.Lastname}
              </h2>
              <p className="text-sm text-gray-500">{data?.Email}</p>
            </div>
          </div>

          <button
            onClick={openEdit}
            className="rounded-lg bg-[#1671D8] px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        <hr className="mb-5" />

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Phone", value: data?.Teacherdetails?.Phone },
            { label: "Address", value: data?.Teacherdetails?.Address },
            {
              label: "Experience",
              value: data?.Teacherdetails?.Experience
                ? `${data.Teacherdetails.Experience} years`
                : null,
            },
            { label: "Email", value: data?.Email },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <p className="mb-1 text-xs text-gray-400">{label}</p>
              <p className="text-sm font-medium text-gray-700">{value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Teacher Overview
        </h3>
        <p className="text-sm text-gray-600">
          Use the dashboard tabs to manage your scheduled classes, create or
          review quizzes, and keep your teacher profile updated. Course browsing
          has been moved to the student dashboard so students can explore
          teachers and class availability there.
        </p>
      </div>

      {editPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-[480px] overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
              <button
                onClick={() => setEditPopup(false)}
                className="text-xl font-bold text-gray-400 hover:text-gray-600"
              >
                x
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              {[
                { label: "First Name", key: "Firstname", type: "text" },
                { label: "Last Name", key: "Lastname", type: "text" },
                { label: "Phone", key: "Phone", type: "tel" },
                { label: "Address", key: "Address", type: "text" },
                { label: "Experience (years)", key: "Experience", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [key]: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 outline-none transition focus:border-[#1671D8]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setEditPopup(false)}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#1671D8] px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardTeacher;
