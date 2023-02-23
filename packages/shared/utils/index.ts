import { ITiled } from "../types"

export type Platform = {
    x: number
    y: number
    width: number
    height: number
}

// Width: 40
// height: 30

// 1,1 pos 42

// Index: 60

export const parseTiled = (data: ITiled) => {
    const tileHeight = data.tileheight
    const tileWidth = data.tilewidth

    const mapHeightTiles = data.height
    const mapWidthTiles = data.width

    const mapHeightPixels = tileHeight * data.height
    const mapWidthPixels = tileWidth * data.width

    let tileCollisionIds: number[] = []

    data.tilesets?.forEach((tileSet) => {
        const { tiles } = tileSet

        tiles?.forEach((tile) => {
            tile.properties?.forEach((property) => {
                if (property.name === "collides" && property.value === true) {
                    tileCollisionIds.push(tile.id)
                }
            })
        })
    })

    let platforms: Platform[] = []

    data.layers?.forEach((tileLayer) => {
        const { data: tileData } = tileLayer

        if (tileData) {
            const twoDimensionalTileLayer = []

            while (tileData.length)
                twoDimensionalTileLayer.push(tileData.splice(0, mapWidthTiles))

            for (let y = 0; y < twoDimensionalTileLayer.length; y++) {
                for (let x = 0; x < twoDimensionalTileLayer[y].length; x++) {
                    const tile = twoDimensionalTileLayer[y][x]

                    if (tileCollisionIds.includes(tile)) {
                        platforms.push({
                            x: (x * tileWidth + 24) * 2,
                            y: (y * tileHeight + 24) * 2,
                            width: 32,
                            height: 32,
                        })
                    }
                }
            }

            // for (let x = 0; x < mapWidthTiles; x++) {
            //     for (let y = 0; y < mapHeightTiles; y++) {

            //         const tile = tileData[x * y]

            //         if (tileCollisionIds.includes(tile)) {
            //             platforms.push({
            //                 x: x * tileHeight,
            //                 y: y * tileHeight,
            //                 width: tileWidth,
            //                 height: tileHeight,
            //             })
            //         }
            //     }
            // }
        }

        // tileData?.forEach((tile, tileIndex) => {
        //     if (tileCollisionIds.includes(tile)) {
        //         const x = tileIndex % mapWidthTiles
        //         const y = tileIndex % mapHeightTiles
        //         console.log("this is a colliding tile", x, y)
        //     }
        // })
    })

    return platforms
}
