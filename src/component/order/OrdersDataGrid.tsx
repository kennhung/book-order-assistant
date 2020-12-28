import React, { useMemo } from 'react'
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

type OrdersDataGridProps = {
    orders: [any],
    loading: boolean
}

function OrdersDataGrid({ orders, loading }: OrdersDataGridProps) {
    const rows = useMemo<any>(() => {
        if (orders) {
            return orders.map((v) => {
                return {
                    id: v.id,
                    timeStamp: v.timeStamp,
                    bookName: "n/a",
                    amount: v.amount,
                    status: "n/a"
                }
            });
        }

        return [];
    }, [orders]);

    return (
        !loading ?
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell align="right">Book Name</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {new Date(row.timeStamp.seconds * 1000).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">{row.bookName}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> :
            <div style={{ textAlign: "center" }}>
                <CircularProgress />
            </div>
    )
}

export default OrdersDataGrid
