import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

const Signup = () => {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
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
  const inputContainerStyle = {
    marginBottom: '1rem', 
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirmation: passwordConfirmationRef.current.value,
    };

    axiosClient
      .post('/auth/signup', payload)
      .then(({ data }) => {
        setUser(data.user.name);
        setToken(data.tokens.accessToken);
        navigate('/'); 
      })
      .catch((err) => {
        const response = err.response;
        if (response.data.error) {
          setErrors(response.data.message);
        }
      });
  };

  return (
    <div style={loginSignUpFormStyle}>
      <div style={formContainerStyle}>
      <form onSubmit={onSubmit}>
          {errors && (
            <div className="alert">
              {Array.isArray(errors) ? (
                errors.map((error, index) => <p key={index}>{error}</p>) // Array of errors
              ) : (
                <p>{errors}</p> 
              )}
            </div>
          )}
            <h1 className="title">Sign Up</h1>
            <div className="col-auto" style={inputContainerStyle}>
              <label htmlFor="name" className="visually-hidden">
                Name
              </label>
              <input
                ref={nameRef}
                type="text"
                className="form-control"
                placeholder="Name"
              />
            </div>
            <div className="col-auto" style={inputContainerStyle}>
              <label htmlFor="staticEmail2" className="visually-hidden">
                Email
              </label>
              <input
                ref={emailRef}
                type="text"
                className="form-control"
                placeholder="Email"
              />
            </div>
            <div className="col-auto" style={inputContainerStyle}>
              <label htmlFor="inputPassword2" className="visually-hidden">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="col-auto" style={inputContainerStyle}>
              <label htmlFor="inputPassword2" className="visually-hidden">
                Confirm Password
              </label>
              <input
                ref={passwordConfirmationRef}
                type="password"
                className="form-control"
                placeholder="Repeat Password"
              />
            </div>
            <div className="col-auto" style={inputContainerStyle}>
              <button type="submit" className="btn btn-primary mb-3">
                Sign Up
              </button>
            </div>
            <div className="text-center">
              <p className="message">
                Already registered? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </form>
      </div>
    </div>
  );
};

export default Signup;

