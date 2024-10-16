import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom';
import Header from "../../layouts/Header";
import axios from 'axios';  
import { UserContext } from "../../Usercontext";
import DiagramEditor from './../../layouts/Diagram_Editor';

const GenerateResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {}; 
  const { user_id } = useContext(UserContext); 

  const [wireframeTitle, setWireframeTitle] = useState("");  

  <Routes>
    {/* Other routes */}
    <Route path="/user" element={<DiagramEditor />} />
  </Routes>

  const handleSaveWireframe = async () => {
    try {
      const saveData = {
        user_id: user_id, 
        imageUrl: imageUrl,
        title: wireframeTitle,
      };
      console.log('Saving data:', saveData);
      const response = await axios.post('https://genux-backend-9f3x.onrender.com/wireframe', saveData);
    
        navigate('/user');
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
    <div style={styles.container}>
      <Header />
      <h2 style={styles.title}>Generated State Diagram</h2>
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
      
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate(-1)} style={styles.button}>
          Go Back
        </button>
        <button onClick={handleSaveLocal} style={styles.saveButton}>
          Save Locally
        </button>
        <button onClick={handleSaveWireframe} style={styles.saveButton}>
          Save UX
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
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
  input: {
    marginTop: '20px',
    padding: '10px',
    fontSize: '16px',
    width: '20%',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '150px',
    marginLeft: '10px',
  },
};

export default GenerateResult;
