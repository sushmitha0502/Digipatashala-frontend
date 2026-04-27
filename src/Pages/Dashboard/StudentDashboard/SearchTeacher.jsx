import React, { useEffect, useState } from "react";

function SearchTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Fetch teachers
  useEffect(() => {
    fetch("/api/teacher/all")
      .then((res) => res.json())
      .then((res) => {
        setTeachers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Search function
  const handleSearch = () => {
    const result = teachers.filter((t) =>
      t.Firstname.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <div className="ml-60 p-10">

      {/* SEARCH BAR */}
      <div className="flex items-center bg-white rounded shadow w-[500px]">
        <input
          type="text"
          placeholder="Ex: Math ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-r"
        >
          Find Teacher
        </button>
      </div>

      {/* TEACHERS RESULT */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        {filtered.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">
              {t.Firstname} {t.Lastname}
            </h3>
            <p>{t.Email}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SearchTeacher;