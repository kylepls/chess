import {makeStyles} from '@material-ui/core'
import transitions from '@material-ui/core/styles/transitions'
import {BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight, BiRotateRight} from 'react-icons/bi'

const useStyles = makeStyles(theme => ({
    flip: {
        userSelect: 'none',
        transition: transitions.create(['transform'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            transform: 'rotate(90deg)',
        },
    },
    other: {
        userSelect: 'none',
        transition: transitions.create(['transform'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            transform: 'scale(1.25)',
        },
    },
}))

export const FlipIcon = (props) => {
    const styles = useStyles()
    return <BiRotateRight className={styles.flip} {...props} />
}

export const StartIcon = (props) => {
    const styles = useStyles()
    return <BiChevronsLeft className={styles.other} {...props} />
}

export const EndIcon = (props) => {
    const styles = useStyles()
    return <BiChevronsRight className={styles.other} {...props} />
}

export const PreviousIcon = (props) => {
    const styles = useStyles()
    return <BiChevronLeft className={styles.other} {...props} />
}

export const NextIcon = (props) => {
    const styles = useStyles()
    return <BiChevronRight className={styles.other} {...props} />
}
