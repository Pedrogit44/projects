class UI {
    constructor() {
        this.credits = document.getElementById('credits');
        this.hull = document.getElementById('hull');
        this.energy = document.getElementById('energy');
        this.inventory = document.getElementById('inventory');
        this.createControlsDisplay();
    }

    createControlsDisplay() {
        const controls = document.createElement('div');
        controls.id = 'controls';
        controls.className = 'controls-overlay';
        controls.innerHTML = `
            <div class="controls-info">
                <h4>Controls:</h4>
                <p>Click: Set direction</p>
                <p>↑/W: Accelerate</p>
                <p>↓/S: Decelerate</p>
                <p>A/D: Manual rotation</p>
                <p>Mouse Wheel: Zoom in/out</p>
                <p>I: Toggle inventory</p>
            </div>
        `;
        document.querySelector('.game-container').appendChild(controls);
    }

    updateStats(player) {
        this.credits.textContent = player.credits;
        this.hull.textContent = Math.round(player.health);
        this.energy.textContent = Math.round(player.energy);
    }

    updateControls(player) {
        // Update dynamic control information with acceleration
        const speed = Math.round(player.getSpeed());
        const acceleration = Math.round(player.acceleration);
        document.querySelector('#stats').innerHTML = `
            <div>Credits: <span id="credits">${player.credits}</span></div>
            <div>Hull: <span id="hull">${Math.round(player.health)}</span>%</div>
            <div>Energy: <span id="energy">${Math.round(player.energy)}</span>%</div>
            <div>Speed: <span id="speed">${speed}</span></div>
            <div>Acceleration: <span id="acceleration">${acceleration}</span></div>
        `;
    }

    toggleInventory() {
        this.inventory.classList.toggle('d-none');
    }

    updateInventory(items) {
        const container = document.getElementById('inventory-items');
        container.innerHTML = '';

        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `${item.name} x${item.quantity}`;
            container.appendChild(div);
        });
    }
}