import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/users/register', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log('Registration successful:', response.data);
      
      // Show a success toast
      toast.success('Registration successful! Please check your email to verify your account.');

    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="mytask-layout">
      <div className="main p-2 py-3 p-xl-5">
        <div className="body d-flex p-0 p-xl-5">
          <div className="container-xxl">
            <div className="row g-0">
              <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{ maxWidth: '25rem' }}>
                  <div className="text-center mb-5">
                    <img src="../assets/images/logoInt.png" alt="login-img" style={{ width: '8rem', height: 'auto' }} />
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">My-Task Let's Management Better</h2>
                  </div>
                  <div className="">
                    <img src="../assets/images/login-img.svg" alt="login-img" />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div className="w-100 p-3 p-md-5 cardlogin border-0 bg-dark text-light" style={{ maxWidth: '32rem', color: '4c3575' }}>
                  <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                    <div className="col-12 text-center mb-1 mb-lg-5">
                      <h1>Create your account</h1>
                      <span>Free access to our dashboard.</span>
                    </div>
                    <div className="col-6">
                      <div className="mb-2">
                        <label className="form-label">Full name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-2">
                        <label className="form-label">&nbsp;</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Parker"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Email address</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="8+ characters required"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Confirm password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="8+ characters required"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          style={{minimumWidth:'1.5rem', minHeight:'1.5rem'}}
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          I accept the <a href="#" title="Terms and Conditions" className="text-secondary">Terms and Conditions</a>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-lg btn-block btn-light lift text-uppercase"
                        disabled={loading}
                      >
                        SIGN UP
                      </button>
                    </div>
                    <div className="col-12 text-center mt-4">
                      <span className="text-muted">Already have an account? <a href="/login" title="Sign in" className="text-secondary">Sign in here</a></span>
                    </div>
                    {error && (
                      <div className="col-12 text-center mt-4">
                        <span className="text-danger">{error}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
         </div>
  );
};

export default Register;
