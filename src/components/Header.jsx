import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Link
} from '@material-ui/core';
import {
  DirectionsBus as DirectionsBusIcon,
  GitHub as GitHubIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  departuresLink: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function Header() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography className={classes.root}>
            <Link href='/departures' color='inherit'>
              <DirectionsBusIcon className={classes.departuresLink} />
              Departures
            </Link>
          </Typography>
          <Link
            href='https://github.com/JuanCarlosHernandezPuebla/metro-transit-trip'
            color='inherit'>
            <GitHubIcon className={classes.homeLink} />
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
