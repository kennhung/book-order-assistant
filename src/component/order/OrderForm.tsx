import { Button, Card, CardContent, Container, Divider, Grid, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import { firestore, auth } from '../../firebase'


function OrderForm() {
    const { formId } = useParams<{ formId: string }>();

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
            toast.success("Order submitted");
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
                            <Typography variant="h5" color="textPrimary">
                                Order Form
                            </Typography>

                            {
                                errorMessage ? <Alert variant="filled" severity="error">
                                    {errorMessage}
                                </Alert> : null
                            }

                            <Divider style={{ margin: "1rem 0" }} />

                            <Grid container style={{ padding: "0 2rem" }} spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        error={checkRequired && name.length <= 0}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="StudentID"
                                        value={stuId}
                                        onChange={(e) => setStuId(e.target.value)}
                                        required
                                        error={checkRequired && stuId.length <= 0}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        required
                                        error={checkRequired && department.length <= 0}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                        required
                                        error={amount == null || amount < 1}
                                        helperText={amount && amount < 1 ? "Should not less then one" : null}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ padding: "0rem 2rem", marginTop: "2rem" }} justify="flex-end">
                                <Grid item xs={"auto"}>
                                    <Button variant="contained" color="primary" onClick={submitForm}>Submit</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default OrderForm
