import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import AdminDashboard from "./AdminDashboard";

function AdminLogin() {

    const token = localStorage.getItem("token");

    if (token) {
        return <AdminDashboard />;
    }
    const [email, setEmail] = useState("");
    const [password, setPassword] =
        useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "https://csr-candidate-backend.onrender.com/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem(
                "lastLogin",
                new Date().toLocaleString("en-IN")
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            toast.success("Login Successful");

            window.location.reload();
        } catch (error) {
            toast.error("Invalid Credentials");
        }
    };

    return (

        <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-4 overflow-hidden">

            {/* Background Glow Effects */}

            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl" />

            {/* Login Card */}

            <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white">

                {/* Logo / Icon */}

                <div className="text-center mb-8">

                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">

                        <FaUserShield
                            size={34}
                            className="text-white"
                        />

                    </div>

                    <h1 className="text-4xl font-bold text-slate-800">
                        Admin Login
                    </h1>

                    <p className="text-slate-500 mt-2">
                        CSR Candidate Search Portal
                    </p>

                </div>

                {/* Form */}

                <div className="space-y-5">

                    <div className="relative">

                        <FaEnvelope
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
    w-full
    pl-12
    pr-5
    py-4
    rounded-2xl
    border
    border-slate-200
    bg-white/70
    focus:outline-none
    focus:ring-4
    focus:ring-blue-200
    focus:border-blue-500
    transition-all
  "
                        />

                    </div>
                    <div className="relative">

                        <FaLock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
    w-full
    pl-12
    pr-5
    py-4
    rounded-2xl
    border
    border-slate-200
    bg-white/70
    focus:outline-none
    focus:ring-4
    focus:ring-blue-200
    focus:border-blue-500
    transition-all
  "
                        />

                    </div>

                    <button
                        onClick={handleLogin}
                        className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                font-semibold
                text-lg
                shadow-lg
                hover:shadow-xl
                hover:scale-[1.02]
                active:scale-[0.99]
                transition-all
              "
                    >
                        Login
                    </button>

                </div>

                {/* Footer */}

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        Authorized Users Only
                    </p>
                </div>

            </div>

        </div>
    );
}

export default AdminLogin;