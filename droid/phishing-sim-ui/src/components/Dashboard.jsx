import React, { useEffect, useState } from "react";

let API_BASE = process.env.REACT_APP_API_BASE_URL;
if (!API_BASE || window.location.hostname === "localhost") {
  API_BASE = "http://localhost:5000";
}
if (API_BASE.endsWith("/")) {
  API_BASE = API_BASE.slice(0, -1);
}
const buildApiUrl = (endpoint) => {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }
  return `${API_BASE}/${endpoint}`;
};

const Dashboard = () => {
  const [clickData, setClickData] = useState([]);
  const [credentialData, setCredentialData] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const response = await fetch(buildApiUrl("clicks"), { credentials: "include" });
        const data = await response.json();
        console.log("Click data received:", data);
        setClickData(data);
      } catch (error) {
        console.error("Failed to fetch click data", error);
        setMessage("❌ Failed to load click data.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    };

    const fetchCredentialData = async () => {
      try {
        const response = await fetch(buildApiUrl("credentials"), { credentials: "include" });
        const data = await response.json();
        console.log("Credentials data received:", data);
        setCredentialData(data);
      } catch (error) {
        console.error("Failed to fetch credentials", error);
        setMessage("❌ Failed to load credentials.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    };

    // Initial fetch
    fetchClickData();
    fetchCredentialData();

    // Polling every 5 seconds
    const interval = setInterval(() => {
      fetchClickData();
      fetchCredentialData();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
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
      top: "5%",
      right: "10%",
      width: "300px",
      height: "300px",
      background: "linear-gradient(45deg, #00f5ff, #0080ff)",
      borderRadius: "50%",
      opacity: 0.05,
      animation: "float 8s ease-in-out infinite",
    },
    shape2: {
      position: "absolute",
      bottom: "10%",
      left: "5%",
      width: "200px",
      height: "200px",
      background: "linear-gradient(45deg, #ff006e, #8338ec)",
      borderRadius: "30px",
      opacity: 0.05,
      animation: "float 10s ease-in-out infinite reverse",
      transform: "rotate(45deg)",
    },
    content: {
      position: "relative",
      zIndex: 1,
      padding: "40px 20px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "60px",
      marginTop: 0,
    },
    dashboardTitleBar: {
      margin: '0 auto 40px auto',
      paddingTop: 24,
      maxWidth: 600,
      textAlign: 'center',
    },
    dashboardTitle: {
      fontSize: 36,
      fontWeight: 700,
      background:
        'linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: 8,
      letterSpacing: '-0.02em',
      userSelect: 'none',
    },
    dashboardDivider: {
      width: 80,
      height: 2,
      background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
      margin: '0 auto 16px auto',
      borderRadius: 1,
    },
    dashboardTagline: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 16,
      fontWeight: 400,
      marginBottom: 0,
      userSelect: 'none',
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "18px",
      fontWeight: "400",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      marginBottom: "50px",
    },
    statCard: {
      background: "rgba(15, 15, 35, 0.9)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "20px",
      padding: "30px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
    },
    statCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 25px 50px rgba(0, 245, 255, 0.3)",
      border: "1px solid rgba(0, 245, 255, 0.4)",
    },
    statIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      display: "block",
    },
    statNumber: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#00f5ff",
      marginBottom: "8px",
    },
    statLabel: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "16px",
      fontWeight: "500",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "40px",
    },
    dataCard: {
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      borderRadius: "24px",
      padding: "40px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "30px",
      paddingBottom: "20px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    refreshButton: {
      background: "linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)",
      border: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
    },
    tableHeader: {
      background: "rgba(0, 245, 255, 0.1)",
      borderRadius: "12px 12px 0 0",
    },
    th: {
      padding: "20px 24px",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      borderBottom: "1px solid rgba(0, 245, 255, 0.2)",
    },
    tbody: {
      background: "rgba(255, 255, 255, 0.02)",
    },
    tr: {
      transition: "all 0.2s ease",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    },
    trHover: {
      background: "rgba(0, 245, 255, 0.05)",
      transform: "scale(1.01)",
    },
    td: {
      padding: "20px 24px",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "14px",
      fontWeight: "400",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "rgba(255, 255, 255, 0.6)",
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      opacity: 0.5,
    },
    emptyText: {
      fontSize: "18px",
      fontWeight: "500",
    },
    glowEffect: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background:
        "conic-gradient(from 0deg, transparent, rgba(0, 245, 255, 0.05), transparent, rgba(255, 0, 110, 0.05), transparent)",
      animation: "rotate 20s linear infinite",
      pointerEvents: "none",
    },
    message: {
      position: "fixed",
      top: "30px",
      right: "30px",
      background: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0, 245, 255, 0.3)",
      borderRadius: "12px",
      padding: "16px 24px",
      color: "#00f5ff",
      fontSize: "14px",
      fontWeight: "500",
      zIndex: 1000,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    },
  };

  const TableRow = ({ children, isHover, onMouseEnter, onMouseLeave }) => (
    <tr
      style={{
        ...styles.tr,
        ...(isHover ? styles.trHover : {}),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </tr>
  );

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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Custom scrollbar */
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

        /* Mobile styles */
        @media (max-width: 900px) {
          .dashboard-content {
            padding: 20px 4vw !important;
          }
          .dashboard-title {
            font-size: 28px !important;
          }
        }
        @media (max-width: 600px) {
          .dashboard-content {
            padding: 10px 2vw !important;
            width: 100vw !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
          .dashboard-title {
            font-size: 20px !important;
            margin-bottom: 12px !important;
          }
          .dashboard-header {
            margin-bottom: 24px !important;
          }
          .dashboard-stats {
            gap: 12px !important;
            margin-bottom: 18px !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100vw !important;
          }
          .cardGrid {
            display: block !important;
            width: 100vw !important;
            gap: 0 !important;
          }
          .dashboard-card {
            padding: 12px 0 !important;
            border-radius: 10px !important;
            width: 98vw !important;
            min-width: 0 !important;
            max-width: 98vw !important;
            margin-left: 1vw !important;
            margin-right: 1vw !important;
            box-sizing: border-box !important;
            overflow-x: auto !important;
            display: block !important;
            margin-bottom: 18px !important;
          }
          .dashboard-card + .dashboard-card {
            margin-top: 0 !important;
          }
          .dashboard-card table {
            min-width: 500px !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backgroundShapes}>
          <div style={styles.shape1}></div>
          <div style={styles.shape2}></div>
        </div>

        <div className="dashboard-content" style={styles.content}>
          <div style={styles.dashboardTitleBar}>
            <div style={styles.dashboardTitle}>PhishDroid</div>
            <div style={styles.dashboardDivider}></div>
            <div style={styles.dashboardTagline}>Security Training Platform</div>
          </div>
          <div className="dashboard-header" style={styles.header}>
            <h1 className="dashboard-title" style={{fontSize:32, fontWeight:700, marginBottom:16, background:'none', WebkitTextFillColor:'#fff', color:'#fff'}}>Dashboard</h1>
            <div style={styles.subtitle}>
              Real-time analytics for your phishing simulation campaigns
            </div>
          </div>
          <div className="dashboard-stats" style={styles.statsGrid}>
            <div
              style={{
                ...styles.statCard,
                ...(activeCard === "clicks" ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setActiveCard("clicks")}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div style={styles.glowEffect}></div>
              <span style={styles.statIcon}>🎯</span>
              <div style={styles.statNumber}>{clickData.length}</div>
              <div style={styles.statLabel}>Total Clicks</div>
            </div>

            <div
              style={{
                ...styles.statCard,
                ...(activeCard === "credentials" ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setActiveCard("credentials")}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div style={styles.glowEffect}></div>
              <span style={styles.statIcon}>🔐</span>
              <div style={styles.statNumber}>{credentialData.length}</div>
              <div style={styles.statLabel}>Captured Credentials</div>
            </div>

            <div
              style={{
                ...styles.statCard,
                ...(activeCard === "rate" ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setActiveCard("rate")}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div style={styles.glowEffect}></div>
              <span style={styles.statIcon}>📊</span>
              <div style={styles.statNumber}>
                {clickData.length > 0
                  ? Math.round((credentialData.length / clickData.length) * 100)
                  : 0}
                %
              </div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
          </div>

          {/* Data Tables */}
          <div style={styles.cardGrid}>
            {/* Click Data Table */}
            <div className="dashboard-card" style={styles.dataCard}>
              <div style={styles.glowEffect}></div>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span>🎯</span>
                  Click Analytics
                </h2>
                <button style={styles.refreshButton}>🔄 Refresh</button>
              </div>

              {clickData.length > 0 ? (
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.th}>Email Address</th>
                      <th style={styles.th}>IP Address</th>
                      <th style={styles.th}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tbody}>
                    {clickData.map((click, index) => (
                      <TableRow
                        key={index}
                        isHover={activeCard === `click-${index}`}
                        onMouseEnter={() => setActiveCard(`click-${index}`)}
                        onMouseLeave={() => setActiveCard(null)}
                      >
                        <td style={styles.td}>{click.email}</td>
                        <td style={styles.td}>{click.ipAddress || "N/A"}</td>
                        <td style={styles.td}>
                          {new Date(click.timestamp).toLocaleString()}
                        </td>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📭</div>
                  <div style={styles.emptyText}>No click data available</div>
                </div>
              )}
            </div>

            {/* Captured Credentials Table */}
            <div className="dashboard-card" style={styles.dataCard}>
              <div style={styles.glowEffect}></div>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span>🔐</span>
                  Captured Credentials
                </h2>
                <button style={styles.refreshButton}>🔄 Refresh</button>
              </div>

              {credentialData.length > 0 ? (
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.th}>Email Address</th>
                      <th style={styles.th}>Password</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tbody}>
                    {credentialData.map((cred, index) => (
                      <TableRow
                        key={index}
                        isHover={activeCard === `cred-${index}`}
                        onMouseEnter={() => setActiveCard(`cred-${index}`)}
                        onMouseLeave={() => setActiveCard(null)}
                      >
                        <td style={styles.td}>{cred.email}</td>
                        <td style={styles.td}>{cred.password}</td>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🛡️</div>
                  <div style={styles.emptyText}>
                    No captured credentials available
                  </div>
                </div>
              )}
            </div>
          </div>

          {showMessage && message && (
            <div style={{
              position: 'fixed',
              left: '50%',
              bottom: 24,
              transform: 'translateX(-50%)',
              background: 'rgba(255,0,110,0.95)',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              zIndex: 9999,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
            }}>{message}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
