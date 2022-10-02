import {Grid, Typography, withStyles} from '@material-ui/core'
import {AddBox, Favorite, Remove} from '@material-ui/icons'
import {LineMoveList} from 'analysis/line/LineMoveList'
import React from 'react'

export const renderName = ({rowIndex: index, cellData: name, isCustomOpening, updateCustomOpeningName}) => {
    if (index === 0) {
        return (
            <Grid container alignItems="center">
                <Typography>Custom Opening</Typography>
            </Grid>
        )
    }

    if (isCustomOpening(name)) {
        const saveValue = (e) => {
            const value = e.target.textContent
            updateCustomOpeningName(name, value)
        }
        const onKeyDown = e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                saveValue(e)
                e.currentTarget.blur()
            }
        }
        return (
            <Grid container alignItems="center">
                <Typography suppressContentEditableWarning={true}
                            onBlur={saveValue}
                            onKeyDown={onKeyDown}
                            onClick={e => e.stopPropagation()}
                            contentEditable={true}>{name}</Typography>
            </Grid>
        )
    }

    return (
        <Grid container alignItems="center">
            <Typography>{name}</Typography>
        </Grid>
    )
}

export const renderMoves = ({rowIndex: index, cellData: moves}) => {
    return <LineMoveList moves={moves} hoverable={true}/>
}

const AddOpeningButton = withStyles((theme) => ({
    root: {
        '&:hover': {
            color: 'green',
        },
    },
}))(AddBox)

const RemoveOpeningButton = withStyles((theme) => ({
    root: {
        '&:hover': {
            color: 'orange',
        },
    },
}))(Remove)

const FavoriteButton = withStyles((theme) => ({
    root: {
        '&:hover': {
            color: '#FFCCCB',
        },
    },
}))(Favorite)

const FavoriteButtonActive = withStyles((theme) => ({
    root: {
        color: 'red',
    },
}))(Favorite)

export const favoriteOpening = ({
                                    rowIndex: index,
                                    cellData: openingName,
                                    isCustomOpening,
                                    addCustomOpening,
                                    removeCustomOpening,
                                    addFavoriteOpening,
                                    removeFavoriteOpening,
                                    isFavoriteOpening,
                                }) => {
    let content
    if (index === 0) {
        content = <AddOpeningButton onClick={(e) => {
            addCustomOpening()
            e.stopPropagation()
        }}/>
    } else if (isCustomOpening(openingName)) {
        content = <RemoveOpeningButton onClick={(e) => {
            removeCustomOpening(openingName)
            e.stopPropagation()
        }}/>
    } else if (isFavoriteOpening(openingName)) {
        content = <FavoriteButtonActive onClick={(e) => {
            removeFavoriteOpening(openingName)
            e.stopPropagation()
        }}/>
    } else {
        content = <FavoriteButton onClick={(e) => {
            addFavoriteOpening(openingName)
            e.stopPropagation()
        }}/>
    }

    return <Grid container alignItems="center">
        {content}
    </Grid>
}
