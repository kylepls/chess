import {createContext, useReducer} from "react";
import Chess from '../../node_modules/chess.js/chess'

const initialState = {
    cg: undefined,
    history: [],
    chessjs: new Chess(),
    boardChessjs: new Chess(),
    currentMove: -1,
    orientation: 'black',
    playerMove: undefined,
    ghost: null
}

export const BoardContext = createContext(initialState);

export const BoardContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <BoardContext.Provider value={[state, dispatch]}>
            {children}
        </BoardContext.Provider>
    )
}

const updateBoardChessjs = (chessjs, boardChessjs, currentMove, history) => {
    boardChessjs.reset();
    if (history.length > 0) {
        const move = history[currentMove]
        if (move) {
            boardChessjs.load(move.fen)
        }
    }
}

const updateChessjs = (chessjs, boardChessjs, history) => {
    chessjs.reset();
    if (history.length > 0) {
        const move = history[history.length-1]
        chessjs.load(move.fen)
        boardChessjs.load(move.fen)
    }
}

const Reducer = (state, {type, payload}) => {
    const {chessjs, boardChessjs, currentMove} = state;
    switch (type) {
        case 'SET_CG':
            return {...state, cg: payload}
        case 'PLAYER_MOVE':
            return {...state, playerMove: payload};
        case 'FLIP_ORIENTATION':
            return {...state, orientation: state.orientation === 'white' ? 'black' : 'white'};
        case 'SET_ORIENTATION':
            return {...state, orientation: payload};
        case 'FIRST_MOVE':
            updateBoardChessjs(chessjs, boardChessjs, -1, state.history)
            return {...state, currentMove: -1};
        case 'PREVIOUS_MOVE':
            const newPrevMoveIndex = currentMove > -1 ? currentMove - 1 : -1;
            updateBoardChessjs(chessjs, boardChessjs, newPrevMoveIndex, state.history)
            return {...state, currentMove: newPrevMoveIndex};
        case 'NEXT_MOVE':
            const newNextMoveIndex = currentMove < state.history.length - 1 ? currentMove + 1 : currentMove;
            updateBoardChessjs(chessjs, boardChessjs, newNextMoveIndex, state.history)
            return {...state, currentMove: newNextMoveIndex};
        case 'SET_MOVES':
            updateChessjs(chessjs, boardChessjs, payload)
            return {...state, currentMove: payload.length-1, history: payload};
        case 'SET_MOVE':
            updateBoardChessjs(chessjs, boardChessjs, payload, state.history)
            return {...state, currentMove: payload};
        case 'MOVE':
            const moves = [...state.history.slice(0, currentMove + 1), payload];
            updateChessjs(chessjs, boardChessjs, moves)
            return {...state, currentMove: currentMove + 1, history: moves};
        case 'SET_FEN':
            chessjs.load(payload)
            boardChessjs.load(payload)
            return {...state, currentMove: -1}
        case 'SET_GHOST':
            return {...state, ghost: payload}
        default:
            return state;
    }
}
