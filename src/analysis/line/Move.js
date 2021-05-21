import {Box, makeStyles, Paper} from '@material-ui/core'
import transitions from '@material-ui/core/styles/transitions'
import {HoverableMove} from 'hover/HoverableMove'

const useStyles = makeStyles(theme => ({
    move: {
        width: 'fit-content',
        height: 'fit-content',
        whiteSpace: 'nowrap',
        paddingRight: '0.5em',
        textAlign: 'center',
        userSelect: 'none',
    },
    movePaper: {
        margin: '0.3em',
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[800],
        border: '1px solid',
        borderColor: theme.palette.grey[700],
        transition: transitions.create(['transform', 'background-color'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            transform: 'scale(1.15)',
            backgroundColor: theme.palette.grey[500]
        }
    },
}))

export const Move = ({move, hoverable = true}) => {
    const styles = useStyles()
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
