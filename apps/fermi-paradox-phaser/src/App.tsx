import Phaser from "phaser"
import { useEffect } from "react"
import { config } from "./config/gameConfig"
import { useSmartAccountContext } from "./contexts/SmartAccountContext"
import { useWeb3AuthContext } from "./contexts/SocialLoginContext"

function App() {
    const {
        address,
        loading: eoaLoading,
        userInfo,
        connect,
        disconnect,
        getUserInfo,
    } = useWeb3AuthContext()
    const {
        selectedAccount,
        loading: scwLoading,
        setSelectedAccount,
    } = useSmartAccountContext()

    useEffect(() => {
        const game = new Phaser.Game(config)

        // Cleanup and destroy our game if the component unmounts
        return () => {
            game.destroy(true)
        }
    }, [])

    return <div id="game-content" />
}

export default App
