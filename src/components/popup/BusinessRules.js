import React, { useState } from "react";
import '../popup/popup.css'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';

const BusinessRules = ({ onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleSubmit = () => {
      onSubmit(inputValue);
      onClose();
    };

  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <FormLabel id="rbg-label">Enter Script</FormLabel>
          <textarea
            value={inputValue}
            onChange={handleChange}
            placeholder="Add script..."
            style={{
              minWidth: '300px',
              minHeight: '300px',
              resize: 'none',  // Disable resizing if desired
              padding: '10px', // Add padding for better readability
              boxSizing: 'border-box', // Ensure padding doesn't affect width/height
              overflowWrap: 'break-word', // Ensure long words break to a new line
              whiteSpace: 'pre-wrap', // Preserve whitespace and wrap as needed
            }}
          />
          <button className="confirm-button" onClick={handleSubmit}>Confirm</button>
          <button className="confirm-button" onClick={onClose}>Close</button>
        </FormControl>
      </div>
    </div>
  );
};

export default BusinessRules;
