import React, { useContext, useRef, useState } from "react";
import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";
import toggleIcon from "../assets/images/buttons/arrow.png";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { UserContext } from "../Usercontext";
import { generateUX } from "./generateUX";
import { minHeight } from "@mui/system";

const FullLayout = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const rotation = isDashboardVisible ? 180 : 0;
  const [code, setCode] = useState(`@startuml\nAlice -> Bob: Hello!\n@enduml`);
  const [imageUrl, setImageUrl] = useState('');
  const bpmnRef = useRef(null);
  const [generateInfo, setgenerateInfo] = useState(null);
  const { user_id } = useContext(UserContext);
  const [generating, setGenerating] = useState(false);

  const generateUX_button = async () => {
    if (bpmnRef.current) {
      const xml = await bpmnRef.current.getXML();
      const generated_text = await generateUX({
        setgenerateInfo,
        user_id,
        setGenerating,
        xml,
        retryCount: 3,
      });

      setCode(generated_text);
      updateImage(generated_text);
    }
  };

  const updateImage = async (script) => {
    try {
      const response = await axios.post("https://genux-backend-9f3x.onrender.com/api/generate-plantuml", {
        script,
      });
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleUpdateImageClick = () => {
    updateImage(code);
  };

  const toggleDashboard = () => {
    setIsDashboardVisible((prevVisible) => !prevVisible);
  };

  return (
    <main style={{ height: "100vh", overflow: "hidden" }}>
      <div className="pageWrapper d-lg-flex">
        <Header />
        <div className="contentArea" style={contentAreaStyle}>
          <div style={sidebarToggleStyle}>
            <img
              src={toggleIcon}
              alt={isDashboardVisible ? "Hide Dashboard" : "Show Dashboard"}
              onClick={toggleDashboard}
              className="toggleImageButton"
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                margin: "5px",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
            />
            {isDashboardVisible && (
              <aside className="sidebarArea shadow" id="sidebarArea">
                <Dashboard />
              </aside>
            )}
          </div>

          <div style={diagramContainerStyle}>
            {/* <div style={{ flex: 1 }}> */}
              <BpmnDiagram ref={bpmnRef} />
            {/* </div> */}
          </div>

          <div style={editorContainerStyle}>
            <MonacoEditor
              height="250px"
              width="100%"
              defaultLanguage="plaintext"
              value={code}
              onChange={handleEditorChange}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />

            <div>
              <button onClick={generateUX_button} style={styles.button}>
                Generate UX
              </button>
              <button onClick={handleUpdateImageClick} style={styles.button}>
                Update Image
              </button>
            </div>

            {imageUrl ? (
              <img src={imageUrl} alt="Generated State Diagram" style={styles.image} />
            ) : (
              <p style={styles.loadingText}>Loading diagram...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const contentAreaStyle = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "flex-start",
  backgroundColor: "#f8f9fa",
  height: "100%",
};

const sidebarToggleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "5px",
  borderRight: "1px solid black",
};

const diagramContainerStyle = {
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const editorContainerStyle = {
  width: "35%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginLeft: "20px",
  overflowY: "auto",
};

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "150px",
    textAlign: "center",
    marginTop: "30px",
    marginRight: "10px"
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    border: "2px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    marginTop: "20px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#777",
    marginTop: "20px",
  },
};

export default FullLayout;
