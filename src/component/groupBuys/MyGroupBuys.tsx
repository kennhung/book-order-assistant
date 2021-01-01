import { Card, CardContent, Container, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { storeTypes } from '../../store';
import GroupBuysDataGrid from './GroupBuysDataGrid';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataGridWrapper: {
            margin: theme.spacing(2, 0)
        }
    })
);

function MyGroupBuys() {
    const classes = useStyles();
    const auth = useFirebase().auth();

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
                                    <GroupBuysDataGrid groupBuys={groupBuys} loading={!isLoaded(groupBuys)}  />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default MyGroupBuys
