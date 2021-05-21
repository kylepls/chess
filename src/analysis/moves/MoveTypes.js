export const MoveType = {
    blunder: 'blunder',
    mistake: 'mistake',
    good: 'good',
    best: 'best'
}

export const classifyMove = (baselineScore, score, side) => {
    const diff = (baselineScore - score) * (side === 'b' ? 1 : -1) / 100

    if (diff <= 0) return MoveType.best
    else if (diff > 2) return MoveType.blunder
    else if (diff > 1) return MoveType.mistake
    else if (diff > 0.5) return MoveType.good
    else if (diff > 0.2) return MoveType.best
    else return `undef ${diff}`
}
