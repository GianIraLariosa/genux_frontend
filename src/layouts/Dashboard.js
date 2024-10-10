import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../Usercontext";
import refreshButton from "../assets/images/buttons/refresh-button.png";
import WireframePopup from '../components/popup/wireframepopup';
const Dashboard = () => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [diagrams, setDiagrams] = useState([]);
  const [wireframes, setWireframes] = useState([]);  
  const [selectedWireframe, setSelectedWireframe] = useState(null);
  const { user_id } = useContext(UserContext);
  const [popupOpen, setPopupOpen] = useState(false);

  const fetchDiagrams = () => {
    if (user_id) {
      axios.get(`/diagrams/${user_id}`)
        .then(response => {
          console.log(response.data);
          setDiagrams(response.data);
        })
        .catch(error => {
          console.error('Error fetching diagrams:', error);
          setShowError(true);
        });
    }
  };


  const fetchWireframes = () => {
    if (user_id) {
      axios.get(`/wireframes/${user_id}`)  
        .then(response => {
          console.log(response.data);
          setWireframes(response.data);
        })
        .catch(error => {
          console.error('Error fetching wireframes:', error);
          setShowError(true);
        });
    }
  };

  useEffect(() => {
    fetchDiagrams();
    fetchWireframes();  
  }, [user_id]);

  const refreshDashboard = () => {
    fetchDiagrams();
    fetchWireframes();  
  };

  const handleDiagramClick = (diagram) => {
    navigate('/diagram-editor', { state: { diagram } });
  };

  const handleWireframeClick = (wireframe) => {
    setSelectedWireframe(wireframe);
    setPopupOpen(true);
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const closePopup = () => {
    setSelectedWireframe(null); 
  };
  return (
    <div className="p-3">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <img
            src={refreshButton}
            alt="Refresh"
            onClick={refreshDashboard}
            style={{
              cursor: 'pointer',
              width: '25px',
              height: 'auto',
              marginLeft: '10px',
              marginBottom: '10px'
            }}
          />
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        <h3>Diagrams</h3>
        <ul className="dashboard-list" style={listStyle}>
          {diagrams.length > 0 ? (
            diagrams.map((diagram, index) => (
              <li key={index}>
                <button className="dashboard-button" onClick={() => handleDiagramClick(diagram?.bpmn)}>
                  {diagram.name}
                </button>
              </li>
            ))
          ) : (
            <li>No diagrams available</li>
          )}
        </ul>

        <h3>Wireframes</h3>
        <ul className="dashboard-list" style={listStyle}>
          {wireframes.length > 0 ? (
            wireframes.map((wireframe, index) => (
              <li key={index}>
                <button className="dashboard-button" onClick={() => handleWireframeClick(wireframe)}>
                  {wireframe.title}
                </button>
              </li>
            ))
          ) : (
            <li>No wireframes available</li>
          )}
        </ul>
      </div>
      {popupOpen && selectedWireframe && (
          <WireframePopup
            imageUrl={selectedWireframe.imageUrl}
            title={selectedWireframe.title}
            onClose={() => setPopupOpen(false)}
          />
        )}
    </div>
  );
};

export default Dashboard;
