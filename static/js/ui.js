class UI {
    constructor() {
        this.credits = document.getElementById('credits');
        this.hull = document.getElementById('hull');
        this.energy = document.getElementById('energy');
        this.inventory = document.getElementById('inventory');
    }

    updateStats(player) {
        this.credits.textContent = player.credits;
        this.hull.textContent = Math.round(player.health);
        this.energy.textContent = Math.round(player.energy);
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
