import React, { useState } from "react";
import BusinessRules from '../components/popup/BusinessRules.js';

const Experiment = () => {
    const [popupBisRulesOpen, setBisRulesPopupOpen] = useState(false);
    const [submittedText, setSubmittedText] = useState('');
    const handleBisRulesSubmit = (text) => {
        setSubmittedText(text);
    }
    const handleBisRulesClosePopup = () => {
        setBisRulesPopupOpen(false);
    };
    const handleBisRulesOnClick = () => {
        setBisRulesPopupOpen(true);
    }

return (
    <div className="p-3">
        <div className="d-flex align-items-center">
        <button className='button' onClick={handleBisRulesOnClick}>Enter PlantUML Script</button>
        {popupBisRulesOpen && <BusinessRules onClose={handleBisRulesClosePopup} onSubmit={handleBisRulesSubmit} />} 
        </div>
    </div>
    );
};

export default Experiment;