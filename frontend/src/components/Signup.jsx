import React, { useState } from 'react';
import { signUpUser } from './api'; // Your signup API function
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUpUser(formData.username, formData.email, formData.password);
      setError('');
      navigate('/');
    } catch {
      setError('Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      {error && <div className="signup-error">{error}</div>}
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="input-field"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
          className="input-field"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          className="input-field"
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          className="input-field"
        />

        <button type="submit" className="signup-button">Sign Up</button>
      </form>

      <p className="signup-text">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
