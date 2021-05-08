import {useContext, useEffect} from "react";
import {BoardContext} from "../board/BoardContext";
import {PracticeContext} from "./PracticeContext";
import {queryLichessExplorer} from "../Lichess";

const shuffle = arr =>
    arr.map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)

const cutoff = 300;

export const PracticeController = ({children}) => {
    const [boardState, dispatchBoard] = useContext(BoardContext);
    const [practiceState, dispatchPractice] = useContext(PracticeContext);

    useEffect(() => {
        if (practiceState.playing && practiceState.state === 'thinking') {
            // TODO: duplicate
            queryLichessExplorer(boardState.chessjs.fen(), data => {
                const top5 = shuffle(data.moves
                    .filter(it => it.total > cutoff)
                    .slice(0, 5))

                if (top5.length > 0) {
                    const move = top5[0];
                    setTimeout(() => {
                        dispatchBoard({type: 'MOVE', payload: move})
                        dispatchPractice({type: 'SET_STATE', payload: 'waiting'})
                    }, 500);
                } else {
                    const opening = practiceState.opening;
                    setTimeout(() => {
                        dispatchBoard({type: 'SET_MOVES', payload: opening.moves})
                        dispatchPractice({type: 'SET_STATE', payload: 'thinking'})
                    }, 2000)
                    dispatchPractice({type: 'SET_STATE', payload: 'success'})
                }
            })
        }
    }, [practiceState.state]);

    useEffect(() => {
        // TODO duplicate
        const turn = boardState.boardChessjs.turn() === 'w' ? 'white' : 'black';
        if (practiceState.playing && boardState.orientation !== turn) {
            dispatchPractice({type: 'SET_STATE', payload: 'thinking'})
        }
    }, [practiceState.playing])

    useEffect(() => {
        const turn = boardState.boardChessjs.turn() === 'w' ? 'white' : 'black';
        if (practiceState.playing && boardState.orientation !== turn) {
            dispatchPractice({type: 'SET_STATE', payload: 'thinking'})
        }
    }, [boardState.playerMove]);

    return <>{children}</>
}
