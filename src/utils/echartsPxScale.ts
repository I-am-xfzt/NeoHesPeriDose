
export default (baseFontSize: number = 12) => {
    const vh = window.innerHeight,
        vw = window.innerWidth,
        result = window.echartsPortrait ? vh / 1080 : vw / 1920
        // , multiplier = 1 - result === 0 ? 1 : 1 + 1 - result
    return result * baseFontSize
}