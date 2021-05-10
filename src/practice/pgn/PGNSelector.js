import {useContext, useEffect, useLayoutEffect, useRef} from "react";

import {OpeningsContext} from "./OpeningsContext";
import {PracticeContext} from "../PracticeContext";
import {BoardContext} from "../../board/BoardContext";
import {LineMoveList} from "../../analysis/line/LineMoveList";
import {loadPgn} from "./PgnLoader";
import {useSyncedLocalStorage} from "use-synced-local-storage";
import 'react-virtualized/styles.css'
import {Grid, makeStyles, Typography} from "@material-ui/core";
import {AutoSizer, Column, Table} from "react-virtualized";

const useStyles = makeStyles(theme => ({
    openingName: {},
    row: {
        borderBottomColor: 'rgb(128,128,128, 0.4)',
        boxSizing: 'border-box',
        borderBottom: '1px solid',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.action.hover
        },
        '&:active': {
            background: theme.palette.primary.dark
        }
    },
    selected: {
        background: theme.palette.primary.light,
        '&:hover': {
            background: theme.palette.primary.main
        },
        '&:active': {
            background: theme.palette.primary.dark
        }
    }
}))

export const PGNSelector = () => {
    const [{openings}, dispatchOpening] = useContext(OpeningsContext);

    useEffect(() => {
        loadPgn((openings) => {
            dispatchOpening({type: 'SET_OPENINGS', payload: openings})
        })
    }, [dispatchOpening])

    if (!openings) {
        return <Loader/>
    } else {
        return <ResizeTable/>
    }
}

const ResizeTable = () => {

    const [{openings}, dispatchOpening] = useContext(OpeningsContext);
    const [practiceState, dispatchPractice] = useContext(PracticeContext);
    const [boardState, dispatchBoard] = useContext(BoardContext);

    const [selectedOpeningName, setSelectedOpeningName] = useSyncedLocalStorage('selectedOpening')
    const tableRef = useRef()

    let sortedEntries = Object.values(openings)
        .sort((a, b) => a.name.localeCompare(b.name))

    if (!selectedOpeningName) {
        sortedEntries = sortedEntries.filter(it =>
            it.moves.every((it, i) => {
                const boardMove = boardState.history[i]
                return !boardMove || (boardMove?.from === it.from && boardMove?.to === it.to)
            })
        )
    }

    useLayoutEffect(() => {
        const selectedIndex = sortedEntries.findIndex(it => it.name === selectedOpeningName)
        if (selectedIndex !== -1) {
            const timeout = setTimeout(() => {
                tableRef.current.scrollToRow(selectedIndex)
            }, 0); // need to wait for the table to fully render
            return () => clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (openings) {
            if (selectedOpeningName) {
                const opening = openings[selectedOpeningName]
                if (!opening) {
                    setSelectedOpeningName(null)
                } else {
                    dispatchPractice({type: 'SET_OPENING', payload: opening})
                    dispatchBoard({type: 'SET_MOVES', payload: opening.moves})
                    dispatchBoard({type: 'SET_ORIENTATION', payload: opening.orientation})
                }
            } else {
                dispatchPractice({type: 'SET_OPENING', payload: null})
                dispatchBoard({type: 'SET_MOVES', payload: []})
            }
        }
    }, [selectedOpeningName])

    const select = ({rowData: opening}) => {
        if (selectedOpeningName !== opening.name) {
            setSelectedOpeningName(opening.name)
        } else {
            setSelectedOpeningName(null)
        }
    }


    const renderName = ({cellData: name}) => {
        return (
            <Grid container alignItems='center'>
                <Typography>{name}</Typography>
            </Grid>
        )
    }

    const renderMoves = ({cellData: moves}) => {
        return <LineMoveList moves={moves} hoverable={true}/>
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
                        label='Name'
                        dataKey='name'
                        width={width * 0.6}
                        cellRenderer={renderName}
                        className={styles.openingName}
                    />
                    <Column label='Moves' dataKey='moves' width={width * 0.4} cellRenderer={renderMoves}/>
                </Table>
            }
        </AutoSizer>
    )
}

const Loader = () => {
    return <></>
}
