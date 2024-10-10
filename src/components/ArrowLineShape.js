import React from 'react';
import { Arrow } from 'react-konva';
import Shapes from './Shapes'; // Import the Shapes class

class ArrowLineShape extends Shapes {

  render() {
    const { x, y, handleDrop } = this.props;

    return (
      <Arrow 
        x={x}
        y={y}
        points={[0, 0, 0, 35]}
        pointerLength={10}
        pointerWidth={10}
        fill="black"
        stroke="black"
        strokeWidth={2}
        draggable
        onDragEnd={(e) => handleDrop(e, "arrow")}
      />
    );
  }
}

export default ArrowLineShape;
