import Phaser from "phaser"

/**
 * FirstGameScene is an example Phaser Scene
 * @class
 * @constructor
 * @public
 */

type WASD = any

export class FirstGameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: WASD

    constructor() {
        super("FirstGameScene")
        console.log("FirstGameScene.constructor()")
    }

    preload() {
        console.log("FirstGameScene.preload")

        this.load.image("tiles", "assets/tiles/tileset-terrain.png")
        this.load.tilemapTiledJSON("tilemap", "assets/maps/dungeon-02.json")

        this.load.spritesheet("player", "assets/gunslinger.png", {
            frameWidth: 48,
            frameHeight: 48,
        })
    }

    create() {
        console.log("FirstGameScene.create")

        const map = this.make.tilemap({ key: "tilemap" })

        // add the tileset image we are using
        const tileset = map.addTilesetImage("tileset-terrain", "tiles")

        // create the layers we want in the right order
        map.createLayer("ground", tileset)

        // "Ground" layer will be on top of "Background" layer
        const walls = map.createLayer("walls", tileset)

        map.setCollisionByProperty({ collides: true })

        const debugGraphics = this.add.graphics().setAlpha(0.75)
        map.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        })

        this.player = this.physics.add
            .sprite(128, 128, "player")
            .setOrigin(0, 0)
        this.physics.add.collider(this.player, walls)
        this.player.body.setSize(16, 30)
        this.player.body.setOffset(16, 20)
        this.player.setScale(2)
        this.add.text(50, 10, "Right size: single sprite/frame shown")

        this.cameras.main.setSize(window.innerWidth, window.innerHeight)
        this.cameras.main.startFollow(this.player, true)

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 9,
                end: 16,
            }),
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 9 }],
            frameRate: 8,
        })

        this.anims.create({
            key: "idle",
            frames: [{ key: "player", frame: 0 }],
            frameRate: 1,
        })

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 16,
                end: 9,
            }),
            frameRate: 8,
            repeat: -1,
        })

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    update() {
        this.player.setVelocity(0)
        // Up, down, left, right
        const goingRight = this.wasd.right.isDown || this.cursors.right.isDown
        const goingLeft = this.wasd.left.isDown || this.cursors.left.isDown
        const goingUp = this.wasd.up.isDown || this.cursors.up.isDown
        const goingDown = this.wasd.down.isDown || this.cursors.down.isDown

        // Combination directions

        if (goingRight) {
            this.player.flipX = false
            this.player.setVelocityX(160)
            this.player.anims.play("right", true)
        } else if (goingLeft) {
            this.player.flipX = true
            this.player.setVelocityX(-160)
            this.player.anims.play("left", true)
        }

        if (goingDown) {
            this.player.setVelocityY(160)
        } else if (goingUp) {
            this.player.setVelocityY(-160)
        }

        if (!goingRight && !goingLeft && !goingDown && !goingUp) {
            this.player.anims.play("idle", true)
        }

        // if (this.cursors.left.isDown) {
        //     this.player.setVelocityX(-160)

        //     this.player.anims.play("left", true)
        // } else if (this.cursors.right.isDown) {
        //     this.player.setVelocityX(160)

        //     this.player.anims.play("right", true)
        // } else {
        //     this.player.setVelocityX(0)

        //     this.player.anims.play("turn")
        // }

        // if (this.cursors.up.isDown && this.player.body.touching.down) {
        //     this.player.setVelocityY(-330)
        // }
    }
}
