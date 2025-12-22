import React, { useState, useEffect } from "react";

export default function OtpAuth() {
  const [otpList, setOtpList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    async function fetchOTPs() {
      try {
        const res = await fetch(`${API}/devapiService/getOtpList`);
        const data = await res.json();
        setOtpList(data);
      } catch (err) {
        console.error("Error fetching OTPs", err);
      }
    }

    fetchOTPs();
    const interval = setInterval(fetchOTPs, 10000);
    return () => clearInterval(interval);
  }, [API]);

  const filteredOTPList = otpList.filter((otp) =>
    String(otp.phone_number).includes(searchTerm)
  );

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#00713E" }}>
        OTP List
      </h2>

      <input
        type="text"
        placeholder="Search by phone number..."
        className="mb-4 px-4 py-2 border-2 rounded-lg outline-none w-full max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Phone Number</th>
              <th className="px-4 py-2 border">OTP</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredOTPList.map((otp, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{otp.phone_number}</td>
                <td className="px-4 py-2 border">{otp.otp}</td>
                <td className="px-4 py-2 border">
                  {new Date(otp.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredOTPList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No OTPs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
