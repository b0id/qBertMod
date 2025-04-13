// This file manages the navigation logic, including character movement and interactions with the grid.

// Handles clicking on the navigation links
export function setupNavigation(qbert) {
    console.log("Navigation setup working!");
    const navItems = document.querySelectorAll('.site-nav li');

    navItems.forEach(item => {
        const cubeIdAttr = item.getAttribute('data-cube');
        if (!cubeIdAttr) {
            console.warn("Nav item missing data-cube attribute:", item);
            return;
        }
        const cubeId = parseInt(cubeIdAttr);
        const link = item.querySelector('a');
        const url = link ? link.getAttribute('href') : null;

        // Store URL in the grid data
        const cube = qbert.grid.getCubeAt(cubeId);
        if (cube && url) {
            cube.url = url;
        } else if (!cube) {
            console.warn(`Nav link points to non-existent cube ${cubeId}`);
        }

        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate navigation
            if (qbert.moving) return; // Don't do anything if already jumping

            console.log(`Link clicked for cube ${cubeId}`);
            qbert.jumpTo(cubeId); // Tell Q*bert to jump

            // Update active link style immediately
            updateActiveNavLink(cubeId);

            // Wait for jump to finish before navigating
            setTimeout(() => {
                const targetCube = qbert.grid.getCubeAt(qbert.currentCube);
                if (targetCube && targetCube.id === cubeId && targetCube.url) {
                    console.log(`Jump finished, navigating to: ${targetCube.url}`);
                    if (!targetCube.url.startsWith('#')) { // Only navigate for external URLs
                        window.location.href = targetCube.url;
                    } else {
                        console.log("Internal link (#), not navigating.");
                        // Handle internal scroll or state change if needed
                    }
                }
            }, 800); // Adjust based on jump animation duration
        });
    });

    // Initial active link based on Q*bert's start position
    updateActiveNavLink(qbert.currentCube);

    return {
        navigateTo: (cubeId) => {
            if (qbert.moving) return false;
            qbert.jumpTo(cubeId);
            updateActiveNavLink(cubeId);
            return true;
        }
    };
}

// Handles keyboard input for Q*bert movement
export class Navigation {
    constructor(grid, character) {
        this.grid = grid;
        this.character = character;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (this.character.moving) return; // Ignore input while jumping

            const currentCube = this.grid.getCubeAt(this.character.currentCube);
            if (!currentCube) {
                console.error("Cannot move: Current cube not found.");
                return;
            }

            const { row, col } = currentCube;
            let targetCubeIndex = -1;

            // Map keys to Q*bert's isometric movement
            switch (event.key) {
                // Top-Right Jump (Numpad 9 or 'e' or 'PageUp')
                case '9':
                case 'e':
                case 'PageUp':
                    targetCubeIndex = this.grid.findCubeIndex(row - 1, col);
                    break;

                // Top-Left Jump (Numpad 7 or 'q' or 'Home')
                case '7':
                case 'q':
                case 'Home':
                    targetCubeIndex = this.grid.findCubeIndex(row - 1, col - 1);
                    break;

                // Bottom-Left Jump (Numpad 1 or 'z' or 'End')
                case '1':
                case 'z':
                case 'End':
                    targetCubeIndex = this.grid.findCubeIndex(row + 1, col);
                    break;

                // Bottom-Right Jump (Numpad 3 or 'c' or 'PageDown')
                case '3':
                case 'c':
                case 'PageDown':
                    targetCubeIndex = this.grid.findCubeIndex(row + 1, col + 1);
                    break;

                default:
                    return; // Ignore other keys
            }

            if (targetCubeIndex !== -1 && targetCubeIndex !== this.character.currentCube) {
                const targetCube = this.grid.getCubeAt(targetCubeIndex);
                if (targetCube) {
                    console.log(`Key pressed, jumping to cube ${targetCubeIndex}`);
                    this.character.jumpTo(targetCubeIndex);
                    this.playJumpSound();
                    updateActiveNavLink(targetCubeIndex); // Update nav link highlight
                }
            }
        });
    }

    playJumpSound() {
        try {
            const jumpSound = new Audio('assets/sounds/jump.mp3');
            jumpSound.volume = 0.3;
            jumpSound.play().catch(e => console.error('Audio play failed:', e));
        } catch (error) {
            console.error("Failed to create or play jump sound:", error);
        }
    }
}

// Helper function to update the active class on navigation links
function updateActiveNavLink(activeCubeIndex) {
    const navItems = document.querySelectorAll('.site-nav li');
    navItems.forEach(item => {
        const itemCubeId = parseInt(item.getAttribute('data-cube'));
        const link = item.querySelector('a');
        if (link) {
            if (itemCubeId === activeCubeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}