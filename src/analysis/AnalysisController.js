import {useAnalysisContext, useAnalysisContextDispatch} from 'analysis/AnalysisContext'
import {parseScore} from 'analysis/ScoreFormat'
import {useBoardContext} from 'board/BoardContext'
import Chess from 'chess.js'
import {getLineMoves} from 'MoveUtils'
import {useEffect} from 'react'

const chessjs = new Chess()

export const AnalysisController = ({children}) => {

    const boardState = useBoardContext()
    const analysisState = useAnalysisContext()
    const dispatchAnalysis = useAnalysisContextDispatch()

    const uci = analysisState.engine

    const {displayFen} = boardState
    const {run, depth, ready} = analysisState

    useEffect(() => {
        if (!run) uci.stop()
    }, [run])

    useEffect(() => {
        uci.init()
            .then(() => dispatchAnalysis({type: 'READY'}))
    }, [])

    useEffect(() => {
        if (!ready) return
        if (run) {
            dispatchAnalysis({type: 'SET_THINKING', payload: 'TRUE'})

            const fixLines = (lines) => {
                return lines.map(line => {
                    const startFen = boardState.displayFen
                    return {...line, moves: getLineMoves(startFen, (line?.moves || []))}
                })
            }

            let linesFunction = (lines) => {
                const fixedLines = fixLines(lines)
                dispatchAnalysis({type: 'SET_LINES', payload: fixedLines})
            }

            uci.stop()
                .then(() => uci.go(displayFen, linesFunction))
                .then(() => dispatchAnalysis({type: 'DONE'}))
                .catch(reason => console.error('stockfish go', reason))
        } else {
            const scoreFunction = evaluation => dispatchAnalysis({
                type: 'SET_EVALUATION',
                payload: mapEvaluation(evaluation),
            })
            uci.eval(displayFen, 10, scoreFunction)
                .catch(console.error)
        }
    }, [displayFen, run, ready])

    const {lines} = analysisState
    useEffect(() => {
        if (run && !boardState.ghost) {
            if (lines && lines.length > 0) {
                const shapes = lines
                    .filter(it => it.moves.length > 0)
                    .map(it => {
                        const [move] = it.moves
                        chessjs.load(boardState.displayFen)
                        const chessMove = chessjs.move(move)
                        if (chessMove) {
                            const {from, to} = chessMove
                            return {
                                analysis: true,
                                orig: from,
                                dest: to,
                                brush: 'red',
                                mouseSq: to,
                                snapToValidMove: true,
                                pos: [600, 700],
                            }
                        } else {
                            return null
                        }
                    })
                    .filter(it => it !== null)
                const otherShapes = boardState.cg.state.drawable.autoShapes.filter(it => !it.hasOwnProperty('analysis'))
                boardState.cg.setAutoShapes([...otherShapes, ...shapes])
            }
        } else if (boardState?.cg?.state?.drawable?.autoShapes) {
            const otherShapes = boardState.cg.state.drawable.autoShapes.filter(it => !it.hasOwnProperty('analysis'))
            boardState.cg.setAutoShapes(otherShapes)
        }
    }, [lines, boardState.ghost])

    return <>{children}</>
}

const mapEvaluation = (evaluation) => {
    return {
        score: parseScore(evaluation),
    }
}
