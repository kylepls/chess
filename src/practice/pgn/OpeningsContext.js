import {createContext, useReducer} from "react";

const initialState = {
    openings: null
}

export const OpeningsContext = createContext(initialState);

export const GeneralContext = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <OpeningsContext.Provider value={[state, dispatch]}>
            {children}
        </OpeningsContext.Provider>
    )
}

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_OPENINGS':
            return { ...state,  openings: action.payload}
        default:
            return state;
    }
}
