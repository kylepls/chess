import React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        '& span:nth-child(1)': {
            backgroundColor: '#fff',
            color: '#303030'
        },
        '& span:nth-child(2)': {
            backgroundColor: '#666'
        },
        '& span:nth-child(3)': {
            backgroundColor: '#333'
        },
        '& span': {
            textAlign: 'center',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
    }
})

export const TriBar = ({white, draws, black}) => {

    const styles = useStyles();
    const total = white + draws + black;

    const f = v => {
        if (v > 0) {
            return parseFloat((v / total * 100).toFixed(1));
        } else {
            return 0;
        }
    }

    const whiteP = f(white);
    const drawP = f(draws);
    let blackP = f(black);

    const all = whiteP + drawP + blackP;
    if (all > 100) {
        blackP = parseFloat((blackP - (all - 100)).toFixed(2));
    }

    const displayValue = v => v > 9 ? `${v}%` : "...";

    return (
        <div className={styles.root}>
            <span className="tribar" style={{width: `${whiteP}%`}}>{displayValue(whiteP)}</span>
            <span className="tribar" style={{width: `${drawP}%`}}>{displayValue(drawP)}</span>
            <span className="tribar" style={{width: `${blackP}%`}}>{displayValue(blackP)}</span>
        </div>
    )
}
