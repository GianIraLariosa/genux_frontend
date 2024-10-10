import React from 'react';
import { FormControl, FormLabel } from '@mui/material';

const WireframePopup = ({ imageUrl, title, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <h3>{title}</h3>
          <img src={imageUrl} alt={title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
          <div className="button-group">
            <button className="button2" onClick={onClose}>Close</button>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default WireframePopup;
