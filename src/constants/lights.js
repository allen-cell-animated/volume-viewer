const spotlightSettings = Object.freeze({
    angle: 6 * THREE.Math.DEG2RAD,
    castShadow: false,
    color: 0xffffff,
    intensity: 0.4,
    position: {
        x: -4,
        y: 3.5,
        z: 7
    }
});

const ambientLightSettings = Object.freeze({
    color: 0xffffff,
    intensity: 0.6
});

const reflectedLightSettings = Object.freeze({
    castShadow: false,
    color: 0xFF88AA,
    intensity: 0.2,
    position: {
        x: 1,
        y: -5,
        z: 0
    }
});

const fillLightSettings = Object.freeze({
    castShadow: false,
    color: 0xe8d1a9,
    intensity: 0.15,
    position: {
        x: 2.5,
        y: 0.2,
        z: 1.5
    }
});

export default {
    spotlightSettings,
    ambientLightSettings,
    reflectedLightSettings,
    fillLightSettings
};
