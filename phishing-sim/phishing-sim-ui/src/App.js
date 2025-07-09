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
import PostCampaign from "./components/PostCampaign";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

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
            JSON.parse(localUser);
          } catch (e) {
            localStorage.removeItem("user");
          }
        }

        const response = await fetch(`${API_BASE}/api/auth/user`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.user) {
            // Update localStorage with current user data
            localStorage.setItem("user", JSON.stringify(data.user));
            setIsAuthenticated(true);
            return;
          }
        } else if (response.status === 401) {
          // Handle 401 Unauthorized gracefully
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          return;
        }

        // Authentication failed
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("Auth check network error:", error);
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    };

    // Only check authentication once on mount, and after a 401, clear user and redirect to login without retrying.
    checkAuth();
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
        <Route path="/post-campaign" element={<PostCampaign />} />
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
