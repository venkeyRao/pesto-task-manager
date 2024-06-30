import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import '../css/login.css'; 

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
    <div className="login-container">
      <div className="form-container">
        <form className="row g-3" onSubmit={onSubmit}>
          {message && (
            <div className="alert alert-danger form-message" role="alert">
              {message}
            </div>
          )}
          <h1 className="form-title">Login To Your Account</h1>
          <div className="col-12">
            <label htmlFor="email" className="form-label">Email</label>
            <input ref={emailRef} type="email" className="form-control" id="email" placeholder="Email" required />
            {errors.email && <div className="form-message text-danger">{errors.email}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="password" className="form-label">Password</label>
            <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Password" required />
            {errors.password && <div className="form-message text-danger">{errors.password}</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </div>
          <div className="text-center">
            <p className="mt-3">Not registered? <Link to="/signup" className="text-info">Create an account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
