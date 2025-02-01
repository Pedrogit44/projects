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
        this.maxThrust = 200;
        this.turnSpeed = Math.PI;
        this.health = 100;
        this.energy = 100;
        this.inventory = [];
        this.credits = 1000;
    }

    update(deltaTime) {
        const thrustVector = Physics.rotateVector(
            { x: this.thrust, y: 0 },
            this.rotation
        );
        
        this.velocity.x += thrustVector.x * deltaTime;
        this.velocity.y += thrustVector.y * deltaTime;
        
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }
}

class Planet extends Entity {
    constructor(x, y, radius, name) {
        super(x, y, radius);
        this.name = name;
        this.orbitRadius = Math.sqrt(x * x + y * y);
        this.orbitSpeed = 0.1 / this.orbitRadius;
        this.orbitAngle = Math.atan2(y, x);
    }

    update(deltaTime) {
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = Math.sin(this.orbitAngle) * this.orbitRadius;
    }
}
