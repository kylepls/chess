import {Grid, makeStyles, Typography} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        '& .tribar:nth-child(1)': {
            ...theme.palette.sides.white,
        },
        '& .tribar:nth-child(2)': {
            ...theme.palette.sides.draw,
        },
        '& .tribar:nth-child(3)': {
            ...theme.palette.sides.black,
        },
        '& .tribar': {
            textAlign: 'center',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        height: '1.5em',
    },
    typography: {
    }
}))

export const TriBar = ({white, draws, black}) => {

    const styles = useStyles()
    const total = white + draws + black

    const formatValue = v => {
        if (v > 0) {
            return parseFloat((v / total * 100).toFixed(1))
        } else {
            return 0
        }
    }

    const whiteP = formatValue(white)
    const drawP = formatValue(draws)
    let blackP = formatValue(black)

    const all = whiteP + drawP + blackP
    if (all > 100) {
        blackP = parseFloat((blackP - (all - 100)).toFixed(2))
    }


    return (
        <Grid container className={styles.root}>
            <SpanValue value={whiteP}/>
            <SpanValue value={drawP}/>
            <SpanValue value={blackP}/>
        </Grid>
    )
}

const SpanValue = ({value}) => {
    const displayValue = v => v > 9 ? `${v}%` : '...'
    return (
        <div className="tribar" style={{width: `${value}%`}}>
            <Value value={displayValue(value)}/>
        </div>
    )
}

const Value = ({value}) => {
    const styles = useStyles()
    return (
        <Grid container justify="center" alignItems="center">
            <Typography className={styles.typography} variant='body2'>{value}</Typography>
        </Grid>
    )
}
