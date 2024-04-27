import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

const Login = () => {
  const loginSignUpFormStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  const formContainerStyle = {
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center'
  };
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
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
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      });
  };

  return (
    <div className="animated fadeInDown" style={loginSignUpFormStyle}>
      <div style={formContainerStyle}>
        <form className="row g-3" onSubmit={onSubmit}>
          {message && (
            <div className="alert">
              <p>{message}</p>
            </div>
          )}
          <h1 className="title">Login To Your Account</h1>
          <div className="col-auto">
            <label htmlFor="staticEmail2" className="visually-hidden">Email</label>
            <input ref={emailRef} type="text" className="form-control" placeholder="Email" />
          </div>
          <div className="col-auto">
            <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
            <input ref={passwordRef} type="password" className="form-control" placeholder="Password" />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3">Login</button>
          </div>
          <div className="text-center">
            <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
