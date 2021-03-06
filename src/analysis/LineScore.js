import {Box, makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    numericScore: ({score}) => ({
        borderRadius: '0.2em',
        width: '3.5em',
        height: '1.5em',
        ...getCss(score, theme),
    }),
}))

const getCss = (score, theme) => {
    if (score > 0) {
        return theme.palette.sides.white
    } else if (score < 0) {
        return theme.palette.sides.black
    } else {
        return theme.palette.sides.draw
    }
}

export const LineScore = ({score}) => {
    if (typeof score === 'string') {
        if (score.startsWith('#')) {
            const mate = score.substr(1)
            return <>#{mate}</>
        } else {
            return <>{score}</>
        }
    } else {
        return <NumberScore score={score}/>
    }
}

const NumberScore = ({score}) => {
    const styles = useStyles({score})

    const value = formatNumber(score)

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={styles.numericScore}
        >
            {value}
        </Box>
    )
}


const formatNumber = (centiPawn) => {
    const value = (centiPawn / 100).toFixed(2)
    const prefix = centiPawn > 0 ? '+' : ''
    return `${prefix}${value}`
}
