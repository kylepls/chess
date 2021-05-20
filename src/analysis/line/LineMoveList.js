import {Grid} from '@material-ui/core'
import {Move} from 'analysis/line/Move'

export const LineMoveList = ({moves, hoverable = true}) => {
    return (
        <Grid container alignItems="center">
            {moves.map((move, i) =>
                <Move key={i} move={move} hoverable={hoverable}/>,
            )}
        </Grid>
    )
}
