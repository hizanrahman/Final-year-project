import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For storing error messages
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if username and password are correct
    if (username === "admin" && password === "admin") {
      // Redirect to the dashboard page after successful login
      window.location.href = "/dashboard";
    } else {
      setError("Invalid username or password");
    }
  };

  // Stunning modern styles with glassmorphism effect
  const styles = {
    body: {
      fontFamily:
        "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      margin: 0,
      padding: 0,
    },
    loginContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: `url('https://images.pexels.com/photos/27301921/pexels-photo-27301921.jpeg') no-repeat center center fixed`,
      backgroundSize: "cover",
      position: "relative",
    },
    loginBox: {
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "24px",
      boxShadow:
        "0 25px 45px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      padding: "48px 40px",
      width: "100%",
      maxWidth: "420px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    loginBoxHover: {
      transform: "translateY(-4px)",
      boxShadow:
        "0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15)",
    },
    h2: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "32px",
      fontSize: "32px",
      fontWeight: "700",
      letterSpacing: "-0.02em",
    },
    inputContainer: {
      marginBottom: "24px",
      textAlign: "left",
      position: "relative",
    },
    label: {
      display: "block",
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "16px",
      fontSize: "16px",
      color: "white",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "rgba(102, 126, 234, 0.6)",
      background: "rgba(255, 255, 255, 0.15)",
      outline: "none",
      transform: "scale(1.02)",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
    },
    inputPlaceholder: {
      color: "rgba(255, 255, 255, 0.6)",
    },
    loginButton: {
      width: "100%",
      padding: "18px 24px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginTop: "8px",
    },
    loginButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    },
    errorMessage: {
      background: "rgba(220, 38, 38, 0.15)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(220, 38, 38, 0.3)",
      borderRadius: "12px",
      color: "#fca5a5",
      marginBottom: "20px",
      fontSize: "14px",
      padding: "12px 16px",
      fontWeight: "500",
    },
    decorativeElement: {
      position: "absolute",
      top: "-50%",
      right: "-50%",
      width: "200%",
      height: "200%",
      background:
        "conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
      animation: "rotate 10s linear infinite",
      pointerEvents: "none",
    },
  };

  return (
    <>
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <div style={styles.loginContainer}>
        <div
          style={{
            ...styles.loginBox,
            ...(isHovered ? styles.loginBoxHover : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={styles.decorativeElement}></div>
          <h2 style={styles.h2}>Welcome Back</h2>
          {error && <div style={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
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
            </div>
            <div style={styles.inputContainer}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
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
            </div>
            <button
              type="submit"
              style={styles.loginButton}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.loginButtonHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, styles.loginButton);
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
