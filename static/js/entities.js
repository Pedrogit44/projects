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
        // Ensure deltaTime is within reasonable bounds
        deltaTime = Math.min(deltaTime, 0.1);

        // Calculate thrust vector based on current rotation
        const thrustVector = Physics.rotateVector(
            { x: 1, y: 0 },
            this.rotation
        );

        // Update acceleration based on thrust
        if (this.thrust !== 0) {
            const targetAcceleration = this.thrust > 0 ? this.maxAcceleration : -this.maxAcceleration / 2;
            this.acceleration += (targetAcceleration - this.acceleration) * Math.min(deltaTime * 2, 1);
        } else {
            this.acceleration *= Math.max(0, 1 - deltaTime * 3);
        }

        // Clamp acceleration
        this.acceleration = Math.max(-this.maxAcceleration/2, Math.min(this.maxAcceleration, this.acceleration));

        // Apply acceleration to velocity
        const accelerationX = thrustVector.x * this.acceleration * deltaTime;
        const accelerationY = thrustVector.y * this.acceleration * deltaTime;

        this.velocity.x += accelerationX;
        this.velocity.y += accelerationY;

        // Apply inertial dampening
        if (Math.abs(this.thrust) < 0.1) {
            this.velocity.x *= (1 - this.inertialDampening * deltaTime);
            this.velocity.y *= (1 - this.inertialDampening * deltaTime);
        }

        // Cap maximum speed
        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }

        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Prevent NaN values
        if (isNaN(this.x) || isNaN(this.y)) {
            this.x = 0;
            this.y = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.acceleration = 0;
            console.error("Position reset due to NaN values");
        }
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
        deltaTime = Math.min(deltaTime, 0.1);
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = Math.sin(this.orbitAngle) * this.orbitRadius;
    }
}