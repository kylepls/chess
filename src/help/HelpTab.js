import {Container, makeStyles, Typography} from '@material-ui/core'

const useStyles = makeStyles({})

export const HelpTab = () => {

    const styles = useStyles()

    return (
        <Container>
            <br/>
            <Typography variant="h4">
                About
            </Typography>
            <Typography paragraph={true}>
                This site works to help you learn how to play chess openings.
                Click on the explorer tab to see example openings.
            </Typography>

            <Typography variant="h4">
                Explore
            </Typography>
            <Typography paragraph={true}>
                You can play moves on the board and they will appear in the moves list (explorer tab).
            </Typography>

            <Typography variant="h4">
                Practice
            </Typography>
            <Typography paragraph={true}>
                Select an opening from the list of openings then click the play button.
                This will allow you to practice against a computer that selects a weighted random move from the top
                Lichess moves for the current position. This will ingrain the most common opening lines into your
                memory. The game will reset after a line is reaches a low frequency of occurrence. Note your evaluation
                during the reset period.
            </Typography>

            <Typography variant="h4">
                Evaluate
            </Typography>
            <Typography paragraph={true}>
                Click on the analysis tab to see an evaluation of the opening.
                Hover over the moves to preview the board at each move. You can also click on the move to set the board
                to that position.

                <br/>
                The evaluation is given in terms of centi-pawn loss (CP). This evaluation is based on what the computer
                think the current advantage is in terms of hundreds of pawns. If white is winning, the evaluation is
                positive. An advantage of 0 is neutral. If black is winning, the evaluation is negative.
            </Typography>
        </Container>
    )
}
