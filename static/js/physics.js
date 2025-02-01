class Physics {
    static calculateVelocity(currentVelocity, acceleration, deltaTime) {
        return currentVelocity + acceleration * deltaTime;
    }

    static calculatePosition(currentPosition, velocity, deltaTime) {
        return currentPosition + velocity * deltaTime;
    }

    static rotateVector(vector, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: vector.x * cos - vector.y * sin,
            y: vector.x * sin + vector.y * cos
        };
    }

    static distance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static checkCollision(obj1, obj2) {
        const distance = this.distance(
            { x: obj1.x, y: obj1.y },
            { x: obj2.x, y: obj2.y }
        );
        return distance < (obj1.radius + obj2.radius);
    }
}
