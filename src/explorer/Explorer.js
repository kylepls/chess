import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core'
import transitions from '@material-ui/core/styles/transitions'
import {Skeleton} from '@material-ui/lab'
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
        opacity: ({secondaryLoading}) => secondaryLoading ? '30%' : '100%',
        transition: transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
        }),
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
    tableContainer: ({loading}) => ({
        overflowY: loading ? 'hidden' : 'auto',
    }),
}))

const LoaderRow = (props) => {
    const styles = useStyles()
    return (
        <TableRow {...props} className={`${styles.row}`}>
            <TableCell>
                <Skeleton/>
            </TableCell>
            <TableCell>
                <Skeleton/>
            </TableCell>
            <TableCell>
                <Skeleton/>
            </TableCell>
        </TableRow>
    )
}

const skeletonRows = [...Array(10).keys()].map(it => (<LoaderRow key={it}/>))

export const Explorer = ({fen}) => {
    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()

    const settingsState = useSettingsContext()

    const [data, setData] = useState()
    const [initialLoading, setInitialLoading] = useState(true)

    const [secondaryLoading, setSecondaryLoading] = useState(false)

    useEffect(() => {
        if (!initialLoading) {
            setSecondaryLoading(true)
        }
        queryLichessExplorer(fen, data => {
            setData(data)

            if (initialLoading) {
                setInitialLoading(false)
            } else {
                setSecondaryLoading(false)
            }
        }, settingsState.lichessSpeeds, settingsState.lichessRatings)
    }, [fen])

    const makeMove = move => {
        if (!secondaryLoading) {
            dispatchBoard({type: 'MOVE', payload: move})
            dispatchBoard({type: 'PLAYER_MOVE', payload: move})
        }
    }

    const activeRowCss = move => {
        const {history} = boardState
        const nextMoveIndex = boardState.currentMove + 1
        const [playedMove] = history.slice(nextMoveIndex, nextMoveIndex + 1)
        return playedMove?.san === move.san ? styles.active : null
    }

    const styles = useStyles({initialLoading, secondaryLoading})
    return (
        <Box position="relative">
            <TableContainer className={styles.tableContainer}>
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
                        {!initialLoading && data && data.moves.map(move =>
                            <ExplorerRow
                                key={move.uci}
                                className={`${styles.row} ${activeRowCss(move)}`}
                                onClick={() => makeMove(move)}
                                move={move}
                            />,
                        )
                        }
                        {initialLoading && skeletonRows}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

const ExplorerRow = (props) => {
    const {move} = props
    return (
        <HoverableMove key={move.uci} move={move}>
            <TableRow {...props}>
                <TableCell>
                    <Typography variant="body1">
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
        </HoverableMove>
    )
}
