import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";

import UploadExcel from "../components/UploadExcel";
import SearchCandidate from "../components/SearchCandidate";

function AdminDashboard() {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/admin" />;
    }

    const [stats, setStats] = useState({
        total: 0,
        mx: 0,
        ce: 0,
    });

    const [todaySearches, setTodaySearches] =
        useState(0);

    const [lastUpload, setLastUpload] =
        useState(
            localStorage.getItem("lastUpload") || "-"
        );
    const [lastLogin] = useState(
        localStorage.getItem("lastLogin") || "-"
    );

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(
                "https://csr-candidate-backend.onrender.com/api/candidates/stats"
            );

            setStats(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/admin";
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-6">

                <Toaster position="top-right" />

                {/* Header */}

                <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-6">

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-800">
                        CSR Candidate Admin Dashboard
                    </h1>

                    <p className="text-center text-sm sm:text-base text-slate-500 mt-2">
                        MX & CE Candidate Management System
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3">

                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                            👋 Welcome Admin
                        </span>

                        <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full">
                            🕒 Last Login: {lastLogin}
                        </span>

                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                        >
                            Logout
                        </button>

                    </div>

                </div>

                {/* Upload */}

                <UploadExcel
                    setLastUpload={setLastUpload}
                    fetchStats={fetchStats}
                />

                {/* Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                    <div className="bg-white rounded-3xl shadow-lg p-5 border-l-4 border-blue-500">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Total Candidates
                                </p>

                                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                                    {stats.total || 0}
                                </h2>
                            </div>

                            <div className="text-5xl">
                                👥
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-5 border-l-4 border-sky-500">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    MX Candidates
                                </p>

                                <h2 className="text-3xl font-bold text-sky-600 mt-2">
                                    {stats.mx || 0}
                                </h2>
                            </div>

                            <div className="text-5xl">
                                🔵
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-5 border-l-4 border-orange-500">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    CE Candidates
                                </p>

                                <h2 className="text-3xl font-bold text-orange-600 mt-2">
                                    {stats.ce || 0}
                                </h2>
                            </div>

                            <div className="text-5xl">
                                🟠
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-5 border-l-4 border-green-500">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Today's Searches
                                </p>

                                <h2 className="text-3xl font-bold text-green-600 mt-2">
                                    {todaySearches}
                                </h2>
                            </div>

                            <div className="text-5xl">
                                🔍
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-5 border-l-4 border-purple-500">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Last Upload
                                </p>

                                <h2 className="text-sm font-bold text-purple-600 mt-2">
                                    {lastUpload}
                                </h2>
                            </div>

                            <div className="text-5xl">
                                📤
                            </div>

                        </div>

                    </div>

                </div>

                {/* Search */}

                <SearchCandidate
                    setTodaySearches={setTodaySearches}
                />

            </div>


        </div>
    );
}

export default AdminDashboard;