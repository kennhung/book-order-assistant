import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

import Home from './homepage/Home'
import MyOrders from './order/MyOrders'
import OrderForm from './order/OrderForm'
import MyGroupBuys from './groupBuys/MyGroupBuys'
import CreateGroupBuyForm from './groupBuys/CreateGroupBuyForm'
import GroupBuyDetail from './groupBuys/GroupBuyDetail'

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
                <Route path='/myGroupBuys'>
                    <MyGroupBuys />
                </Route>
                <Route path='/groupBuy/create'>
                    <CreateGroupBuyForm />
                </Route>
                <Route path='/groupBuy/detail/:groupBuyId'>
                    <GroupBuyDetail />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </>
    )
}

export default MainAppRoutes
