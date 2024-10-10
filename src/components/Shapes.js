import React, { Component, useState } from 'react';

class Shapes extends Component {
    static processes = [];

    static addProcess(newProcess) {
        Shapes.processes.push(newProcess);
    }

    static isWithin(shapeType, shapeX, shapeY, shapeRadius, x, y) {
        const distanceCircle = Math.sqrt(Math.pow(x - shapeX, 2) + Math.pow(y - shapeY, 2));
        let shapeWidth, shapeHeight;

        switch (shapeType) {
            case 'rectangle':
                shapeWidth = 100; // Define the width of the rectangle
                shapeHeight = 50; // Define the height of the rectangle
                break;
            case 'diamond':
                shapeWidth = 40; // Define the width of the diamond
                shapeHeight = 40; // Define the height of the diamond
                break;
            default:
                break;
        }
        //const distanceRec = Math.sqrt(Math.pow(x - shapeX, 2) + Math.pow(y - shapeY, 2));
        // Depending on the shape type, calculate if the point (x, y) is within the shape's area
        switch (shapeType) {
            case 'circle':
                // Calculate the distance between the center of the circle and the point (x, y)
                // If the distance is less than or equal to the radius, the point is within the circle
                return distanceCircle <= shapeRadius;
            case 'rectangle':
                return x >= shapeX && x <= shapeX + shapeWidth && y >= shapeY && y <= shapeY + shapeHeight;
            case 'diamond':
                // Check if the point (x, y) falls within the diamond's bounds
                const halfWidth = shapeWidth / 2;
                const halfHeight = shapeHeight / 2;
                return (x - shapeX) / halfWidth + (y - shapeY) / halfHeight <= 1 &&
                        (x - shapeX) / halfWidth - (y - shapeY) / halfHeight >= -1 &&
                        (y - shapeY) / halfHeight - (x - shapeX) / halfWidth <= 1 &&
                        (y - shapeY) / halfHeight + (x - shapeX) / halfWidth >= -1;
            default:
                return false;
        }
    }

    render() {
        return null; // You can render shapes here if needed
    }

}

export default Shapes;