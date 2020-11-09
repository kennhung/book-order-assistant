import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Card, CardContent, Typography, CardActions, Button, Container, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(15, 4)
        }
    })
);

function Home() {
    const classes = useStyles();

    return (
        <Container maxWidth="xl" className={classes.root}>
            <Grid container spacing={3} justify="center">
                <Grid item xs md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                Book Order Assistant
                            </Typography>
                            <Typography color="textSecondary" style={{ marginBottom: ".5rem" }}>
                                訂書小幫手
                            </Typography>
                            <Typography variant="body2" component="p">
                                團購訂書的好用工具
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home
