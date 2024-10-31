import React, { useState } from "react";
import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";
import toggleIcon from "../assets/images/buttons/arrow.png";
import MonacoEditor from '@monaco-editor/react';
import axios from "axios";

const FullLayout = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const rotation = isDashboardVisible ? 180 : 0;
  const [code, setCode] = useState(`@startuml\nAlice -> Bob: Hello!\n@enduml`);
  const [imageUrl, setImageUrl] = useState('');
  
  const generateUX = async ( retryCount = 3 ) => {
    try{
      const newResponse = await axios.post('https://genux-backend-9f3x.onrender.com/api/generate-plantuml', { script: code });
      const imageUrl = newResponse.data.imageUrl;
    } catch(err) {
      console.log("error", err);

      // Retry logic: retryCount controls how many times to retry before giving up
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount - 1}`);
        await generateUX(retryCount - 1);  // Recursive call with a decremented retryCount
      } else {
        console.error("Max retry attempts reached. Failed to generate UX.");
      }
    } finally {
      //setGenerating(false);
    }
  };

  const handleEditorChange = (value) => {
      setCode(value);
    };

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
                marginLeft: "5px",
                marginRight: "5px",
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

            <div style={{ border: '1px solid black', display: 'inline-block' }}>
            <MonacoEditor
              height="300px"
              width="450px"
              defaultLanguage="plaintext"
              defaultValue={code}
              onChange={handleEditorChange}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />

            {imageUrl ? (
              <img src={imageUrl} alt="Generated State Diagram" style={styles.image} />
            ) : (
              <p style={styles.loadingText}>Loading diagram...</p>
            )}
            <button onClick={generateUX} style={styles.button}>Generate UX</button> 
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
  borderRight: "1px solid black",
};

const styles = {
  image: {
    maxWidth: '100%',
    height: 'auto',
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: '10px',
    marginTop: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#777',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '150px',
    marginRight: '10px',
  },
};

export default FullLayout;
