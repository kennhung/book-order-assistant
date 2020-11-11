import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

import Home from './homepage/Home'


function MainAppRoutes() {
    return (
        <>
            <Switch>
                <Route path='/' exact>
                    <Home />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </>
    )
}

export default MainAppRoutes
