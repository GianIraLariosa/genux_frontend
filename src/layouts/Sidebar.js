import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from "react";
import { Arrow, Layer, Line, Stage } from "react-konva";
import { useNavigate } from 'react-router-dom';
//import ArrowLineShape from '../components/ArrowLineShape';
import CancelShape from '../components/CancelShape';
import DiamondShape from "../components/Diamond.js";
import CircleWithRing from "../components/End.js";
//import LineShape from '../components/LineShape';
import Object from '../components/Object';
import ProcessShape from "../components/ProcessShape";
import Shapes from '../components/Shapes';
import CircleShape from "../components/Start.js";
import EditableText from '../components/EditableText';
import Themes from '../../src/components/popup/Themes';
import BusinessRules from '../components/popup/BusinessRules.js';
import "../assets/scss/sidebar.css";
import Error from '../components/popup/Error.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [diamonds, setDiamond] = useState([]);
  const [end_shape, setEndShape] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [cancelShapes, setCancelShapes] = useState([]);
  const [lines, setLines] = useState([]);
  const [arrow, setArrow] = useState([]);
  const [object, setObjects] = useState([]);
  const stageRef = useRef(null);
  const [r, setR] = useState(1);
  const [selectedShape, setSelectedShape] = useState({});
  const Circleid = useRef(0);
  const Processid = useRef(0);
  const Endid = useRef(0);
  const Diamondid = useRef(0);
  const Lineid = useRef(0);
  const [isCreatingLine, setIsCreatingLine] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [line4shape, setline4shape] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [text, setText] = useState([]);
  const [jsonOutput, setJsonOutput] = useState('');
  const [popupThemesOpen, setThemesPopupOpen] = useState(false);
  const [popupBisRulesOpen, setBisRulesPopupOpen] = useState(false);
  const [startShape, setStartShape] = useState({});
  const [left_arrow, setLeft_arrow] = useState(false);
  const [right_arrow, setRight_arrow] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [showError, setShowError] = useState(false);

  const getColorsByTheme = (selectedOption) => {
    switch (selectedOption) {
        case "Pastel":
            return "#F1E5D1, #DBB5B5, #C39898 and #987070";
        case "Vintage":
            return "#254336, #6B8A7A, #B7B597 and #DAD3BE";
        case "Retro":
            return "#01204E, #028391, #F6DCAC and #FEAE6F";
        case "Light":
            return "#FFF9D0, #CAF4FF, #A0DEFF and #5AB2FF";
        case "Dark":
            return "#222831, #31363F, #76ABAE and #EEEEEE";
        default:
            return "none";
    }
};

  const handleThemesPopupSubmit = (option) => {
    setSelectedOption(option);
  };

  const handleBisRulesSubmit = (text) => {
    setSubmittedText(text);
    //console.log(text);
  }

  const handleThemesClosePopup = () => {
    setThemesPopupOpen(false);
  };
  
  const handleThemesOnClick = () => {
    setThemesPopupOpen(true);
  }

  const handleBisRulesClosePopup = () => {
    setBisRulesPopupOpen(false);
  };
  
  const handleBisRulesOnClick = () => {
    setBisRulesPopupOpen(true);
  }

  const generateJson = () => {
    const data = {  
      // // circles: circles,
      // // decision: diamonds,
      // // end: end_shape,
      activities: processes.map(process => ({ id: process.id,text: process.text })),
      // // cancel: cancelShapes,
      // // lines: lines.map((line)),
      // // arrows: arrow,
      // objects: object.map(object => ({id: object.id,text : object.text})),
      // // text: text
    };
    
    return JSON.stringify(data, null, 2);
  };

