import React, { useState, useEffect } from "react";

let API_BASE = process.env.REACT_APP_API_BASE_URL;
if (!API_BASE || window.location.hostname === "localhost") {
  API_BASE = "http://localhost:5000";
}
// Ensure API_BASE does not have trailing slash and always use absolute URL
if (API_BASE.endsWith("/")) {
  API_BASE = API_BASE.slice(0, -1);
}

// Helper to build API URLs
const buildApiUrl = (endpoint) => {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }
  return `${API_BASE}/${endpoint}`;
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Check if user is already authenticated
  useEffect(() => {
    const checkCurrentAuth = async () => {
      try {
        const response = await fetch(buildApiUrl("api/auth/user"), {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            window.location.href = "/dashboard";
          }
        }
      } catch (error) {
        // Ignore errors - user will stay on login page
        console.log("No active session found");
      }
    };
    checkCurrentAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(buildApiUrl("api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Login failed:", errorData);
        setError("Invalid username or password");
        return;
      }

      const data = await response.json();
      console.log("Login success:", data);

      if (data.success && data.user) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Add a small delay to ensure session is established
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login network error:", error);
      setError("Unable to connect to server. Please try again.");
    }
  };

  const styles = {
    body: {
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      margin: 0,
      padding: 0,
    },
    loginContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background:
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      position: "relative",
      overflow: "hidden",
    },
    backgroundShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
    },
    shape1: {
      position: "absolute",
      top: "10%",
      left: "15%",
      width: "200px",
      height: "200px",
      background: "linear-gradient(45deg, #00f5ff, #0080ff)",
      borderRadius: "50%",
      opacity: 0.1,
      animation: "float 6s ease-in-out infinite",
    },
    shape2: {
      position: "absolute",
      top: "60%",
      right: "10%",
      width: "150px",
      height: "150px",
      background: "linear-gradient(45deg, #ff006e, #8338ec)",
      borderRadius: "20px",
      opacity: 0.1,
      animation: "float 8s ease-in-out infinite reverse",
      transform: "rotate(45deg)",
    },
    shape3: {
      position: "absolute",
      bottom: "20%",
      left: "5%",
      width: "120px",
      height: "120px",
      background: "linear-gradient(45deg, #06ffa5, #00d4ff)",
      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
      opacity: 0.1,
      animation: "float 7s ease-in-out infinite",
    },
    loginCard: {
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "20px",
      padding: "50px 40px",
      width: "100%",
      maxWidth: "450px",
      position: "relative",
      boxShadow:
        "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 245, 255, 0.1)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
    },
    loginCardHover: {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow:
        "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 245, 255, 0.3)",
      border: "1px solid rgba(0, 245, 255, 0.4)",
    },
    glowEffect: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background:
        "conic-gradient(from 0deg, transparent, rgba(0, 245, 255, 0.1), transparent, rgba(255, 0, 110, 0.1), transparent)",
      animation: "rotate 15s linear infinite",
      pointerEvents: "none",
    },
    title: {
      color: "#ffffff",
      fontSize: "36px",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "40px",
      position: "relative",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      letterSpacing: "-0.02em",
    },
    inputGroup: {
      marginBottom: "30px",
      position: "relative",
    },
    label: {
      display: "block",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "18px 24px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "2px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "15px",
      fontSize: "16px",
      color: "#ffffff",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
    },
    inputFocus: {
      background: "rgba(0, 245, 255, 0.1)",
      border: "2px solid #00f5ff",
      boxShadow: "0 0 20px rgba(0, 245, 255, 0.3)",
      transform: "scale(1.02)",
    },
    inputIcon: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#00f5ff",
      fontSize: "20px",
      opacity: 0.7,
    },
    button: {
      width: "100%",
      padding: "20px 30px",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      border: "none",
      borderRadius: "15px",
      fontSize: "18px",
      fontWeight: "700",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      position: "relative",
      overflow: "hidden",
      marginTop: "20px",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 20px 40px rgba(0, 245, 255, 0.4)",
      background:
        "linear-gradient(135deg, #0080ff 0%, #00f5ff 50%, #8338ec 100%)",
    },
    buttonRipple: {
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.3)",
      transform: "scale(0)",
      animation: "ripple 0.6s linear",
      pointerEvents: "none",
    },
    errorMessage: {
      background: "rgba(255, 0, 110, 0.1)",
      border: "1px solid rgba(255, 0, 110, 0.3)",
      borderRadius: "12px",
      color: "#ff6b9d",
      padding: "15px 20px",
      marginBottom: "25px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
      backdropFilter: "blur(10px)",
    },
    footer: {
      textAlign: "center",
      marginTop: "30px",
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "14px",
    },
    link: {
      color: "#00f5ff",
      textDecoration: "none",
      fontWeight: "600",
      transition: "color 0.3s ease",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00f5ff, #0080ff);
          border-radius: 4px;
        }
      `}</style>

      <div style={styles.body}>
        <div style={styles.loginContainer}>
          <div style={styles.backgroundShapes}>
            <div style={styles.shape1}></div>
            <div style={styles.shape2}></div>
            <div style={styles.shape3}></div>
          </div>

          <div
            style={{
              ...styles.loginCard,
              ...(isHovered ? styles.loginCardHover : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div style={styles.glowEffect}></div>

            <h1 style={styles.title}>Login</h1>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>
                  Username
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    style={{
                      ...styles.input,
                      ...(focusedInput === "username" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("username")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <div style={styles.inputIcon}>👤</div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      ...styles.input,
                      ...(focusedInput === "password" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <div style={styles.inputIcon}>🔒</div>
                </div>
              </div>

              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, styles.buttonHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, styles.button);
                }}
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  const ripple = document.createElement("span");
                  const size = Math.max(rect.width, rect.height);
                  const x = e.clientX - rect.left - size / 2;
                  const y = e.clientY - rect.top - size / 2;

                  ripple.style.width = ripple.style.height = size + "px";
                  ripple.style.left = x + "px";
                  ripple.style.top = y + "px";
                  ripple.className = "ripple";
                  Object.assign(ripple.style, styles.buttonRipple);

                  e.target.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }}
              >
                Sign In
              </button>
            </form>

            <div style={styles.footer}>
              Don't have an account?{" "}
              <button type="button" style={styles.link}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
