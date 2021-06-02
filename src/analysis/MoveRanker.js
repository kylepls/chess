const cutoffDeltaCpi = 500

const rankLines = (inLines) => {
    const lines = inLines
        .filter(it => it.moves.length > 0 && it.moves.length > 0)

    const maxScore = lines[0].score

    // cut the lines that significantly underperform the best move
    return lines.filter(it => Math.abs(maxScore - it.score) < cutoffDeltaCpi)
}

const sizes = {
    bestMove: 15,
    goodMoves: 9,
    terribleMoves: 2,
}

export const getShapes = (displayFen, inLines) => {
    const lines = rankLines(inLines)

    const scores = lines.map(it => it.score)
    const maxScore = scores.max()

    return lines
        .map(it => {
            const [move] = it.moves
            const {from, to} = move

            const delta = maxScore - it.score

            let size
            if (delta === 0) {
                size = sizes.bestMove
            } else {
                const ratio = 1 - delta / cutoffDeltaCpi
                size = ratio * (sizes.goodMoves - sizes.terribleMoves) + sizes.terribleMoves
            }

            return makeShape(from, to, size)
        })
}

const makeShape = (from, to, size) => {
    return {
        analysis: true,
        orig: from,
        dest: to,
        brush: 'red',
        mouseSq: to,
        snapToValidMove: true,
        pos: [600, 700],
        modifiers: {
            lineWidth: size,
        },
    }
}
