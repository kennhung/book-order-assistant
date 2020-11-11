import React from 'react'
import firebase from 'firebase'
import { Avatar } from '@material-ui/core'

import useStyles from '../../useStyles'

type UserAvatarProps = {
    loginedUser: firebase.User | null
}

function UserAvatar({ loginedUser }: UserAvatarProps) {
    const classes = useStyles();

    return (
        <Avatar src={loginedUser?.photoURL || undefined} alt={loginedUser?.displayName || undefined} className={classes.appBarAvater}>
            {loginedUser?.displayName?.split(" ").map((v) => {
                return v.toUpperCase().substr(0, 1);
            })}
        </Avatar>
    )
}

export default UserAvatar
