import {useBoardContext, useBoardContextDispatch} from "../board/BoardContext";

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import {Box, Grid, makeStyles, Typography} from "@material-ui/core";
import {useAnalysisContext} from "../analysis/AnalysisContext";

import LoopIcon from '@material-ui/icons/Loop'

const useStyles = makeStyles(theme => ({
    root: {
        '& svg': {
            height: '100%',
            width: 'auto'
        },
        '& svg:hover': {
            cursor: 'pointer',
            background: '#ccc'
        },
        background: theme.palette.background.default
    },
    score: {
        height: 'fit-content',
        textAlign: 'center',
        '& p': {
            fontWeight: 900,
            fontSize: '20px'
        }
    },
    flip: {
        cursor: 'pointer',
        alignSelf: 'center',
        width: 'auto'
    }
}))

export const MoveArrows = () => {
    const dispatchBoard = useBoardContextDispatch()
    const analysisState = useAnalysisContext()

    const scoreString = analysisState.evaluation?.score?.formatted || '--'

    const flipBoard = () => {
        dispatchBoard({type: 'FLIP_ORIENTATION'})
    }

    const styles = useStyles();
    return (
        <Grid container className={styles.root} justify="center">
            <Grid item xs={1}>
                <Grid container justify="center">
                    <Box className={styles.flip}>
                        <LoopIcon onClick={flipBoard}/>
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <MoveControls/>
            </Grid>
            <Grid item xs={1}>
                <Grid container justify="center" alignItems="center">
                    <Grid item className={styles.score}>
                        <Typography>{scoreString}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

const MoveControls = () => {
    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()


    const start = () => dispatchBoard({type: 'FIRST_MOVE'})
    const previous = () => dispatchBoard({type: 'PREVIOUS_MOVE'})
    const next = () => dispatchBoard({type: 'NEXT_MOVE'})
    const end = () => dispatchBoard({type: 'SET_MOVE', payload: boardState.history.length - 1})

    return (
        <Grid container justify="center">
            <SkipPreviousIcon onClick={start}/>
            <KeyboardArrowLeftIcon onClick={previous}/>
            <KeyboardArrowRightIcon onClick={next}/>
            <SkipNextIcon onClick={end}/>
        </Grid>
    )
}
