import React, { useState } from "react";
import '../popup/popup.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Themes = ({ onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleThemeChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedOption);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <FormControl>
          <FormLabel id="rbg-label">Available Themes</FormLabel>
          <RadioGroup
            aria-labelledby="rg-button"
            defaultValue="none"
            name="radio-buttons-group"
            onChange={handleThemeChange}
          >
            <FormControlLabel style={{ color: "white" }} value="Pastel" control={<Radio />} label="Pastel" />
            <FormControlLabel style={{ color: "white" }} value="Vintage" control={<Radio />} label="Vintage" />
            <FormControlLabel style={{ color: "white" }} value="Retro" control={<Radio />} label="Retro" />
            <FormControlLabel style={{ color: "white" }} value="Light" control={<Radio />} label="Light" />
            <FormControlLabel style={{ color: "white" }} value="Dark" control={<Radio />} label="Dark" />
          </RadioGroup>
          <button className="confirm-button" onClick={handleSubmit}>Confirm</button>
        </FormControl>
      </div>
    </div>
  );
};

export default Themes;
