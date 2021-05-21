import {
    Box,
    LinearProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab'
import {useAnalysisContext} from 'analysis/AnalysisContext'
import {LineMoveList} from 'analysis/line/LineMoveList'
import {LineScore} from 'analysis/LineScore'

// eslint-disable-next-line no-extend-native
Array.prototype.max = function () {
    return Math.max.apply(null, this)
}

// eslint-disable-next-line no-extend-native
Array.prototype.min = function () {
    return Math.min.apply(null, this)
}

const useStyles = makeStyles({
    line: {
        height: 'auto',
    },
    box: {
        width: 'auto',
        height: 'auto',
    },
    text: {
        width: 'fit-content',
    },
})

export const AnalysisLines = () => {
    const {lines, depth} = useAnalysisContext()

    const currentDepth = [...lines.filter(it => it.depth).map(it => it.depth), depth].min()

    return (
        <TableContainer>
            <LinearProgressWithLabel variant="determinate"
                                     value={currentDepth / depth * 100}
                                     displayValue={`${currentDepth}/${depth}`}/>
            <Table display="block">
                <colgroup>
                    <col width="10%"/>
                </colgroup>
                <TableBody>
                    {lines.map((it, i) => <Line key={i} moves={it.moves} score={it.score}/>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const Line = ({moves, score}) => {
    return (
        <TableRow>
            {moves ?
                <>
                    <TableCell key="score"><LineScore score={score}/></TableCell>
                    <TableCell key="moves">
                        <LineMoveList moves={moves}/>
                    </TableCell>
                </>
                : <Skeleton/>
            }
        </TableRow>
    )
}

const LinearProgressWithLabel = (props) => {
    const {displayValue} = props
    const passProps = {...props}
    delete passProps['displayValue']

    const styles = useStyles()
    return (
        <Box className={styles.box} display="flex" alignItems="center" justifyContent="center" alignContent="center">
            <Box className={null} width="100%" mr={1}>
                <LinearProgress variant="determinate" {...passProps} />
            </Box>
            <Box className={styles.box} minWidth={70} display="flex" justifyContent="center" alignItems="center">
                <Typography className={styles.text} variant="h6" color="textSecondary">{displayValue}</Typography>
            </Box>
        </Box>
    )
}
