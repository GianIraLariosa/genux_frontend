import React from "react";
import { Shape, Group, Line, Rect, Transformer, Arrow } from "react-konva";
import Shapes from "./Shapes";
import TextAttachment from "./TextAttachment";

class ProcessShape extends Shapes {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    // this.handleRef = React.createRef();
    this.transformerRef = React.createRef();
    this.textAttachmentRef = React.createRef();
    this.state = {
      textX: props.x + 5,
      textY: props.y + 5,
      isSelected: false,
      isHovered: false,
      isDraggable: true,
      line: false,
      isHoveredsmall: false,
      text: ''
    };
  }

  componentDidMount() {
    this.attachTransformer();
    document.addEventListener('keydown', this.handleKeyPress);
}

componentWillUnmount() {
  document.removeEventListener('keydown', this.handleKeyPress);
}

componentDidUpdate(prevProps) {
    this.attachTransformer();

    if (prevProps.selectedShape !== this.props.selectedShape) {
      if (this.props.selectedShape === null) {
        // Handle the case when selectedShape is set to null
        this.setState({ isSelected: false });
      } else {
        // Handle other cases if needed
      }
    }
}

attachTransformer() {
  const transformer = this.transformerRef.current;
  const shapeNode = this.shapeRef.current;

  if (transformer && shapeNode) {
    transformer.nodes([shapeNode]);
    transformer.getLayer().batchDraw();
  }
}


handleDragMove = (e) => {
  const node = this.shapeRef.current;
  if (node) {
    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });

    const textAttachment = this.textAttachmentRef.current;
    if (textAttachment && textAttachment.position) { // Check if position method exists
      textAttachment.position({ x: node.x() + 5, y: node.y() + 5 });
    }
  }

  if(this.props.id != 0){
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      thistext: false,
      text: this.state.text
    });
  }
};

handleDragEnd = (e) => {
  const node = this.shapeRef.current;
  if(this.props.id == 0){
    this.props.handleDrop(e, "process")
    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });
  } else {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      thistext: false,
      text: this.state.text
    });
  }
}

handleTransformEnd = (e) => {
  const node = this.shapeRef.current;
  if (node && this.props.id > 0) {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      thistext: false,
      text: this.state.text
    });

    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });

    const textAttachment = this.textAttachmentRef.current;
    if (textAttachment && textAttachment.position) { // Check if position method exists
      textAttachment.position({ x: node.x() + 5, y: node.y() + 5 });
    }
  }
};

handleOnClick = (e) => {
  if (this.props.id > 0) {
    this.props.setSelectedShape({
      id: this.props.id, 
      x: this.props.x,
      y: this.props.y, 
      text: this.state.text, 
      type: 'process',
      width: this.props.width,
      height: this.props.height
    })
    // console.log(this.props.selectedShape, this.props.id);

    // Schedule the toggle action after ensuring the state is updated
    setTimeout(() => {
      if (this.props.selectedShape && this.props.selectedShape.id === this.props.id) {
        this.setState((prevState) => ({ isSelected: !prevState.isSelected }));
      }
    }, 0);

  } else {
    this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, text: this.state.text, type: 'process'})
    this.props.circleOnclick(e)
  }
};

handleMouseEnter = (e) => {
  this.setState({ isHovered: true });
  if(this.props.startPoint){
    this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, text: this.state.text, type: 'process'})
  }
};

handleMouseLeave = () => {
  if(this.state.line){
    this.setState({ isHovered: false });
  }
  this.setState({ isHovered: false });
};

makeline = (e) => {
  this.setState({ isDraggable: false }); // Disable draggable property
  this.props.setline4shape(true);
  this.setState({ line: true });
}

na_makeline = (e) => {
  this.setState({ isDraggable: true }); // Disable draggable property
  this.props.setline4shape(false);
  this.setState({ line: false });
}

handleText = (text) => {
  this.setState({ text: text });
  this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, text: this.state.text, type: 'process'})
}

handleKeyPress = (event) => {
  if (event.key === 'Enter' && this.props.id > 0) {
    const { x, y } = this.props;
    const { text } = this.state;

    this.props.onTransformEnd({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width, // Assuming width and height are also needed
      height: this.props.height,
      thistext: true,
      text: this.state.text,
    });
  }
};

render() {
  const { x, y, width, height, fill, handleDrop, stroke, id } = this.props;
  const { textX, textY, isSelected } = this.state;

  return (
    <Group>
      <Rect
        ref={this.shapeRef}
        x={x}
        y={y}
        onDragEnd={this.handleDragEnd}
        onDragMove={this.handleDragMove}
        onClick={this.handleOnClick}
        onMouseEnter={this.handleMouseEnter}
        onkeypress
        width={width}
        height={height}
        cornerRadius={10}
        fill="skyblue"
        stroke={stroke}
        draggable={true}
        onTransformEnd={(e) => {
          if(this.props.id > 0){
          const node = this.shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
            this.props.onTransformEnd({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              thistext: false,
              text: this.state.text
            });
          }
        }}
      />
      {isSelected && ( // Conditionally render Transformer if isSelected is true
      <>
        <Transformer
          ref={this.transformerRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(5, newBox.width);
            newBox.height = Math.max(5, newBox.height);
            return newBox;
          }}
        />
        
        <Arrow
              points={[x + width / 2, y + height + 5, x + width / 2, y + height + 15]}
              pointerLength={10}
              pointerWidth={10}
              fill="black"
              stroke="black"
              onMouseEnter={this.makeline}
              onMouseLeave={this.na_makeline}
            />
            </>
       )}
       {id > 0 && (
        <TextAttachment
        ref={this.textAttachmentRef}
        x={textX}
        y={textY}
        width={width}
        height={height}
        id={id}
        handleText={this.handleText}
      />
       )}
    </Group>
  );    
}
}

export default ProcessShape;
