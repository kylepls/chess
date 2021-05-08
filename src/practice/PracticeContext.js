import {createContext, useReducer} from "react";

const initialState = {
    opening: undefined,
    playing: false,
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

const Reducer = (state, action) => {
    switch (action.type) {
        case 'PLAY':
            return { ...state,  playing: true, state: 'thinking'}
        case 'STOP':
            return { ...state,  playing: false, state: 'stopped'}
        case 'SET_STATE':
            return { ...state,  playing: true, state: action.payload}
        case 'SET_OPENING':
            return { ...state,  opening: action.payload, playing: false, waitingForMove: false}
        default:
            return state;
    }
}
