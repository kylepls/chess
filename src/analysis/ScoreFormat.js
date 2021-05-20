export const parseScore = (score) => {
    // TODO draw

    if (score.startsWith('#')) {
        const value = parseInt(score.substr(1))
        const formatted = `#${value}`
        return {
            type: 'mate',
            value,
            formatted,
        }
    } else {
        const value = score
        const prefix = value > 0 ? '+' : ''
        const formatted = `${prefix}${value}`
        return {
            type: 'pawn',
            value,
            formatted,
        }
    }
}
