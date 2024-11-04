import React, { useContext, useRef, useState } from "react";
import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";
import toggleIcon from "../assets/images/buttons/arrow.png";
import MonacoEditor from '@monaco-editor/react';
import axios from "axios";
import parseXML from '../assets/UtilityComponents/ParseXMLComponent';
import translateToPlantUML from '../assets/UtilityComponents/TranslateUMLComponent';
import { UserContext } from "../Usercontext";
import { generateUX } from "./generateUX";

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
      if(bpmnRef.current) {
       const xml = await bpmnRef.current.getXML();
      //  const xml = modeler.PromiseResult;
      //  console.log(modeler);
       const generated_text = await generateUX({
          setgenerateInfo,
          user_id,
          setGenerating,
          xml,
          retryCount: 3,
        });

        // const data = parseXML(xml);
        // const plantUML = translateToPlantUML(data);
        setCode(generated_text);
        console.log(generated_text);
        const newResponse = await axios.post('https://genux-backend-9f3x.onrender.com/api/generate-plantuml', { script: generated_text });
        const imageUrl = newResponse.data.imageUrl;
        setImageUrl(imageUrl);
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
        {/* <LoadingModal loading={generating} /> */}
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
              <BpmnDiagram ref={bpmnRef} />
            </div>

            <button onClick={generateUX_button} style={styles.button}>Generate UX</button> 

            <div className="diagramArea" style={{ border: '1px solid black', 
              width: '20%', 
              height: '80vh', 
              margin: '20px', 
              display: 'block',
              }}>
            <MonacoEditor
              height="300px"
              width="450px"
              defaultLanguage="plaintext"
              value={code}
              onChange={handleEditorChange}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />

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

const buttonStyle = {
  backgroundColor: "#41C9E2",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px", // Adds space between buttons
};

export default FullLayout;
