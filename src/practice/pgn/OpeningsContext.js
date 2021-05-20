import {loadPgn} from 'practice/pgn/PGNLoader'
import {useEffect, useReducer} from 'react'
import {createContainer} from 'react-tracked'

const initialState = {
    openings: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_OPENINGS':
            return {...state, openings: action.payload}
        default:
            return state
    }
}

const useValue = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        loadPgn((openings) => {
            const sortedEntries = Object.values(openings)
                .sort((a, b) => a.name.localeCompare(b.name))
            dispatch({type: 'SET_OPENINGS', payload: sortedEntries})
        })
    }, [dispatch])

    return [state, dispatch]
}

export const {
    Provider: OpeningsContextProvider,
    useTrackedState: useOpeningsContext,
    useUpdate: useOpeningsContextDispatch,
} = createContainer(useValue)
