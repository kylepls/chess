import {Box, makeStyles, TableCell, TableRow} from "@material-ui/core";
import {LineScore} from "../LineScore";
import {Skeleton} from "@material-ui/lab";
import {Move} from "./Move";

export const LineMoveList = ({moves, hoverable=true}) => {
    return (
        <Box display="flex" flexDirection="row">
            {moves.map((move, i) =>
                <Move key={i} move={move} hoverable={hoverable}/>
            )}
        </Box>
    )
}
