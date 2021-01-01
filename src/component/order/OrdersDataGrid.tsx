import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@material-ui/core'
import { storeTypes } from '../../store'
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import PaymentIcon from '@material-ui/icons/Payment'
import BookIcon from '@material-ui/icons/Book';

type OrdersDataGridProps = {
    orders: [any],
    loading: boolean,
    groupBuyView?: boolean
}

export const orderStatusString: any = {
    pending: "等待中",
    pendingPay: "等待付款中",
    paid: "已付款",
    pendingTake: "等待取書中",
    taken: "已取書"
}

function getOrderStatus(order: any, groupBuy: any): any {
    const taken = order.taken || 0;

    if (taken >= order.amount) {
        return "taken";
    } else if (order.paid && taken < order.amount) {
        return groupBuy.canTake ? "pendingTake" : "paid";
    } else if (!order.paid && groupBuy.canPay) {
        return "pendingPay";
    } else {
        return "pending";
    }
}

function OrderRow({ order, groupBuyView }: { order: any, groupBuyView: boolean }) {
    const firestore = useFirestore();

    useFirestoreConnect([
        {
            collection: 'groupBuys',
            doc: order.orderTarget
        }
    ]);

    const groupBuy = useSelector((state: storeTypes) => {
        const data = state.firestore.data;

        return data.groupBuys && data.groupBuys[order.orderTarget];
    });

    const [payAnchorEl, setPayAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handlePayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPayAnchorEl(event.currentTarget);
    };
    const handlePayClose = () => {
        setPayAnchorEl(null);
    };

    const [openTakeDialog, setOpenTakeDialog] = useState(false);
    const handleTakeDialogClose = () => {
        setOpenTakeDialog(false);
        if (order && (order.taken || order.taken === 0)) {
            setTakenCount(order.taken);
        }
    }
    const [takenCount, setTakenCount] = useState<number | null>(0);
    useEffect(() => {
        if (order && (order.taken || order.taken === 0)) {
            setTakenCount(order.taken);
        }
    }, [order]);

    const takeDialogSubmit = () => {
        firestore.collection("orders").doc(order.id).update({
            taken: takenCount
        }).then(() => {
            handleTakeDialogClose()
        });
    }

    return <TableRow hover key={order.id}>
        <TableCell component="th" scope="row">
            {new Date(order.timeStamp.seconds * 1000).toLocaleString()}
        </TableCell>
        <TableCell>{order.department}{" "}{order.name}</TableCell>
        {!groupBuyView ? <TableCell>{groupBuy?.bookName}</TableCell> : null}
        <TableCell align="right">{order.amount}</TableCell>
        <TableCell align="right">{groupBuy && order ? orderStatusString[getOrderStatus(order, groupBuy)] : "n/a"}</TableCell>
        {
            groupBuyView ? <TableCell>
                <Tooltip title="付款">
                    <div style={{ display: "inline" }}>
                        <IconButton size="small" disabled={order.paid || groupBuy?.end} onClick={handlePayClick}>
                            <PaymentIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="取書">
                    <IconButton size="small" disabled={groupBuy?.end} color={order.amount > (order.taken || 0) && order.paid ? "primary" : "default"} onClick={() => { setOpenTakeDialog(true) }}>
                        <BookIcon />
                    </IconButton>
                </Tooltip>
            </TableCell> : null
        }
        <Popover
            open={Boolean(payAnchorEl)}
            anchorEl={payAnchorEl}
            onClose={handlePayClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <div style={{
                padding: ".75rem",
                textAlign: "center"
            }}>
                <Typography>確認付款</Typography>
                <Button variant="contained" color="primary" onClick={() => {
                    firestore.collection("orders").doc(order.id).update({
                        paid: true
                    })
                    handlePayClose();
                }}>是</Button>
            </div>
        </Popover>
        <Dialog
            open={openTakeDialog}
            onClose={handleTakeDialogClose}
        >
            <DialogTitle id="confirmation-dialog-title">取書</DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="已取數量"
                    type="number"
                    value={takenCount}
                    error={takenCount === null || takenCount > order.amount || takenCount < 0}
                    onChange={(e) => setTakenCount(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            takeDialogSubmit();
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleTakeDialogClose} color="primary">
                    Cancel
                </Button>
                <Button disabled={takenCount === null} onClick={takeDialogSubmit} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    </TableRow >
}

function OrdersDataGrid({ orders, groupBuyView = false, loading }: OrdersDataGridProps) {

    return (
        !loading ?
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>訂購時間</TableCell>
                            <TableCell>訂購人</TableCell>
                            {!groupBuyView ? <TableCell>書名</TableCell> : null}
                            <TableCell align="right">數量</TableCell>
                            <TableCell align="right">狀態</TableCell>
                            {groupBuyView ? <TableCell></TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order: any) => {
                            return <OrderRow key={order.id} order={order} groupBuyView={groupBuyView} />
                        })}
                    </TableBody>
                </Table>
            </TableContainer> :
            <div style={{ textAlign: "center" }}>
                <CircularProgress />
            </div>
    )
}

export default OrdersDataGrid
