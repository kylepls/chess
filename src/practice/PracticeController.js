import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {queryLichessExplorer} from 'Lichess'
import {usePracticeContext, usePracticeContextDispatch} from 'practice/PracticeContext'
import {useEffect} from 'react'

const shuffle = arr =>
    arr.map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)

const cutoff = 20

export const PracticeController = ({children}) => {
    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()
    const practiceState = usePracticeContext()
    const dispatchPractice = usePracticeContextDispatch()

    useEffect(() => {
        if (practiceState.playing && practiceState.state === 'thinking') {
            queryLichessExplorer(boardState.boardChessjs.fen(), data => {
                const random = Math.random()

                const top5 = shuffle(data.moves.filter(it => it.total > cutoff).slice(0, 5))

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

                    const move = selection
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
            dispatchPractice({type: 'SET_STATE', payload: 'thinking'})
        }
    }, [boardState.playerMove])

    return <>{children}</>
}
