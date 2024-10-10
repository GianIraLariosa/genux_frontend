import React, { useEffect } from "react";
import '../popup/popup.css'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Error = ({ onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <FormLabel id="rbg-label">INVALID DIAGRAM!</FormLabel>
        </FormControl>
      </div>
    </div>
  );
};

export default Error;
