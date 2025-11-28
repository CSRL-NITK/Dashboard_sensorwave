import React, { useState } from "react";
import logo from '../assets/CSRL_logo.svg';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForceResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit clicked")
        if (password !== confirmPassword) {
            setError("Passwords do not match");
        } else if (password.length < 6) {
            setError("Password must be at least 6 characters");
        } else {
            setError("");
            console.log("Password reset successful");
            // Add actual submit logic here
            try {
                const res = await axios({
                    url: "http://localhost:8000/api/auth0/reset-password",
                    method: "PATCH",
                    data: {
                        newPassword: confirmPassword,
                        need: sessionStorage.getItem("needsReset") === 'true'
                    },
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json",
                    }
                })
                console.log(res.data);
                if (res.status === 200) {
                    nav("/");
                    window.location.reload();
                }
            } catch (error) {
                console.error(error.response || error.message);
            }
        }
    };

    return (
        <div className="min-h-screen w-full gap-2 flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="flex justify-center items-center gap-4 mb-2">
                <img src={logo} className="w-20 h-20 " alt="" />
                <h1 className="font-bold text-5xl bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                    SensorWave
                </h1>
            </div>
            <div className="text-3xl bg-gradient-to-r from-red-500 to-orange-700 text-transparent bg-clip-text">Smart Authentication</div>
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Reset Your Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full px-4 py-2 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 cursor-pointer text-xl select-none"
                                title="Toggle visibility"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <button
                        // type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition duration-200"
                        onClick={handleSubmit}
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
