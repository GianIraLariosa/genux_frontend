import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Iframe from '../Iframe';
import axios from 'axios';
import { UserContext } from "../Usercontext"; 
import DOMPurify from 'dompurify';

function Result() {
  const [htmls, setHtmls] = useState([]);
  const location = useLocation();
  const { texts, firstname } = location.state || {}; 
  const API_Key = 'AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ';
  const { user_id } = useContext(UserContext); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genAI = new GoogleGenerativeAI(API_Key);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const generatedHtmls = [];
        
        for (const prompt of texts) {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const promptText = await response.text();
          const sanitizedHtml = DOMPurify.sanitize(promptText);
          generatedHtmls.push(sanitizedHtml);
        }

        setHtmls(generatedHtmls);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [texts, firstname]);

  const handleSaveWireframe = async () => {
    try {
      for (const html of htmls) {
        console.log(user_id);
        await axios.post('https://genux-backend-9f3x.onrender.com/wireframe', {
          user_id: user_id,
          htmlCode: html
        });
      }
      console.log('Wireframes saved successfully.');
    } catch (error) {
      console.error('Error saving wireframes:', error);
    }

  };

  const handleSaveLocal = async () => {
        try {
          for (const html of htmls) {
            // Fetch the generated image from the backend (or the image URL you have)
            const response = await axios.get('https://genux-backend-9f3x.onrender.com/get-generated-image', {
              responseType: 'blob' // Get the image as a blob
            });
            // Create a Blob from the response
            const blob = new Blob([response.data], { type: 'image/png' });
            // Create a temporary download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            // Set the download attribute (filename)
            link.download = 'generated-diagram.png';
            // Append the link to the body (required for Firefox)
            document.body.appendChild(link);
            // Trigger the download
            link.click();
            // Remove the link from the DOM after downloading
            document.body.removeChild(link);
            console.log('Image saved locally.');
          }
        } catch (error) {
          console.error('Error saving wireframes:', error);
        }
    };

  return (
    <div style={outerContainerStyle}>
      <h1 style={titleStyle}>Screens</h1>
      <br/>
      {htmls.map((html, index) => (
        <div key={index} style={containerStyle}>
          <Iframe content={html} style={innerBoxStyle} />
        </div>
      ))}
      <button onClick={handleSaveWireframe} style={buttonStyle}>Save Wireframes</button>
      <button onClick={handleSaveLocal} style={buttonStyle}>Save Locally</button>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#41C9E2",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginTop: "20px" 
};

const outerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  background: 'white',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '50px',
  paddingTop: '30px',
  paddingBottom: '30px',
  paddingLeft: '20px',
  paddingRight: '20px',
  boxSizing: 'border-box',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: '30px',
};

const innerBoxStyle = {
  padding: '20px',
  width: '100%',
  maxWidth: '800px',
  height: '600px',
  border: '1px solid #000080',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

export default Result;
