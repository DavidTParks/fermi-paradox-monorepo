import Phaser from "phaser"

class Chunk {
    private scene!: Phaser.Scene
    private x!: number
    private y!: number
    private tiles!: Phaser.GameObjects.Group
    private isLoaded!: boolean
    private chunkSize!: number

    constructor(scene: Phaser.Scene, x: number, y: number, chunkSize: number) {
        this.chunkSize = chunkSize
        this.scene = scene
        this.x = x
        this.y = y
        this.tiles = this.scene.add.group()
        this.isLoaded = false
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true)

            this.isLoaded = false
        }
    }

    load() {
        if (!this.isLoaded) {
            for (let x = 0; x < this.chunkSize; x++) {
                for (let y = 0; y < this.chunkSize; y++) {}
            }
        }
    }
}
