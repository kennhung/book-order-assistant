import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Card, CardContent, Container, Grid, Theme, Typography } from '@material-ui/core'
import OrdersDataGrid from './OrdersDataGrid'

import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded, useFirebase } from 'react-redux-firebase'
import { storeTypes } from '../../store'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataGridWrapper: {
            margin: theme.spacing(2, 0)
        }
    })
);

function MyOrders() {
    const classes = useStyles();
    const auth = useFirebase().auth();

    useFirestoreConnect([
        {
            collection: 'orders',
            where: [['orderOwner', '==', auth.currentUser ? auth.currentUser.uid : ""]]
        }
    ]);

    const orders = useSelector((state: storeTypes) => state.firestore.ordered.orders);

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5">
                                        我的訂單
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={8} xl={6} className={classes.dataGridWrapper}>
                                    <OrdersDataGrid orders={orders} loading={!isLoaded(orders)} />
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
