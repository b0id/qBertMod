// This file is the main JavaScript entry point for the application.

import { createGrid } from './grid.js';
import { Character } from './character.js';
import { setupNavigation, Navigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing Q*bert navigation");
    
    const canvas = document.getElementById('qbert-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    console.log("Canvas size:", canvas.width, "x", canvas.height);
    
    // Initialize the isometric grid
    console.log("Creating grid...");
    const grid = createGrid(canvas.width, canvas.height);
    
    // Create character
    console.log("Creating Q*bert character...");
    const qbert = new Character('qbert', grid);
    
    // Setup navigation systems
    console.log("Setting up navigation...");
    setupNavigation(qbert);  // For clicking links
    new Navigation(grid, qbert);  // For keyboard controls

    // Game loop with timestamp for smooth animation
    let lastTimestamp = 0;
    function gameLoop(timestamp) {
        // Calculate delta time for smooth animations
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = (timestamp - lastTimestamp) / 1000; // seconds
        lastTimestamp = timestamp;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw the game elements
        qbert.update(deltaTime);
        grid.draw(ctx);
        qbert.draw(ctx);
        
        // Continue the animation loop
        requestAnimationFrame(gameLoop);
    }

    console.log("Starting game loop...");
    requestAnimationFrame(gameLoop);
});