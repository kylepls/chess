import {useContext, useEffect, useRef} from "react";
import {AnalysisContext} from "./AnalysisContext";
import {BoardContext} from "../board/BoardContext";
import Chess from 'chess.js'
import UCI from "./UCI";
import {getLineMoves} from "../MoveUtils"

const chessjs = new Chess();

export const AnalysisController = ({children}) => {

    const [boardState] = useContext(BoardContext);
    const [analysisState, dispatchAnalysis] = useContext(AnalysisContext);

    const uci = useRef(new UCI(analysisState.engine)).current;

    const viewFen = boardState.boardChessjs.fen();
    const {engine, run, depth, linesCount} = analysisState;

    useEffect(() => {
        if (!run) uci.postStop()
        return () => uci.postStop()
    }, [run])
    useEffect(() => {
        if (run) {
            dispatchAnalysis({type: 'SET_THINKING', payload: 'TRUE'})

            const fixLines = (lines) => {
                return lines.map(line => {
                    const startFen = boardState.boardChessjs.fen();
                    return {...line, moves: getLineMoves(startFen, (line?.moves || []))}
                })
            }

            uci.stop()
                .then(() => uci.isReady())
                .then(() => uci.eval())
                .then (evaluation => {
                    console.log(`EVAL: ${JSON.stringify(evaluation)}`)
                })
                .then(() => uci.setPosition(viewFen))
                .then(() => {
                    return uci.go(depth, linesCount, (lines) => {
                        const fixedLines = fixLines(lines)
                        dispatchAnalysis({type: 'SET_LINES', payload: fixedLines})
                    })
                })
                .then((bestMove) => dispatchAnalysis({type: 'DONE'}))
        }
    }, [viewFen, run])

    useEffect(() => {
        engine.postMessage(`go depth ${depth}`)
    }, [depth])

    const lines = analysisState.lines;
    useEffect(() => {
        if (run && !boardState.ghost) {
            if (lines && lines.length > 0) {
                const shapes = lines
                    .filter(it => it.moves.length > 0)
                    .map(it => {
                        const move = it.moves[0];
                        chessjs.load(boardState.boardChessjs.fen());
                        const chessMove = chessjs.move(move);
                        if (chessMove) {
                            const {from, to} = chessMove;
                            return {
                                analysis: true,
                                orig: from,
                                dest: to,
                                brush: 'red',
                                mouseSq: to,
                                snapToValidMove: true,
                                pos: [600, 700]
                            }
                        } else {
                            return null
                        }
                    })
                    .filter(it => it !== null)
                const otherShapes = boardState.cg.state.drawable.autoShapes.filter(it => !it.hasOwnProperty('analysis'));
                boardState.cg.setAutoShapes([...otherShapes, ...shapes]);
            }
        } else if (boardState?.cg?.state?.drawable?.autoShapes) {
            const otherShapes = boardState.cg.state.drawable.autoShapes.filter(it => !it.hasOwnProperty('analysis'));
            boardState.cg.setAutoShapes(otherShapes);
        }
    }, [lines, boardState.ghost])

    return <>{children}</>
}
