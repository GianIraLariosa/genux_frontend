import React from "react";
import { Circle, Group, Line } from "react-konva";
import Shapes from "./Shapes";

class CancelShape extends Shapes {
  render() {
    const { x, y, handleDrop } = this.props;

    return (
      <Group
        x={x}
        y={y}
        draggable 
        onDragEnd={(e) => handleDrop(e, "cancel")}
      >
        <Circle
          radius={27} 
          stroke="black" 
          strokeWidth={2} 
        />
        <Circle
          radius={25}
        />
        <Line
          x={-(25 * 0.7)}
          y={-(25 * 0.7)}
          points={[0, 0, 25 * 1.4, 25 * 1.4]}
          stroke="black"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
        <Line
          x={-(25 * 0.7)}
          y={25 * 0.7}
          points={[0, 0, 25 * 1.4, -(25 * 1.4)]}
          stroke="black"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Group>
    );
  }
}

export default CancelShape;
