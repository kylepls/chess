import {makeStyles} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        '& span:nth-child(1)': {
            ...theme.palette.sides.white
        },
        '& span:nth-child(2)': {
            ...theme.palette.sides.draw
        },
        '& span:nth-child(3)': {
            ...theme.palette.sides.black
        },
        '& span': {
            textAlign: 'center',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
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

    const displayValue = v => v > 9 ? `${v}%` : '...'

    return (
        <div className={styles.root}>
            <span className="tribar" style={{width: `${whiteP}%`}}>{displayValue(whiteP)}</span>
            <span className="tribar" style={{width: `${drawP}%`}}>{displayValue(drawP)}</span>
            <span className="tribar" style={{width: `${blackP}%`}}>{displayValue(blackP)}</span>
        </div>
    )
}
