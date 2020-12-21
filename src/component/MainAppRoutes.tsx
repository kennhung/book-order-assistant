import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

import Home from './homepage/Home'
import MyOrders from './order/MyOrders'
import OrderForm from './order/OrderForm'

function MainAppRoutes() {
    return (
        <>
            <Switch>
                <Route path='/' exact>
                    <Home />
                </Route>
                <Route path='/myorder'>
                    <MyOrders />
                </Route>
                <Route path='/order/form/:formId'>
                    <OrderForm />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </>
    )
}

export default MainAppRoutes
