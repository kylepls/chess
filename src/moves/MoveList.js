import {makeStyles, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {useContext} from "react";
import {BoardContext} from "../board/BoardContext";
import {MoveArrows} from "./MoveArrows";
import {HoverableMove} from "../explorer/HoverableMove";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexFlow: 'column'
    },
    item: {
        '&:hover': {
            background: '#ccc',
            cursor: 'pointer'
        }
    },
    number: {
        width: 'min-content'
    },
    selectedMove: {
        background: 'rgba(172,255,18,0.25)',
        '&:hover': {
            background: 'rgba(116,167,11,0.25)',
        }
    },
    navigationIcons: {
        flex: '0 1',
    }
})

export const MoveList = () => {

    const [state, dispatch] = useContext(BoardContext);
    const styles = useStyles();
    const content = [];

    const activeCss = i => i === state.currentMove ? styles.selectedMove : undefined;

    const makeCell = (move, i) => {
        const click = () => dispatch({type: 'SET_MOVE', payload: i})
        const content =
            <TableCell
                key={move.fen}
                onClick={click}
                className={`${styles.item} ${(activeCss(i))}`}>
                {move.san}
            </TableCell>;
        if (i !== state.currentMove) {
            return (
                <HoverableMove key={move.fen} move={move}>
                    {content}
                </HoverableMove>
            )
        } else {
            return content
        }
    }

    const moves = state.history;
    for (let i = 0; i < moves.length; i += 2) {
        const cols = [];

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
