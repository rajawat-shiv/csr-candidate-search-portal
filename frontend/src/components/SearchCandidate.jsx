import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaPhone,
  FaIdCard,
  FaClipboard,
  FaCalendarAlt,
} from "react-icons/fa";


function SearchCandidate({
  setTodaySearches,
}) {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const searchRef = useRef(null);
  const suggestionRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const today =
      new Date().toLocaleDateString("en-IN");

    const savedDate =
      localStorage.getItem("searchDate");

    if (savedDate !== today) {
      localStorage.setItem(
        "searchDate",
        today
      );

      localStorage.setItem(
        "todaySearches",
        "0"
      );
    }

    const count =
      Number(
        localStorage.getItem(
          "todaySearches"
        )
      ) || 0;

    setSearchCount(count);
  }, []);

  useEffect(() => {
    setTodaySearches(searchCount);
  }, [searchCount]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResult([]);
      return;
    }
    fetchCandidate();
  }, [debouncedSearch]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Load search history
  useEffect(() => {
    const savedHistory =
      JSON.parse(
        localStorage.getItem("searchHistory")
      ) || [];

    setHistory(savedHistory);
  }, []);

  // Clear result when input empty
  useEffect(() => {
    if (!search.trim()) {
      setResult([]);
      setSuggestions([]);
    }
  }, [search]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();

        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(
          event.target
        )
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);

    toast.success("Copied Successfully");
  };

  const fetchCandidate = async () => {
    try {
      const res = await axios.get(
        `https://csr-candidate-backend.onrender.com/api/candidates/search?q=${debouncedSearch}`
      );

      if (res.data.data && res.data.data.length > 0) {
        setResult(res.data.data);
        setSuggestions(res.data.data.slice(0, 5));
      } else {
        setResult([]);
      }

      setSearchCount((prev) => {
        const updated = prev + 1;

        localStorage.setItem(
          "todaySearches",
          updated
        );

        return updated;
      });

      if (debouncedSearch.length > 3) {
        setHistory((prev) => {
          const updated = [
            debouncedSearch,
            ...prev.filter(
              (item) => item !== debouncedSearch
            ),
          ].slice(0, 5);

          localStorage.setItem(
            "searchHistory",
            JSON.stringify(updated)
          );

          return updated;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white shadow-xl rounded-3xl p-6">

      <h2 className="text-3xl font-bold mb-6">
        Search Candidate
      </h2>

      {/* Search */}

      <div className="relative mb-6">

        <FaSearch className="absolute top-5 left-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search by Contact, Name, HO ID, Attendance ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={searchRef}
          className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-24 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
        />

        {suggestions.length > 0 &&
          search.trim() && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

              {suggestions.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => {
                    setResult([candidate]);
                    setSuggestions([]);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">

                    <div>
                      <div className="font-semibold text-slate-800">
                        👤 {candidate.candidate_name}
                      </div>

                      <div className="text-sm text-slate-500">
                        📱 {candidate.contact_number}
                      </div>

                      <div className="text-xs text-blue-600">
                        🆔 {candidate.attendance_app_id}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${candidate.vertical_type === "CE"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-500 text-white"
                          }`}
                      >
                        {candidate.vertical_type}
                      </span>

                      <span className="text-red-600 font-bold">
                        {
                          candidate.ho_id === "-" ||
                            candidate.ho_id === "NA"
                            ? "Not Available"
                            : candidate.ho_id
                        }
                      </span>

                    </div>

                  </div>
                </button>
              ))}
            </div>
          )}

        <div className="absolute right-4 top-4 text-xs text-slate-400 border px-2 py-1 rounded-md">
          Ctrl + K
        </div>

      </div>

      {/* Search History */}

      {history.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Recent Searches
          </h3>

          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => setSearch(item)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:bg-slate-200 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}

      {result.map((candidate) => {

        const isExited =
          candidate.lwd &&
          candidate.lwd !== "NA" &&
          candidate.lwd !== "-";

        return (
          <div
            key={candidate.id}
            className="border rounded-3xl shadow-lg p-6 mb-5 animate-[fadeIn_.3s_ease-in-out]"
          >
            {/* Header */}

            <div className="flex justify-between items-start mb-6">

              <div>

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-3xl font-black text-slate-800">
                    {candidate.candidate_name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${candidate.vertical_type === "CE"
                      ? "bg-orange-500 text-white"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    {candidate.vertical_type}
                  </span>

                </div>

                <p className="text-gray-500">
                  Attendance ID: {candidate.attendance_app_id}
                </p>

                <p className="text-red-600 font-bold">
                  HO ID: {
                    candidate.ho_id === "-" ||
                      candidate.ho_id === "NA"
                      ? "Not Available"
                      : candidate.ho_id
                  }
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() => {
                    const text = `
Name: ${candidate.candidate_name}
Contact: ${candidate.contact_number}
Attendance ID: ${candidate.attendance_app_id}
HO ID: ${candidate.ho_id}
OJT Start: ${candidate.ojt_start_date}
OJT End: ${candidate.ojt_end_date}
LWD: ${candidate.lwd}
`;

                    navigator.clipboard.writeText(text);

                    toast.success("Candidate Details Copied");
                  }}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl font-medium"
                >
                  📋 Copy All
                </button>

                <span
                  className={`px-5 py-2 rounded-full text-white font-bold ${isExited
                    ? "bg-red-500"
                    : "bg-green-500"
                    }`}
                >
                  {isExited ? "Exited" : "Active"}
                </span>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">

              <button
                onClick={() => copyText(candidate.contact_number)}
                className="bg-blue-50 hover:bg-blue-100 rounded-2xl p-4"
              >
                <p className="text-gray-500 text-sm">Contact</p>
                <h3 className="font-bold text-xl">
                  {candidate.contact_number}
                </h3>
              </button>

              <button
                onClick={() => copyText(candidate.attendance_app_id)}
                className="bg-purple-50 hover:bg-purple-100 rounded-2xl p-4"
              >
                <p className="text-gray-500 text-sm">Attendance</p>
                <h3 className="font-bold text-xl">
                  {candidate.attendance_app_id}
                </h3>
              </button>

              <button
                onClick={() => copyText(candidate.ho_id)}
                className="bg-green-50 hover:bg-green-100 rounded-2xl p-4"
              >
                <p className="text-gray-500 text-sm">HO ID</p>
                <h3 className="font-bold text-xl">
                  {
                    candidate.ho_id === "-" ||
                      candidate.ho_id === "NA"
                      ? "Not Available"
                      : candidate.ho_id
                  }
                </h3>
              </button>

            </div>
            {/* Candidate Details */}

            <div className="grid md:grid-cols-2 gap-7 mt-5 ">

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
                <p className="font-semibold">
                  <FaCalendarAlt className="inline mr-2" />
                  OJT Start Date
                </p>

                <p>{candidate.ojt_start_date}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
                <p className="font-semibold">
                  📅 OJT End Date
                </p>

                <p>{candidate.ojt_end_date}</p>
              </div>
            </div>

            {/* LWD Hero Section */}

            <div
              className={`rounded-2xl p-6 text-center mt-6 ${isExited
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
                }`}
            >
              <p className="uppercase tracking-widest text-sm ">
                {isExited
                  ? "Last Working Day"
                  : "Active Candidate"}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {isExited
                  ? candidate.lwd
                  : "Currently Active"}
              </h2>
            </div>
          </div>
        );
      })}

      {search && result.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            🔍
          </div>

          <h2 className="text-2xl font-bold text-red-500">
            Candidate Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            Search using Contact Number,
            HO ID or Attendance ID
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchCandidate;