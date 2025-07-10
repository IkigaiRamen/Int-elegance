import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/UserService';
import GLogin from './googleLogin';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(''); // State to manage error messages
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password); // Call the login function from authServices
  
      // If login is successful
      console.log('Login successful:', response);
  
      // Handle remember me logic (e.g., saving the token to localStorage)
      if (rememberMe) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }
  
      // Check the user's role and navigate accordingly
      if (response.role === null) {
        navigate('/role'); // Redirect to /role if role is null
      } else {
        navigate('/profile'); // Redirect to /profile otherwise
      }
    } catch (err) {
      console.error('Login failed:', err);
  
      // Extract the message from the backend response
      setError(err.message || 'Login failed. Please check your credentials and try again.');
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
                    <img src="../assets/images/logo-intel.png" alt="login-img" style={{ width: '8rem', height: 'auto' }} />
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">Intlegance Let's Management Better</h2>
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
                      <h1>Sign in</h1>
                      <span>Free access to our dashboard.</span>
                    </div>
                    <div className="col-12 text-center mb-4">
                    <GLogin />

                      <span className="dividers text-muted mt-4">OR</span>
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
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <div className="form-label d-flex justify-content-between align-items-center">
                          <span>Password</span>
                          <a className="text-secondary" href="auth-password-reset.html">Forgot Password?</a>
                        </div>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="***************"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {error && <div className="col-12 text-center mt-2"><span className="text-danger">{error}</span></div>}
                    <div className="col-12 text-center mt-4">
                      <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase" disabled={loading}>
                        {loading ? 'Signing in...' : 'SIGN IN'}
                      </button>
                    </div>
                    <div className="col-12 text-center mt-4">
                      <span className="text-muted">
                        Don't have an account yet? <a href="/register" className="text-secondary">Sign up here</a>
                      </span>
                    </div>
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

export default Login;
