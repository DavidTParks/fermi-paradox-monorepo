import Phaser from "phaser"
import { useEffect } from "react"
import { config } from "./config/gameConfig"

function App() {
    useEffect(() => {
        const game = new Phaser.Game(config)

        // Cleanup and destroy our game if the component unmounts
        return () => {
            game.destroy(true)
        }
    }, [])

    return (
        <div className="App">
            <div id="game-content">
                {/* this is where the game canvas will be rendered */}
            </div>
        </div>
    )
}

export default App
