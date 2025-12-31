import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async () => {
    setError("");
    setMsg("");

    const usernameTrim = username.trim();
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    if (!usernameTrim || !emailTrim || !passwordTrim) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: usernameTrim,
          email: emailTrim,
          password: passwordTrim,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Signup successful! Wait for role assignment.");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8 relative text-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-[#00713E] flex items-center justify-center gap-2">
          Sign Up
        </h1>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {msg && <p className="text-green-600 text-sm text-center mb-3">{msg}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#00713E] text-sm sm:text-base"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#00713E] text-sm sm:text-base"
        />

        <div className="relative mb-4">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-[#00713E] text-sm sm:text-base"
          />
          <span
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
          >
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-[#00713E] hover:bg-[#00713E]/90 text-white py-2 rounded-lg font-semibold mb-3 text-sm sm:text-base"
        >
          Sign Up
        </button>

        {/* <p className="text-center mt-4 text-sm sm:text-base text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-[#00713E] hover:underline font-semibold">
            Login
          </Link>
        </p> */}
      </div>
    </div>
  );
}
