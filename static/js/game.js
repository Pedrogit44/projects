class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.ui = new UI();
        this.audio = new AudioManager();

        this.worldSize = 50000;
        this.player = new Ship(0, 0);
        this.entities = [this.player];

        this.initializeSolarSystem();

        this.keys = {};
        this.setupInputHandlers();

        this.lastTime = 0;
        this.gameLoop(0);
    }

    initializeSolarSystem() {
        const planets = [
            new Planet(1000, 0, 100, "Mercury", 0.15),
            new Planet(-2000, 800, 120, "Venus", 0.12),
            new Planet(3500, -1200, 150, "Earth", 0.1),
            new Planet(-5000, 2000, 130, "Mars", 0.08),
            new Planet(8000, -3000, 250, "Jupiter", 0.05),
            new Planet(-12000, 5000, 220, "Saturn", 0.03),
            new Planet(16000, -6000, 200, "Uranus", 0.02),
            new Planet(-20000, 8000, 190, "Neptune", 0.01)
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

        window.addEventListener('click', () => this.audio.initialize());
    }

    update(deltaTime) {
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.thrust = Math.min(this.player.thrust + 200 * deltaTime, this.player.maxThrust);
            this.audio.playThrustSound();
        } else if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.thrust = Math.max(this.player.thrust - 300 * deltaTime, -this.player.maxThrust / 2);
        } else {
            this.player.thrust = 0;
        }

        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.rotation -= this.player.turnSpeed * deltaTime;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.rotation += this.player.turnSpeed * deltaTime;
        }

        this.entities.forEach(entity => entity.update(deltaTime));

        this.renderer.updateCamera(this.player);

        this.ui.updateStats(this.player);

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
            const other = entity1 instanceof Ship ? entity2 : entity1;

            const relativeSpeed = Math.sqrt(
                Math.pow(ship.velocity.x - other.velocity.x, 2) +
                Math.pow(ship.velocity.y - other.velocity.y, 2)
            );

            const damage = Math.min(50, relativeSpeed / 20);
            ship.health -= damage;
            this.audio.playCollisionSound();
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
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

window.addEventListener('load', () => {
    new Game();
});