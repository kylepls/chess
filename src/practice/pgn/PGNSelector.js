import {useContext, useEffect, useLayoutEffect, useMemo, useRef} from "react";

import {OpeningsContext} from "./OpeningsContext";
import {makeStyles, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import {PracticeContext} from "../PracticeContext";
import {BoardContext} from "../../board/BoardContext";
import {LineMoveList} from "../../analysis/line/LineMoveList";
import {loadPgn} from "./PgnLoader";
import {useSyncedLocalStorage} from "use-synced-local-storage";

const useStyles = makeStyles({
    row: {
        cursor: 'pointer',
        '&:hover': {
            background: '#aaa'
        }
    },
    selected: {
        background: '#aaa'
    }
})

export const PGNSelector = () => {
    const [{openings}, dispatchOpening] = useContext(OpeningsContext);
    const [practiceState, dispatchPractice] = useContext(PracticeContext);
    const [_, dispatchBoard] = useContext(BoardContext);
    const [openingName, setOpeningName] = useSyncedLocalStorage('selectedOpening')

    useEffect(() => {
        loadPgn((openings) => {
            dispatchOpening({type: 'SET_OPENINGS', payload: openings})
        })
    }, [dispatchOpening])


    useEffect(() => {
        if (openingName && openings) {
            const opening = openings[openingName]
            if (!opening) {
                setOpeningName(null)
            } else {
                dispatchPractice({type: 'SET_OPENING', payload: opening})
                dispatchBoard({type: 'SET_MOVES', payload: opening.moves})
                dispatchBoard({type: 'SET_ORIENTATION', payload: opening.orientation})
            }
        }
    }, [openings, openingName])

    const content = useMemo(() => {
        if (!openings) {
            return <Loader/>
        } else {
            const sortedEntries = Object.entries(openings)
            sortedEntries.sort(([a], [b]) => a.localeCompare(b));
            // TODO this needs to be a react-virtualized table
            return (
                <TableContainer>
                    <Table>
                        <TableBody>
                            {sortedEntries.map(([name, opening]) =>
                                <Row
                                    key={name}
                                    opening={opening}
                                    setOpeningName={setOpeningName}
                                    selected={opening.name === openingName}
                                />
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
    }, [openings, openingName])

    return content
}

const Row = ({opening, setOpeningName, selected}) => {
    const ref = useRef();

    useLayoutEffect(() => {
        if (selected) {
            ref.current.scrollIntoViewIfNeeded({behavior: 'smooth'})
        }
    }, [])

    const styles = useStyles();
    const selectedCss = selected ? styles.selected : ''
    return (
        <TableRow ref={ref}
                  className={`${styles.row} ${selectedCss}`}
                  onClick={() => !selected ? setOpeningName(opening.name) : null}
                  key={opening.name}
        >
            <TableCell>{opening.name}</TableCell>
            <TableCell>
                <LineMoveList moves={opening.moves} hoverable={true}/>
            </TableCell>
        </TableRow>
    )
}

const Loader = () => {
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {[...Array(10).keys()].map(it =>
                        <TableRow key={it}>
                            <TableCell><Skeleton/></TableCell>
                            <TableCell><Skeleton/></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
