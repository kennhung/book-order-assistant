import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Card, CardContent, Container, Grid, Theme, Typography } from '@material-ui/core'
import OrdersDataGrid from './OrdersDataGrid'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataGridWrapper: {
            margin: theme.spacing(2, 0)
        }
    })
);

function MyOrders() {
    const classes = useStyles();

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5">
                                        My Orders
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} className={classes.dataGridWrapper}>
                                    <OrdersDataGrid />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default MyOrders
