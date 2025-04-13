export class Character {
    constructor(type, grid) {
        this.type = type;
        this.grid = grid;
        this.currentCube = 1; // Start at cube 1 (top)
        this.targetCube = 1;
        this.x = 0;
        this.y = 0;
        this.spriteWidth = 40;
        this.spriteHeight = 40;
        this.moving = false;
        this.jumpSpeed = 5; // Adjust for desired speed
        this.jumpHeight = 80; // Max height during jump
        this.jumpProgress = 0;

        // Try to load sprite if needed
        this.sprite = null;
        if (type === 'qbert') {
            try {
                this.sprite = new Image();
                this.sprite.src = 'assets/images/characters/qbert_sprite.png';
                this.sprite.onerror = () => {
                    console.warn("Q*bert sprite not found, using fallback");
                    this.sprite = null;
                };
            } catch (e) {
                console.error("Failed to create sprite image:", e);
            }
        }

        // Initialize position
        this.updatePositionToCurrentCube();
    }

    updatePositionToCurrentCube() {
        const cube = this.grid.getCubeAt(this.currentCube);
        if (cube) {
            this.x = cube.x;
            this.y = cube.y - this.spriteHeight/2 - this.grid.cubeHeight/4;
        } else {
            console.error(`Cannot find cube ${this.currentCube}`);
            // Default position if cube not found
            this.x = 0;
            this.y = 0;
        }
    }

    jumpTo(targetCubeIndex) {
        if (this.moving || targetCubeIndex === this.currentCube) return;

        const targetCube = this.grid.getCubeAt(targetCubeIndex);
        if (!targetCube) {
            console.warn(`Invalid cube index: ${targetCubeIndex}`);
            return;
        }

        this.targetCube = targetCubeIndex;
        this.moving = true;
        this.jumpProgress = 0;

        // Mark the target cube as visited
        this.grid.markVisited(targetCubeIndex);
    }

    update(deltaTime) {
        if (!this.moving) return;

        const startCube = this.grid.getCubeAt(this.currentCube);
        const targetCube = this.grid.getCubeAt(this.targetCube);

        if (!startCube || !targetCube) {
            this.moving = false;
            return;
        }

        // Update jump progress
        this.jumpProgress += deltaTime * this.jumpSpeed;

        if (this.jumpProgress >= 1) {
            // Jump complete
            this.jumpProgress = 1;
            this.currentCube = this.targetCube;
            this.updatePositionToCurrentCube();
            this.moving = false;
            return;
        }

        // Calculate current position during jump
        const t = this.jumpProgress;
        const startX = startCube.x;
        const startY = startCube.y - this.spriteHeight/2 - this.grid.cubeHeight/4;
        const targetX = targetCube.x;
        const targetY = targetCube.y - this.spriteHeight/2 - this.grid.cubeHeight/4;

        // Linear interpolation for X and base Y
        this.x = startX + (targetX - startX) * t;
        const baseY = startY + (targetY - startY) * t;

        // Add parabolic jump arc
        const jumpOffset = Math.sin(Math.PI * t) * this.jumpHeight;
        this.y = baseY - jumpOffset;
    }

    draw(ctx) {
        if (this.sprite && this.sprite.complete && this.sprite.naturalWidth !== 0) {
            // Draw sprite image if loaded
            ctx.drawImage(
                this.sprite,
                this.x - this.spriteWidth/2,
                this.y,
                this.spriteWidth,
                this.spriteHeight
            );
        } else {
            // Fallback simple Q*bert drawing
            ctx.save();
            
            // Main body (orange circle)
            ctx.fillStyle = '#ff721c'; // Q*bert orange
            ctx.beginPath();
            ctx.arc(this.x, this.y + this.spriteHeight/2, this.spriteWidth/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Simple eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x - 8, this.y + this.spriteHeight/2 - 5, 5, 0, Math.PI * 2);
            ctx.arc(this.x + 8, this.y + this.spriteHeight/2 - 5, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x - 8, this.y + this.spriteHeight/2 - 5, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 8, this.y + this.spriteHeight/2 - 5, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
}