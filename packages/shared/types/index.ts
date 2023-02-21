export interface ITiled {
    compressionlevel: number
    height: number
    infinite: boolean
    layers?: LayersEntity[] | null
    nextlayerid: number
    nextobjectid: number
    orientation: string
    renderorder: string
    tiledversion: string
    tileheight: number
    tilesets?: TilesetsEntity[] | null
    tilewidth: number
    type: string
    version: string
    width: number
}
export interface LayersEntity {
    data?: number[] | null
    height: number
    id: number
    name: string
    opacity: number
    type: string
    visible: boolean
    width: number
    x: number
    y: number
}
export interface TilesetsEntity {
    columns: number
    firstgid: number
    image: string
    imageheight: number
    imagewidth: number
    margin: number
    name: string
    spacing: number
    tilecount: number
    tileheight: number
    tiles?: TilesEntity[] | null
    tilewidth: number
}
export interface TilesEntity {
    id: number
    properties?: PropertiesEntity[] | null
}
export interface PropertiesEntity {
    name: string
    type: string
    value: boolean
}
