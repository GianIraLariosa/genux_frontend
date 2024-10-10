import axios from 'axios';
import React, { useState } from 'react';

function PlantUMLGenerator() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Send the script to your Node.js backend
      const response = await axios.post('http://localhost:4000/api/generate-plantuml', { script: inputValue });
      
      // Set the generated image URL to state
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating PlantUML image:", error);
    }
  };

  return (
    <div>
      <h1>PlantUML Script to Image</h1>
      <textarea
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter PlantUML script..."
        style={{ width: '100%', height: '200px' }}
      />
      <button onClick={handleSubmit}>Generate Image</button>
      
      {imageUrl && (
        <div>
          <h2>Generated Image:</h2>
          <img src={imageUrl} alt="Generated PlantUML Diagram" />
        </div>
      )}
    </div>
  );
}

export default PlantUMLGenerator;
