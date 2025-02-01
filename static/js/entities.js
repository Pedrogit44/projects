class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0;
    }
}

class Ship extends Entity {
    constructor(x, y) {
        super(x, y, 20);
        this.thrust = 0;
        this.maxThrust = 500;
        this.turnSpeed = Math.PI * 0.8;
        this.health = 100;
        this.energy = 100;
        this.inventory = [];
        this.credits = 1000;
        this.maxSpeed = 1000;
        this.acceleration = 0;
    }

    update(deltaTime) {
        // Limit deltaTime to prevent large time steps
        deltaTime = Math.min(deltaTime, 0.1);

        // Get direction vector from rotation
        const direction = {
            x: Math.cos(this.rotation),
            y: Math.sin(this.rotation)
        };

        // Simple acceleration based on thrust
        if (this.thrust > 0) {
            // Accelerate
            this.velocity.x += direction.x * this.thrust * deltaTime;
            this.velocity.y += direction.y * this.thrust * deltaTime;
        } else if (this.thrust < 0) {
            // Brake
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > 0) {
                const scale = Math.max(0, 1 + this.thrust * deltaTime / speed);
                this.velocity.x *= scale;
                this.velocity.y *= scale;
            }
        }

        // Cap maximum speed
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }

        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }

    getSpeed() {
        return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    }
}

class Planet extends Entity {
    constructor(x, y, radius, name, orbitSpeed = 0.1) {
        super(x, y, radius);
        this.name = name;
        this.orbitRadius = Math.sqrt(x * x + y * y);
        this.orbitSpeed = orbitSpeed * 2; // Increased orbit speed
        this.orbitAngle = Math.atan2(y, x);
        this.resources = {
            minerals: Math.random() * 100,
            metals: Math.random() * 100,
            fuel: Math.random() * 100
        };
    }

    update(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.1);
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = Math.sin(this.orbitAngle) * this.orbitRadius;
    }
}