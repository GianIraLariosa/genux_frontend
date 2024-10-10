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
    <Route path="/diagram-editor" element={<DiagramEditor />} />
  </Routes>

  const handleSaveWireframe = async () => {
    try {
      const saveData = {
        user_id: user_id, 
        imageUrl: imageUrl,
        title: wireframeTitle,
      };
      console.log('Saving data:', saveData);
      const response = await axios.post('http://localhost:4000/wireframe', saveData);
    
        navigate('/diagram-editor');
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
