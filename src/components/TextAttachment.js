import React from 'react';
import { Text } from 'react-konva';
import Shapes from './Shapes';

class TextAttachment extends Shapes {
  constructor(props) {
    super(props);
    this.state = {
      text: "Edit",
      isEditing: false,
    };
    this.textRef = React.createRef();
  }

  handleDblClick = () => {
    const textNode = this.textRef.current;
    const stage = textNode.getStage();
    const layer = textNode.getLayer();  

    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    console.log(textPosition);
    console.log(stageBox);

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
    textarea.style.width = /*textNode.width() - textNode.padding() * 2*/ this.props.width - textNode.padding() * 5 + "px";
    textarea.style.height = /*textNode.height() - textNode.padding() * 2*/this.props.height - textNode.padding() * 10+ "px";
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

    const resizeTextarea = () => {
      textarea.style.height = 'auto';  // Reset height to auto to calculate new height
      textarea.style.width = 'auto';  // Reset width to auto to calculate new width
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.style.width = textarea.scrollWidth + 'px';
    };

    resizeTextarea();

    textarea.addEventListener("input", resizeTextarea);

    this.setState({ isEditing: true });

    const removeTextarea = () => {
      this.setState({ isEditing: false });
      document.body.removeChild(textarea);
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === 'Enter') {
        this.setState({ text: textarea.value }, () => {
          textNode.text(this.state.text);
          layer.draw();
          this.props.handleText(this.state.text);
        });
        removeTextarea();
      }
      if (e.key === 'Escape') {
        removeTextarea();
      }
    });

    textarea.addEventListener("blur", () => {
      this.setState({ text: textarea.value });
      textNode.text(textarea.value);
      this.props.handleText(this.state.text);
      layer.draw();
    });

    // console.log(this.state.text);
  };

  render() {
    const { x, y, width } = this.props;
    const { text, isEditing } = this.state;

    return (
      <>
        {!isEditing && (
          <Text
            ref={this.textRef}
            x={x}
            y={y}
            width={width - 14}
            text={text}
            fontSize={15}
            fill="black"
            // align='center'
            // offsetX={this.textRef.current ? this.textRef.current.width() / 2 : 0}
            // offsetY={this.textRef.current ? this.textRef.current.height() / 2 : 0}
            onDblClick={this.handleDblClick}
          />
        )}
      </>
    );
  }
}

export default TextAttachment;