const handleGenerateJson = () => {
  const jsonData = generateJson();
  setJsonOutput(jsonData);
};

  const CreateWireframe = () => {
    const jsonData = generateJson(); 
    const data = JSON.parse(jsonData);
    const activities = data.activities;
    
    
    const texts = [];
  
    if (Array.isArray(activities) && activities.length > 0 ) {
      activities.forEach(activity => {
        console.log(submittedText);
        texts.push("As a web developer, Generate me a website's " + activity.text + " page using html and inline css with a color palette of " + 
        getColorsByTheme(selectedOption) +" make sure it is symmetrical. Additionally I want " + submittedText + ". Make sure to add a usecase comment under every screen to explain the purpose of the process");
      });
      navigate('/result', { state: { texts: texts } });
    } else {
      console.error('Error: Activities data is not in the expected format.');
      setShowError(true);
    }
  };
  
  const handleErrorClose = () => {
    setShowError(false);
  };

  const [shapeProps, setShapeProps] = useState({
    x: 100,
    y: 25,
    fill: "skyblue",
    stroke: "black",
    width: 100,
    height: 50,
    strokeWidth: 4
  });


  function invalid(e, x, y) {
    e.target.to({
      x: x,
      y: y,
      duration: 0.1,
    });
  }

  const handleTransformEnd = (id, newAttrs, shapeType) => {
    console.log("Transformed shape attributes:", newAttrs);

    if(newAttrs.thistext == true){
      setProcesses(prevProcesses =>
        prevProcesses.map(process =>
          process.id === id
            ? { ...process, 
              text: newAttrs.text
             }
            : process
        )
      );

      const updatedLines = lines.map(line => {
        if (line.startShapeId === id && line.startShapeType === shapeType) {
          return { ...line, startshape_text: newAttrs.text };
        } 
        
        if (line.endShapeId === id && line.endShapeType === shapeType) {
          return { ...line, endshape_text: newAttrs.text };
        } 
        return line;
      });
      setLines(updatedLines);

    } else {
      const updatedLines = lines.map(line => {
        if (line.startShapeId === id && line.startShapeType === shapeType) {
          return { ...line, points: [newAttrs.x + (newAttrs.width / 2), newAttrs.y + newAttrs.height, line.points[2], line.points[3]] };
        } else if (line.endShapeId === id && line.endShapeType === shapeType) {
          return { ...line, points: [line.points[0], line.points[1], newAttrs.x + (newAttrs.width / 2), newAttrs.y] };
        }
        return line;
      });
      setLines(updatedLines);
  
  
      setProcesses(prevProcesses =>
        prevProcesses.map(process =>
          process.id === id
            ? { ...process, 
              x: newAttrs.x,
              y: newAttrs.y,
              width: newAttrs.width,
              height: newAttrs.height
             }
            : process
        )
      );
    }

    // console.log("After: ", shapeProps);
  };

  const deleteComponent = (selectedshape) => {
    if (selectedshape === null) return; // Do nothing if no item is selected

    switch(selectedshape.type){
      case 'process':
        const newProcesses = processes.filter(process => process.id !== selectedshape.id);
        setProcesses(newProcesses);
        break;
      case 'start':
        const newCircles = circles.filter(circle => circle.id !== selectedshape.id);
        setCircles(newCircles);
        break;
      case 'decision':
        const newDecisions = diamonds.filter(diamond => diamond.id !== selectedshape.id);
        setDiamond(newDecisions);
        break;
      case 'end':
        const newEndshapes = end_shape.filter(end => end.id !== selectedshape.id);
        setEndShape(newEndshapes);
        break;
    }
    

    // Remove connections that are linked to the deleted shape
    const newLines = lines.filter(line =>
      !(line.startShapeId === selectedshape.id && line.startShapeType === selectedshape.type) &&
      !(line.endShapeId === selectedshape.id && line.endShapeType === selectedshape.type)
    );
    setLines(newLines);

    setSelectedShape(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteComponent(selectedShape);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const container = stageRef.current.container();
      const width = container.clientWidth;
      const height = container.clientHeight;
      stageRef.current.width(width);
      stageRef.current.height(height);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size setup

    window.addEventListener('keydown', handleKeyDown);


    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [selectedShape]);

    const handleDrop = (e, componentType) => {
    const stage = stageRef.current;
    const mousePos = stage.getPointerPosition();

    switch (componentType) {
      case "circle":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return;
        }
        const newCircle = { id: ++Circleid.current, x: e.target.x(), y: e.target.y() };
        setCircles((prevCircles) => [...prevCircles, newCircle]);
        // console.log(e);
        e.target.position({ x: 0, y: 0 });
        break;
    
      case "diamondShape":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 125, 90);
          return;
        }
        const newDiamond = { id: ++Diamondid.current, x: e.target.x(), y: e.target.y()};
        setDiamond((prevDiamonds) => [...prevDiamonds, newDiamond]);
        e.target.position({ x: 125, y: 90 });
        break;
    
      case "end":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 155);
          return;
        }
        const newEndShape = { id: ++Endid.current, x: e.target.x(), y: e.target.y() };
        setEndShape((prevEnd) => [...prevEnd, newEndShape]);
        e.target.position({ x: 0, y: 155 });
        break;
    
        case "process":
          if (mousePos.x < 260) {
            console.log("Cannot drop in the restricted area.");
            invalid(e, 100, 25);
            return;
          }
          
          const newX = e.target.x();
          const newY = e.target.y();
          // const stage = e.target.getStage();
          // const stagePosition = stage.getPointerPosition();
          
          // Check if the new process overlaps with any existing processes
          // const overlapping = Shapes.processes.some(process => Shapes.isWithin('rectangle', process.x, process.y, process.radius, newX, newY));

          // if (overlapping) {
          //   console.log("Cannot drop within another shape.");
          //   invalid(e, 0, 0);
          //   return;
          // }

          const newProcess = 
          { id: ++Processid.current, 
            x: newX, 
            y: newY, 
            fill: "skyblue",
            stroke: "black",
            width: 100,
            height: 50,
            strokeWidth: 4,
            text: "Edit"
          };
          setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
          //Shapes.addProcess(newProcess);
          console.log("new shape added ", e);
          e.target.position({ x: 100, y: 25 });
          break;

      case "object":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 0, 0);
          return;
        }

        const newObjects = { x: e.target.x(), y: e.target.y()};
        setObjects((prevObjects) => [...prevObjects, newObjects]);
        e.target.position({ x: 0, y: 0 });
        break;
      
      case "text":
        if (mousePos.x < 260){
          invalid(e,25,270);
          return;
        }
        const newTexts = {x: e.target.x(), y: e.target.y(), currText: e.target.text()};
        console.log("testing text");
        console.log(newTexts.currText);
        setText((prevTexts) => [...prevTexts, newTexts]);
        e.target.position({x:20, y:270});
        break;

    
      case "cancel":
        if (mousePos.x < 260) {
          console.log("Cannot drop in the restricted area.");
          invalid(e, 50, 125);
          return;
        }
        const newCancel = { x: e.target.x(), y: e.target.y()};
        setCancelShapes((prevCancelShapes) => [...prevCancelShapes, newCancel]);
        e.target.position({ x: 50, y: 125 });
        break;
    
      default:
        break;
    }
    

  };

  const handleUpdate = (newX, newY, id, shapeType) => {
    // Update the circles
    var updatedLines = null;

    switch(shapeType){
      case "start":
          updatedLines = lines.map(line => {
          if (line.startShapeId === id && line.startShapeType === shapeType) {
            return { ...line, points: [newX + 50, newY + 80, line.points[2], line.points[3]] };
          } else if (line.endShapeId === id && line.endShapeType === shapeType) {
            return { ...line, points: [line.points[0], line.points[1], newX + 50, newY + 20] };
          }
          return line;
        });
        setLines(updatedLines);

        const updatedCircles = circles.map(circle =>
          circle.id === id ? { ...circle, x: newX, y: newY } : circle
        );
        setCircles(updatedCircles);
        break;
      case "end":
          updatedLines = lines.map(line => {
          if (line.startShapeId === id && line.startShapeType === shapeType) {
            return { ...line, points: [newX + 50, newY + 80, line.points[2], line.points[3]] };
          } else if (line.endShapeId === id && line.endShapeType === shapeType) {
            return { ...line, points: [line.points[0], line.points[1], newX + 50, newY + 20] };
          }
          return line;
        });
        setLines(updatedLines);
        
        const updatedEnd = end_shape.map(end =>
          end.id === id ? { ...end, x: newX, y: newY } : end
        );
        setEndShape(updatedEnd);
        break;
      case "decision":
        updatedLines = lines.map(line => {
          if (line.startShapeId === id && line.startShapeType === shapeType) {
            if(line.direction == 'left'){
              return { ...line, points: [newX, newY + 20, line.points[2], line.points[3]] };
            } else if(line.direction == 'right'){
              return { ...line, points: [newX + 40, newY + 20, line.points[2], line.points[3]] };
            }
          } else if (line.endShapeId === id && line.endShapeType === shapeType) {
            return { ...line, points: [line.points[0], line.points[1], newX + 20, newY] };
          }
          return line;
        });
        setLines(updatedLines);

        const updateddiamond = diamonds.map(diamond =>
          diamond.id === id ? { ...diamond, x: newX, y: newY } : diamond
        );
        setDiamond(updateddiamond);
        break;
    }
  };
  
  const updateText = (id, newText) => {
    setText(prevTexts =>
      prevTexts.map(textItem =>
        textItem.id === id ? { ...textItem, currText: newText } : textItem
      )
    );
  };

  const updateProcess = (id, newText) => {
    setProcesses(prevProcess => 
        prevProcess.map(Process => 
          Process.id === id ? { ...Process, text: newText} : Process
        )
    )
  }

  const updateObject = (id, newText) => {
    setObjects(prevObject => 
        prevObject.map(Object => 
          Object.id === id ? { ...Object, text: newText} : Object
        )
    )
  }

  const circleOnclick = (e) => {
    const container = stageRef.current.container();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const newCircle = { id: ++Circleid.current, x: Math.floor(width/3), y: Math.floor(height/3), fill: "skyblue" };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  const handleDoubleClick = (e) => {
    if (line4shape && selectedShape) {
      switch(selectedShape.type){
        case 'process':
          setStartPoint({ x: selectedShape.x + (selectedShape.width / 2), y: selectedShape.y + selectedShape.height});
          setIsCreatingLine(true);
          setStartShape(selectedShape);
          break;
        case 'start':
          setStartPoint({ x: selectedShape.x + 50, y: selectedShape.y + 80});
          setIsCreatingLine(true);
          setStartShape(selectedShape);
          break;
        case 'decision':
          if(left_arrow){
            setStartPoint({ x: selectedShape.x, y: selectedShape.y + 20});
            setIsCreatingLine(true);
            setStartShape({
              ...selectedShape,
              direction: 'left' // Replace 'newKey' and 'newValue' with your actual key and value
            });
          } else if(right_arrow){
            setStartPoint({ x: selectedShape.x + 40, y: selectedShape.y + 20});
            setIsCreatingLine(true);
            setStartShape({
              ...selectedShape,
              direction: 'right' // Replace 'newKey' and 'newValue' with your actual key and value
            });
          }
          break;
      }
    }
  };

  const handleMouseMove = (e) => {
    const { layerX, layerY } = e.evt;

    if (startPoint && isCreatingLine) {
      setEndPoint({ x: layerX, y: layerY });
    }
  };

  const handleMouseUp = (e) => {
    if (startPoint  && selectedShape.x != startShape.x) {
      const endShape = selectedShape;
      // Check if there is a shape below the mouse pointer
      if (endShape && (endShape.x !== startPoint.x - 50 || endShape.y !== startPoint.y - 50)) {
        // Create endpoint only if there is a shape below
        if(endShape.type == 'process'){
          if(startShape.type == 'decision'){
            const newLine = {
              line_id : ++Lineid.current,
              points: [startPoint.x, startPoint.y, endShape.x + 50, endShape.y],
              startShapeId: startShape.id,
              startShapeType: startShape.type, // Add shape type
              endShapeId: endShape.id,
              endShapeType: endShape.type, // Add shape type
              startshape_text: startShape.text,
              endshape_text: endShape.text,
              direction: startShape.direction
            };
            setLines((prevLines) => [...prevLines, newLine]);
          } else {
            const newLine = {
              line_id : ++Lineid.current,
              points: [startPoint.x, startPoint.y, endShape.x + 50, endShape.y],
              startShapeId: startShape.id,
              startShapeType: startShape.type, // Add shape type
              endShapeId: endShape.id,
              endShapeType: endShape.type, // Add shape type
              startshape_text: startShape.text,
              endshape_text: endShape.text
            };
            setLines((prevLines) => [...prevLines, newLine]);
          }

        } else if(endShape.type == 'decision'){
          const newLine = {
            line_id : ++Lineid.current,
            points: [startPoint.x, startPoint.y, endShape.x + 20, endShape.y],
            startShapeId: startShape.id,
            startShapeType: startShape.type, // Add shape type
            endShapeId: endShape.id,
            endShapeType: endShape.type, // Add shape type
            startshape_text: startShape.text,
            endshape_text: endShape.text
          };

          setLines((prevLines) => [...prevLines, newLine]);
        } else {
          const newLine = {
            line_id : ++Lineid.current,
            points: [startPoint.x, startPoint.y, endShape.x + 50, endShape.y + 20],
            startShapeId: startShape.id,
            startShapeType: startShape.type, // Add shape type
            endShapeId: endShape.id,
            endShapeType: endShape.type, // Add shape type
          };
          setLines((prevLines) => [...prevLines, newLine]);
        }
       }
      setIsCreatingLine(false);
      setStartPoint(null);
      setEndPoint(null);
      setSelectedShape(null);
      setline4shape(false);
      setLeft_arrow(false);
      setRight_arrow(false);
    } else {
      setIsCreatingLine(false);
      setEndPoint(null);
      setStartPoint(null);
      setSelectedShape(null);
      setline4shape(false);
      setLeft_arrow(false);
      setRight_arrow(false);
    }
  };

  
  

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}
              onMouseDown={handleDoubleClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
        >
          <Layer>
          {startPoint && endPoint && (
                        <Arrow
                          points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
                          stroke="black"
                          strokeWidth={2}
                        />
                      )}
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                  <CircleShape
                    id={0}
                    x={0}
                    y={0}
                    fill="skyblue"
                    handleDrop={handleDrop}
                    sidebar={true}
                    circleOnclick={circleOnclick}
                    setSelectedShape={setSelectedShape}
                    setline4shape={setline4shape}
                  />
                </Grid>
                <Grid item xs={6}>
                  <EditableText
                    x={25}
                    y={270}
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ProcessShape
                    id={0}
                    {... shapeProps}
                    handleDrop={handleDrop}
                    setline4shape={setline4shape}
                    onTransformEnd={handleTransformEnd}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Object
                    x={100}
                    y={170}
                    fill="skyblue"
                    stroke="black"
                    strokeWidth={4}
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DiamondShape
                    id={0}
                    x={125}
                    y={90}
                    fill="skyblue"
                    handleDrop={handleDrop}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CircleWithRing
                    x={0}
                    y={155}
                    handleDrop={handleDrop}
                    sidebar={true}
                    circleOnclick={circleOnclick}
                    setSelectedShape={setSelectedShape}
                    setline4shape={setline4shape}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CancelShape
                    x={50}
                    y={125}
                    radius={25}
                    handleDrop={handleDrop}
                  />
                </Grid>
              </Grid>
            
            
            {circles.map((eachCircle) => (
              <CircleShape
                key={eachCircle.id}
                id={eachCircle.id}
                x={eachCircle.x}
                y={eachCircle.y}
                radius={CircleShape.radius}
                fill={eachCircle.fill}
                sidebar={false}
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachCircle.id, 'start')}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
                line4shape={line4shape}
              />
            ))}
            {processes.map((eachProcess, index) => (
              <ProcessShape
                key={index}
                id={eachProcess.id}
                x={eachProcess.x}
                y={eachProcess.y}
                width={eachProcess.width}
                height={eachProcess.height}
                stroke={"black"}
                fill={eachProcess.fill}
                onTransformEnd={(newAttrs) => handleTransformEnd(eachProcess.id, newAttrs, 'process')}
                updateProcess = {updateProcess}
                isSelected={isSelected}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
              />
            ))}
            {text.map((eachText, index) => (
              <EditableText
              key={index}
              x={eachText.x}
              y={eachText.y}
              handleDrop={() => setR(2)}
              updateText={updateText}
              />
            ))}
            {object.map((eachObjects, index) => (
              <Object
                key={index}
                x={eachObjects.x}
                y={eachObjects.y}
                fill={eachObjects.fill}
                handleDrop={() => setR(2)}
                updateObject={updateObject}
              />
            ))}
            {diamonds.map((eachDia, index) => (
              <DiamondShape 
                key={index}
                id={eachDia.id}
                x={eachDia.x}
                y={eachDia.y}
                fill={eachDia.fill}
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachDia.id, 'decision')}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                startPoint={startPoint}
                setline4shape={setline4shape}
                setLeft_arrow={setLeft_arrow}
                setRight_arrow={setRight_arrow}
                />
              ))}
              {end_shape.map((eachEnd, index) => (
              <CircleWithRing 
                key={index}
                id={eachEnd.id}
                x={eachEnd.x}
                y={eachEnd.y}
                handleDrop={(newX, newY) => handleUpdate(newX, newY, eachEnd.id, 'end')}
                setisSelected={setisSelected}
                startPoint={startPoint}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                setline4shape={setline4shape}
                />
              ))}
          {cancelShapes.map((cancel, index) => (
            <CancelShape
              key={index}
              x={cancel.x}
              y={cancel.y}
              radius={25}
              handleDrop={handleDrop}
            />
          ))}

 {lines.map((line, index) => (
              <Arrow
                key={index}
                points={line.points}
                stroke="black"
                strokeWidth={2} 
               /> 
             ))} 
          </Layer>
        </Stage>
         {/* {console.log(lines)} */}
        {console.log(selectedShape, " selected")}
        {/* {console.log(startShape, " Wazzyo")} */}
        {/* {console.log(processes)} */}
        {/* {console.log("After (immediate): ", shapeProps)} */}
      </div>
      <button className='button' onClick={handleThemesOnClick}>Choose A Theme</button>
      {popupThemesOpen && <Themes onClose={handleThemesClosePopup} onSubmit={handleThemesPopupSubmit} />}
      <button className='button' onClick={handleBisRulesOnClick}>Add Business Rules</button>
      {popupBisRulesOpen && <BusinessRules onClose={handleBisRulesClosePopup} onSubmit={handleBisRulesSubmit} />}
      {/* <button className='button' onClick={handleGenerateJson}>Generate JSON</button> */}
      <button className='button' onClick={CreateWireframe}>Generate Wireframe</button>
    {/* <textarea
      value={jsonOutput}
      readOnly
      rows="10"
      cols="50"
      style={{ marginTop: '20px', width: '100%' }}
    /> */}
    {showError && <Error onClose={handleErrorClose} />}
    </div>

    
  );
  
};

export default Sidebar;