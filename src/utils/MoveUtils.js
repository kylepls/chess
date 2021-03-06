import Chess from 'chess.js/chess'

const chess = new Chess()

const required = (name) => {
    throw new Error(`Missing parameter ${name}`)
}

export const makeMove = (
    from = required('from'),
    to = required('to'),
    san = required('san'),
    fen = required('fen'),
) => {
    return {from, to, san, fen}
}

export const makeMoveFenSan = (fen, move) => {
    chess.load(fen)
    const res = chess.move(move)
    if (!res?.from || !res?.to) {
        throw Error(`invalid move ${JSON.stringify(move)} - ${fen}`)
    } else {
        return makeMove(res.from, res.to, res.san, chess.fen())
    }
}

export const getLineMoves = (startFen, moves) => {
    if (startFen) {
        chess.load(startFen)
    } else {
        chess.reset()
    }
    return moves
        .map(move => {
            const chessMove = chess.move(move, {sloppy: true})
            return {...chessMove, fen: chess.fen()}
        })
        .filter(it => it !== null)
        .map(it => makeMove(it.from, it.to, it.san, it.fen))
}

export const makeMoveFromTo = (fen, from, to) => {
    chess.load(fen)
    const res = chess.move({from, to})
    return makeMove(res.from, res.to, res.san, chess.fen())
}

export const toMove = (fen) => {
    chess.load(fen)
    const turnMap = {
        'b': 'black',
        'w': 'white',
    }
    const turn = chess.turn()

    return turnMap[turn] || 'undefined'
}

export const flip = (side) => {
    return side === 'black' ? 'white' : 'black'
}
