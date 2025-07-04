import React, { useState } from "react";

const AuthTest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: "admin", password: "admin" }),
      });

      const data = await response.json();
      setResult(
        `Admin Login - Status: ${response.status}, Data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setResult(`Admin Login Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testUserLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: "user", password: "Hizan@007" }),
      });

      const data = await response.json();
      setResult(
        `User Login - Status: ${response.status}, Data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setResult(`User Login Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testInvalidLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: "invalid", password: "wrong" }),
      });

      const data = await response.json();
      setResult(
        `Invalid Login - Status: ${response.status}, Data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setResult(`Invalid Login Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      setResult(
        `Logout - Status: ${response.status}, Data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setResult(`Logout Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <h2>Authentication Test</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testAdminLogin}
          disabled={loading}
          style={{ margin: "5px", padding: "10px" }}
        >
          Test Admin Login
        </button>
        <button
          onClick={testUserLogin}
          disabled={loading}
          style={{ margin: "5px", padding: "10px" }}
        >
          Test User Login
        </button>
        <button
          onClick={testInvalidLogin}
          disabled={loading}
          style={{ margin: "5px", padding: "10px" }}
        >
          Test Invalid Login
        </button>
        <button
          onClick={testLogout}
          disabled={loading}
          style={{ margin: "5px", padding: "10px" }}
        >
          Test Logout
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: "#fff",
          border: "1px solid #ccc",
        }}
      >
        <strong>Result:</strong>
        <pre>{loading ? "Loading..." : result}</pre>
      </div>
    </div>
  );
};

export default AuthTest;
