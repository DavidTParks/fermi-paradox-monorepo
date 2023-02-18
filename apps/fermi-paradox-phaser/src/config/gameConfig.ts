import Phaser from "phaser"
import { ForestScene } from "../scenes/forest-scene"

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: "Sick game",
    pixelArt: true,
    roundPixels: true,
    scene: [ForestScene],
    fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: false,
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 100,
            },
        },
    },
    backgroundColor: "#bddfda",
}
