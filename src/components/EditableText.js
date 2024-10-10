import React from 'react';
import { Text } from 'react-konva';
import Shapes from './Shapes';

class EditableText extends Shapes {
  constructor(props) {
    super(props);
    this.state = {
      text: "Edit",
      isEditing: false,
    };
  }

  handleDblClick = (e) => {
    const textNode = e.target;
    const stage = textNode.getStage();
    const layer = textNode.getLayer();
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
    textarea.style.height = textNode.height() - textNode.padding() * 2 + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    textarea.style.opacity = 1;
    textarea.focus();

    this.setState({ isEditing: true });

    const removeTextarea = () => {
      this.setState({ isEditing: false });
      document.body.removeChild(textarea);
    };

    const handleUpdateText = () => {
      const newText = textarea.value;
      this.setState({ text: newText }, () => {
        textNode.text(newText);
        layer.draw();
        this.props.updateText(this.props.id, newText); // Update parent state
      });
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleUpdateText();
        removeTextarea();
      }

      if (e.key === 'Escape') {
        removeTextarea();
      }
    };

    const handleBlur = () => {
      handleUpdateText();
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("blur", handleBlur);
  };

  render() {
    const { x, y, handleDrop } = this.props;
    const { text, isEditing } = this.state;

    return (
      <>
        {!isEditing && (
          <Text
            onDragEnd={(e) => handleDrop(e, "text")}
            x={x}
            y={y}
            text={text}
            fontSize={15}
            fill="black"
            draggable
            onDblClick={this.handleDblClick}
          />
        )}
      </>
    );
  }
}

export default EditableText;
