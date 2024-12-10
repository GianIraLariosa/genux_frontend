import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import saveButton from "../assets/images/buttons/savebutton.png";
import parseXML from '../assets/UtilityComponents/ParseXMLComponent';
import ImportDiagram from '../components/importDiagram';
import SavePopup from '../components/popup/SavePopup';
import DiagramInfo from "../components/XML_Class";
import { UserContext } from "../Usercontext";
import { GoogleGenerativeAI } from '@google/generative-ai';
import translateToPlantUML from '../assets/UtilityComponents/TranslateUMLComponent';
import parseTextToPlantUML from '../assets/UtilityComponents/ParseTextComponent';
import { useNavigate } from 'react-router-dom';
import "react-loading-indicators"
import axios from 'axios';
import { Atom } from 'react-loading-indicators';
import LoadingModal from '../components/popup/LoadingModal';
import { LoadingIndicator } from 'react-loading-indicators';
import { generateUX } from './generateUX';
import newButton from "../assets/images/buttons/refresh-button.png";


const BpmnDiagram = forwardRef((props, ref) => {
  const [fileContent, setFileContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const [height, setHeight] = useState(window.innerHeight - 250);
  const modeler = useRef(null);
  const [popupSaveOpen, setpopupSaveOpen] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [diagramInfo, setDiagramInfo] = useState(null);
  const [generateInfo, setgenerateInfo] = useState(null);
  const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ';
  const { state } = useLocation();
  const { diagram } = state || {};
  const { user_id } = useContext(UserContext); 
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(1);
  

  const openDiagram = async () => {
    const response = await fetch('empty_bpmn.bpmn');
    const diagram = await response.text();
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  // Make a function available through the ref to get the current XML
  useImperativeHandle(ref, () => ({
    getXML: async () => {
      if (modeler.current) {
        const { xml } = await modeler.current.saveXML({ format: true });
        return xml;
      }
      return null;
    },
  }));

  const openImportedDiagram = async (diagram) => {
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  const handleGenerate = () => {
    generateUX({
      setgenerateInfo,
      user_id,
      setGenerating,
      modeler,
      navigate,
      retryCount: 3,
    });
  }

  const handleNewDiagram = async () => {
    const response = await fetch('empty_bpmn.bpmn');
    const diagram = await response.text();
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  useEffect(() => {
    modeler.current = new BpmnJS({
      container: '#canvas',
      keyboard: { bindTo: window },
    });

    if (diagram) {
      openImportedDiagram(diagram);  
      console.log(diagram);
    }else{
      openDiagram();
    }

    return () => {
      modeler.current.destroy();
    };
  }, [diagram]);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  const handleXMLSaveSubmit = (text) => {
    setSubmittedText(text);
  }

  const handleXMLSaveClosePopup = () => {
    setpopupSaveOpen(false);
  };

  const handleXMLSaveOnClick = async () => {
    const { xml } = await modeler.current.saveXML({ format: true });
    const data = parseXML(xml);


    if (data) {
      const diagramInfo = new DiagramInfo(user_id, diagramName, xml);  // Create DiagramInfo instance
      console.log('diagramInfo: ', diagramInfo);
      setDiagramInfo(diagramInfo);  // Store it in state
      setpopupSaveOpen(true);  // Open the popup
    } else {
      console.error('Failed to parse BPMN data.');
    }
  };

  const handleFileSelect = (content) => {
    setFileContent(content);
    openImportedDiagram(content);
  };

  const handleZoomIn = () => {
    const canvas = modeler.current.get('canvas');
    const newZoom = Math.min(zoomLevel + 0.2, 2); 
    canvas.zoom(newZoom);
    setZoomLevel(newZoom);
  };

  const handleZoomOut = () => {
    const canvas = modeler.current.get('canvas');
    const newZoom = Math.max(zoomLevel - 0.2, 0.2); 
    canvas.zoom(newZoom);
    setZoomLevel(newZoom);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '=') {
        handleZoomIn();
      } else if (event.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomLevel]);

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center', width: '95%', height: '95%' }}>
      <div className="diagram-header">
        <h4>Step 1: </h4>
        <div className="button-group">
          <button className="canva-edit-button" alt="Zoom in" title ="Zoom in" onClick={handleZoomIn}>+</button>
          <button className="canva-edit-button" alt="Zoom out" title ="Zoom out" onClick={handleZoomOut}>-</button>
          <button className="canva-button" alt="Save Diagram" title="Save Diagram" onClick={handleXMLSaveOnClick}>Save</button>
          <button className="canva-button" alt="New Diagram" title="New Diagram" onClick={openDiagram}>New</button>
          <ImportDiagram onFileSelect={handleFileSelect} />
        </div>
      </div>
      <div id="canvas-wrapper">
        <div id="canvas" style={{ width: '90%', height: '100%' }} ></div>
      </div>
      <div className="d-flex align-items-center">
        {popupSaveOpen && (
          <SavePopup 
            onClose={handleXMLSaveClosePopup} 
            onSubmit={handleXMLSaveSubmit} 
            info={diagramInfo}  // Pass diagramInfo to the popup
          />
        )}
      </div>
    </div>
  );
});

export default BpmnDiagram;
