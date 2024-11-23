import parseXML from '../assets/UtilityComponents/ParseXMLComponent';
import translateToPlantUML from '../assets/UtilityComponents/TranslateUMLComponent';
import DiagramInfo from "../components/XML_Class";
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export const generateUX = async ({ setgenerateInfo, user_id, setGenerating, xml, navigate, retryCount = 3 }) => {
    const API_Key = 'AIzaSyBDRBBgf0jcTb9MZMWTJcUSqOoP9ZfzxMI';
    try{
      // Set Loading indicator
      // setGenerating(true);

      // data prepocessing
      // const { xml } = await modeler.current.saveXML({ format: true });
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

          Using the given PlantUML activity diagram, create a corresponding state diagram that represents the user experience (UX) on individual pages. For each page, generate a nested state diagram that details the various elements the user interacts with. Exclude any processes performed by the system—focus solely on user actions and interactions. Ensure that all variable names are unique (no duplicates).

          The output should follow the structure below:
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


          Please output only the PlantUML script.
      `;


      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = await response.text();
      // const endoutput = parseTextToPlantUML(generatedText);
      // console.log(generatedText);
      
    //   const newResponse = await axios.post('https://genux-backend-9f3x.onrender.com/api/generate-plantuml', { script: generatedText });
    //   const imageUrl = newResponse.data.imageUrl;
    //   navigate('/PlantUMLResult', { state: { imageUrl } });
    return generatedText

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
    //   setGenerating(false);
    }
  };