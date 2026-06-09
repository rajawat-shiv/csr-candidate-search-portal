import { useState } from "react";
import SearchCandidate from "../components/SearchCandidate";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";

function SearchPage() {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/admin" />;
    }
    const [todaySearches, setTodaySearches] =
        useState(0);

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-6">


                <Toaster position="top-right" />


                <div className="relative bg-white rounded-3xl shadow-lg p-6 mb-6">

                    <a
                        href="/admin"
                        className="absolute top-6 right-6 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition"
                    >
                        🔐 Admin Login
                    </a>

                    <h1 className="text-4xl font-bold text-center text-slate-800">
                        CSR Candidate Search Portal
                    </h1>

                    <p className="text-center text-slate-500 mt-2">
                        Search Candidate by Contact Number, HO ID, Attendance ID
                    </p>

                </div>

                <SearchCandidate
                    setTodaySearches={setTodaySearches}
                />

            </div>

        </div>
    );
}

export default SearchPage;