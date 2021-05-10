import {Box, Grid, makeStyles, Paper, Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {PracticeTab} from "./practice/PracticeTab";
import {AnalysisTab} from "./analysis/AnalysisTab";
import React, {useContext, useEffect, useState} from "react";
import {BoardContext} from "./board/BoardContext";
import {AnalysisContext} from "./analysis/AnalysisContext";
import {ExplorerTab} from "./explorer/ExplorerTab";
import {useSyncedLocalStorage} from "use-synced-local-storage";

const useStyles = makeStyles({
    tabList: {
        height: 'auto'
    },
    tabPanel: {
        padding: '0 !important'
    },
})

export const RightBar = () => {

    const [tab, setTab] = useSyncedLocalStorage('tab', 'explorer')
    const [analysisState, dispatchAnalysis] = useContext(AnalysisContext);

    useEffect(() => {
        const run = tab === 'analysis';
        dispatchAnalysis({type: 'SET_RUN', payload: run})
    }, [tab])

    const styles = useStyles();
    return (
        <Paper>
            <TabContext value={String(tab)}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <TabList className={styles.tabList}
                                 onChange={(event, newValue) => setTab(newValue)}>
                            <Tab label="explorer" value="explorer"/>
                            <Tab label="practice" value="practice"/>
                            <Tab label="analysis" value="analysis"/>
                        </TabList>
                        <TabPanel className={styles.tabPanel} value="explorer">
                            <ExplorerTab/>
                        </TabPanel>
                        <TabPanel className={styles.tabPanel} value="practice">
                            <PracticeTab/>
                        </TabPanel>
                        <TabPanel value="analysis">
                            <AnalysisTab/>
                        </TabPanel>
                    </Grid>
                </Grid>
            </TabContext>
        </Paper>
    )
}
