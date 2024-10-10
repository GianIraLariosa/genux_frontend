import React, { useEffect, useState } from 'react';
import DiagramInfo from '../../components/XML_Class'; 
import parseXML from './ParseXMLComponent'; 
import translateToPlantUML from './TranslateUMLComponent';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { useNavigate } from 'react-router-dom';

const GenerateComponent = async (modeler, user_id, setgenerateInfo) => {
    const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ';
    //const navigate = useNavigate();

    try {
        console.log("1");
        //data prepocessing
        const { xml } = await modeler.current.saveXML({ format: true });
        const data = parseXML(xml);
        const plantUML = translateToPlantUML(data);
        //save the data into a class
        const generateInfo = new DiagramInfo(user_id, xml, "", plantUML);
        //prepare the api call
        const genAI = new GoogleGenerativeAI(API_Key);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        //set the current info from the one created
        setgenerateInfo(generateInfo);
        //prompt generation
        const prompt = `
            Convert the following PlantUML activity diagram script into a state diagram
            and dont include any other words apart from the script and dont forget to include
            "@startuml" and "@enduml":
            Activity Diagram:
            ${plantUML}
            
            State Diagram:
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const promptText = await response.text();
        console.log(plantUML);
        console.log(promptText);
        //navigate('/result', { state: { texts: promptText } });
        console.log("before window");
        window.location.assign(`/#/PlantUMLResult?texts=${promptText}`);
        console.log("after window");
    } catch (err) {
    console.log("error", err);
    }
};

export default GenerateComponent;
