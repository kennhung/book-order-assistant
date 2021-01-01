import { Button, Card, CardContent, Container, createStyles, Divider, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

import { useFirebase, useFirestore } from 'react-redux-firebase'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            margin: theme.spacing(0, 0, 2, 0)
        },
        infoAlert: {
            margin: theme.spacing(2, 0)
        },
        divider: {
            margin: theme.spacing(2, 0)
        },
        formContainer: {
            padding: theme.spacing(0, 2),
        },
        btnContainer: {
            padding: theme.spacing(0, 2),
            marginTop: theme.spacing(2)
        }
    })
);

function CreateGroupBuyForm() {
    const classes = useStyles();
    const auth = useFirebase().auth();
    const firestore = useFirestore();

    const history = useHistory();

    const [checkRequired, setCheckRequired] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [bookName, setBookName] = useState("");
    const [price, setPrice] = useState<number | null>(0);
    const [notes, setNotes] = useState("");

    const submitForm = () => {
        setErrorMessage(null);
        if (!auth.currentUser) {
            setErrorMessage("You have to login first.");
            return;
        }

        setCheckRequired(true);

        if ((!bookName) || (price == null)) {
            setErrorMessage("Please fillin all required field.");
            return;
        }

        firestore.collection("groupBuys").add({
            bookName: bookName,
            isOpen: true,
            notes: notes,
            organizer: [
                auth.currentUser.uid
            ],
            price: price
        }).then(({ id }) => {
            toast.success("團購已建立");
            history.push(`/groupBuy/detail/${id}`);
        }).catch((err) => {
            toast.error(err.message);
            console.log(err);
        });
    }

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3} justify={"center"}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" color="textPrimary" className={classes.title}>
                                新增團購
                            </Typography>

                            {
                                errorMessage ? <Alert variant="filled" severity="error">
                                    {errorMessage}
                                </Alert> : null
                            }

                            <Divider className={classes.divider} />

                            <Grid container className={classes.formContainer} spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="書名"
                                        value={bookName}
                                        onChange={(e) => setBookName(e.target.value)}
                                        required
                                        fullWidth
                                        error={checkRequired && bookName.length <= 0}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="價格"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                        required
                                        error={price === null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="注意事項"
                                        multiline
                                        rows={4}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Grid container className={classes.btnContainer} justify="flex-end">
                                <Grid item xs={"auto"}>
                                    <Button variant="contained" color="primary" onClick={submitForm}>送出</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default CreateGroupBuyForm
