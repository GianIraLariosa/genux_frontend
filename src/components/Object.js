import React, { Component } from "react";
import { Group, Rect, Transformer, Shape } from "react-konva";
import TextAttachment from "./TextAttachment";
import Shapes from "./Shapes";


class Object extends Shapes {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    this.transformerRef = React.createRef();
    this.textAttachmentRef = React.createRef();
    this.state = {
      textX: props.x + 5,
      textY: props.y + 5,
      isSelected: false
    };
  }

  componentDidMount() {
    this.attachTransformer();
  }

  componentDidUpdate() {
    this.attachTransformer();
  }

  attachTransformer() {
    const transformer = this.transformerRef.current;
    const shapeNode = this.shapeRef.current;

    if (transformer && shapeNode) {
      transformer.nodes([shapeNode]);
      transformer.getLayer().batchDraw();
    }
  }

  handleDragMove = () => {
    const node = this.shapeRef.current;
    if (node) {
      const { x, y } = node;
      this.setState({
        textX: x() + 5,
        textY: y() + 5,
      });

      const textAttachment = this.textAttachmentRef.current;
      if (textAttachment && textAttachment.position) {
        textAttachment.position({ x: x() + 5, y: y() + 5 });
      }
    }
  };

  handleDragEnd = () => {
    const node = this.shapeRef.current;
    if (node) {
      const { id, handleDrop, onTransformEnd } = this.props;
      const { x, y, width, height } = node;
      if (id === 0) {
        handleDrop({ x: x(), y: y() }, "object");
        this.setState({
          textX: x() + 5,
          textY: y() + 5,
        });
      } else {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        onTransformEnd({
          x: x(),
          y: y(),
          width: Math.max(5, width() * scaleX),
          height: Math.max(5, height() * scaleY),
        });
      }
    }
  };

  handleTransformEnd = () => {
    const node = this.shapeRef.current;
    if (node) {
      const { x, y } = node;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      this.props.onTransformEnd({
        x: x(),
        y: y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      });

      this.setState({
        textX: x() + 5,
        textY: y() + 5,
      });

      const textAttachment = this.textAttachmentRef.current;
      if (textAttachment && textAttachment.position) {
        textAttachment.position({ x: x() + 5, y: y() + 5 });
      }
    }
  };

  handleOnClick = (e) => {
    e.cancelBubble = true; // prevent bubbling to Group's onClick
    this.setState((prevState) => ({
      isSelected: !prevState.isSelected,
    }));
  };
  
  handleTextAttachmentChange = (newText) => {
    this.setState({ textAttachment: newText });
    this.handleUpdateObject(newText)
  };
  
  handleUpdateObject = (newText) => {
    this.setState({ text: newText }, () => {  
      this.props.updateObject(this.props.id, newText); // Update parent state
    });
  };

  render() {
    const { x, y, width, height, stroke, handleDrop } = this.props;
    const { textX, textY, isSelected } = this.state;
  
    return (
      <Group draggable onDragEnd={(e) => handleDrop(e, "object")} onClick={this.handleOnClick}>
        <Shape
          x={x}
          y={y}
          width={100}
          height={50}
          ref={this.shapeRef}
          sceneFunc={(context, shape) => {
            const width = shape.width();
            const height = shape.height();
            const cornerRadius = 0;
  
            context.beginPath();
            context.moveTo(cornerRadius, 0);
            context.arcTo(width, 0, width, cornerRadius, cornerRadius);
            context.arcTo(width, height, width - cornerRadius, height, cornerRadius);
            context.arcTo(0, height, 0, height - cornerRadius, cornerRadius);
            context.arcTo(0, 0, cornerRadius, 0, cornerRadius);
            context.closePath();
  
            context.fillStrokeShape(shape);
          }}
          fill="skyblue"
          stroke="black"
          strokeWidth={1}
        />
        {isSelected && (
          <Transformer
            ref={this.transformerRef}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              newBox.width = Math.max(5, newBox.width);
              newBox.height = Math.max(5, newBox.height);
              return newBox;
            }}
          />
        )}
        <TextAttachment
          ref={this.textAttachmentRef}
          x={textX}
          y={textY}
          onChange={this.handleTextAttachmentChange}
        />
      </Group>
    );
  }
  
}

export default Object;
