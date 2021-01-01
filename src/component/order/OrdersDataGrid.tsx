import React from 'react'
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { storeTypes } from '../../store'
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

type OrdersDataGridProps = {
    orders: [any],
    loading: boolean,
    groupBuyView?: boolean
}

export const statusStrings: any = {
    pending: "等待中",
    pendingPay: "等待付款中",
    paid: "已付款",
    pendingTake: "等待取書中",
    taken: "已取書"
}

function OrderRow({ order, groupBuyView }: { order: any, groupBuyView: boolean }) {

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

    return <TableRow key={order.id}>
        <TableCell component="th" scope="row">
            {new Date(order.timeStamp.seconds * 1000).toLocaleString()}
        </TableCell>
        <TableCell>{order.department}{" "}{order.name}</TableCell>
        {!groupBuyView ? <TableCell>{groupBuy?.bookName}</TableCell> : null}
        <TableCell align="right">{order.amount}</TableCell>
        <TableCell align="right">{statusStrings[order.status]}</TableCell>
    </TableRow>
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
