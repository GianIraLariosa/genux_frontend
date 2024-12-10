import React, { useContext, useEffect, useRef, useState } from "react";
import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";
import toggleIcon from "../assets/images/buttons/arrow.png";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { UserContext } from "../Usercontext";
import { generateUX } from "./generateUX";
import { minHeight, padding } from "@mui/system";
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import { Atom, OrbitProgress, ThreeDot } from "react-loading-indicators";
import classNames from "classnames";

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
  const dashboardRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const generateAndHandle = async () => {
      if (!isMounted) return;
      try {
        setGenerating(true); //Disable button immediately
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
          await updateImage(generated_text); // Await the image update
        }
      } catch (error) {
        console.error("Error generating UX:", error);
        // Handle the error appropriately, perhaps display a message to the user
      } finally {
        if (isMounted) setGenerating(false); //Enable button after completion (success or failure)
      }
    };

    if (generating) {
      generateAndHandle();
    }

    return () => {
      isMounted = false;
    };
  }, [generating]);


  const generateUX_button = async () => {
    if (!generating) {
      //No need for await here since the actual work is done in the useEffect
      setGenerating(true); 
    }
  };

  const Loading = () => <OrbitProgress style={{ fontSize: "7px" }} color={"#7FA1C3"} />;

  const buttonContent = generating ? (
    <Loading />
  ) : (
    "Generate UX"
  );

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
      
      if (dashboardRef.current) {
        dashboardRef.current.refreshDashboard();
      }
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
          <div className="sidebar-toggle">
            <img
              src={toggleIcon}
              alt={isDashboardVisible ? "Hide Dashboard" : "Show Dashboard"}
              onClick={toggleDashboard}
              className="image-dashboard dashboard-button"
              style={{
                // Inline styles for dynamic rotation using CSS custom properties
                '--rotation': `${rotation}deg`,
              }}
            />
            {isDashboardVisible && (
              <aside className="sidebarArea shadow" id="sidebarArea">
                <Dashboard ref={dashboardRef}/>
              </aside>
            )}
          </div>

          <div className="diagram-container">
            <BpmnDiagram ref={bpmnRef} />
          </div>
          
          <div className="editor-container">
          <h4>Step 2</h4>
            <div>
                <p className="title-style">State Diagram</p>
            </div>
            <div className="monaco-container" style={{ minHeight: "300px" }}>
              <MonacoEditor
                minHeight="250px"
                width="100%"
                defaultLanguage="plaintext"
                value={code}
                onChange={handleEditorChange}
                options={{ fontSize: 14, minimap: { enabled: false } }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={generateUX_button} 
                className={classNames('generate-button', { 'buttonDisabled': generating })}
                disabled={generating}>
                  {buttonContent}
              </button>
              <button className="generate-button" onClick={handleUpdateImageClick} >
                Update Image
              </button>
            </div>

            <div>
            <input 
              type="text" 
              placeholder="Enter wireframe title" 
              value={wireframeTitle}
              onChange={(e) => setWireframeTitle(e.target.value)} 
              className="input"
            />
            </div>

            {imageUrl ? (
              <img src={imageUrl} alt="Generated State Diagram" style={styles.image} />
            ) : (
              <p style={styles.loadingText}>Loading diagram...</p>
            )}

        <div>
            <button onClick={handleSaveLocal} className="generate-button">
              Save Locally
            </button>
            <button onClick={handleSaveWireframe} className="generate-button">
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
  backgroundColor: "white",
  height: "100%",
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
