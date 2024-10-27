import React, { useState } from "react";
import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";
import toggleIcon from "../assets/images/buttons/arrow.png";

const FullLayout = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const rotation = isDashboardVisible ? 180 : 0;

  const toggleDashboard = () => {
    console.log("Toggle button clicked");
    setIsDashboardVisible((prevVisible) => {
      console.log("Previous visibility:", prevVisible);
      return !prevVisible;
    });
  };

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <Header />
        <div className="contentArea">
          <div style={contentAreaStyle}>
            <img
              src={toggleIcon}
              alt={isDashboardVisible ? "Hide Dashboard" : "Show Dashboard"}
              onClick={toggleDashboard}
              className="toggleImageButton"
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          {isDashboardVisible && (
            <aside className="sidebarArea shadow" id="sidebarArea">
              <Dashboard />
            </aside>
          )}
          <div className="diagramArea">
            <BpmnDiagram />
          </div>
        </div>
      </div>
    </main>
  );
};

const contentAreaStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "#f8f9fa", 
  padding: "5px", 
  borderRadius: "4px", 
};

export default FullLayout;
