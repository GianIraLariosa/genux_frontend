import React, { useImperativeHandle, forwardRef, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../Usercontext";
import refreshButton from "../assets/images/buttons/refresh-button.png";
import WireframePopup from '../components/popup/wireframepopup';

const Dashboard = forwardRef ((props, ref) => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [diagrams, setDiagrams] = useState([]);
  const [wireframes, setWireframes] = useState([]);  
  const [selectedWireframe, setSelectedWireframe] = useState(null);
  const { user_id } = useContext(UserContext);
  const [popupOpen, setPopupOpen] = useState(false);
  const { setCode } = props;
  const { updateImage } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  const fetchDiagrams = () => {
    if (user_id) {
      axios.get(`https://genux-backend-9f3x.onrender.com/diagrams/${user_id}`)
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
      axios.get(`https://genux-backend-9f3x.onrender.com/wireframes/${user_id}`)  
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
    navigate('/user', { state: { diagram } });
  };

  const handleWireframeClick = (wireframe) => {
    setSelectedWireframe(wireframe);
    setCode(wireframe.script);
    setPopupOpen(true);
  };

  const handleDeleteDiagram = (diagramName) => {
    axios.delete(`https://genux-backend-9f3x.onrender.com/diagrams/${user_id}/${diagramName}`)
      .then(() => {
        setDiagrams(prev => prev.filter(diagram => diagram.name !== diagramName));
      })
      .catch(error => console.error('Error deleting diagram:', error));
  };

  const handleDeleteWireframe = (wireframeTitle) => {
    axios.delete(`https://genux-backend-9f3x.onrender.com/wireframes/${user_id}/${wireframeTitle}`)
      .then(() => {
        setWireframes(prev => prev.filter(wireframe => wireframe.title !== wireframeTitle));
      })
      .catch(error => console.error('Error deleting wireframe:', error));
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  useImperativeHandle(ref, () => ({
    refreshDashboard
  }));

  return (
    <div className="p-3 dashboard">
      <div className="dashboard-sidebar">
        <h2 style = {{ marginTop: '20px'}}>Dashboard</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end',flexDirection:'column', alignItems: 'flex-end', position:'relative'}}>
        <div
            style={{
              position: "relative",
              top: "5px",
              left: "10px",
              cursor: "pointer",
              zIndex: 0,
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div
              style={{
                width: "20px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              i
            </div>
            {showTooltip && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  center: "0px",
                  backgroundColor: "black",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  zIndex: 20,
                }}
              >
                Locally saved diagrams and wireframes are displayed here.
              </div>
            )}
          </div>
          
        </div>
      </div>
      <div className="d-flex flex-column align-items-center" style={{marginTop: '10px'}}>
      {/* <img
            src={refreshButton}
            alt="Refresh"
            onClick={refreshDashboard}
            style={{
              cursor: 'pointer',
              width: '25px',
              height: 'auto',
              marginBottom: '10px',
              marginLeft:'100px',
            }}
          /> */}
        <h3>Diagrams</h3>
        <ul className="dashboard-list" style={listStyle}>
          {diagrams.length > 0 ? (
            diagrams.map((diagram, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <button className="close-button" onClick={() => handleDeleteDiagram(diagram.name)} >
                  &times;
                </button>
                <button className="dashboard-button2" onClick={() => handleDiagramClick(diagram?.bpmn)}>
                  {diagram.name}
                </button>
              </li>
            ))
          ) : (
            <li>No saved diagrams</li>
          )}
        </ul>

        <h3>State Diagrams</h3>
        <ul className="dashboard-list" style={listStyle}>
          {wireframes.length > 0 ? (
            wireframes.map((wireframe, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <button 
                  className="close-button" 
                  onClick={() => handleDeleteWireframe(wireframe.title)} 
                  >
                  &times;
                </button>
                <button className="dashboard-button2" onClick={() => handleWireframeClick(wireframe)}>
                  {wireframe.title}
                </button>
              </li>
            ))
          ) : (
            <li>No saved State Diagrams</li>
          )}
        </ul>
      </div>

      {popupOpen && selectedWireframe && (
        <WireframePopup
          script={selectedWireframe.script}
          title={selectedWireframe.title}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
});

export default Dashboard;
