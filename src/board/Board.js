import React, {useEffect, useLayoutEffect, useRef} from "react";
import {Chessground} from "chessground";
import {makeStyles} from "@material-ui/styles";

import {useBoardContext, useBoardContextDispatch} from "./BoardContext";
import {makeMoveFromTo} from "../MoveUtils";
import Chess from 'chess.js'
import transitions from "@material-ui/core/styles/transitions";

const useStyles = makeStyles(theme => ({
    board: ({ghost}) => ({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& piece': {
            transition: transitions.create(['opacity'], {
                duration: theme.transitions.duration.complex
            }),
            opacity: ghost ? '60%' : '100%'
        },
        '& coords': {
            fontSize: '19px',
            fontWeight: 700,
            fontFamily: "'Noto Sans', Sans-Serif"
        },
        '& coords.files': {
            bottom: '6px',
            left: '40px'
        },
        '& coords.ranks': {
            top: '-40px',
            left: '2px'
        }
    }),
    boardArea: {
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden'
    }
}))

const validMoves = (chess) => {
    return chess.SQUARES
        .map(s => [s, chess.moves({square: s, verbose: true})])
        .filter(([_, value]) => value.length)
        .reduce((result, [s, moves]) => result.set(s, moves.map(move => move.to)), new Map());
}

const cgLoad = (cg, chessJs, lastMove) => {
    const turnColor = (chessJs.turn() === 'w') ? 'white' : 'black';
    const fen = chessJs.fen();
    const check = chessJs.in_check();
    const dests = validMoves(chessJs);
    cg.set({
        fen,
        turnColor,
        check,
        autoCastle: true,
        movable: {
            color: turnColor,
            dests,
        },
        highlight: {
            check: true
        },
        lastMove: lastMove ? [lastMove.from, lastMove.to] : null
    })
}

export const Board = () => {
    const state = useBoardContext()
    const dispatch = useBoardContextDispatch()

    const divRef = useRef();
    const cgRef = useRef();

    useEffect(() => {
        const {boardChessjs, currentMove} = state;
        if (!state.ghost) {
            const history = state.history.slice(0, currentMove + 1)
            const lastMove = history.length > 0 ? history.slice(-1)[0] : null;
            cgLoad(cgRef.current, boardChessjs, lastMove)
        } else {
            const move = state.ghost;
            const chess = Chess(move.fen)
            cgLoad(cgRef.current, chess, {from: move.from, to: move.to})
        }
    }, [state.displayFen, state.orientation, state.ghost]);

    useLayoutEffect(() => {
        cgRef.current = Chessground(divRef.current, {
            movable: {
                color: 'white',
                free: false,
                dests: validMoves(state.boardChessjs),
                events: {
                    after: (orig, dest) => {
                        dispatch({type: 'MOVE', payload: makeMoveFromTo(state.boardChessjs.fen(), orig, dest)})
                        dispatch({type: 'PLAYER_MOVE', payload: {from: orig, to: dest}})
                    }
                }
            }
        })
        dispatch({type: 'SET_CG', payload: cgRef.current})
    }, [])

    useLayoutEffect(() => {
        cgRef.current.set({
            orientation: state.orientation
        })
    }, [state.orientation])

    const styles = useStyles({ghost: !!state.ghost});

    return (
        <div className={styles.board}>
            <BoardArea>
                <div ref={divRef}/>
            </BoardArea>
        </div>
    );
}

/**
 * The size of a board has to be divisible by 8 and of 1:1 aspect ratio or else the
 * chessground API will create a board that overflows the boundaries of the div.
 *
 * This creates a component that guarantees an aspect ratio of 1:1 and that the size is divisible by 8.
 */
// TODO: at some zoom levels, the clicked board squares are messed up
const BoardArea = ({children}) => {
    const divRef = useRef();

    useLayoutEffect(() => {
        const updateSize = () => {
            const current = divRef.current;
            const maxWidth = current.parentElement.clientWidth;
            const maxHeight = current.parentElement.clientHeight;

            const size = Math.floor(Math.min(maxWidth, maxHeight) / 8) * 8;
            current.setAttribute("style", `width: ${size}px; height: ${size}px`)
        };
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, []);

    const styles = useStyles()
    return (
        <div className={styles.boardArea} ref={divRef}>
            {children}
        </div>
    )
}
