import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import Appbar from './component/layout/appbar/Appbar'
import MainDrawer from './component/layout/drawer/MainDrawer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
  })
);

function App() {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Appbar drawerOpen={isDrawerOpen} handleDrawerOpen={handleDrawerOpen} />
      <MainDrawer open={isDrawerOpen} handleDrawerClose={handleDrawerClose} />
    </div>
  );
}

export default App;
