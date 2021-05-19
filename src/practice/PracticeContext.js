import {useReducer} from "react";
import {createContainer} from "react-tracked";

const initialState = {
    opening: undefined,
    playing: false,
    side: undefined,
    state: 'stopped'
}

const reducer = (state, {type, payload}) => {
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

const useValue = () => useReducer(reducer, initialState)

export const {
    Provider: PracticeContextProvider,
    useTrackedState: usePracticeContext,
    useUpdate: usePracticeContextDispatch
} = createContainer(useValue)
