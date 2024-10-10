import React from 'react';
import { Arrow, Circle, Group, Rect } from 'react-konva';
import Shapes from './Shapes';

class CircleShape extends Shapes {
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

  handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id, 'start');
    } else {
      this.props.handleDrop(e, "circle");
    }
  };

  handleDragMove = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id, 'start');
    } else {
      // Do something else for the first instance
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedShape !== this.props.selectedShape) {
      if (this.props.selectedShape === null) {
        // Handle the case when selectedShape is set to null
        this.setState({ isSelected: false });
        this.setState({ isDraggable: true });
      } else {
        // Handle other cases if needed
      }
    }
  }

  handleonClick = (e) => {
    if (this.props.id > 0) {
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'start'})

      // Schedule the toggle action after ensuring the state is updated
      setTimeout(() => {
        if (this.props.selectedShape && this.props.selectedShape.id === this.props.id) {
          this.setState((prevState) => ({ isSelected: !prevState.isSelected }));
          this.setState({ isDraggable: false }); // Disable draggable property
          this.props.setline4shape(true);
        }
      }, 0);

    } else {
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill})
      this.props.circleOnclick(e)
    }
  };

  makeline = (e) => {
    this.setState({ isDraggable: false }); // Disable draggable property
    this.props.setline4shape(true);
    this.setState({ line: true });
  }

  na_makeline = (e) => {
    // this.setState({ isDraggable: true }); // Disable draggable property
    this.setState({ line: false });
    this.props.setline4shape(false);  }

  handleMouseEnter = (e) => {
    this.setState({ isHovered: true });
    if(this.props.startPoint){
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'start'})
    }
  };

  smallcircleMouseEnter = (e) => {
    this.setState({ isHovered: true });
  }

  handleMouseLeave = () => {
    if(this.state.line){
      this.setState({ isHovered: false });
    }
    this.setState({ isHovered: false });
  };
  
  render() {
    const { id, x, y, handleDrop, setSelectedShape, circleOnclick, setisSelected, line4shape } = this.props;
    const { isHovered, isDraggable, isSelected, line } = this.state;

    return (
      <Group
        x={x}
        y={y}
        draggable={isDraggable}
        stroke={isSelected ? 'red broken' : 'black'} // Example: Change stroke color if selected
        strokeWidth={1}
        onDragEnd={this.handleDragEnd}
        onDragMove={this.handleDragMove}
        onClick={this.handleonClick} // Set selected shape on mouse down
        onMouseUp={this.na_makeline}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        fill='red'
        dash={[10, 10]}
        dashEnabled
      >
        {isSelected && (
        <Rect
          x={10}
          y={10}
          fill='transparent'
          width={80}
          height={80}
          stroke='lightblue'
          dash={[10, 10]}
          dashEnabled
        />
      )}
        {/* <Circle
          x={100 / 2}
          y={100 / 2}
          radius={45}
          fill='white'
          opacity={0.5}
        /> */}
        <Circle
          x={100 / 2}
          y={100 / 2}
          radius={30}
          fill="skyblue"
          stroke={isSelected ? 'red' : 'black'}
          strokeWidth={1}
        />

        {/* Dot in the middle of the inner circle */}
        {line4shape && isSelected && (
         <Arrow
         x={2}
         y={15}
         points={[100 / 2, 100 / 2 + 30, 100 / 2, 100 / 2 + 60]}
         pointerLength={10}
         pointerWidth={10}
         stroke="skyblue"
         strokeWidth={5}
        //  onMouseEnter={this.makeline}
         onMouseDown={this.na_makeline}
       />
       )}
      </Group>
    );
  }
}

export default CircleShape;
