import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'

type UserIconMenuProps = {
    anchorEl: HTMLElement | null,
    open: boolean,
    handleClose: () => void
}

function UserIconMenu({ anchorEl, open, handleClose }: UserIconMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
        </Menu>
    )
}

export default UserIconMenu
