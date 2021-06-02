import axios from 'axios'
import {makeMoveFenSan} from 'utils/MoveUtils'

const memo = new Map()

export const Lichess = {
    speeds: ['bullet', 'blitz', 'rapid', 'classical'],
    ratings: [1600, 1800, 2000, 2200, 2500],
}

export const queryLichessExplorer = (fen, cb, speeds = Lichess.speeds, ratings = Lichess.ratings) => {
    const request = {fen, speeds, ratings}
    if (memo[request]) {
        cb(memo[request])
    } else {
        const params = {
            'variant': 'standard',
            'fen': fen,
            'speeds': speeds,
            'ratings': ratings,
        }
        axios.get('https://explorer.lichess.ovh/lichess', {params})
            .then(res => {
                const {data} = res
                const json = {...data, moves: data.moves.map(move => mapMove(fen, move))}
                memo[fen] = json
                cb(json)
            })
            .catch(reason => console.error(reason))
    }
}

const mapMove = (fen, move) => {
    return {
        ...move,
        ...makeMoveFenSan(fen, move.san),
        total: move.white + move.draws + move.black,
    }
}
