import {makeStyles, Table, TableBody, TableCell, TableContainer, TableRow} from '@material-ui/core'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'
import {HoverableMove} from 'hover/HoverableMove'
import {MoveArrows} from 'moves/MoveArrows'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexFlow: 'column',
    },
    item: {
        '&:hover': {
            background: '#ccc',
            cursor: 'pointer',
        },
    },
    number: {
        width: 'min-content',
    },
    selectedMove: {
        background: 'rgba(172,255,18,0.25)',
        '&:hover': {
            background: 'rgba(116,167,11,0.25)',
        },
    },
    navigationIcons: {
        height: '2.7em',
    },
})

export const MoveList = () => {

    const state = useBoardContext()
    const dispatch = useBoardContextDispatch()
    const styles = useStyles()
    const content = []

    const activeCss = i => i === state.currentMove ? styles.selectedMove : undefined

    const makeCell = (move, i) => {
        const click = () => dispatch({type: 'SET_MOVE', payload: i})
        let key = `${i}+${move.fen}`
        const content =
            <TableCell
                key={key}
                onClick={click}
                className={`${styles.item} ${(activeCss(i))}`}>
                {move.san}
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

        cols.push(<TableCell className={styles.number} key={`idx${i}`}>{(i / 2) + 1}</TableCell>)
        cols.push(makeCell(moves[i], i))

        if (i + 1 < moves.length) {
            cols.push(makeCell(moves[i + 1], i + 1))
        } else {
            cols.push(<TableCell key={`black${i}`}>...</TableCell>)
        }

        content.push(<TableRow key={`row${i}`}>{cols}</TableRow>)
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
