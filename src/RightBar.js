import {Grid, makeStyles, Paper, Tab} from '@material-ui/core'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'
import {useAnalysisContextDispatch} from 'analysis/AnalysisContext'
import {AnalysisTab} from 'analysis/AnalysisTab'
import {ExplorerTab} from 'explorer/ExplorerTab'
import {PracticeTab} from 'practice/PracticeTab'
import React, {useEffect, useLayoutEffect, useRef} from 'react'
import {useSyncedLocalStorage} from 'use-synced-local-storage'
import {useForceUpdate} from 'utils/ForceUpdate'

const useStyles = makeStyles({
    tabList: {
        height: 'auto',
    },
    tabPanel: {
        padding: '0 !important',
    },
})

export const RightBar = () => {

    const [tab, setTab] = useSyncedLocalStorage('tab', 'explorer')
    const dispatchAnalysis = useAnalysisContextDispatch()

    const tabListRef = useRef()

    useEffect(() => {
        const run = tab === 'analysis'
        dispatchAnalysis({type: 'SET_RUN', payload: run})
    }, [tab, dispatchAnalysis])

    const update = useForceUpdate()
    const headerHeight = tabListRef.current?.offsetHeight || 0
    useLayoutEffect(() => {
        // re-render after layout is completed to force the headerHeight to be applied correctly
        update()
    }, [update])

    const styles = useStyles()
    return (
        <Paper>
            <TabContext value={String(tab)}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <TabList ref={tabListRef} className={styles.tabList}
                                 onChange={(event, newValue) => setTab(newValue)}>
                            <Tab label="explorer" value="explorer"/>
                            <Tab label="practice" value="practice"/>
                            <Tab label="analysis" value="analysis"/>
                        </TabList>
                        <div style={{
                            height: `calc(100% - ${headerHeight}px)`,
                        }}>
                            <TabPanel className={styles.tabPanel} value="explorer">
                                <ExplorerTab/>
                            </TabPanel>
                            <TabPanel className={styles.tabPanel} value="practice">
                                <PracticeTab/>
                            </TabPanel>
                            <TabPanel value="analysis">
                                <AnalysisTab/>
                            </TabPanel>
                        </div>
                    </Grid>
                </Grid>
            </TabContext>
        </Paper>
    )
}
