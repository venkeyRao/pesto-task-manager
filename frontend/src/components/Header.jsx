import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import StyledButton from './styledButton';

function Header({ user, onLogout }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager using React
        </Typography>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          Welcome {user ? user : 'Guest'}
        </Typography>
        <StyledButton
          color="inherit"
          onClick={onLogout}
          component={Link}
          to="#"
        >
          Logout
        </StyledButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
