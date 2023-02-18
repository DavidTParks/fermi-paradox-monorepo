import Phaser from "phaser"
import { ForestScene } from "../scenes/forest-scene"

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: "Sick game",
    pixelArt: true,
    roundPixels: true,
    scene: [ForestScene],
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 400,
            },
            debug: true,
        },
    },
    backgroundColor: "#bddfda",
}
