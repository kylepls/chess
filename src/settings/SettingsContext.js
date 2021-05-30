import {Lichess} from 'Lichess'
import {useEffect, useReducer} from 'react'
import {createContainer} from 'react-tracked'
import {useSyncedLocalStorage} from 'use-synced-local-storage'

const initialState = {
    lichessSpeeds: [...Lichess.speeds],
    lichessRatings: [...Lichess.ratings]
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case 'SET':
            return {...state, ...payload}
        default:
            return state
    }
}

const init = (initialArg) => {
    return {...initialState, ...initialArg}
}

const useValue = () => {
    const [settings, setSettings] = useSyncedLocalStorage('settings', initialState)
    const [state, dispatch] = useReducer(reducer, settings, init)
    useEffect(() => {
        setSettings(state)
    }, [state])
    return [state, dispatch]
}

export const {
    Provider: SettingsContextProvider,
    useTrackedState: useSettingsContext,
    useUpdate: useSettingsContextDispatch,
} = createContainer(useValue)
