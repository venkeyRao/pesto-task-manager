import React, { createRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import '../css/login.css'; 

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
    <div className="signup-container">
      <div className="form-container">
        <form className="row g-3" onSubmit={onSubmit}>
          <h1 className="form-title">Sign Up</h1>
          <div className="col-12">
            <label htmlFor="name" className="form-label">Name</label>
            <input ref={nameRef} type="text" className="form-control" id="name" placeholder="Name" required />
            {errors.name && <div className="form-message text-danger">{errors.name}</div>}
          </div>
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
            <label htmlFor="passwordConfirmation" className="form-label">Confirm Password</label>
            <input ref={passwordConfirmationRef} type="password" className="form-control" id="passwordConfirmation" placeholder="Repeat Password" required />
            {errors.passwordConfirmation && <div className="form-message text-danger">{errors.passwordConfirmation}</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </div>
          <div className="text-center">
            <p className="mt-3">Already registered? <Link to="/login" className="text-info">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
