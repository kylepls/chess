import React, {useContext, useEffect, useRef} from "react";
import {BoardContext} from "../board/BoardContext";

let activeHover;
let timer;
const timeout = 100;

const clearTimer = () => {
    if (timer) clearTimeout(timer)
}


export const HoverableMove = ({children, move}) => {
    if (!move) {
        throw new Error('Forgot to supply move')
    }

    const ref = useRef()
    const [boardState, dispatchBoard] = useContext(BoardContext)

    const setTimer = () => {
        clearTimer()
        timer = setTimeout(() => {
            dispatchBoard({type: 'SET_GHOST', payload: null})
            activeHover = null
        }, timeout)
    }

    const setHover = (value) => {
        if (value && activeHover !== move) {
            if (timer) clearTimeout(timer)
            dispatchBoard({type: 'SET_GHOST', payload: move})
            activeHover = move
        } else if (activeHover === move) {
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

    if (!move?.fen) {
        throw Error(`Invalid move: ${JSON.stringify(move)}`)
    }

    const hoverChildren = React.Children.map(children, child => {
        return React.cloneElement(child, {
            onMouseLeave: () => setHover(false),
            onMouseEnter: () => setHover(true),
            ref: ref,
            key: child.key || move.fen
        })
    })

    return (
        <>{hoverChildren}</>
    )
}
