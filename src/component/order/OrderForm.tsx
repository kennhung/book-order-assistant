import { Button, Card, CardContent, Container, createStyles, Divider, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'

import { firestore, auth } from '../../firebase'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { storeTypes } from '../../store'
import { first } from 'lodash'

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

function OrderForm() {
    const classes = useStyles();
    const history = useHistory();
    const { formId } = useParams<{ formId: string }>();

    useFirestoreConnect([
        {
            collection: 'groupBuys',
            doc: formId
        }
    ]);

    const groupBuy: any = first(useSelector((state: storeTypes) => state.firestore.ordered.groupBuys));

    const [name, setName] = useState("");
    const [stuId, setStuId] = useState("");
    const [department, setDepartment] = useState("");
    const [amount, setAmount] = useState<number | null>(1);

    const [checkRequired, setCheckRequired] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submitForm = () => {
        setErrorMessage(null);
        if (!auth.currentUser) {
            setErrorMessage("You have to login first.");
            return;
        }

        setCheckRequired(true);

        if ((!name) || (!stuId) || (!department) || (amount == null)) {
            setErrorMessage("Please fillin all required field.");
            return;
        }

        if (amount <= 0) {
            setErrorMessage("Amount can't less then one.");
            return;
        }

        firestore.collection("orders").add({
            orderOwner: auth.currentUser.uid,
            orderTarget: formId,
            name,
            stuId,
            department,
            amount,
            timeStamp: new Date()
        }).then(() => {
            toast.success("訂單已送出");
            history.push('/');
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
                                訂購單 - {groupBuy?.bookName}
                            </Typography>

                            <Typography variant="body1" color="textPrimary">
                                價格：{groupBuy?.price} / 本
                            </Typography>

                            {groupBuy?.notes ?
                                <Alert severity="info" className={classes.infoAlert}>
                                    <AlertTitle>注意事項</AlertTitle>
                                    {groupBuy?.notes}
                                </Alert> : null
                            }

                            {
                                errorMessage ? <Alert variant="filled" severity="error">
                                    {errorMessage}
                                </Alert> : null
                            }

                            <Divider className={classes.divider} />

                            {
                                isLoaded(auth) && !auth.currentUser ? <Alert variant="filled" severity="warning">
                                    請先登入後繼續訂購
                                </Alert> :
                                    groupBuy && !groupBuy.isOpen ?
                                        <Alert variant="filled" severity="warning">
                                            團購已停止接收訂單
                                        </Alert>
                                        :
                                        <>
                                            <Grid container className={classes.formContainer} spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="姓名"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        error={checkRequired && name.length <= 0}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="學號"
                                                        value={stuId}
                                                        onChange={(e) => setStuId(e.target.value)}
                                                        required
                                                        error={checkRequired && stuId.length <= 0}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="系級"
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                        required
                                                        error={checkRequired && department.length <= 0}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="數量"
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                                        required
                                                        error={amount == null || amount < 1}
                                                        helperText={amount && amount < 1 ? "Should not less then one" : null}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid container className={classes.btnContainer} justify="flex-end">
                                                <Grid item xs={"auto"}>
                                                    <Button variant="contained" color="primary" onClick={submitForm}>送出</Button>
                                                </Grid>
                                            </Grid>
                                        </>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default OrderForm
