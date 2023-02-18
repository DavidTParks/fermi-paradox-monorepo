import Phaser from "phaser"

/**
 * FirstGameScene is an example Phaser Scene
 * @class
 * @constructor
 * @public
 */

type WASD = any

export class ForestScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: WASD

    private backgrounds: {
        ratioX: number
        sprite: Phaser.GameObjects.TileSprite
    }[] = []

    private velocityX = 10

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    constructor() {
        super("FirstGameScene")
        console.log("FirstGameScene.constructor()")
    }

    preload() {
        console.log("FirstGameScene.preload")

        this.load.image("bg", "assets/background/forest/bg.png")
        this.load.image("bg1", "assets/background/forest/bg1.png")
        this.load.image("bg2", "assets/background/forest/bg2.png")
        this.load.image("bg3", "assets/background/forest/bg3.png")
        this.load.image("bg4", "assets/background/forest/bg4.png")

        this.load.image("tiles", "assets/tiles/ancient-caves/green-1.png")
        this.load.tilemapTiledJSON(
            "tilemap",
            "assets/maps/fermi-paradox-level-1/level-1.json"
        )

        this.load.spritesheet("player", "assets/gunslinger.png", {
            frameWidth: 48,
            frameHeight: 48,
        })
    }

    create() {
        console.log("FirstGameScene.create")

        const { width } = this.scale

        const height = 384

        const map = this.make.tilemap({ key: "tilemap" })

        this.backgrounds.push({
            ratioX: 0,
            sprite: this.add
                .tileSprite(0, 0, width, height, "bg")
                .setOrigin(0, 0)
                .setScrollFactor(0, 0)
                .setScale(0, 1.5)
                .setPosition(0, 300),
        })

        // this.add.image(0, 0, 'middle').setOrigin(0, 0)
        this.backgrounds.push({
            ratioX: 0.1,
            sprite: this.add
                .tileSprite(0, 0, width, height, "bg1")
                .setOrigin(0, 0)
                .setScrollFactor(0, 0)
                .setPosition(0, 200),
        })

        // this.add.image(0, 0, 'foreground').setOrigin(0, 0)
        this.backgrounds.push({
            ratioX: 0.2,
            sprite: this.add
                .tileSprite(0, 0, width, height, "bg2")
                .setOrigin(0, 0)
                .setScrollFactor(0, 0)
                .setPosition(0, 200),
        })

        // this.add.image(0, 0, 'ground1').setOrigin(0, 0)
        this.backgrounds.push({
            ratioX: 0.3,
            sprite: this.add
                .tileSprite(0, 0, width, height, "bg3")
                .setOrigin(0, 0)
                .setScrollFactor(0, 0)
                .setPosition(0, 200),
        })

        this.physics.world.fixedStep = false

        this.backgrounds.push({
            ratioX: 0.8,
            sprite: this.add
                .tileSprite(0, 0, width, height, "bg4")
                .setOrigin(0, 0)
                .setScrollFactor(0, 0)
                .setPosition(0, 200),
        })

        // add the tileset image we are using
        const tileset = map.addTilesetImage("green-1", "tiles")

        // create the layers we want in the right order
        const underground = map.createLayer("underground", tileset)

        underground.setScale(2)

        // "Ground" layer will be on top of "Background" layer
        const tree = map.createLayer("tree", tileset)
        const grass = map.createLayer("grass", tileset)
        tree.setScale(2)
        grass.setScale(2)

        map.setCollisionByProperty({ collides: true })

        const debugGraphics = this.add.graphics().setAlpha(0.75)
        // map.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        // })

        this.player = this.physics.add
            .sprite(300, 445, "player")
            .setOrigin(0, 0)
        this.physics.add.collider(this.player, underground)
        this.physics.add.collider(this.player, grass)
        this.player.body.setSize(16, 30)
        this.player.body.setOffset(16, 20)
        this.player.setScale(2)

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
        for (let i = 0; i < this.backgrounds.length; ++i) {
            const bg = this.backgrounds[i]

            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX
            bg.sprite.setPosition(0, -this.cameras.main.scrollY + 160)
        }
    }
}
