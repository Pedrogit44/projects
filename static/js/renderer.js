class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
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

    drawStar(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 50, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fill();
        
        // Draw glow effect
        const gradient = this.ctx.createRadialGradient(x, y, 50, x, y, 100);
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawShip(ship, isPlayer = false) {
        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);
        this.ctx.rotate(ship.rotation);
        
        // Draw ship triangle
        this.ctx.beginPath();
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(-10, -10);
        this.ctx.lineTo(-10, 10);
        this.ctx.closePath();
        this.ctx.fillStyle = isPlayer ? '#00ff00' : '#ff0000';
        this.ctx.fill();
        
        // Draw engine thrust
        if (ship.thrust > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(-10, 0);
            this.ctx.lineTo(-20 - ship.thrust/10, 0);
            this.ctx.strokeStyle = '#ff6600';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    drawPlanet(planet) {
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#666666';
        this.ctx.fill();
        
        // Draw orbit path
        this.ctx.beginPath();
        this.ctx.arc(0, 0, planet.orbitRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.stroke();
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
            this.ctx.beginPath();
            this.ctx.arc(
                (entity.x + gameState.worldSize) * scale,
                (entity.y + gameState.worldSize) * scale,
                2,
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = entity instanceof Ship ? '#00ff00' : '#ffffff';
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }
}
