import Phaser from "phaser"
import { calculateGameSize } from "../utils/utils"
import { FirstGameScene } from "../scenes/first-scene"
const { width, height } = calculateGameSize()

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: "Sick game",
    parent: "game-content",
    pixelArt: true,
    roundPixels: true,
    scene: [FirstGameScene],
    scale: {
        parent: "game-content",
        mode: Phaser.Scale.RESIZE,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    backgroundColor: "black",
}
