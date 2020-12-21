import React, { useState, useEffect } from 'react'
import clsx from 'clsx'

import { AppBar, Toolbar, IconButton, Typography, InputBase, Badge, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'

import firebase from 'firebase'
import { useFirebase } from 'react-redux-firebase'

import useStyles from '../../useStyles'

import UserIconMenu from './UserIconMenu'
import MobileMenu from './MobileMenu'
import UserAvatar from './UserAvatar'

type AppbarProps = {
    drawerOpen: boolean,
    handleDrawerOpen: () => void,
    handleLoginBtnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

export default function Appbar({ drawerOpen, handleDrawerOpen, handleLoginBtnClick }: AppbarProps) {
    const auth = useFirebase().auth();

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

    const [loginedUser, setLoginedUser] = useState<null | firebase.User>(null);
    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setLoginedUser(user);
        })
    }, [auth]);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    return (
        <>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.menuButtonHide]: drawerOpen,
                        })}
                        color="inherit"
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Book Order Assistant
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <div className={classes.grow} />
                    {
                        loginedUser ?
                            <>
                                <div className={classes.sectionDesktop}>
                                    <IconButton color="inherit">
                                        <Badge badgeContent={0} color="secondary">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                    >
                                        <UserAvatar loginedUser={loginedUser} />
                                    </IconButton>
                                </div>
                                <div className={classes.sectionMobile}>
                                    <IconButton
                                        onClick={handleMobileMenuOpen}
                                        color="inherit"
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </div>
                            </> :
                            <Button color="inherit" onClick={handleLoginBtnClick}>Login</Button>
                    }
                </Toolbar>
            </AppBar>
            <MobileMenu
                mobileMoreAnchorEl={mobileMoreAnchorEl}
                open={isMobileMenuOpen}
                handleClose={handleMobileMenuClose}
                handleProfileMenuOpen={handleProfileMenuOpen}
                loginedUser={loginedUser}
            />

            <UserIconMenu anchorEl={anchorEl} open={isMenuOpen} handleClose={handleMenuClose} />
        </>
    );
}
