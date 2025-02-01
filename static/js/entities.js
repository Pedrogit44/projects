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
        this.maxSpeed = 2000;
        this.inertialDampening = 0.2;
        this.acceleration = 0;
        this.maxAcceleration = 1000;
    }

    update(deltaTime) {
        const thrustVector = Physics.rotateVector(
            { x: this.thrust, y: 0 },
            this.rotation
        );

        if (this.thrust > 0) {
            this.acceleration = Math.min(this.acceleration + this.maxAcceleration * deltaTime, this.maxThrust);
        } else if (this.thrust < 0) {
            this.acceleration = Math.max(this.acceleration - this.maxAcceleration * deltaTime, -this.maxThrust / 2);
        } else {
            this.acceleration *= 0.98;
        }

        const targetVelocityX = thrustVector.x * this.acceleration / this.maxThrust;
        const targetVelocityY = thrustVector.y * this.acceleration / this.maxThrust;

        this.velocity.x += (targetVelocityX - this.velocity.x) * this.inertialDampening * deltaTime;
        this.velocity.y += (targetVelocityY - this.velocity.y) * this.inertialDampening * deltaTime;

        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }

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
        this.orbitSpeed = orbitSpeed / this.orbitRadius;
        this.orbitAngle = Math.atan2(y, x);
        this.resources = {
            minerals: Math.random() * 100,
            metals: Math.random() * 100,
            fuel: Math.random() * 100
        };
    }

    update(deltaTime) {
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = Math.sin(this.orbitAngle) * this.orbitRadius;
    }
}