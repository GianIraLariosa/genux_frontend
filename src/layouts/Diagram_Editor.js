import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
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



const BpmnDiagram = () => {
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

  const openImportedDiagram = async (diagram) => {
    try {
      await modeler.current.importXML(diagram);
      const canvas = modeler.current.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Error importing diagram:', err);
    }
  };

  const generateUX = async ( retryCount = 3 ) => {
    try{
      //Set Loading indicator
      setGenerating(true);

      //data prepocessing
      const { xml } = await modeler.current.saveXML({ format: true });
      const data = parseXML(xml);
      const plantUML = translateToPlantUML(data);

      //save the data into a class
      const generateInfo = new DiagramInfo(user_id, xml, "", plantUML);

      //prepare the api call
      const genAI = new GoogleGenerativeAI(API_Key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-exp-0827' });
      setgenerateInfo(generateInfo);

      const prompt = `
          ${plantUML}

          Using this plantuml activity diagram
          Make a plantuml state diagram that has the individual pages and have each page have another state diagram about 
          the various elements that are interacted by the user.
          Disregard any process that is done by the system, focus on the User Experience.
          DO NOT USE DUPLICATE VARIABLE NAMES!
          OUTPUT ONLY THE PLANTUML SCRIPT!
          Make sure to follow the output:
          @startuml
          [*] --> LoginPage

          state LoginPage {
            [*] --> UsernameTextfield
            UsernameTextfield : User enters username
            UsernameTextfield --> PasswordTextfield : Clicks Textfield
            PasswordTextfield : User enters password
            PasswordTextfield --> LoginButton : Clicks button
            LoginButton : User clicks button
          }
          @enduml
      `;


      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = await response.text();
      // const endoutput = parseTextToPlantUML(generatedText);
      console.log(generatedText);
      
      const newResponse = await axios.post('https://genux-backend-9f3x.onrender.com/api/generate-plantuml', { script: generatedText });
      const imageUrl = newResponse.data.imageUrl;
      navigate('/PlantUMLResult', { state: { imageUrl } });

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
      setGenerating(false);
    }
  };

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

  const handleGenerate = () => {
    generateUX();
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

  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '10px', position: 'relative' }}>
        Additional buttons can be placed here
      </div> */}
      <div id="canvas" style={{ width: '100%', height: '80vh', border: '1px solid black' }}></div>
      <br/>
      <div className="d-flex align-items-center">
        <LoadingModal loading={generating} />
        <button onClick={handleNewDiagram} style={buttonStyle}>New Diagram</button> 
        <button onClick={handleGenerate} style={buttonStyle}>Generate UX</button> 
        <ImportDiagram onFileSelect={handleFileSelect} />
        <img
          src={saveButton}
          alt="Save Diagram"
          onClick={handleXMLSaveOnClick}
          style={{
            cursor: 'pointer',
            width: '30px',
            height: 'auto',
            marginLeft: '10px'
          }}
        />
        {popupSaveOpen && (
          <SavePopup 
            onClose={handleXMLSaveClosePopup} 
            onSubmit={handleXMLSaveSubmit} 
            info={diagramInfo}  // Pass diagramInfo to the popup
          />
        )}
        {/* <img src={imageUrl} alt="Generated PlantUML Diagram" /> */}
      </div>
      
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#41C9E2",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px", // Adds space between buttons
};


export default BpmnDiagram;
