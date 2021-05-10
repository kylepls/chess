import {useEffect, useRef} from "react";

export let mousePosition = {
    mouseX: -1,
    mouseY: -1,
}

const listener = event => {
    mousePosition = {mouseX: event.clientX, mouseY: event.clientY}
}

export const MouseTracker = ({children}) => {
    useEffect(() => {
        window.addEventListener('mousemove', listener)
        return () => window.removeEventListener('mousemove', listener)
    })

    return <>{children}</>
}
