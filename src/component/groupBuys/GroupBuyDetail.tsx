import { Card, CardContent, CardHeader, CircularProgress, Container, createStyles, Divider, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { sum } from 'lodash';
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router-dom'
import { storeTypes } from '../../store';
import OrdersDataGrid from '../order/OrdersDataGrid';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            margin: theme.spacing(2, 0)
        },
        headerActionOpen: {
            color: theme.palette.success.main
        },
        headerActionClosed: {
            color: theme.palette.error.main
        }
    })
);

function GroupBuyDetail() {
    const classes = useStyles();
    const { groupBuyId } = useParams<{ groupBuyId: string }>();

    useFirestoreConnect({
        collection: "groupBuys",
        doc: groupBuyId
    })
    const groupBuy = useSelector((store: storeTypes) => {
        const data = store.firestore.data;

        return data.groupBuys && data.groupBuys[groupBuyId]
    })

    useFirestoreConnect({
        collection: "orders",
        where: [["orderTarget", "==", groupBuyId]]
    })

    const orders = useSelector((store: storeTypes) => store.firestore.ordered.orders);

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                {
                    isLoaded(groupBuy) ?
                        <>
                            <Grid item xs={12} md={6} lg={4}>
                                <Card>
                                    <CardHeader
                                        title="團購單"
                                        subheader={groupBuy.bookName}
                                        action={
                                            <Grid
                                                container
                                                spacing={1}
                                                className={groupBuy.isOpen ? classes.headerActionOpen : classes.headerActionClosed}
                                            >
                                                <Grid item xs="auto">
                                                    <Typography>{groupBuy.isOpen ? "開放訂購" : "訂單關閉"}</Typography>
                                                </Grid>
                                                <Grid item xs="auto">
                                                    {groupBuy.isOpen ?
                                                        <CheckCircleOutlineIcon /> :
                                                        <HighlightOffIcon />
                                                    }
                                                </Grid>
                                            </Grid>
                                        }
                                    />
                                    <CardContent>
                                        <Typography variant="body1">價格：{groupBuy.price}</Typography>
                                        <Divider className={classes.divider} />
                                        {
                                            isLoaded(orders) ? <>
                                                <Typography variant="subtitle1">目前訂單數量：{orders.length}</Typography>
                                                <Typography variant="subtitle1">總件數：{sum(orders.map(({ amount }: any) => amount))}</Typography>
                                            </> : null
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={8}>
                                <Card>
                                    <CardHeader title="訂單列表" />
                                    <CardContent>
                                        <OrdersDataGrid orders={orders} loading={!isLoaded(orders)} groupBuyView />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                        : <Grid item xs={12} style={{ textAlign: "center", marginTop: "2rem" }}>
                            <CircularProgress />
                        </Grid>
                }
            </Grid>
        </Container>
    )
}

export default GroupBuyDetail
