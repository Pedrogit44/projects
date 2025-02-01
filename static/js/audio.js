class AudioManager {
    constructor() {
        this.synth = new Tone.Synth().toDestination();
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            await Tone.start();
            this.initialized = true;
        }
    }

    playThrustSound() {
        if (!this.initialized) return;
        this.synth.triggerAttackRelease('C2', '0.1');
    }

    playCollisionSound() {
        if (!this.initialized) return;
        this.synth.triggerAttackRelease('G1', '0.2');
    }

    playWeaponSound() {
        if (!this.initialized) return;
        this.synth.triggerAttackRelease('E4', '0.1');
    }
}
