import axios from 'axios'
import {makeMoveFenSan} from "./MoveUtils";

const memo = {};

export const queryLichessExplorer = (fen, cb) => {
    if (memo.hasOwnProperty(fen)) {
        cb(memo[fen])
    } else {
        const params = {
            'variant': 'standard',
            'fen': fen,
            'speeds': ['blitz', 'rapid', 'classical'],
            'ratings': [1800/*, 2000, 2200, 2500*/]
        }
        axios.get('https://explorer.lichess.ovh/lichess', {params})
            .then(res => {
                const data = res.data;
                const json = {...data, moves: data.moves.map(move => mapMove(fen, move))};
                memo[fen] = json;
                cb(json);
            });
    }
}

const mapMove = (fen, move) => {
    return {
        ...move,
        ...makeMoveFenSan(fen, move.san),
        total: move.white + move.draws + move.black
    }
}
