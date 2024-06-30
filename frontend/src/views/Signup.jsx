import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const Signup = () => {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirmation: passwordConfirmationRef.current.value,
    };

    axiosClient.post('/auth/signup', payload)
      .then(({ data }) => {
        setUser(data.user.name);
        setToken(data.tokens.accessToken);
        navigate('/');
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          const errorMessages = response.data.message.reduce((acc, errorMessage) => {
            if (errorMessage.includes('name')) {
              acc.name = errorMessage;
            } else if (errorMessage.includes('email')) {
              acc.email = errorMessage;
            } else if (errorMessage.includes('password')) {
              acc.password = errorMessage;
            } else if (errorMessage.includes('passwordConfirmation')) {
              acc.passwordConfirmation = errorMessage;
            }
            return acc;
          }, {});
          setErrors(errorMessages);
        }
      });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Container maxWidth="xs">
        <Box sx={{ padding: 4, boxShadow: 1, borderRadius: 1, backgroundColor: '#ffffff' }}>
          <form onSubmit={onSubmit}>
            <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>Sign Up</Typography>
            <TextField
              fullWidth
              label="Name"
              inputRef={nameRef}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Email"
              inputRef={emailRef}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              inputRef={passwordRef}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              inputRef={passwordConfirmationRef}
              margin="normal"
              required
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Sign Up
            </Button>
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Already registered? <Link to="/login" style={{ color: '#1976d2' }}>Sign In</Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
