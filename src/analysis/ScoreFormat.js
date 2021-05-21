export const parseScore = (score) => {
    // TODO draw

    if (typeof score === 'string' && score.startsWith('#')) {
        const value = parseInt(score.substr(1))
        const formatted = `#${value}`
        return {
            type: 'mate',
            value,
            formatted,
        }
    } else {
        const value = score / 100
        const prefix = value > 0 ? '+' : ''
        const formatted = `${prefix}${value}`
        return {
            type: 'pawn',
            value,
            formatted,
        }
    }
}
