import Phaser from "phaser"
import { calculateGameSize } from "../utils/utils"
import { FirstGameScene } from "../scenes/first-scene"
import { ForestScene } from "../scenes/forest-scene"
const { width, height } = calculateGameSize()

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: "Sick game",
    pixelArt: true,
    roundPixels: true,
    scene: [ForestScene],
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 1000,
            },
            debug: true,
        },
    },
    backgroundColor: "#bddfda",
}
