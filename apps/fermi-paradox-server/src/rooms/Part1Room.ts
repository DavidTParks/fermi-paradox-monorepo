import { Room, Client } from "colyseus"
import { Part1State, Player, InputData } from "./Part1State"
import { ArcadePhysics } from "arcade-physics"
import { Body } from "arcade-physics/lib/physics/arcade/Body"
import { Level2, Platform, parseTiled } from "shared"
export class Part1Room extends Room<Part1State> {
    fixedTimeStep = 1000 / 60
    physics: ArcadePhysics = null
    bodies: Record<string, Body> = {}
    platforms: Body[]
    tick: number = 0

    onCreate(options: any) {
        this.setState(new Part1State())

        // set map dimensions
        this.state.mapWidth = 850
        this.state.mapHeight = 865

        this.onMessage(0, (client, input) => {
            // handle player input
            const player = this.state.players.get(client.sessionId)

            // enqueue input to user input buffer.
            player.inputQueue.push(input)
        })

        let elapsedTime = 0

        this.physics = new ArcadePhysics({
            gravity: {
                y: 500,
                x: 0,
            },
            height: 865,
            width: 850,
        })

        const platforms = parseTiled(Level2)

        this.platforms = platforms.map((platform) => {
            const staticPlatform = this.physics.add
                .body(platform.x, platform.y, platform.width, platform.height)
                .setAllowGravity(false)
                .setImmovable(true)
            console.log(staticPlatform.center)
            return staticPlatform
        })

        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime

            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep
                this.fixedTick(this.fixedTimeStep)
            }
        })
    }

    fixedTick(timeStep: number) {
        const velocity = 2

        this.physics.world.update(this.tick * 1000, 1000 / 60)
        this.tick++

        this.state.players.forEach((player, sessionId) => {
            let input: InputData

            const body = this.bodies[sessionId]

            // dequeue player inputs
            while ((input = player.inputQueue.shift())) {
                if (input.left) {
                    body.setVelocityX(-160)
                    // body.x -= velocity
                } else if (input.right) {
                    body.setVelocityX(160)
                    // body.x += velocity
                } else {
                    body.setVelocityX(0)
                }

                player.tick = input.tick
                player.x = body.x
                player.y = body.y
            }
        })
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!")

        // create player at random position.
        const player = new Player()
        player.x = 0
        player.y = 0

        this.state.players.set(client.sessionId, player)
        const playerBody = this.physics.add.body(24, 24, 48, 48)
        playerBody.setCollideWorldBounds(true, undefined, undefined, undefined)

        // const testPlatform = this.physics.add
        //     .body(0, 56, 16, 30)
        //     .setAllowGravity(false)
        //     .setImmovable(true)

        // this.physics.add.collider(playerBody, testPlatform)

        this.platforms.forEach((platformBody) =>
            this.physics.add.collider(playerBody, platformBody)
        )
        this.bodies[client.sessionId] = playerBody
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!")
        this.state.players.delete(client.sessionId)
        this.bodies[client.sessionId].destroy()
        delete this.bodies[client.sessionId]
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...")
    }
}
