

declare const mapfeatures = ['bg', 'road', 'building', 'point'] as const

declare interface THEAMAPSTATETYPE {
    theAmapLoader: any,
    AmapInstance: any,
    mapSetCenter: (lnglat: [number, number], immediately: boolean, duration?: number) => void,
}