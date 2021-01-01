import React from 'react'
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { storeTypes } from '../../store'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

type GroupBuysDataGridProps = {
    groupBuys: [any],
    loading: boolean
}

function GroupBuyRow({ groupBuy }: { groupBuy: any }) {

    useFirestoreConnect([
        {
            collection: 'orders',
            where: [["orderTarget", "==", groupBuy.id]]
        }
    ]);

    const orders = useSelector((state: storeTypes) => state.firestore.ordered.orders);

    return <TableRow>
        <TableCell component="th" scope="row">
            {groupBuy.isOpen ? "開放中" : "停止接收訂單"}
        </TableCell>
        <TableCell>{groupBuy.bookName}</TableCell>
        <TableCell>{groupBuy.price}</TableCell>
        <TableCell>{isLoaded(orders) ? orders.length : null}</TableCell>
    </TableRow>
}

function GroupBuysDataGrid({ groupBuys, loading }: GroupBuysDataGridProps) {

    return (
        !loading ?
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>狀態</TableCell>
                            <TableCell>書名</TableCell>
                            <TableCell>價格</TableCell>
                            <TableCell>目前數量</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupBuys.map((groupBuy: any) => {
                            return <GroupBuyRow key={groupBuy.id} groupBuy={groupBuy} />
                        })}
                    </TableBody>
                </Table>
            </TableContainer> :
            <div style={{ textAlign: "center" }}>
                <CircularProgress />
            </div>
    )
}

export default GroupBuysDataGrid
