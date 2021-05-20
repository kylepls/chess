import {useCallback, useState} from 'react'

export const useForceUpdate = () => {
    const [, setValue] = useState()
    return useCallback(() => setValue(value => value + 1), [])
}
