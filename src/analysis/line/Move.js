import {HoverableMove} from "../../hover/HoverableMove";
import {Box, makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles({
    move: {
        width: 'fit-content',
        height: 'fit-content',
        whiteSpace: 'nowrap',
        paddingRight: '0.5em',
        textAlign: 'center',
    },
    movePaper: {
        margin: '0.3em',
        cursor: 'pointer'
    },
})

export const Move = ({move, hoverable = true}) => {
    const styles = useStyles();
    const content =
        <Box flex="0" className={styles.move}>
            <Paper className={styles.movePaper}>
                {move.san}
            </Paper>
        </Box>
    if (hoverable) {
        return (
            <HoverableMove move={move}>
                {content}
            </HoverableMove>
        )
    } else {
        return content
    }
}
