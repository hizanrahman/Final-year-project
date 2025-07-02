import React, { useState } from "react";

const SendEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const response = await fetch("/send-phishing-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientEmail: email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("✅ Email sent successfully!");
    } else {
      setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
    }
  } catch (error) {
    setMessage(`❌ Network Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Phishing Email</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
    </div>
  );
};

export default SendEmail;
