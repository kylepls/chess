import {makeStyles} from '@material-ui/core'
import {useBoardContext, useBoardContextDispatch} from 'board/BoardContext'

import {useOpeningsContext} from 'practice/pgn/OpeningsContext'
import {favoriteOpening, renderMoves, renderName} from 'practice/pgn/VirtualizedRowContent'
import {usePracticeContextDispatch} from 'practice/PracticeContext'
import {useEffect, useLayoutEffect, useMemo, useRef} from 'react'
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
    heart: {
        '&:hover': {
            background: theme.palette.secondary.light,
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

const ResizeTable = () => {

    const [favoriteOpenings, setFavoriteOpenings] = useSyncedLocalStorage('favoriteOpenings', [])
    const {openings: unsortedOpenings} = useOpeningsContext()
    const state = useBoardContext()
    const [customOpenings, setCustomOpenings] = useSyncedLocalStorage('customOpenings', [])

    const [customOpeningId, setCustomOpeningId] = useSyncedLocalStorage('customOpeningId', 1)

    const openings = useMemo(() => {
        return Object.values(unsortedOpenings)
            .sort((a, b) => {
                const compute = (value) => favoriteOpenings.some(it => it === value.name)
                const n = compute(b) - compute(a)
                if (n !== 0) return n
                return a.name.localeCompare(b.name)
            })
    }, [unsortedOpenings, favoriteOpenings, customOpenings])

    const dispatchPractice = usePracticeContextDispatch()

    const boardState = useBoardContext()
    const dispatchBoard = useBoardContextDispatch()
    const history = boardState.history.slice(0, boardState.currentMove + 1)

    const [selectedOpeningName, setSelectedOpeningName] = useSyncedLocalStorage('selectedOpening')
    const tableRef = useRef()

    const addCustomOpening = () => {
        const toMove = state.boardChessjs.turn() === 'b' ? 'black' : 'white'
        const {orientation} = state

        const opening = {
            name: `Custom ${customOpeningId}`,
            moves: state.history,
            toMove,
            orientation,
        }

        setCustomOpenings([...customOpenings, opening])
        setCustomOpeningId(customOpeningId + 1)
    }

    let entries = [...customOpenings, ...openings]
    if (!selectedOpeningName) {
        entries = entries.filter(it =>
            it.moves.length >= history.length &&
            it.moves.every((it, i) => {
                const boardMove = history[i]
                return !boardMove || (boardMove?.from === it.from && boardMove?.to === it.to)
            }),
        )
    }
    let customPlaceholder = {name: 'Add an opening', moves: state.history, addCustomOpening}
    entries = [customPlaceholder, ...entries]

    useEffect(() => {
        if (openings && selectedOpeningName) {
            const opening = customOpenings.find(it => it.name === selectedOpeningName) ||
                openings.find(it => it.name === selectedOpeningName)
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
        const opening = entries[index]
        if (selectedOpeningName === opening?.name) {
            return `${styles.selected} ${styles.row}`
        } else {
            return styles.row
        }
    }

    useLayoutEffect(() => {
        const selectedIndex = entries.findIndex(it => it.name === selectedOpeningName)
        if (selectedIndex !== -1) {
            window.requestAnimationFrame(() => {
                tableRef.current.scrollToRow(selectedIndex)
            })
        }
    }, [openings])

    const isCustomOpening = (name) => customOpenings.some(it => it.name === name)
    const removeCustomOpening = (name) => setCustomOpenings(customOpenings.filter(it => it.name !== name))
    const updateCustomOpeningName = (from, to) => {
        const openingIndex = customOpenings.findIndex(it => it.name === from)
        const newOpenings = [...customOpenings]
        newOpenings[openingIndex] = {...newOpenings[openingIndex], name: to}
        setCustomOpenings(newOpenings)
    }

    const addFavoriteOpening = (opening) => setFavoriteOpenings([...favoriteOpenings, opening])
    const removeFavoriteOpening = (name) => setFavoriteOpenings(favoriteOpenings.filter(it => it !== name))
    const isFavoriteOpening = (name) => favoriteOpenings.some(it => it === name)

    return (
        <AutoSizer>
            {({width, height}) =>
                <Table
                    ref={tableRef}
                    width={width}
                    height={height}
                    loaderHeight={height}
                    rowHeight={height / 5}
                    rowCount={entries.length}
                    rowGetter={({index}) => entries[index]}
                    onRowClick={select}
                    rowClassName={rowClass}
                >
                    <Column label={'favorite'} dataKey={'name'} width={width * 0.07}
                            cellRenderer={props => favoriteOpening({
                                ...props,
                                openings: entries,
                                isCustomOpening,
                                addCustomOpening,
                                removeCustomOpening,
                                isFavoriteOpening,
                                removeFavoriteOpening,
                                addFavoriteOpening,
                            })}/>
                    <Column
                        label="Name"
                        dataKey="name"
                        width={width * 0.53}
                        cellRenderer={props => renderName({
                            ...props,
                            isCustomOpening,
                            updateCustomOpeningName,
                        })}
                        className={styles.openingName}
                    />
                    <Column label="Moves" dataKey="moves" width={width * 0.4} cellRenderer={renderMoves}/>
                </Table>
            }
        </AutoSizer>
    )
}
const Loader = () => (<></>)
