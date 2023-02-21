import Phaser from "phaser"
import { Client, Room } from "colyseus.js"
import { BACKEND_URL } from "../backend"
import { Level2, Platform, parseTiled } from "shared"
/**
 * FirstGameScene is an example Phaser Scene
 * @class
 * @constructor
 * @public
 */

type WASD = any

export class ForestScene extends Phaser.Scene {
    room: Room
    playerEntities: {
        [sessionId: string]: Phaser.Physics.Arcade.Sprite
    } = {}

    currentPlayer: Phaser.Physics.Arcade.Sprite
    remoteRef: Phaser.GameObjects.Rectangle

    localRef: Phaser.GameObjects.Rectangle

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys

    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: WASD
    private spacebar!: Phaser.Input.Keyboard.Key

    private backgrounds: {
        ratioX: number
        sprite: Phaser.GameObjects.TileSprite
    }[] = []

    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
        tick: undefined,
    }

    elapsedTime = 0
    fixedTimeStep = 1000 / 60

    currentTick: number = 0

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
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
        this.load.tilemapTiledJSON("tilemap", Level2)

        this.load.spritesheet(
            "player",
            "assets/sprites/gunslinger/gunslinger.png",
            {
                frameWidth: 48,
                frameHeight: 48,
            }
        )
    }

    async create() {
        console.log("FirstGameScene.create")

        this.cursorKeys = this.input.keyboard.createCursorKeys()

        await this.connect()

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
        const underground = map.createLayer("ground", tileset)

        const accents = map.createLayer("accents", tileset)
        const grass = map.createLayer("grass", tileset)

        map.setCollisionByProperty({ collides: true })

        const debugGraphics = this.add.graphics().setAlpha(0.75)
        map.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        })

        this.room.state.players.onAdd((player, sessionId) => {
            const entity = this.physics.add.sprite(player.x, player.y, "player")
            this.physics.add.collider(entity, underground)
            this.physics.add.collider(entity, grass)
            this.playerEntities[sessionId] = entity

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = entity
                this.cameras.main.startFollow(entity, true)

                this.localRef = this.add.rectangle(
                    player.x,
                    player.y,
                    entity.width,
                    entity.height
                )
                this.localRef.setStrokeStyle(1, 0x00ff00)

                this.remoteRef = this.add.rectangle(
                    player.x,
                    player.y,
                    entity.width,
                    entity.height
                )
                this.remoteRef.setStrokeStyle(1, 0xff0000)

                player.onChange(() => {
                    this.remoteRef.x = player.x
                    this.remoteRef.y = player.y
                })
            } else {
                // listening for server updates
                player.onChange(() => {
                    //
                    // we're going to LERP the positions during the render loop.
                    //
                    entity.setData("serverX", player.x)
                    entity.setData("serverY", player.y)
                })
            }
        })

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId]
            if (entity) {
                entity.destroy()
                delete this.playerEntities[sessionId]
            }
        })

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

    async connect() {
        // add connection status text

        const client = new Client("ws://localhost:2567")

        try {
            this.room = await client.joinOrCreate("part1_room", {})

            // connection successful!
        } catch (e) {
            // couldn't connect
        }
    }

    update(time: number, delta: number): void {
        // skip loop if not connected yet.
        if (!this.currentPlayer) {
            return
        }

        this.elapsedTime += delta
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep
            this.fixedTick(time, this.fixedTimeStep)
        }

        for (let i = 0; i < this.backgrounds.length; ++i) {
            const bg = this.backgrounds[i]

            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX
            bg.sprite.setPosition(0, -this.cameras.main.scrollY + 160)
        }
    }

    fixedTick(time, delta) {
        this.currentTick++

        const velocity = 2
        this.inputPayload.left = this.cursors.left.isDown
        this.inputPayload.right = this.cursors.right.isDown
        this.inputPayload.down = this.cursors.down.isDown

        this.inputPayload.tick = this.currentTick
        this.room.send(0, this.inputPayload)

        if (this.inputPayload.left) {
            this.currentPlayer.setVelocityX(-160)
            // this.currentPlayer.x -= velocity
            this.currentPlayer.flipX = true
            this.currentPlayer.anims.play("left", true)
        } else if (this.inputPayload.right) {
            this.currentPlayer.setVelocityX(160)
            this.currentPlayer.flipX = false
            this.currentPlayer.anims.play("right", true)
        } else if (this.inputPayload.down) {
            this.currentPlayer.setVelocityY(160)
        } else {
            this.currentPlayer.setVelocityX(0)
        }

        // if (this.inputPayload.up) {
        //     this.currentPlayer.y -= velocity
        // } else if (this.inputPayload.down) {
        //     this.currentPlayer.y += velocity
        // }

        this.localRef.x = this.currentPlayer.x
        this.localRef.y = this.currentPlayer.y

        for (let sessionId in this.playerEntities) {
            // interpolate all player entities
            // (except the current player)
            if (sessionId === this.room.sessionId) {
                continue
            }

            const entity = this.playerEntities[sessionId]
            const { serverX, serverY } = entity.data.values

            if (serverX > entity.x) {
                entity.flipX = false
                entity.anims.play("right", true)
            } else if (serverX < entity.x) {
                entity.flipX = true
                entity.anims.play("left", true)
            }
            entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2)
            entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2)
        }
    }
}
