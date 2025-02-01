class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.ui = new UI();
        this.audio = new AudioManager();
        
        this.worldSize = 5000;
        this.player = new Ship(0, 0);
        this.entities = [this.player];
        
        // Initialize solar system
        this.initializeSolarSystem();
        
        // Setup input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop(0);
    }

    initializeSolarSystem() {
        // Add initial planets
        const planets = [
            new Planet(500, 0, 50, "Alpha"),
            new Planet(-800, 300, 70, "Beta"),
            new Planet(0, -1000, 60, "Gamma")
        ];
        this.entities.push(...planets);
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        // Initialize audio on first user interaction
        window.addEventListener('click', () => this.audio.initialize());
    }

    update(deltaTime) {
        // Handle player input
        if (this.keys['ArrowUp']) {
            this.player.thrust = Math.min(this.player.thrust + 100 * deltaTime, this.player.maxThrust);
            this.audio.playThrustSound();
        } else {
            this.player.thrust = Math.max(this.player.thrust - 50 * deltaTime, 0);
        }
        
        if (this.keys['ArrowLeft']) {
            this.player.rotation -= this.player.turnSpeed * deltaTime;
        }
        if (this.keys['ArrowRight']) {
            this.player.rotation += this.player.turnSpeed * deltaTime;
        }
        
        // Update all entities
        this.entities.forEach(entity => entity.update(deltaTime));
        
        // Update UI
        this.ui.updateStats(this.player);
        
        // Check collisions
        this.checkCollisions();
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

    handleCollision(entity1, entity2) {
        if (entity1 instanceof Ship || entity2 instanceof Ship) {
            const ship = entity1 instanceof Ship ? entity1 : entity2;
            ship.health -= 10;
            this.audio.playCollisionSound();
        }
    }

    render() {
        this.renderer.clear();
        
        // Draw star at center
        this.renderer.drawStar(0, 0);
        
        // Draw all entities
        this.entities.forEach(entity => {
            if (entity instanceof Ship) {
                this.renderer.drawShip(entity, entity === this.player);
            } else if (entity instanceof Planet) {
                this.renderer.drawPlanet(entity);
            }
        });
        
        // Draw minimap
        this.renderer.drawMinimap(this, this.player.x, this.player.y);
    }

    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
