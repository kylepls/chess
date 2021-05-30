import {Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@material-ui/core'
import transitions from '@material-ui/core/styles/transitions'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {HoverableMove} from 'hover/HoverableMove'
import {MoveArrows} from 'moves/MoveArrows'
import {useLayoutEffect, useRef} from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        '& td': {
            borderBottom: '0',
        },
    },
    item: {
        userSelect: 'none',
        transition: transitions.create(['background'], {
            duration: theme.transitions.duration.shortest,
        }),
        '&:hover': {
            background: theme.palette.action.focus,
            cursor: 'pointer',
        },
    },
    number: {
        width: 'min-content',
        background: theme.palette.grey['A400'],
    },
    selectedMove: {
        background: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.dark,
        },
    },
    navigationIcons: {
        height: '2.7em',
    },
    score: {
        float: 'right',
    },
}))

const MoveNumber = ({move}) => {
    const styles = useStyles()

    return (
        <TableCell className={styles.number} key={`idx${move}`}>
            <Typography variant="subtitle1" align="center">{move}</Typography>
        </TableCell>
    )
}

export const MoveList = () => {

    const state = useBoardContext()
    const dispatch = useBoardContextDispatch()
    const styles = useStyles()
    const content = []

    const activeCss = i => i === state.currentMove ? styles.selectedMove : undefined

    const currentMoveRef = useRef()
    const makeCell = (move, i) => {
        const click = () => dispatch({type: 'SET_MOVE', payload: i})
        let key = `${i}+${move.fen}`

        const content =
            <TableCell
                key={key}
                onClick={click}
                className={`${styles.item} ${(activeCss(i))}`}
                ref={i === state.currentMove ? currentMoveRef : undefined}>
                <Grid container alignItems="center" justify="space-between">
                    <Typography display="inline">
                        {move.san}
                    </Typography>
                    {move.evaluation &&
                    <Typography className={styles.score} color="textSecondary" display="inline" align="right"
                                variant="subtitle2">
                        {move.evaluation.formatted}
                    </Typography>
                    }
                </Grid>
            </TableCell>
        if (i !== state.currentMove) {
            return (
                <HoverableMove key={key} move={move}>
                    {content}
                </HoverableMove>
            )
        } else {
            return content
        }
    }

    const moves = state.history
    for (let i = 0; i < moves.length; i += 2) {
        const cols = []

        cols.push(<MoveNumber key={`num${i}`} move={(i / 2) + 1}/>)
        cols.push(makeCell(moves[i], i))

        if (i + 1 < moves.length) {
            cols.push(makeCell(moves[i + 1], i + 1))
        } else {
            cols.push(<TableCell key={`black${i}`}>...</TableCell>)
        }

        content.push(<TableRow key={`row${i}`}>{cols}</TableRow>)
    }

    useLayoutEffect(() => {
        window.requestAnimationFrame(() => {
            const {current} = currentMoveRef
            if (current) {
                current.scrollIntoView({behavior: 'smooth', block: 'nearest'})
            }
        })
    }, [state.currentMove])

    if (moves.length === 0) {
        content.push(<TableRow key="0">
            <MoveNumber move={1}/>
            <TableCell/>
            <TableCell/>
        </TableRow>)
    }

    return (
        <div className={styles.root}>
            <TableContainer>
                <Table size="small">
                    <colgroup>
                        <col width="10%"/>
                        <col width="45%"/>
                        <col width="45%"/>
                    </colgroup>
                    <TableBody>
                        {content}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.navigationIcons}>
                <MoveArrows/>
            </div>
        </div>
    )
}
