import {memo, useContext, useEffect, useLayoutEffect, useMemo, useRef} from "react";

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
    const [boardState, dispatchBoard] = useContext(BoardContext);

    useEffect(() => {
        loadPgn((openings) => {
            const sortedEntries = Object.values(openings)
                .sort((a, b) => a.name.localeCompare(b.name))
            dispatchOpening({type: 'SET_OPENINGS', payload: sortedEntries})
        })
    }, [dispatchOpening])

    if (!openings) {
        return <Loader/>
    } else {
        return <MemoResizeTable history={boardState.history.slice(0, boardState.currentMove + 1)}
                                dispatchBoard={dispatchBoard}
                                fen={boardState.chessjs.fen()}/>
    }
}

const MemoResizeTable = (props) => {
    // This prevents the history prop from redrawing the table
    return useMemo(() => (<ResizeTable {...props} />), [props.fen])
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

const ResizeTable = ({history, dispatchBoard}) => {

    const [{openings}] = useContext(OpeningsContext);
    const [practiceState, dispatchPractice] = useContext(PracticeContext);

    const [selectedOpeningName, setSelectedOpeningName] = useSyncedLocalStorage('selectedOpening')
    const tableRef = useRef()

    let sortedEntries = openings

    if (!selectedOpeningName) {
        sortedEntries = sortedEntries.filter(it =>
            it.moves.length >= history.length &&
            it.moves.every((it, i) => {
                const boardMove = history[i]
                return !boardMove || (boardMove?.from === it.from && boardMove?.to === it.to)
            })
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
            setSelectedOpeningName(null)
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
