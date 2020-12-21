import React, { useState } from 'react'
import { DataGrid, ColDef } from '@material-ui/data-grid'

const columns: ColDef[] = [
    {
        field: 'timeStamp', headerName: 'Time', width: 250, valueFormatter: (params: any) => {
            return new Date(params.value.seconds * 1000).toLocaleString();
        }
    },
    { field: 'bookName', headerName: 'Book Name', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 }
];

function OrdersDataGrid() {

    const [rows, setRows] = useState<any>([]);

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    )
}

export default OrdersDataGrid
