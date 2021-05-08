import pgnParser from "pgn-parser";
import {getLineMoves} from "../../MoveUtils";
import axios from "axios";
import pgnUri from "./openings.pgn";

export const loadPgn = (cb) => {
    axios.get(pgnUri)
        .then(res => {
            const parsed = parse(res.data);
            cb(parsed)
        })
}

const parse = pgn => {
    const parsed = pgnParser.parse(pgn);
    const openings = {};
    parsed.forEach(e => {
        const name = e.headers.find(it => it.name === "Opening").value;
        const flipped = e.headers.find(it => it.name === "StartFlipped");
        const orientation = flipped ? 'black' : 'white';

        const moveStrings = e.moves.map(it => it.move)
        const moves = getLineMoves(null, moveStrings)
        openings[name] = {...e, name, movesPgn: e.moves, orientation: orientation, moves}
    })
    return openings;
}

