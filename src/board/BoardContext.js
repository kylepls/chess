import Chess from 'chess.js'
import {useReducer} from 'react'
import {createContainer} from 'react-tracked'

const initialState = {
    cg: undefined,
    history: [],
    chessjs: new Chess(),
    boardChessjs: new Chess(),
    displayFen: undefined,
    fen: undefined,
    currentMove: -1,
    orientation: 'black',
    playerMove: undefined,
    ghost: null,
}

const updateBoardChessjs = (chessjs, boardChessjs, currentMove, history) => {
    boardChessjs.reset()
    if (history.length > 0) {
        const move = history[currentMove]
        if (move) {
            boardChessjs.load(move.fen)
        }
    }
}

const updateChessjs = (chessjs, boardChessjs, history) => {
    chessjs.reset()
    boardChessjs.reset()
    if (history.length > 0) {
        const move = history[history.length - 1]
        chessjs.load(move.fen)
        boardChessjs.load(move.fen)
    }
}

const reducer = (state, {type, payload}) => {
    const {chessjs, boardChessjs, currentMove} = state
    switch (type) {
        case 'SET_CG':
            return {...state, cg: payload}
        case 'PLAYER_MOVE':
            return {...state, playerMove: payload}
        case 'FLIP_ORIENTATION':
            return {...state, orientation: state.orientation === 'white' ? 'black' : 'white'}
        case 'SET_ORIENTATION':
            return {...state, orientation: payload}
        case 'SET_GHOST':
            return {...state, ghost: payload}
        case 'FIRST_MOVE':
            updateBoardChessjs(chessjs, boardChessjs, -1, state.history)
            return {...state, currentMove: -1, displayFen: boardChessjs.fen()}
        case 'PREVIOUS_MOVE':
            const newPrevMoveIndex = currentMove > -1 ? currentMove - 1 : -1
            updateBoardChessjs(chessjs, boardChessjs, newPrevMoveIndex, state.history)
            return {...state, currentMove: newPrevMoveIndex, displayFen: boardChessjs.fen()}
        case 'NEXT_MOVE':
            const newNextMoveIndex = currentMove < state.history.length - 1 ? currentMove + 1 : currentMove
            updateBoardChessjs(chessjs, boardChessjs, newNextMoveIndex, state.history)
            return {...state, currentMove: newNextMoveIndex, displayFen: boardChessjs.fen()}
        case 'SET_MOVE':
            updateBoardChessjs(chessjs, boardChessjs, payload, state.history)
            return {...state, currentMove: payload, displayFen: boardChessjs.fen()}
        case 'SET_MOVES':
            updateChessjs(chessjs, boardChessjs, payload)
            return {
                ...state,
                currentMove: payload.length - 1,
                history: payload,
                displayFen: boardChessjs.fen(),
                fen: chessjs.fen(),
            }
        case 'SET_MOVE_EVALUATION':
            return {
                ...state,
                history: state.history.map((it, i) => {
                    if (payload.move === i) {
                        return {
                            ...it,
                            evaluation: payload.evaluation,
                        }
                    } else {
                        return it
                    }
                }),
            }
        case 'MOVE':
            const moves = [...state.history.slice(0, currentMove + 1), payload]
            updateChessjs(chessjs, boardChessjs, moves)
            return {
                ...state,
                currentMove: currentMove + 1,
                history: moves,
                displayFen: boardChessjs.fen(),
                fen: chessjs.fen(),
            }
        case 'SET_FEN':
            chessjs.load(payload)
            boardChessjs.load(payload)
            return {
                ...state,
                currentMove: -1,
                displayFen: boardChessjs.fen(),
                fen: chessjs.fen(),
            }
        default:
            return state
    }
}

const useValue = () => useReducer(reducer, initialState, state => ({
    ...state,
    displayFen: state.chessjs.fen(),
    fen: state.chessjs.fen(),
}))

export const {
    Provider: BoardContextProvider,
    useTrackedState: useBoardContext,
    useUpdate: useBoardContextDispatch,
} = createContainer(useValue)
