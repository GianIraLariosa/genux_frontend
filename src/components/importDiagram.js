import React, { useRef } from 'react';
import uploadButton from "../assets/images/buttons/uploadbutton.png";
function ImportDiagram({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();  // Trigger file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.bpmn')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileSelect(e.target.result); // Pass file content to the parent
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .bpmn file.');
    }
  };

  return (
    <div>
      <img 
    src={uploadButton}
    alt="Upload Bpmn" 
    onClick={handleButtonClick}
    //style={{ cursor: 'pointer', width: '30px', height: 'auto', marginLeft: '750px'}} 
    style={{
      cursor: 'pointer',
      width: '30px',
      height: 'auto',
    }}
  />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".bpmn"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImportDiagram;