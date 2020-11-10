import React, { useState, useEffect } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button, useMediaQuery, useTheme
} from '@material-ui/core'

import firebase, { auth } from '../../firebase'

type AuthDialogProps = {
    open: boolean,
    handleClose?: () => any
};

function AuthDialog({ open, handleClose }: AuthDialogProps) {
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
                if (handleClose) handleClose();
                return false;
            }
        }
    };

    const [loginedUser, setLoginedUser] = useState<null | firebase.User>(null);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setLoginedUser(user);
        })
    });

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{loginedUser ? `Hi~ ${loginedUser.displayName}` : `Login`}</DialogTitle>
            <DialogContent>
                {
                    !loginedUser ?
                        <>
                            <DialogContentText>Login to Book Order Assistant</DialogContentText>
                            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                        </> :
                        <>
                            <DialogContentText>Close the dialog to continue.</DialogContentText>
                            <DialogContentText>Want to logout? Click the button below.</DialogContentText>
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    onClick={() => {
                                        auth.signOut();
                                    }}
                                    variant="contained"
                                    color="secondary"
                                >Logout</Button>
                            </div>
                        </>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AuthDialog
