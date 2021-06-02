import {useAnalysisContext, useAnalysisContextDispatch} from 'analysis/AnalysisContext'
import {getShapes} from 'analysis/MoveRanker'
import {parseScore} from 'analysis/ScoreFormat'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {useEffect} from 'react'
import {getLineMoves} from 'utils/MoveUtils'

export const AnalysisController = ({children}) => {

    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()

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
            const scoreFunction = evaluation => {
                let objectEvaluation = mapEvaluation(evaluation)
                dispatchAnalysis({
                    type: 'SET_EVALUATION',
                    payload: objectEvaluation,
                })

                if (boardState.currentMove > -1) {
                    dispatchBoard({
                        type: 'SET_MOVE_EVALUATION',
                        payload: {
                            move: boardState.currentMove,
                            evaluation: objectEvaluation.score,
                        },
                    })
                }
            }
            uci.eval(displayFen, 13)
                .then(scoreFunction)
                .catch(console.error)
        }
    }, [displayFen, run, ready])

    const {lines} = analysisState
    useEffect(() => {
        if (run && !boardState.ghost) {
            if (lines && lines.length > 0) {
                const shapes = getShapes(displayFen, lines)
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
