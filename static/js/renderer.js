class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        this.camera = { x: 0, y: 0, scale: 1 };
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateCamera(player) {
        // Smoothly follow the player
        const targetX = -player.x * this.camera.scale + this.canvas.width / 2;
        const targetY = -player.y * this.camera.scale + this.canvas.height / 2;

        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
    }

    worldToScreen(x, y) {
        return {
            x: x * this.camera.scale + this.camera.x,
            y: y * this.camera.scale + this.camera.y
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.camera.x) / this.camera.scale,
            y: (screenY - this.camera.y) / this.camera.scale
        };
    }

    drawStar(x, y) {
        const screen = this.worldToScreen(x, y);
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, 100 * this.camera.scale, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fill();

        // Draw glow effect
        const gradient = this.ctx.createRadialGradient(
            screen.x, screen.y, 100 * this.camera.scale,
            screen.x, screen.y, 200 * this.camera.scale
        );
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawShip(ship, isPlayer = false) {
        const screen = this.worldToScreen(ship.x, ship.y);
        this.ctx.save();
        this.ctx.translate(screen.x, screen.y);
        this.ctx.rotate(ship.rotation);
        this.ctx.scale(this.camera.scale, this.camera.scale);

        // Draw ship triangle
        this.ctx.beginPath();
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(-10, -10);
        this.ctx.lineTo(-10, 10);
        this.ctx.closePath();
        this.ctx.fillStyle = isPlayer ? '#00ff00' : '#ff0000';
        this.ctx.fill();

        // Draw engine thrust with intensity based on acceleration
        if (ship.thrust !== 0) {
            const thrustLength = Math.abs(ship.thrust) / ship.maxThrust * 20;
            this.ctx.beginPath();
            this.ctx.moveTo(-10, 0);
            this.ctx.lineTo(-10 - thrustLength, 0);
            this.ctx.strokeStyle = ship.thrust > 0 ? '#ff6600' : '#3366ff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // Draw velocity vector
        if (isPlayer) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(ship.velocity.x * 0.5, ship.velocity.y * 0.5);
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.stroke();

            // Draw acceleration indicator
            if (ship.acceleration !== 0) {
                const accScale = ship.acceleration / ship.maxThrust;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 15, 0, Math.PI * 2 * Math.abs(accScale));
                this.ctx.strokeStyle = accScale > 0 ? 'rgba(255, 102, 0, 0.5)' : 'rgba(51, 102, 255, 0.5)';
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    drawPlanet(planet) {
        const screen = this.worldToScreen(planet.x, planet.y);
        const scaledRadius = planet.radius * this.camera.scale;

        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, scaledRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#666666';
        this.ctx.fill();

        // Draw orbit path
        const centerScreen = this.worldToScreen(0, 0);
        this.ctx.beginPath();
        this.ctx.arc(centerScreen.x, centerScreen.y, planet.orbitRadius * this.camera.scale, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.stroke();

        // Draw planet name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(planet.name, screen.x - 20, screen.y - scaledRadius - 10);
    }

    drawMinimap(gameState, centerX, centerY) {
        const minimapSize = 200;
        const scale = minimapSize / (gameState.worldSize * 2);

        this.ctx.save();
        this.ctx.translate(
            this.canvas.width - minimapSize - 20,
            this.canvas.height - minimapSize - 20
        );

        // Draw minimap background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, minimapSize, minimapSize);

        // Draw entities as dots
        gameState.entities.forEach(entity => {
            const x = (entity.x + gameState.worldSize) * scale;
            const y = (entity.y + gameState.worldSize) * scale;

            this.ctx.beginPath();
            this.ctx.arc(x, y, entity instanceof Planet ? 3 : 2, 0, Math.PI * 2);
            this.ctx.fillStyle = entity instanceof Ship ? '#00ff00' : '#ffffff';
            this.ctx.fill();
        });

        this.ctx.restore();
    }
}