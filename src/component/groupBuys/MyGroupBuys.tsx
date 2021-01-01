import { Card, CardContent, Container, createStyles, Fab, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase, useFirestoreConnect } from 'react-redux-firebase'
import { storeTypes } from '../../store'
import GroupBuysDataGrid from './GroupBuysDataGrid'
import AddIcon from '@material-ui/icons/Add'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataGridWrapper: {
            margin: theme.spacing(2, 0)
        },
        createGroupBuyFAB: {
            position: "fixed",
            top: "auto",
            left: "auto",
            right: theme.spacing(5),
            bottom: theme.spacing(5),
            margin: 0
        }
    })
);

function MyGroupBuys() {
    const classes = useStyles();
    const auth = useFirebase().auth();

    const history = useHistory();

    useFirestoreConnect([
        {
            collection: 'groupBuys',
            where: [['organizer', "array-contains", auth.currentUser ? auth.currentUser.uid : ""]]
        }
    ]);

    const groupBuys = useSelector((state: storeTypes) => state.firestore.ordered.groupBuys);

    return (
        <Container maxWidth={false}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5">
                                        我的團購
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6} className={classes.dataGridWrapper}>
                                    <GroupBuysDataGrid groupBuys={groupBuys} loading={!isLoaded(groupBuys)} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Fab color="primary" className={classes.createGroupBuyFAB}>
                <AddIcon onClick={() => { history.push('/groupBuy/create') }} />
            </Fab>
        </Container>
    )
}

export default MyGroupBuys
