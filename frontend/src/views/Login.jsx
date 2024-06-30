import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const Login = () => {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post('/auth/signin', payload)
      .then(({ data }) => {
        setUser(data.user.name);
        setToken(data.tokens.accessToken);
        navigate('/'); 
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          if (response.status === 422) {
            setMessage(response.data.message);
          } else if (response.status === 400) {
            const errorMessages = response.data.message.reduce((acc, errorMessage) => {
              if (errorMessage.includes('email')) {
                acc.email = errorMessage;
              } else if (errorMessage.includes('password')) {
                acc.password = errorMessage;
              }
              return acc;
            }, {});
            setErrors(errorMessages);
          } else if (response.status === 403 || response.status === 404) {
            setMessage(response.data.message);
          }
        }
      });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Container maxWidth="xs">
        <Box sx={{ padding: 4, boxShadow: 1, borderRadius: 1, backgroundColor: '#ffffff' }}>
          <form onSubmit={onSubmit}>
            {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}
            <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>Login</Typography>
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Not registered? <Link to="/signup" style={{ color: '#1976d2' }}>Create an account</Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
