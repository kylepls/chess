import {useBoardContextDispatch} from 'board/BoardContext'
import React, {useEffect, useLayoutEffect, useRef} from 'react'

let activeHover
let timer
const timeout = 100

const enabled = true

const clearTimer = () => {
    if (timer) clearTimeout(timer)
}

export const HoverableMove = ({children, move}) => {
    if (!move) {
        throw new Error('Forgot to supply move')
    }

    const elementRef = useRef()
    const dispatchBoard = useBoardContextDispatch()

    const setTimer = () => {
        clearTimer()
        timer = setTimeout(() => {
            dispatchBoard({type: 'SET_GHOST', payload: null})
            activeHover = null
        }, timeout)
    }

    const setHover = (value) => {
        if (value && activeHover !== move && enabled) {
            if (timer) clearTimeout(timer)
            dispatchBoard({type: 'SET_GHOST', payload: move})
            activeHover = move
        } else if (activeHover === move && enabled) {
            setTimer()
        }
    }

    useEffect(() => {
        return () => {
            if (activeHover === move) {
                setTimer()
            }
        }
    }, [])

    useLayoutEffect(() => {
        // when the component is first loaded, hover events will not fire if the mouse is already over
        window.requestAnimationFrame(() => {
            if (elementRef.current && elementRef.current.matches(':hover')) {
                setHover(true)
            }
        })
    }, [])

    const hoverChildren = React.Children.map(children, child => {
        return React.cloneElement(child, {
            onMouseLeave: () => setHover(false),
            onMouseEnter: () => setHover(true),
            ref: elementRef,
            key: child.key || JSON.stringify(move),
        })
    })

    return (
        <>{hoverChildren}</>
    )
}
