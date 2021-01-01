import { Switch, Card, CardContent, CardHeader, CircularProgress, Container, createStyles, Divider, FormControlLabel, Grid, makeStyles, Theme, Typography, Button, IconButton, Menu, MenuItem, ListItemIcon, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import DeleteIcon from '@material-ui/icons/Delete'
import { sum } from 'lodash'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { useHistory, useParams } from 'react-router-dom'
import { storeTypes } from '../../store'
import OrdersDataGrid from '../order/OrdersDataGrid'
import { Alert } from '@material-ui/lab'
import { toast } from 'react-toastify'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            margin: theme.spacing(1.5, 0)
        },
        cardHeader: {
            paddingBottom: theme.spacing(.5)
        },
        cardContent: {
            paddingTop: theme.spacing(.5)
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
        },
        successBtnNoFill: {
            color: theme.palette.success.main
        },
        dangerBtnNoFill: {
            color: theme.palette.error.main
        },
    })
);

const copyToClipboard = (text: string) => {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
};

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
    }

    const [endGroupBuyConfirmDialogOpen, setEndGroupBuyConfirmDialogOpen] = useState(false);
    const onEndGroupBuyConfirmDialogClose = () => {
        setEndGroupBuyConfirmDialogOpen(false);
    }

    const history = useHistory();

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                {
                    isLoaded(groupBuy) ?
                        <>
                            <Grid item xs={12} md={6} lg={4}>
                                <Card>
                                    <CardHeader
                                        className={classes.cardHeader}
                                        title="團購單"
                                        subheader={groupBuy.bookName}
                                        action={
                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="body1">價格：{groupBuy.price}</Typography>
                                        <Typography variant="body2">{groupBuy.notes}</Typography>

                                        <Grid
                                            container
                                            spacing={1}
                                            style={{ marginTop: ".5rem" }}
                                            className={groupBuy.isOpen ? classes.headerActionOpen : classes.headerActionClosed}
                                        >
                                            <Grid item xs="auto">
                                                {groupBuy.isOpen ?
                                                    <CheckCircleOutlineIcon /> :
                                                    <HighlightOffIcon />
                                                }
                                            </Grid>
                                            <Grid item xs="auto">
                                                <Typography>{groupBuy.isOpen ? "開放中" : "訂單關閉"}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Typography variant="subtitle1">訂購連結</Typography>
                                        <Typography variant="subtitle2" style={{ overflowWrap: "anywhere" }}>{`${window.location.origin}/order/form/${groupBuyId}`}</Typography>
                                        <div style={{ textAlign: "right" }}>
                                            <Button onClick={() => {
                                                copyToClipboard(`${window.location.origin}/order/form/${groupBuyId}`)
                                                toast.success("連結已複製")
                                            }} size="small">複製連結</Button>
                                        </div>

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
                                            disabled={groupBuy.end}
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
                                            disabled={groupBuy.end}
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
                                            disabled={groupBuy.end}
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
                                        <Button
                                            disabled={groupBuy.end}
                                            className={`${(orderCount === paidCount && totalCount === takenCount) ? classes.successBtn : classes.dangerBtn} ${classes.endBtn}`}
                                            variant="contained"
                                            fullWidth
                                            onClick={() => setEndGroupBuyConfirmDialogOpen(true)}
                                        >
                                            結束訂單
                                        </Button>
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
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    setSnackBarOpen(true);
                }}>
                    <ListItemIcon><EditIcon /></ListItemIcon>
                    <Typography>編輯</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setSnackBarOpen(true);
                }}>
                    <ListItemIcon><DeleteSweepIcon /></ListItemIcon>
                    <Typography>清空訂單</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setSnackBarOpen(true);
                }}>
                    <ListItemIcon><DeleteIcon /></ListItemIcon>
                    <Typography>刪除團購</Typography>
                </MenuItem>
            </Menu>
            <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity="error">
                    尚未支援此功能
                </Alert>
            </Snackbar>
            <Dialog open={endGroupBuyConfirmDialogOpen} onClose={onEndGroupBuyConfirmDialogClose}>
                <DialogTitle>確認結束團購</DialogTitle>
                <DialogContent>
                    <DialogContentText>確定要結束這個團購嗎</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onEndGroupBuyConfirmDialogClose}>取消</Button>
                    <Button
                        className={orderCount === paidCount && totalCount === takenCount ? classes.successBtnNoFill : classes.dangerBtnNoFill}
                        onClick={() => {
                            firestore.collection("groupBuys").doc(groupBuyId).update({
                                end: true,
                                canTake: false,
                                canPay: false,
                                isOpen: false
                            }).then(() => {
                                toast.success("團購已結束");
                                history.push('/myGroupBuys');
                            })
                        }}
                    >確認</Button>
                </DialogActions>
            </Dialog>
        </Container >
    )
}

export default GroupBuyDetail
