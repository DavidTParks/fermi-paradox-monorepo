import { Room, Client } from "colyseus"
import { Part1State, Player, InputData } from "./Part1State"
import { ArcadePhysics } from "arcade-physics"
import { Body } from "arcade-physics/lib/physics/arcade/Body"

export class Part1Room extends Room<Part1State> {
    fixedTimeStep = 1000 / 60
    physics: ArcadePhysics = null
    bodies: Record<string, Body> = {}

    onCreate(options: any) {
        this.setState(new Part1State())

        // set map dimensions
        this.state.mapWidth = 800
        this.state.mapHeight = 600

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
            height: 600,
            width: 800,
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

        this.physics.world.update(this.fixedTimeStep * 1000, 1000 / 60)

        this.state.players.forEach((player, sessionId) => {
            let input: InputData

            const body = this.bodies[sessionId]

            player.x = body.x
            player.y = body.y

            // dequeue player inputs
            while ((input = player.inputQueue.shift())) {
                if (input.left) {
                    player.x -= velocity
                } else if (input.right) {
                    player.x += velocity
                }

                if (input.up) {
                    player.y -= velocity
                } else if (input.down) {
                    player.y += velocity
                }

                player.tick = input.tick
            }
        })
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!")

        // create player at random position.
        const player = new Player()
        player.x = 300
        player.y = 300

        this.state.players.set(client.sessionId, player)
        this.bodies[client.sessionId] = this.physics.add.body(300, 300, 16, 30)
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!")
        this.state.players.delete(client.sessionId)
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...")
    }
}
