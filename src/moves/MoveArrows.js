import {useContext} from "react";
import {BoardContext} from "../board/BoardContext";

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "center",
        height: '2.7em',
        '& svg': {
            flex: 1,
            height: 'auto'
        },
        '& svg:hover': {
            cursor: 'pointer',
            background: '#ccc'
        }
    }
})

export const MoveArrows = () => {
    const [state, dispatch] = useContext(BoardContext);

    const start = () => dispatch({type: 'FIRST_MOVE'})
    const previous = () => dispatch({type: 'PREVIOUS_MOVE'})
    const next = () => dispatch({type: 'NEXT_MOVE'})
    const end = () => dispatch({type: 'SET_MOVE', payload: state.history.length-1})

    const styles = useStyles();
    return (
        <div className={styles.root}>
            <SkipPreviousIcon onClick={start} />
            <KeyboardArrowLeftIcon onClick={previous}/>
            <KeyboardArrowRightIcon onClick={next}/>
            <SkipNextIcon onClick={end}/>
        </div>
    )
}
