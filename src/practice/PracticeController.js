import {useAnalysisContext} from 'analysis/AnalysisContext'
import {classifyMove} from 'analysis/moves/MoveTypes'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {queryLichessExplorer} from 'Lichess'
import {getLineMoves} from 'MoveUtils'
import {usePracticeContext, usePracticeContextDispatch} from 'practice/PracticeContext'
import {useEffect} from 'react'

const shuffle = arr =>
    arr.map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)

const cutoff = 20

const pickMove = moves => {
    const random = Math.random()

    const top5 = shuffle(moves.filter(it => it.total > cutoff).slice(0, 5))
    const combinedTotal = top5.reduce((total, it) => it.total + total, 0)

    if (top5.length > 0) {
        let [selection] = top5
        let i = 0
        let pctSum = 0
        while (pctSum < random) {
            selection = top5[i]
            pctSum += top5[i].total / combinedTotal
            i++
        }

        return selection
    }
}

export const PracticeController = ({children}) => {
    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()
    const practiceState = usePracticeContext()
    const {engine: uci, ready} = useAnalysisContext()
    const dispatchPractice = usePracticeContextDispatch()

    useEffect(() => {
        if (practiceState.playing && practiceState.state === 'thinking') {
            queryLichessExplorer(boardState.boardChessjs.fen(), data => {
                const move = pickMove(data.moves)
                if (move) {
                    setTimeout(() => {
                        dispatchBoard({type: 'MOVE', payload: move})
                        dispatchPractice({type: 'SET_STATE', payload: 'waiting'})
                    }, 500)
                } else {
                    // completed a line, reset
                    const {opening} = practiceState
                    setTimeout(() => {
                        dispatchBoard({type: 'SET_MOVES', payload: opening.moves})
                        dispatchPractice({type: 'PLAY_AGAIN'})
                    }, 2000)
                    dispatchPractice({type: 'SET_STATE', payload: 'success'})
                }
            })
        }
    }, [practiceState.state])

    useEffect(() => {
        const turn = boardState.boardChessjs.turn() === 'w' ? 'white' : 'black'
        if (practiceState.playing && boardState.orientation !== turn) {
            const [{fen: beforeFen}] = boardState.history.slice(-2)
            const [move] = boardState.history.slice(-1)

            console.info('checking best line')
            uci.go(beforeFen, () => {
            }, 1, 12)
                .then(([line]) => {
                    // best move
                    const moves = getLineMoves(beforeFen, line.moves)
                    return {
                        score: line.score,
                        best: moves[0],
                        moves,
                    }
                })
                .then(baseline => {
                    console.log('checking played line')
                    return uci.eval(move.fen, 12)
                        .then(evaluation => {
                            const classification = classifyMove(baseline.score, evaluation, boardState.orientation)
                            console.log('evaluation', evaluation, baseline, classification)
                            dispatchPractice({type: 'SET_STATE', payload: 'thinking'})
                        })
                })


            dispatchPractice({type: 'SET_STATE', payload: 'evaluating'})
        }

    }, [boardState.playerMove])

    return <>{children}</>
}
