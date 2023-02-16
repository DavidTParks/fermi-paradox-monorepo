import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./globals.css"
import { SmartAccountProvider } from "./contexts/SmartAccountContext"
import { Web3AuthProvider } from "./contexts/SocialLoginContext"
import "@biconomy/web3-auth/dist/src/style.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Web3AuthProvider>
            <SmartAccountProvider>
                <App />
            </SmartAccountProvider>
        </Web3AuthProvider>
    </React.StrictMode>
)
