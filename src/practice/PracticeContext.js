import {createContext, useReducer} from "react";

const initialState = {
    opening: undefined,
    playing: false,
    side: undefined,
    state: 'stopped'
}

export const PracticeContext = createContext(initialState);

export const PracticeContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <PracticeContext.Provider value={[state, dispatch]}>
            {children}
        </PracticeContext.Provider>
    )
}

const Reducer = (state, {type, payload}) => {
    switch (type) {
        case 'PLAY':
            if (!state.opening) throw new Error("Play requires opening to be selected")
            const s = payload === state.opening.toMove ? 'waiting' : 'thinking'
            return {
                ...state,
                playing: true,
                state: s,
                side: payload
            }
        case 'PLAY_AGAIN':
            const st = state.side === state.opening.toMove ? 'waiting' : 'thinking'
            return {
                ...state,
                playing: true,
                state: st,
            }
        case 'STOP':
            return {...state, playing: false, state: 'stopped'}
        case 'SET_STATE':
            return {...state, playing: true, state: payload}
        case 'SET_OPENING':
            return {...state, opening: payload, playing: false, waitingForMove: false}
        default:
            return state;
    }
}
