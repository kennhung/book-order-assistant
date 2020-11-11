import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Grid, Paper, Typography, Theme, Button } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(3),
            textAlign: 'center'
        },
        warningText: {
            color: theme.palette.warning.main
        },
        homeBtn: {
            margin: theme.spacing(3, 0)
        }
    }),
);

function NotFoundPage() {
    const classes = useStyles();

    const history = useHistory();

    return (
        <Grid container spacing={3} justify="center">
            <Grid item xs={12} md={6} lg={4}>
                <Paper className={classes.paper}>
                    <WarningIcon fontSize="large" className={classes.warningText} />
                    <Typography variant="h3" className={classes.warningText}>
                        Oh no.
                    </Typography>
                    <Typography variant="h5">
                        Page Not Found!!
                    </Typography>
                    <Button variant="contained" color="secondary" className={classes.homeBtn} onClick={() => {
                        history.push('/');
                    }}>
                        Go To Homepage
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default NotFoundPage
