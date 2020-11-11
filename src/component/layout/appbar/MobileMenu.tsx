import React from 'react'
import { Menu, MenuItem, IconButton, Badge } from '@material-ui/core'
import firebase from 'firebase'
import NotificationsIcon from '@material-ui/icons/Notifications'

import UserAvatar from './UserAvatar'

type MobileMenuProps = {
    mobileMoreAnchorEl: HTMLElement | null,
    open: boolean,
    handleClose: () => void,
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void,
    loginedUser: firebase.User | null
}

function MobileMenu({ mobileMoreAnchorEl, open, handleClose, handleProfileMenuOpen, loginedUser }: MobileMenuProps) {
    return (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open}
            onClose={handleClose}
        >
            <MenuItem>
                <IconButton color="inherit">
                    <Badge badgeContent={0} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    color="inherit"
                >
                    <UserAvatar loginedUser={loginedUser} />
                </IconButton>
                <p>{loginedUser?.displayName}</p>
            </MenuItem>
        </Menu>
    )
}

export default MobileMenu
