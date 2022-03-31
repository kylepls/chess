import {Grid, makeStyles, Paper, Tab} from '@material-ui/core'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'
import {useAnalysisContextDispatch} from 'analysis/AnalysisContext'
import {AnalysisTab} from 'analysis/AnalysisTab'
import {ExplorerTab} from 'explorer/ExplorerTab'
import {HelpTab} from 'help/HelpTab'
import {PracticeTab} from 'practice/PracticeTab'
import React, {useEffect, useLayoutEffect, useRef} from 'react'
import {SettingsTab} from 'settings/SettingsTab'
import {useSyncedLocalStorage} from 'use-synced-local-storage'
import {useForceUpdate} from 'utils/ForceUpdate'

const useStyles = makeStyles({
    tabList: {
        height: 'auto',
    },
    tab: {
        minWidth: 'unset !important',
        flex: '1 0 auto',
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
                            <Tab className={styles.tab} label="explorer" value="explorer"/>
                            <Tab className={styles.tab} label="practice" value="practice"/>
                            <Tab className={styles.tab} label="analysis" value="analysis"/>
                            <Tab className={styles.tab} label="settings" value="settings"/>
                            <Tab className={styles.tab} label="help" value="help"/>
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
                            <TabPanel className={styles.tabPanel} value="help">
                                <HelpTab/>
                            </TabPanel>
                            <TabPanel value="analysis">
                                <AnalysisTab/>
                            </TabPanel>
                            <TabPanel value="settings">
                                <SettingsTab/>
                            </TabPanel>
                        </div>
                    </Grid>
                </Grid>
            </TabContext>
        </Paper>
    )
}
