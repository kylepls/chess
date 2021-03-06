import axios from 'axios'
import {getLineMoves} from 'utils/MoveUtils'
import pgnParser from 'pgn-parser'
import pgnUri from 'practice/pgn/openings.pgn'

export const loadPgn = (cb) => {
    axios.get(pgnUri)
        .then(res => {
            const parsed = parse(res.data)
            cb(parsed)
        })
}

const parse = pgn => {
    const parsed = pgnParser.parse(pgn)
    const openings = {}
    parsed.forEach(e => {
        const name = e.headers.find(it => it.name === 'Opening').value
        const playAs = e.headers.find(it => it.name === 'PlayAs')?.value
        const orientation = playAs ? playAs : 'white'

        const moveStrings = e.moves.map(it => it.move)
        const moves = getLineMoves(null, moveStrings)

        const toMove = moveStrings.length % 2 === 0 ? 'white' : 'black'
        openings[name] = {...e, name, movesPgn: e.moves, orientation, moves, toMove}
    })
    return openings
}

