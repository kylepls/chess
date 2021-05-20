import {Container, createMuiTheme, CssBaseline, Grid, MuiThemeProvider} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {AnalysisContextProvider} from 'analysis/AnalysisContext'
import {AnalysisController} from 'analysis/AnalysisController'
import 'App.css'
import {Board} from 'board/Board'
import {BoardContextProvider} from 'board/BoardContext'

import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'
import {OpeningsContextProvider} from 'practice/pgn/OpeningsContext'
import {PracticeContextProvider} from 'practice/PracticeContext'
import React from 'react'
import {RightBar} from 'RightBar'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appArea: {
        maxWidth: '85vw',
        height: '90%',
    },
})

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        sides: {
            white: {
                background: '#fff',
                color: '#303030',
            },
            draw: {
                background: '#666',
                color: '#fff',
            },
            black: {
                background: '#333',
                color: '#fff',
            },
        }
    },
})

export const App = () => {
    const styles = useStyles()
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                <div className={styles.root}>
                    <OpeningsContextProvider>
                        <BoardContextProvider>
                            <AnalysisContextProvider>
                                <PracticeContextProvider>
                                    <AnalysisController>
                                        <AppArea key={0}/>
                                    </AnalysisController>
                                </PracticeContextProvider>
                            </AnalysisContextProvider>
                        </BoardContextProvider>
                    </OpeningsContextProvider>
                </div>
            </div>
        </MuiThemeProvider>
    )
}

const AppArea = () => {
    const styles = useStyles()
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
