import React from 'react';
import './App.css';

import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'
import {makeStyles} from "@material-ui/styles";
import {Board} from "./board/Board";
import {GeneralContext} from "./practice/pgn/OpeningsContext";
import {Container, createMuiTheme, CssBaseline, Grid, MuiThemeProvider} from "@material-ui/core";
import {BoardContextProvider} from "./board/BoardContext";
import {PracticeContextProvider} from "./practice/PracticeContext";
import {AnalysisContextProvider} from "./analysis/AnalysisContext";
import {AnalysisController} from "./analysis/AnalysisController";
import {RightBar} from "./RightBar";

const useStyles = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    appArea: {
        maxWidth: "85vw",
        height: "90%",
    },
});

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
})

export const App = () => {
    const styles = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                <div className={styles.root}>
                    <GeneralContext>
                        <BoardContextProvider>
                            <AnalysisContextProvider>
                                <PracticeContextProvider>
                                    <AnalysisController>
                                        <AppArea/>
                                    </AnalysisController>
                                </PracticeContextProvider>
                            </AnalysisContextProvider>
                        </BoardContextProvider>
                    </GeneralContext>
                </div>
            </div>
        </MuiThemeProvider>
    );
}

const AppArea = () => {
    const styles = useStyles();
    return (
        <Container className={styles.appArea}>
            <Grid container>
                <Grid item xs={7}>
                    <Board/>
                </Grid>
                <Grid item xs={5}>
                    <RightBar/>
                </Grid>
            </Grid>
        </Container>
    )
}

export default App;
