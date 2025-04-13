// This file contains the logic for creating and managing the isometric grid layout.

class IsometricGrid {
    constructor(canvasId, cubeSize, levels) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cubeSize = cubeSize;
        this.levels = levels;
        this.grid = [];
        this.initGrid();
    }

    initGrid() {
        for (let level = 0; level < this.levels; level++) {
            this.grid[level] = [];
            for (let row = 0; row <= level; row++) {
                this.grid[level][row] = [];
                for (let col = 0; col <= level - row; col++) {
                    this.grid[level][row][col] = {
                        x: col * this.cubeSize,
                        y: row * this.cubeSize,
                        level: level,
                        occupied: false
                    };
                }
            }
        }
    }

    drawCube(x, y) {
        this.ctx.fillStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + this.cubeSize / 2, y - this.cubeSize / 2);
        this.ctx.lineTo(x + this.cubeSize, y);
        this.ctx.lineTo(x + this.cubeSize / 2, y + this.cubeSize / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawGrid() {
        for (let level = 0; level < this.levels; level++) {
            for (let row = 0; row <= level; row++) {
                for (let col = 0; col <= level - row; col++) {
                    const cube = this.grid[level][row][col];
                    this.drawCube(cube.x + (this.canvas.width / 2 - (this.cubeSize * level) / 2), cube.y + (this.canvas.height - this.cubeSize * level));
                }
            }
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    }
}

export default IsometricGrid;

export function createGrid(width, height) {
    const pyramidLevels = 5; // Number of rows in the pyramid
    const cubeSize = 60;     // Base size of cubes
    const cubeHeight = cubeSize * 0.5; // Visual height of cube sides

    // Calculate positions based on screen size
    const centerX = width / 2;
    const topY = height / 4; // Start pyramid higher up

    // Isometric projection constants
    const isoAngle = Math.PI / 6; // 30 degrees
    const cosAngle = Math.cos(isoAngle);
    const sinAngle = Math.sin(isoAngle);

    // Calculate step distances
    const stepX = cubeSize * cosAngle;
    const stepY = cubeSize * sinAngle;

    // Generate cube positions
    const cubes = [];
    let cubeIdCounter = 1;
    
    for (let row = 0; row < pyramidLevels; row++) {
        for (let col = 0; col <= row; col++) {
            // Calculate isometric coordinates from grid position
            const isoX = (col - row / 2) * stepX * 2;
            const isoY = row * (stepY + cubeHeight / 2);

            const screenX = centerX + isoX;
            const screenY = topY + isoY;

            cubes.push({
                row,        // 0-based row index
                col,        // 0-based col index within row
                id: cubeIdCounter++,
                x: screenX, // Center X on screen
                y: screenY, // Top-center Y on screen
                color: '#ebdc7d', // Default Q*bert yellow
                visited: false,
                url: null
            });
        }
    }

    return {
        cubes,
        cubeSize,
        cubeHeight,
        cosAngle,
        sinAngle,

        draw(ctx) {
            ctx.save();
            // Draw cubes from back to front
            for (const cube of this.cubes) {
                this.drawCube(ctx, cube);
            }
            ctx.restore();
        },

        drawCube(ctx, cube) {
            const { x, y, color, visited } = cube;
            const topColor = visited ? '#ff721c' : color; // Orange when visited
            const leftColor = '#633100'; // Dark brown
            const rightColor = '#8a4500'; // Medium brown

            const halfWidth = this.cubeSize * this.cosAngle;
            const halfHeight = this.cubeSize * this.sinAngle;
            const sideHeight = this.cubeHeight;

            // Draw the cube faces
            // Top face (diamond)
            ctx.beginPath();
            ctx.moveTo(x, y - halfHeight); // Top point
            ctx.lineTo(x + halfWidth, y);   // Right point
            ctx.lineTo(x, y + halfHeight); // Bottom point
            ctx.lineTo(x - halfWidth, y);   // Left point
            ctx.closePath();
            ctx.fillStyle = topColor;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Left face
            ctx.beginPath();
            ctx.moveTo(x - halfWidth, y);
            ctx.lineTo(x, y + halfHeight);
            ctx.lineTo(x, y + halfHeight + sideHeight);
            ctx.lineTo(x - halfWidth, y + sideHeight);
            ctx.closePath();
            ctx.fillStyle = leftColor;
            ctx.fill();
            ctx.stroke();

            // Right face
            ctx.beginPath();
            ctx.moveTo(x + halfWidth, y);
            ctx.lineTo(x, y + halfHeight);
            ctx.lineTo(x, y + halfHeight + sideHeight);
            ctx.lineTo(x + halfWidth, y + sideHeight);
            ctx.closePath();
            ctx.fillStyle = rightColor;
            ctx.fill();
            ctx.stroke();
        },

        getCubeAt(index) {
            return index >= 1 && index <= this.cubes.length ? this.cubes[index - 1] : null;
        },

        findCubeIndex(targetRow, targetCol) {
            const cube = this.cubes.find(c => c.row === targetRow && c.col === targetCol);
            return cube ? cube.id : -1;
        },

        markVisited(index) {
            const cube = this.getCubeAt(index);
            if (cube) {
                cube.visited = true;
            }
        },

        isValidPosition(pos) {
            if (!pos || pos.row < 0 || pos.row >= pyramidLevels) return false;
            if (pos.col < 0 || pos.col > pos.row) return false;
            return this.findCubeIndex(pos.row, pos.col) !== -1;
        }
    };
}