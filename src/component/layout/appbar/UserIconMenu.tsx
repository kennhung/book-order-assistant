import React from 'react'
import { Divider, Menu, MenuItem } from '@material-ui/core'
import { useFirebase } from 'react-redux-firebase'
import { useHistory } from 'react-router-dom';

type UserIconMenuProps = {
    anchorEl: HTMLElement | null,
    open: boolean,
    handleClose: () => void
}

function UserIconMenu({ anchorEl, open, handleClose }: UserIconMenuProps) {
    const firebase = useFirebase();
    const history = useHistory();

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
            <Divider />
            <MenuItem onClick={() => { 
                firebase.logout();
                handleClose();
                history.push('/');
            }}>Logout</MenuItem>
        </Menu>
    )
}

export default UserIconMenu
