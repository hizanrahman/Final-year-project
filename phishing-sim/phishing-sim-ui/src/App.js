import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout"; // Contains the sidebar
import Dashboard from "./components/Dashboard";
import EmailTemplates from "./components/EmailTemplates";
import SendEmail from "./components/SendEmail";
import Login from "./components/Login";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for immediate feedback
        const localUser = localStorage.getItem("user");
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            console.log("Found user in localStorage:", userData);
          } catch (e) {
            localStorage.removeItem("user");
          }
        }

        console.log("Checking authentication with server...");
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });

        console.log("Auth check response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Auth check response data:", data);

          if (data.user) {
            // Update localStorage with current user data
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("Authentication successful, user:", data.user);
            setIsAuthenticated(true);
            return;
          }
        }

        // Authentication failed
        console.log("Authentication failed, redirecting to login");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("Auth check network error:", error);
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    };

    // Add a small delay to allow any pending requests to complete
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
          color: "#00f5ff",
          fontSize: "18px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login page, without sidebar */}
        <Route path="/" element={<Login />} />

        {/* Protected routes that use sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/send-email" element={<SendEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
