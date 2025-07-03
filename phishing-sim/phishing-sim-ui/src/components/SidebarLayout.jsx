import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SidebarLayout = () => {
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      fontFamily:
        "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    },
    contentWrapper: {
      flex: 1,
      position: "relative",
      zIndex: 1,
    },
    backgroundOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(1px)",
      pointerEvents: "none",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        /* Global styles for consistent theming */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 245, 255, 0.5) rgba(255, 255, 255, 0.1);
        }
        
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00f5ff, #0080ff);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0080ff, #00f5ff);
        }
        
        /* Remove default margins and ensure full coverage */
        body, html {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
        }
      `}</style>

      <div style={styles.container}>
        <Sidebar />
        <div style={styles.mainContent}>
          <div style={styles.backgroundOverlay}></div>
          <div style={styles.contentWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
