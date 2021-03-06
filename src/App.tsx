import React, { useState } from 'react'
import 'fontsource-roboto'
import { BrowserRouter } from 'react-router-dom'

import Appbar from './component/layout/appbar/Appbar'
import MainDrawer from './component/layout/drawer/MainDrawer'
import AuthDialog from './component/auth/AuthDialog'

import { isLoaded, useFirebase } from 'react-redux-firebase'

import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import useStyles from './component/useStyles'
import MainAppRoutes from './component/MainAppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            '"Roboto"',
            '"Helvetica"',
            '"Noto Sans TC"',
            '"Arial"',
            'sans-serif'
        ].join(','),
        fontSize: 16
    },
    palette: {
        primary: {
            main: '#2586FF',
            dark: '#005acb',
            light: '#72b5ff'
        },
        secondary: {
            main: '#FFB200',
            dark: '#c68300',
            light: '#ffe44c'
        }
    }
});

function App() {
    const classes = useStyles();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const auth = useFirebase().auth();

    return (
        <div className={classes.root}>
            {isLoaded(auth) ?
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <CssBaseline />
                        <ToastContainer />
                        <Appbar drawerOpen={isDrawerOpen} handleDrawerOpen={handleDrawerOpen} handleLoginBtnClick={() => {
                            setOpenLoginModal(true);
                        }} />
                        <MainDrawer open={isDrawerOpen} handleDrawerClose={handleDrawerClose} />
                        <AuthDialog open={openLoginModal} handleClose={() => {
                            setOpenLoginModal(false);
                        }} />
                        <div className={classes.mainContent}>
                            <MainAppRoutes />
                        </div>
                    </BrowserRouter>
                </ThemeProvider> : null
            }
        </div>
    );
}

export default App;
