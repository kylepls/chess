import {CircularProgress} from '@material-ui/core'
import React from 'react'

const {makeStyles} = require('@material-ui/styles')

const useStyles = makeStyles({
    loaderContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0',
        top: '0',
        zIndex: 999,
        background: 'rgb(66,66,66, 0.8)',
    },
    overlayContainer: {
        position: 'relative',
    },
})

export const SpinnerOverlay = ({size = '5vmin'}) => {
    const styles = useStyles()
    return (
        <div className={styles.loaderContainer}>
            <CircularProgress style={{width: size, height: size}}/>
        </div>
    )
}

export const SpinnerOverlayContainer = ({children}) => {
    const styles = useStyles()
    return (
        <div className={styles.overlayContainer}>
            {children}
        </div>
    )
}
