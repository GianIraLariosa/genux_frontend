import React from 'react';
import { FormControl, FormLabel } from '@mui/material';

const WireframePopup = ({ script, title, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <h3>{title}</h3>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              backgroundColor: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
              fontFamily: 'monospace',
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '10px',
            }}
          >
            {script}
          </pre>
          <div className="button-group">
            <button className="button2" onClick={onClose}>Close</button>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default WireframePopup;
