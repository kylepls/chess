import {FormControl, Grid, makeStyles, Slider, Typography} from '@material-ui/core'
import {Lichess} from 'Lichess'
import {useSettingsContext, useSettingsContextDispatch} from 'settings/SettingsContext'

const useStyles = makeStyles({
    formControl: {
        height: 'auto',
    },
    slider: {
        width: '93%',
    },
})

export const SettingsTab = () => {

    const styles = useStyles()

    const settings = useSettingsContext()
    const dispatchSettings = useSettingsContextDispatch()

    const handleSpeedChange = (newValues) => {
        dispatchSettings({type: 'SET', payload: {lichessSpeeds: newValues}})
    }

    const handleRatingChange = (newValues) => {
        dispatchSettings({type: 'SET', payload: {lichessRatings: newValues}})
    }

    return (
        <>
            <FormControl className={styles.formControl}>
                <Typography gutterBottom variant="h5">Speeds</Typography>
                <Grid container justify="center">
                    <DiscreteRangeSlider className={styles.slider} values={settings.lichessSpeeds}
                                         possibleValues={Lichess.speeds}
                                         onChange={handleSpeedChange}/>
                </Grid>
            </FormControl>
            <br/>
            <br/>
            <FormControl className={styles.formControl}>
                <Typography gutterBottom variant="h5">Ratings</Typography>
                <Grid container justify="center">
                    <DiscreteRangeSlider className={styles.slider} values={settings.lichessRatings}
                                         possibleValues={Lichess.ratings}
                                         onChange={handleRatingChange}/>
                </Grid>
            </FormControl>
        </>
    )
}

const DiscreteRangeSlider = (props) => {
    const {values, possibleValues, onChange} = props

    const handleRatingChange = (event, newRange) => {
        const [start, end] = newRange
        const newValues = possibleValues.slice(start, end + 1)
        onChange(newValues)
    }

    const marks = possibleValues.map((it, i) => ({value: i, label: it}))

    const indexes = values.map(it => possibleValues.indexOf(it))
    const minIndex = indexes.min()
    const maxIndex = indexes.max()

    return (
        <Slider {...props} marks={marks} min={0} max={possibleValues.length - 1} value={[minIndex, maxIndex]}
                onChange={handleRatingChange}/>
    )
}
