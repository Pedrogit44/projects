class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.ui = new UI();
        this.audio = new AudioManager();

        this.worldSize = 50000;
        this.player = new Ship(0, 0);
        this.entities = [this.player];
        this.targetDirection = null;

        this.initializeSolarSystem();

        this.keys = {};
        this.setupInputHandlers();

        this.lastTime = 0;
        this.frameCount = 0;
        this.lastDebugTime = 0;
        this.gameLoop(0);
    }

    initializeSolarSystem() {
        const planets = [
            new Planet(1000, 0, 100, "Mercury", 0.5),
            new Planet(-2000, 800, 120, "Venus", 0.4),
            new Planet(3500, -1200, 150, "Earth", 0.3),
            new Planet(-5000, 2000, 130, "Mars", 0.25),
            new Planet(8000, -3000, 250, "Jupiter", 0.2),
            new Planet(-12000, 5000, 220, "Saturn", 0.15),
            new Planet(16000, -6000, 200, "Uranus", 0.1),
            new Planet(-20000, 8000, 190, "Neptune", 0.08)
        ];
        this.entities.push(...planets);
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'i') {
                this.ui.toggleInventory();
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Mouse click handler for direction setting
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;

            const worldCoords = this.renderer.screenToWorld(screenX, screenY);

            // Calculate angle to target
            const dx = worldCoords.x - this.player.x;
            const dy = worldCoords.y - this.player.y;
            this.player.rotation = Math.atan2(dy, dx);
        });

        // Smooth zoom with mouse wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
            this.renderer.camera.scale *= zoomFactor;
            this.renderer.camera.scale = Math.max(0.1, Math.min(5, this.renderer.camera.scale));
        });

        window.addEventListener('click', () => {
            try {
                this.audio.initialize();
            } catch (e) {
                console.error("Failed to initialize audio", e)
            }
        });
    }

    update(deltaTime) {
        // Forward/backward thrust with arrow keys or WASD
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.thrust = this.player.maxThrust;
            try {
                this.audio.playThrustSound();
            } catch (e) {
                console.log('Audio not ready');
            }
        } else if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.thrust = -this.player.maxThrust / 2;
        } else {
            this.player.thrust = 0;
        }

        // Manual rotation override with A/D keys
        if (this.keys['a']) {
            this.player.rotation -= this.player.turnSpeed * deltaTime;
        }
        if (this.keys['d']) {
            this.player.rotation += this.player.turnSpeed * deltaTime;
        }

        this.entities.forEach(entity => entity.update(deltaTime));
        this.renderer.updateCamera(this.player);
        this.ui.updateControls(this.player);
        this.checkCollisions();

        // Debug logging
        console.log(`Speed: ${this.player.getSpeed().toFixed(2)}, Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`);
    }

    handleCollision(entity1, entity2) {
        if (entity1 instanceof Ship || entity2 instanceof Ship) {
            // ... existing code ...
            try {
                this.audio.playCollisionSound();
            } catch (e) {
                console.log('Audio not ready');
            }
        }
    }

    checkCollisions() {
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                if (Physics.checkCollision(this.entities[i], this.entities[j])) {
                    this.handleCollision(this.entities[i], this.entities[j]);
                }
            }
        }
    }

    render() {
        this.renderer.clear();
        this.renderer.drawStar(0, 0);

        this.entities.forEach(entity => {
            if (entity instanceof Ship) {
                this.renderer.drawShip(entity, entity === this.player);
            } else if (entity instanceof Planet) {
                this.renderer.drawPlanet(entity);
            }
        });

        this.renderer.drawMinimap(this, this.player.x, this.player.y);
    }

    gameLoop(currentTime) {
        const rawDeltaTime = (currentTime - this.lastTime) / 1000;
        const deltaTime = Math.max(0, Math.min(rawDeltaTime, 0.1)); // Ensure non-negative
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

window.addEventListener('load', () => {
    new Game();
});