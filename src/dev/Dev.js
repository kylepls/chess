import {useEffect, useRef} from "react";

export const useTraceUpdate = (value, prefix) => {
    const prev = useRef(value);
    useEffect(() => {
        if (value !== prev.current) {
            console.log(`${prefix} - ${nameOf(value)} Changed from ${JSON.stringify(prev.current)} -> ${JSON.stringify(value)}`);
        }
        prev.current = value;
    });
}

export const nameOf = (expression) => {
    if (expression !== Object(expression)
        || typeof expression === 'function'
        || Array.isArray(expression)) {
        throw new Error(`Unable to determine name. '${expression}' is not an object`);
    }
    return Object.keys(expression)[0];
}
