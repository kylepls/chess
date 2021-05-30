import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {TriBar} from 'explorer/Tribar'
import {HoverableMove} from 'hover/HoverableMove'
import {queryLichessExplorer} from 'Lichess'
import React, {useEffect, useState} from 'react'
import {useSettingsContext} from 'settings/SettingsContext'

const useStyles = makeStyles(theme => ({
    row: {
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.action.hover,
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
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    typography: {
    }
}))

export const Explorer = ({fen}) => {
    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()

    const settingsState = useSettingsContext()

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    // TODO deal with loading
    useEffect(() => {
        setLoading(true)
        queryLichessExplorer(fen, data => {
            setData(data)
            setLoading(false)
        }, settingsState.lichessSpeeds, settingsState.lichessRatings)
    }, [fen])

    const makeMove = move => {
        dispatchBoard({type: 'MOVE', payload: move})
        dispatchBoard({type: 'PLAYER_MOVE', payload: move})
    }

    const activeRowCss = move => {
        const {history} = boardState
        const nextMoveIndex = boardState.currentMove + 1
        const [playedMove] = history.slice(nextMoveIndex, nextMoveIndex + 1)
        return playedMove?.san === move.san ? styles.active : null
    }

    const styles = useStyles()
    return (
        <Box position="relative">
            <TableContainer>
                <Table stickyHeader>
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
                        {data && data.moves.map(move =>
                            <HoverableMove key={move.uci} move={move}>
                                <TableRow
                                    className={`${styles.row} ${activeRowCss(move)}`}
                                    onClick={() => makeMove(move)}
                                >
                                    <TableCell>
                                        <Typography className={styles.typography} variant="body1">
                                            {move.san}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption">
                                            {move.white + move.draws + move.black}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TriBar {...move} />
                                    </TableCell>
                                </TableRow>
                            </HoverableMove>,
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
