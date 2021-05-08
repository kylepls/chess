import React, {useContext, useEffect, useLayoutEffect, useRef} from "react";
import {Chessground} from "chessground";
import {makeStyles} from "@material-ui/styles";

import {BoardContext} from "./BoardContext";
import {makeMoveFromTo} from "../MoveUtils";
import Chess from 'chess.js'

const useStyles = makeStyles({
    board: ({ghost}) => ({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& piece': {
            opacity: ghost ? '60%' : '100%'
        }
    }),
})

// https://github.com/ornicar/chessground-examples/blob/f9ddc6afcd809b7cbe2035d60e963d2627258888/src/util.ts#L4
const validMoves = (chess) => {
    const dests = new Map();
    chess.SQUARES.forEach(s => {
        const ms = chess.moves({square: s, verbose: true});
        if (ms.length) dests.set(s, ms.map(m => m.to));
    });
    return dests;
}

export const cgLoad = (cg, chessJs, lastMove) => {
    const turnColor = (chessJs.turn() === 'w') ? 'white' : 'black';
    cg.set({
        fen: chessJs.fen(),
        turnColor: turnColor,
        check: chessJs.in_check(),
        autoCastle: true,
        movable: {
            color: turnColor,
            dests: validMoves(chessJs),
        },
        highlight: {
            check: true
        }
    })

    cg.set({
        lastMove: lastMove ? [lastMove.from, lastMove.to] : null
    })
}

export const Board = () => {
    const [state, dispatch] = useContext(BoardContext);

    const divRef = useRef();
    const cgRef = useRef();

    const displayFen = state.boardChessjs.fen()

    useEffect(() => {
        const {boardChessjs, currentMove} = state;
        if (!state.ghost) {
            const history = state.history.slice(0, currentMove)
            const lastMove = history.length > 0 ? history[history.length - 1] : null;
            cgLoad(cgRef.current, boardChessjs, lastMove)
        } else {
            const move = state.ghost;
            const chess = Chess(move.fen)
            cgLoad(cgRef.current, chess, {from: move.from, to: move.to})
        }
    }, [displayFen, state.orientation, state.ghost]);

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

    return (
        <div ref={divRef}>
            {children}
        </div>
    )
}
