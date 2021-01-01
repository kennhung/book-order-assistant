import { Switch, Card, CardContent, CardHeader, CircularProgress, Container, createStyles, Divider, FormControlLabel, Grid, makeStyles, Theme, Typography, Button } from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { sum } from 'lodash';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
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
        },
        successBtn: {
            backgroundColor: theme.palette.success.main,
            color: "#fff"
        },
        dangerBtn: {
            backgroundColor: theme.palette.error.main,
            color: "#fff"
        },
        endBtn: {
            marginTop: theme.spacing(2)
        }
    })
);

function GroupBuyDetail() {
    const classes = useStyles();
    const { groupBuyId } = useParams<{ groupBuyId: string }>();
    const firestore = useFirestore();

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

    const { orderCount, totalCount, takenCount, paidCount } = useMemo<any>(() => {
        if (orders) {
            return {
                orderCount: orders.length,
                paidCount: orders.filter(({ paid }: any) => paid).length,
                totalCount: sum(orders.map(({ amount }: any) => amount)),
                takenCount: sum(orders.map(({ taken }: any) => (taken || 0)))
            }
        }

        return {
            orderCount: 0,
            paidCount: 0,
            totalCount: 0,
            takenCount: 0
        };
    }, [orders]);

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
                                                    <Typography>{groupBuy.isOpen ? "開放中" : "訂單關閉"}</Typography>
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
                                                <Typography variant="subtitle1">目前訂單數量：{orderCount}</Typography>
                                                <Typography variant="subtitle1">未繳費訂單：{orderCount - paidCount}</Typography>
                                                <Typography variant="subtitle1">總件數：{totalCount}</Typography>
                                                <Typography variant="subtitle1">未取件數：{totalCount - takenCount}</Typography>
                                            </> : null
                                        }
                                        <Divider className={classes.divider} />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={groupBuy.isOpen}
                                                    color="primary"
                                                    onChange={() => {
                                                        firestore.collection("groupBuys").doc(groupBuyId).update({
                                                            isOpen: !groupBuy.isOpen
                                                        });
                                                    }}
                                                />
                                            }
                                            label="開放訂購"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={groupBuy.canPay}
                                                    color="primary"
                                                    onChange={() => {
                                                        firestore.collection("groupBuys").doc(groupBuyId).update({
                                                            canPay: !groupBuy.canPay
                                                        });
                                                    }}
                                                />
                                            }
                                            label="開放繳費"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={groupBuy.canTake}
                                                    color="primary"
                                                    onChange={() => {
                                                        firestore.collection("groupBuys").doc(groupBuyId).update({
                                                            canTake: !groupBuy.canTake
                                                        });
                                                    }}
                                                />
                                            }
                                            label="開放取書"
                                        />
                                        <Button className={`${(orderCount === paidCount && totalCount === takenCount) ? classes.successBtn : classes.dangerBtn} ${classes.endBtn}`} variant="contained" fullWidth>結束訂單</Button>
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
