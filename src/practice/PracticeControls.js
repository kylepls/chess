import {LinearProgress, makeStyles} from "@material-ui/core";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

import {usePracticeContext, usePracticeContextDispatch} from "./PracticeContext";
import CheckIcon from '@material-ui/icons/Check';
import {useBoardContext} from "../board/BoardContext";
import {MoveArrows} from "../moves/MoveArrows";

const useStyles = makeStyles({
    play: {
        cursor: 'pointer',
        background: 'rgba(172,255,18,0.25)',
        display: "flex",
        justifyContent: "center",
        '& svg': {
            flex: 1,
            height: 'auto'
        }
    },
    stop: {
        cursor: 'pointer',
        background: 'rgba(255,18,18,0.25)',
        display: "flex",
        justifyContent: "center",
        flexDirection: 'column',
        '& svg': {
            flex: 1,
            height: 'auto',
            width: 'auto'
        }
    }
})

export const PracticeControls = () => {
    const practiceState = usePracticeContext()

    const playing = practiceState.playing;
    return (
        playing ?
            <StopButton/>
            :
            <PlayButton/>
    )
}

const StopButton = () => {
    const practiceState = usePracticeContext()
    const dispatchPractice = usePracticeContextDispatch()

    const stop = () => dispatchPractice({type: 'STOP'})
    const success = practiceState.state === 'success';

    const styles = useStyles();
    return (
        <div className={styles.stop} onClick={stop}>
            {practiceState.state === 'thinking' ?
                <LinearProgress/>
                : null
            }
            {success ? <CheckIcon/> : <StopIcon/>}
        </div>
    )
}

const PlayButton = () => {
    const practiceState = usePracticeContext()
    const dispatchPractice = usePracticeContextDispatch()

    const {orientation} = useBoardContext()


    const styles = useStyles();
    if (practiceState.opening) {
        const play = () => dispatchPractice({type: 'PLAY', payload: orientation})
        return (
            <div className={styles.play} onClick={play}>
                <PlayArrowIcon/>
            </div>
        )
    } else {
        return <MoveArrows/>
    }
}
