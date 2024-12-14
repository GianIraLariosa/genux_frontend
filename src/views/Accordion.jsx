import React, { useState } from "react";
import "./Accordion.css"; // Make sure you style the images in Accordion.css
import activitydiag_image from "../assets/images/logos/04-activity-diagram-example-process-order.webp"
import statediag_image from "../assets/images/logos/state_diag.png"

const Accordion = () => {
  const faqItems = [
    { 
      title: "What is Act2State?", 
      content: (
        <div>
          Act2State is an AI-powered web application designed to automatically transform activity diagrams into state diagrams, streamlining workflow design and enhancing productivity for developers and designers.
        </div>
      )
    },
    { 
      title: "What is an Activity Diagram?", 
      content: (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          An activity diagram is a type of visual representation used in software design to model workflows, processes, or user interactions.
          <img src={activitydiag_image} 
          alt="Act2State Diagram" 
          style={{
            width: '300px',
            height: 'auto',
            objectFit: 'contain',
            marginTop: '10px'
          }}
          />
        </div>
      )
    },
    { 
      title: "What is a State Diagram?", 
      content: (
        <div>
          A state diagram is a graphical representation used to model the states of an object and how it transitions between those states.
          <img src={statediag_image} 
            alt="Activity Diagram Example" 
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              marginTop: '10px'
            }} 
            />
        </div>
      )
    },
    { 
      title: "How can I add or edit elements in my diagram?", 
      content: "You can easily add or edit elements by selecting objects from the toolbar and dragging them onto the canvas. To edit, simply click on an element and modify its properties."
    },
    { 
      title: "Can I use the system on my mobile device?", 
      content: "Mobile support is currently limited. We are working to improve the experience for mobile users."
    },
    { 
      title: "How do I save my work or export my Activity Diagrams?", 
      content: "To save your work, click on the Save button in the top menu. For exporting, you can download your diagram in multiple formats, including PDF, PNG, and SVG."
    },
    { 
      title: "Is there a way to collaborate with others on my diagram?", 
      content: "Currently, real-time collaboration features are not supported. However, we plan to include them in future updates."
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="wrapper">
      {faqItems.map((item, index) => (
        <div key={index} className="item">
          <div
            className={`title ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleAccordion(index)}
          >
            {item.title}
          </div>
          <div className={`content ${activeIndex === index ? "show" : ""}`}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
