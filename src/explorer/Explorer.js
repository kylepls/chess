import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {TriBar} from 'explorer/Tribar'
import {HoverableMove} from 'hover/HoverableMove'
import {queryLichessExplorer} from 'Lichess'
import React, {useEffect, useState} from 'react'

const useStyles = makeStyles({
    row: {
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
            background: '#aaa',
        },
    },
    loaderContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0',
        top: '0',
        zIndex: 999,
        background: 'rgb(66,66,66, 0.6)',
    },
    active: {
        backgroundColor: '#aaa',
    },
})

export const Explorer = ({fen}) => {
    const state = useBoardContext()
    const dispatch = useBoardContextDispatch()

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        queryLichessExplorer(fen, data => {
            setData(data)
            setLoading(false)
        })
    }, [fen])

    const makeMove = move => {
        dispatch({type: 'MOVE', payload: move})
        dispatch({type: 'PLAYER_MOVE', payload: move})
    }

    const activeRowCss = move => {
        const {history} = state
        const nextMoveIndex = state.currentMove + 1
        if (nextMoveIndex < history.length) {
            const playedMove = history[nextMoveIndex]
            return playedMove === move.san ? styles.active : null
        }
        return null
    }

    const styles = useStyles()
    return (
        <Box position="relative">
            <TableContainer>
                <Table stickyHeader className={styles.table}>
                    <colgroup>
                        <col width="10%"/>
                        <col width="10%"/>
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Move</TableCell>
                            <TableCell>Games</TableCell>
                            <TableCell>White / Draw / Black</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data ? data.moves.map(move =>
                                <HoverableMove key={move.uci} move={move}>
                                    <TableRow
                                        className={`${styles.row} ${activeRowCss(move)}`}
                                        onClick={() => makeMove(move)}
                                    >
                                        <TableCell>{move.san}</TableCell>
                                        <TableCell>{move.white + move.draws + move.black}</TableCell>
                                        <TableCell>
                                            <TriBar {...move} />
                                        </TableCell>
                                    </TableRow>
                                </HoverableMove>,
                            )
                            : null
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {loading ? // todo
                <></>
                : null
            }
        </Box>
    )
}
