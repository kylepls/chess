import {LinearProgress, makeStyles} from "@material-ui/core";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

import {useContext} from "react";
import {PracticeContext} from "./PracticeContext";
import CheckIcon from '@material-ui/icons/Check';
import {BoardContext} from "../board/BoardContext";

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
    const [practiceState] = useContext(PracticeContext);
    const playing = practiceState.playing;
    return (
        playing ?
            <StopButton/>
            :
            <PlayButton/>
    )
}

const StopButton = () => {
    const [practiceState, dispatchPractice] = useContext(PracticeContext);

    const stop = () => dispatchPractice({type: 'STOP'})
    const success = practiceState.state === 'success';

    const styles = useStyles();
    return (
        <div className={styles.stop} onClick={stop}>
            {practiceState.state === 'thinking' ?
                <LinearProgress/>
                : null
            }
            {success ? <CheckIcon /> : <StopIcon/>}
        </div>
    )
}

const PlayButton = () => {
    const [practiceState, dispatchPractice] = useContext(PracticeContext);
    const [{orientation}] = useContext(BoardContext)

    const styles = useStyles();
    if (practiceState.opening) {
        const play = () => dispatchPractice({type: 'PLAY', payload: orientation})
        return (
            <div className={styles.play} onClick={play}>
                <PlayArrowIcon/>
            </div>
        )
    } else {
        // TODO
        return null;
    }
}
