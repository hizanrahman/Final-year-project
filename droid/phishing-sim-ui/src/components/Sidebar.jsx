import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout, getCurrentUser } from "../utils/auth";

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get user data using utility function
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      description: "Analytics & Overview",
    },
    {
      path: "/email-templates",
      label: "Email Templates",
      icon: "📝",
      description: "Template Management",
    },
    {
      path: "/send-email",
      label: "Send Email",
      icon: (
        <img
          src={process.env.PUBLIC_URL + "/images/send_button.svg"}
          alt="Send Email"
          style={{ width: 24, height: 24, verticalAlign: "middle" }}
        />
      ),
      description: "Campaign Management",
    },
  ];

  const styles = {
    sidebar: {
      width: "320px",
      minHeight: "100vh",
      background:
        "linear-gradient(180deg, rgba(12, 12, 12, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(0, 245, 255, 0.2)",
      position: "relative",
      overflow: "hidden",
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    backgroundElements: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
    },
    floatingShape1: {
      position: "absolute",
      top: "10%",
      right: "-30px",
      width: "100px",
      height: "100px",
      background: "linear-gradient(45deg, #00f5ff, #0080ff)",
      borderRadius: "50%",
      opacity: 0.1,
      animation: "float 8s ease-in-out infinite",
    },
    floatingShape2: {
      position: "absolute",
      bottom: "20%",
      left: "-20px",
      width: "80px",
      height: "80px",
      background: "linear-gradient(45deg, #ff006e, #8338ec)",
      borderRadius: "20px",
      opacity: 0.1,
      animation: "float 6s ease-in-out infinite reverse",
      transform: "rotate(45deg)",
    },
    glowEffect: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background:
        "conic-gradient(from 0deg, transparent, rgba(0, 245, 255, 0.05), transparent, rgba(255, 0, 110, 0.05), transparent)",
      animation: "rotate 25s linear infinite",
      pointerEvents: "none",
    },
    content: {
      position: "relative",
      zIndex: 1,
      padding: "40px 30px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      marginBottom: "50px",
      textAlign: "center",
    },
    logo: {
      fontSize: "28px",
      fontWeight: "700",
      background:
        "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8338ec 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "8px",
      letterSpacing: "-0.02em",
    },
    tagline: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    divider: {
      width: "60px",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
      margin: "20px auto",
      borderRadius: "1px",
    },
    navigation: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    menuItem: {
      display: "block",
      textDecoration: "none",
      padding: "20px 24px",
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
    },
    menuItemActive: {
      background: "rgba(0, 245, 255, 0.1)",
      border: "1px solid rgba(0, 245, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 245, 255, 0.2)",
    },
    menuItemHover: {
      transform: "translateX(8px)",
      background: "rgba(0, 245, 255, 0.08)",
      border: "1px solid rgba(0, 245, 255, 0.2)",
      boxShadow: "0 12px 24px rgba(0, 245, 255, 0.15)",
    },
    menuItemContent: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      position: "relative",
      zIndex: 1,
    },
    menuIcon: {
      fontSize: "24px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 245, 255, 0.1)",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    menuIconActive: {
      background: "rgba(0, 245, 255, 0.2)",
      boxShadow: "0 0 16px rgba(0, 245, 255, 0.3)",
    },
    menuText: {
      flex: 1,
    },
    menuLabel: {
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "4px",
      transition: "color 0.3s ease",
    },
    menuLabelActive: {
      color: "#00f5ff",
    },
    menuDescription: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "12px",
      fontWeight: "400",
    },
    activeIndicator: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: "4px",
      height: "24px",
      background: "linear-gradient(180deg, #00f5ff, #0080ff)",
      borderRadius: "0 2px 2px 0",
      boxShadow: "0 0 12px rgba(0, 245, 255, 0.6)",
    },
    footer: {
      marginTop: "auto",
      paddingTop: "20px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
    profileSection: {
      padding: "16px 20px",
      marginBottom: "16px",
      background: "rgba(0, 245, 255, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(0, 245, 255, 0.2)",
    },
    profileHeader: {
      color: "#00f5ff",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "8px",
    },
    userName: {
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "4px",
    },
    userRole: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "12px",
      textTransform: "capitalize",
    },
    logoutButton: {
      width: "100%",
      padding: "12px 16px",
      background: "rgba(255, 0, 110, 0.1)",
      border: "1px solid rgba(255, 0, 110, 0.3)",
      borderRadius: "12px",
      color: "#ff6b9d",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
    },
    logoutButtonHover: {
      background: "rgba(255, 0, 110, 0.2)",
      transform: "translateY(-2px)",
    },
    footerText: {
      color: "rgba(255, 255, 255, 0.5)",
      fontSize: "12px",
      textAlign: "center",
      fontWeight: "400",
    },
    version: {
      color: "#00f5ff",
      fontWeight: "600",
    },
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div style={styles.sidebar}>
        <div style={styles.backgroundElements}>
          <div style={styles.floatingShape1}></div>
          <div style={styles.floatingShape2}></div>
          <div style={styles.glowEffect}></div>
        </div>

        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.logo}>PhishDroid</h1>
            <div style={styles.divider}></div>
            <p style={styles.tagline}>Security Training Platform</p>
          </div>

          <nav style={styles.navigation}>
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              const hovered = hoveredItem === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.menuItem,
                    ...(active ? styles.menuItemActive : {}),
                    ...(hovered ? styles.menuItemHover : {}),
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideIn 0.6s ease forwards",
                  }}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {active && <div style={styles.activeIndicator}></div>}

                  <div style={styles.menuItemContent}>
                    <div
                      style={{
                        ...styles.menuIcon,
                        ...(active ? styles.menuIconActive : {}),
                      }}
                    >
                      {item.icon}
                    </div>

                    <div style={styles.menuText}>
                      <div
                        style={{
                          ...styles.menuLabel,
                          ...(active ? styles.menuLabelActive : {}),
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={styles.menuDescription}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div style={styles.footer}>
            {user && (
              <div style={styles.profileSection}>
                <div style={styles.profileHeader}>My Profile</div>
                <div style={styles.userName}>{user.username}</div>
                <div style={styles.userRole}>{user.role}</div>
              </div>
            )}

            <button
              style={{
                ...styles.logoutButton,
                ...(hoveredItem === "logout" ? styles.logoutButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

            <div style={styles.footerText}>
              Version <span style={styles.version}>2.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
