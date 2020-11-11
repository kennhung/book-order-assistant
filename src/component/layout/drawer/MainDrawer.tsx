import React from 'react'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import { Drawer, List, Divider, IconButton, ListItem, ListItemIcon, ListItemText, SvgIconTypeMap } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SettingsIcon from '@material-ui/icons/Settings'
import HomeIcon from '@material-ui/icons/Home'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import GroupIcon from '@material-ui/icons/Group'

import useStyles from '../../useStyles'

type MainDrawerProps = {
    open: boolean,
    handleDrawerClose: () => void
};

function MainDrawer({ open, handleDrawerClose }: MainDrawerProps) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const location = useLocation();

    return (
        <Drawer
            variant='permanent'
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem button selected={location.pathname === '/'} onClick={() => history.push('/')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Home"} />
                </ListItem>
                <ListItem button selected={location.pathname === '/myorder'} onClick={() => history.push('/myorder')}>
                    <ListItemIcon>
                        <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary={"My Orders"} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary={"My Group Buys"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Settings"} />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default MainDrawer
