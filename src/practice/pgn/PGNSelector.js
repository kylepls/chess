import {Grid, makeStyles, Typography} from '@material-ui/core'
import {LineMoveList} from 'analysis/line/LineMoveList'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'

import {useOpeningsContext} from 'practice/pgn/OpeningsContext'
import {usePracticeContextDispatch} from 'practice/PracticeContext'
import {useEffect, useLayoutEffect, useRef} from 'react'
import {AutoSizer, Column, Table} from 'react-virtualized'
import 'react-virtualized/styles.css'
import {useSyncedLocalStorage} from 'use-synced-local-storage'

const useStyles = makeStyles(theme => ({
    row: {
        borderBottomColor: 'rgb(128,128,128, 0.4)',
        boxSizing: 'border-box',
        borderBottom: '1px solid',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.action.hover,
        },
        '&:active': {
            background: theme.palette.primary.dark,
        },
    },
    selected: {
        background: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.dark,
        },
    },
}))

export const PGNSelector = () => {
    const {openings} = useOpeningsContext()
    if (!openings) {
        return <Loader/>
    } else {
        return <ResizeTable/>
    }
}

const renderName = ({cellData: name}) => {
    return (
        <Grid container alignItems="center">
            <Typography>{name}</Typography>
        </Grid>
    )
}

const renderMoves = ({cellData: moves}) => {
    return <LineMoveList moves={moves} hoverable={true}/>
}

const ResizeTable = () => {

    const {openings} = useOpeningsContext()

    const dispatchPractice = usePracticeContextDispatch()

    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()
    const history = boardState.history.slice(0, boardState.currentMove + 1)

    const [selectedOpeningName, setSelectedOpeningName] = useSyncedLocalStorage('selectedOpening')
    const tableRef = useRef()

    let sortedEntries = openings
    if (!selectedOpeningName) {
        sortedEntries = sortedEntries.filter(it =>
            it.moves.length >= history.length &&
            it.moves.every((it, i) => {
                const boardMove = history[i]
                return !boardMove || (boardMove?.from === it.from && boardMove?.to === it.to)
            }),
        )
    }

    useEffect(() => {
        if (openings && selectedOpeningName) {
            const opening = openings.find(it => it.name === selectedOpeningName)
            if (!opening) {
                setSelectedOpeningName(null)
            } else {
                dispatchPractice({type: 'SET_OPENING', payload: opening})
                dispatchBoard({type: 'SET_MOVES', payload: opening.moves})
                dispatchBoard({type: 'SET_ORIENTATION', payload: opening.orientation})
            }
        }
    }, [selectedOpeningName])

    const select = ({rowData: opening}) => {
        if (selectedOpeningName !== opening.name) {
            setSelectedOpeningName(opening.name)
        } else {
            dispatchPractice({type: 'SET_OPENING', payload: null})
            dispatchBoard({type: 'SET_MOVES', payload: []})

            // here the opening is set to a bogus value
            // this will give time for the board to update to reflect the new state
            // this makes sure that the openings list.length != 1. If this is ever true, the scroll bar position
            // is reset to the top
            setSelectedOpeningName('asdf')
        }
    }

    const styles = useStyles()
    const rowClass = ({index}) => {
        const opening = sortedEntries[index]
        if (selectedOpeningName === opening?.name) {
            return `${styles.selected} ${styles.row}`
        } else {
            return styles.row
        }
    }

    useLayoutEffect(() => {
        const selectedIndex = openings.findIndex(it => it.name === selectedOpeningName)
        if (selectedIndex !== -1) {
            window.requestAnimationFrame(() => {
                tableRef.current.scrollToRow(selectedIndex)
            })
        }
    }, [openings])

    return (
        <AutoSizer>
            {({width, height}) =>
                <Table
                    ref={tableRef}
                    width={width}
                    height={height}
                    loaderHeight={height}
                    rowHeight={height / 5}
                    rowCount={sortedEntries.length}
                    rowGetter={({index}) => sortedEntries[index]}
                    onRowClick={select}
                    rowClassName={rowClass}
                >
                    <Column
                        label="Name"
                        dataKey="name"
                        width={width * 0.6}
                        cellRenderer={renderName}
                        className={styles.openingName}
                    />
                    <Column label="Moves" dataKey="moves" width={width * 0.4} cellRenderer={renderMoves}/>
                </Table>
            }
        </AutoSizer>
    )
}

const Loader = () => {
    return (
        <></>
        // <SpinnerOverlayContainer>
        //     <SpinnerOverlay size={'10vmin'}/>
        // </SpinnerOverlayContainer>
    )
}
