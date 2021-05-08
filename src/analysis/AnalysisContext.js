import {createContext, useReducer} from "react";

const initialState = {
    // eslint-disable-next-line no-eval
    engine: eval('sf'),
    depth: 20,
    linesCount: 3,
    run: false,
    thinking: false,
    lines: []
}

export const AnalysisContext = createContext(initialState);

export const AnalysisContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <AnalysisContext.Provider value={[state, dispatch]}>
            {children}
        </AnalysisContext.Provider>
    )
}

const Reducer = (state, {type, payload}) => {
    switch (type) {
        case 'SET_LINES':
            return {...state, lines: payload}
        case 'BEST_LINE':
            const {line, moves, score, depth} = payload;
            const linesTemp = [...state.lines]

            while (linesTemp.length < line) {
                linesTemp.push({});
            }

            linesTemp[line] = {
                moves, score, depth
            }

            return {...state, lines: linesTemp}
        case 'CLEAR':
            return {...state, thinking: false, lines: []}
        case 'SET_THINKING':
            return {...state, thinking: payload, lines: []}
        case 'DONE':
            return {...state, thinking: false}
        case 'TOGGLE_RUN':
            return {...state, run: !state.run}
        case 'SET_RUN':
            const newLines = payload ? state.lines : [];
            return {...state, run: payload, lines: newLines}
        default:
            return state;
    }
}
