import React from 'react';
import { Arrow, Group, Shape } from 'react-konva';
import Shapes from './Shapes';

class DiamondShape extends Shapes {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isDraggable: true,
      line: false,
      isSelected: false,
      isHoveredsmall: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedShape !== this.props.selectedShape) {
      if (this.props.selectedShape === null) {
        // Handle the case when selectedShape is set to null
        this.setState({ isSelected: false });
      } else {
        // Handle other cases if needed
      }
    }
  };

  handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id, 'decision');
    } else {
      this.props.handleDrop(e, "diamondShape");
    }
  };

  handleDragMove = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id, 'decision');
    } else {
      // Do something else for the first instance
    }
  };

  handleonClick = (e) => {
    if (this.props.id > 0) {
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'decision'})

      // Schedule the toggle action after ensuring the state is updated
      setTimeout(() => {
        if (this.props.selectedShape && this.props.selectedShape.id === this.props.id) {
          this.setState((prevState) => ({ isSelected: !prevState.isSelected }));
        }
      }, 0);

    } else {
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill})
      this.props.circleOnclick(e)
    }
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
    if(this.props.startPoint){
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'decision'})
    }
  };

  handleMouseLeave = () => {
    if(this.state.line){
      this.setState({ isHovered: false });
    }
    this.setState({ isHovered: false });
  };

  makeline = (side) => {
    if(side == 'left'){
      this.props.setLeft_arrow(true);
    } else {
      this.props.setRight_arrow(true);
    }
    this.setState({ isDraggable: false }); // Disable draggable property
    this.props.setline4shape(true);
    this.setState({ line: true });
  }

  na_makeline = () => {
    this.setState({ isDraggable: true }); // Disable draggable property
    this.setState({ line: false });
  }

  render() {
    const { id, x, y, handleDrop, setSelectedShape, circleOnclick, setisSelected } = this.props;
    const { isHovered, isDraggable, isSelected } = this.state;

    return (
      <Group
        x={x}
        y={y}
        draggable={isDraggable}
        onDragEnd={this.handleDragEnd}
        onDragMove={this.handleDragMove}
        onClick={this.handleonClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        // onMouseUp={this.na_makeline}
      >
        <Shape
          sceneFunc={(context, shape) => {
            const width = shape.width();
            const height = shape.height();
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            context.beginPath();
            context.moveTo(halfWidth, 0); // Top point
            context.lineTo(width, halfHeight); // Right point
            context.lineTo(halfWidth, height); // Bottom point
            context.lineTo(0, halfHeight); // Left point
            context.closePath();

            context.fillStrokeShape(shape);
          }}
          fill="skyblue"
          stroke={isSelected ? 'red' : 'black'} // Example: Change stroke color if selected
          strokeWidth={1}
          width={40}
          height={40}
        />

        {/* Left Arrow */}
        {isSelected && (
          <Arrow
            points={[0, 20, -20, 20]} // Adjust arrow position and size as needed
            pointerLength={10}
            pointerWidth={10}
            fill="black"
            stroke="black"
            onMouseEnter={(e) => this.makeline(e, 'left')}
            onMouseLeave={this.na_makeline}
          />
         )}

        {/* Right Arrow */}
        {isSelected && (
          <Arrow
            points={[40, 20, 60, 20]} // Adjust arrow position and size as needed
            pointerLength={10}
            pointerWidth={10}
            fill="black"
            stroke="black"
            onMouseEnter={(e) => this.makeline(e, 'right')}
            onMouseLeave={this.na_makeline}
          />
         )}
      </Group>
    );
  }
}

export default DiamondShape;
