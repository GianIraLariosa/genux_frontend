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
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';

const FullLayout = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const rotation = isDashboardVisible ? 180 : 0;
  const [code, setCode] = useState(`@startuml\nAlice -> Bob: Hello!\n@enduml`);
  const [imageUrl, setImageUrl] = useState('');
  const bpmnRef = useRef(null);
  const [generateInfo, setgenerateInfo] = useState(null);
  const { user_id } = useContext(UserContext);
  const [generating, setGenerating] = useState(false);
  const [wireframeTitle, setWireframeTitle] = useState("");  
  const navigate = useNavigate();

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

  const handleSaveWireframe = async () => {
    try {
      const saveData = {
        user_id: user_id, 
        imageUrl: imageUrl,
        title: wireframeTitle,
      };
      console.log('Saving data:', saveData);
      const response = await axios.post('https://genux-backend-9f3x.onrender.com/wireframe', saveData); 
    } catch (error) {
      console.error("Error while saving UX wireframe:", error);
    }
  };

  const handleSaveLocal = async () => {
    try {
      // Fetch the image data from the imageUrl
      const response = await axios.get(imageUrl, {
        responseType: 'blob' // Get the image as a blob
      });
  
      // Create a Blob from the response
      const blob = new Blob([response.data], { type: 'image/png' });
  
      // Create a temporary download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
  
      // Set the download attribute (filename)
      link.download = `${wireframeTitle || 'generated-diagram'}.png`;
  
      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Remove the link from the DOM after downloading
      document.body.removeChild(link);
  
      console.log('Image saved locally.');
      
      // Navigate to another page after the save
      navigate('/user');
    } catch (error) {
      console.error("Error while saving UX wireframe:", error);
    }
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

            <div>
            <input 
              type="text" 
              placeholder="Enter wireframe title" 
              value={wireframeTitle}
              onChange={(e) => setWireframeTitle(e.target.value)} 
              style={styles.input}
            />
            </div>

            {imageUrl ? (
              <img src={imageUrl} alt="Generated State Diagram" style={styles.image} />
            ) : (
              <p style={styles.loadingText}>Loading diagram...</p>
            )}

        <div>
            <button onClick={handleSaveLocal} style={styles.button}>
              Save Locally
            </button>
            <button onClick={handleSaveWireframe} style={styles.button}>
              Save UX
            </button>
        </div>
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
    marginRight: "10px",
    marginBottom: "10px"
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
