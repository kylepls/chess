import {Box, makeStyles, Paper, Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {PracticeTab} from "./practice/PracticeTab";
import {AnalysisTab} from "./analysis/AnalysisTab";
import React, {useContext, useEffect, useState} from "react";
import {BoardContext} from "./board/BoardContext";
import {AnalysisContext} from "./analysis/AnalysisContext";
import {ExplorerTab} from "./explorer/ExplorerTab";

const useStyles = makeStyles({
    paper: {
        overflowY: "hidden"
    },
    tabList: {
        height: 'auto'
    },
    tabPanel: {
        padding: '0 !important'
    },
    flip: {
        cursor: 'pointer',
        alignSelf: "center"
    }
})

export const RightBar = () => {

    const [tab, setTab] = useState("explorer")
    const [boardState, dispatchBoard] = useContext(BoardContext);
    const [analysisState, dispatchAnalysis] = useContext(AnalysisContext);

    const flipBoard = () => {
        dispatchBoard({type: 'FLIP_ORIENTATION'})
    }

    useEffect(() => {
        const run = tab === "analysis";
        dispatchAnalysis({type: 'SET_RUN', payload: run})
    }, [tab])

    const styles = useStyles();
    return (
        <Paper className={styles.paper}>
            <TabContext value={String(tab)}>
                <Box display="flex" flexDirection="column">
                    <TabList className={styles.tabList}
                             onChange={(event, newValue) => setTab(newValue)}>
                        <Tab label="explorer" value="explorer"/>
                        <Tab label="practice" value="practice"/>
                        <Tab label="analysis" value="analysis"/>
                    </TabList>
                    {/*<Box className={styles.flip}>*/}
                    {/*    <LoopIcon onClick={flipBoard}/>*/}
                    {/*</Box>*/}
                    <TabPanel className={styles.tabPanel} value="explorer">
                        <ExplorerTab/>
                    </TabPanel>
                    <TabPanel className={styles.tabPanel} value="practice">
                        <PracticeTab/>
                    </TabPanel>
                    <TabPanel value="analysis">
                        <AnalysisTab/>
                    </TabPanel>
                </Box>
            </TabContext>
        </Paper>
    )
}
