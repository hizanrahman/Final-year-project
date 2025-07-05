import React, { useState, useEffect } from "react";

let API_BASE = process.env.REACT_APP_API_BASE_URL;
if (!API_BASE || window.location.hostname === "localhost") {
  API_BASE = "http://localhost:5000";
}

const SendEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/email-templates`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error("Failed to load templates", err);
      }
    };
    fetchTemplates();

    // fetch login pages
    const fetchPages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/login-pages`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (err) {
        console.error("Failed to load pages", err);
      }
    };
    fetchPages();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Sending email to:", email);

    try {
      const response = await fetch(`${API_BASE}/send-phishing-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ recipientEmail: email, templateId: selectedTemplate, loginPageId: selectedPage }),
      });

      console.log("Send email response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Send email failed:", errorText);

        if (response.status === 401) {
          setMessage("❌ Authentication required. Please login again.");
        } else {
          setMessage(`❌ Error: Failed to send email (${response.status})`);
        }
        return;
      }

      const data = await response.json();
      console.log("Send email success:", data);

      setMessage("✅ Email sent successfully!");
      setEmail(""); // Clear the input on success
    } catch (error) {
      console.error("Send email network error:", error);
      setMessage(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    },
    backgroundShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    },
    shape1: {
      position: "absolute",
      top: "15%",
      right: "10%",
      width: "250px",
      height: "250px",
      background: "linear-gradient(45deg, #00f5ff, #0080ff)",
      borderRadius: "50%",
      opacity: 0.08,
      animation: "float 8s ease-in-out infinite",
    },
    shape2: {
      position: "absolute",
      bottom: "20%",
      left: "8%",
      width: "180px",
      height: "180px",
      background: "linear-gradient(45deg, #ff006e, #8338ec)",
      borderRadius: "25px",
      opacity: 0.08,
      animation: "float 10s ease-in-out infinite reverse",
      transform: "rotate(45deg)",
    },
    shape3: {
      position: "absolute",
      top: "40%",
      left: "15%",
      width: "120px",
      height: "120px",
      background: "linear-gradient(45deg, #06ffa5, #00d4ff)",
      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
      opacity: 0.08,
      animation: "float 7s ease-in-out infinite",
    },
    formCard: {
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "24px",
      padding: "50px 40px",
      width: "100%",
      maxWidth: "500px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow:
        "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 245, 255, 0.1)",
      zIndex: 1,
    },
    formCardHover: {
      transform: "translateY(-8px)",
      boxShadow:
        "0 35px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 245, 255, 0.3)",
      border: "1px solid rgba(0, 245, 255, 0.4)",
    },
    glowEffect: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background:
        "conic-gradient(from 0deg, transparent, rgba(0, 245, 255, 0.08), transparent, rgba(255, 0, 110, 0.08), transparent)",
      animation: "rotate 15s linear infinite",
      pointerEvents: "none",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "12px",
      letterSpacing: "-0.02em",
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "16px",
      fontWeight: "400",
    },
    divider: {
      width: "80px",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
      margin: "24px auto",
      borderRadius: "1px",
    },
    inputGroup: {
      marginBottom: "32px",
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
      padding: "20px 60px 20px 24px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "2px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      fontSize: "16px",
      color: "#ffffff",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
    },
    inputFocus: {
      background: "rgba(0, 245, 255, 0.1)",
      border: "2px solid #00f5ff",
      boxShadow: "0 0 24px rgba(0, 245, 255, 0.3)",
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
      transition: "all 0.3s ease",
    },
    inputIconActive: {
      opacity: 1,
      transform: "translateY(-50%) scale(1.1)",
    },
    button: {
      width: "100%",
      padding: "20px 30px",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      border: "none",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "700",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      position: "relative",
      overflow: "hidden",
      marginTop: "12px",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 20px 40px rgba(0, 245, 255, 0.4)",
      background:
        "linear-gradient(135deg, #0080ff 0%, #00f5ff 50%, #8338ec 100%)",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "#ffffff",
      animation: "spin 1s ease-in-out infinite",
      marginRight: "12px",
    },
    messageContainer: {
      marginTop: "30px",
      padding: "20px 24px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    },
    successMessage: {
      background: "rgba(6, 255, 165, 0.1)",
      border: "1px solid rgba(6, 255, 165, 0.3)",
      color: "#06ffa5",
    },
    errorMessage: {
      background: "rgba(255, 0, 110, 0.1)",
      border: "1px solid rgba(255, 0, 110, 0.3)",
      color: "#ff6b9d",
    },
    infoSection: {
      marginTop: "40px",
      textAlign: "center",
      paddingTop: "30px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
    infoText: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "13px",
      lineHeight: "1.6",
    },
    featureList: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
    },
    feature: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "12px",
      fontWeight: "500",
    },
    featureIcon: {
      color: "#00f5ff",
      fontSize: "16px",
    },
  };

  const getMessageStyle = () => {
    if (message.includes("✅")) return styles.successMessage;
    if (message.includes("❌")) return styles.errorMessage;
    return {};
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backgroundShapes}>
          <div style={styles.shape1}></div>
          <div style={styles.shape2}></div>
          <div style={styles.shape3}></div>
        </div>

        <div
          style={{
            ...styles.formCard,
            ...(isHovered ? styles.formCardHover : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={styles.glowEffect}></div>

          <div style={styles.header}>
            <h1 style={styles.title}>Campaign Launcher</h1>
            <div style={styles.divider}></div>
            <p style={styles.subtitle}>
              Deploy phishing simulation emails to target recipients
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label htmlFor="template" style={styles.label}>
                Email Template (optional)
              </label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{
                  ...styles.input,
                  appearance: "none",
                  cursor: "pointer",
                  background: "#0e1525",
                  color: "#fff",
                  border: "1px solid rgba(0, 245, 255, 0.3)",
                }}
              >
                <option value="">-- Default Template --</option>
                {templates.map((tpl) => (
                  <option key={tpl._id} value={tpl._id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="loginPage" style={styles.label}>
                Login Page (optional)
              </label>
              <select
                id="loginPage"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                style={{
                  ...styles.input,
                  appearance: "none",
                  cursor: "pointer",
                  background: "#0e1525",
                  color: "#fff",
                  border: "1px solid rgba(0, 245, 255, 0.3)",
                }}
              >
                <option value="">-- Default Page --</option>
                {pages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Target Email Address
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter recipient email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    ...styles.input,
                    ...(focusedInput === "email" ? styles.inputFocus : {}),
                  }}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
                <div
                  style={{
                    ...styles.inputIcon,
                    ...(focusedInput === "email" ? styles.inputIconActive : {}),
                  }}
                >
                  📧
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.target.style, styles.buttonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  Object.assign(e.target.style, styles.button);
                }
              }}
            >
              {loading && <div style={styles.loadingSpinner}></div>}
              {loading ? "Deploying Campaign..." : "Launch Campaign"}
            </button>
          </form>

          {message && (
            <div
              style={{
                ...styles.messageContainer,
                ...getMessageStyle(),
              }}
            >
              {message}
            </div>
          )}

          <div style={styles.infoSection}>
            <div style={styles.infoText}>
              This tool sends simulated phishing emails for security awareness
              training
            </div>
            <div style={styles.featureList}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🎯</span>
                <span>Targeted Delivery</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>📊</span>
                <span>Real-time Tracking</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🔒</span>
                <span>Secure Testing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendEmail;
