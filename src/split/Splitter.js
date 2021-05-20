import {Box, makeStyles} from '@material-ui/core'

const useStyles = makeStyles({
    item: {
        flexGrow: 1,
        flexShrink: 1,
    },
})

export const VerticalSplit = ({children, splits: split}) => {
    const styles = useStyles()
    return (
        <Box display="flex" flexDirection="column">
            {children.map((child, i) =>
                <Box className={styles.item} key={i} height={`${split[i]}%`}>
                    {child}
                </Box>,
            )}
        </Box>
    )
}
