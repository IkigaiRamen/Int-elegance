import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CLIENT_ID = '956795060962-mi9ksasd1vak12l93siihfspuhusjh2s.apps.googleusercontent.com';

const GLogin = () => {
  const navigate = useNavigate(); // Initialize navigate

  const onSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    // Send token to the backend for verification
    fetch('http://localhost:5000/api/users/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Backend response:', data);
      // If the backend returns a token, store it in localStorage and sessionStorage
      if (data.token) {
        // Save token to localStorage and sessionStorage
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("token", data.token);

        // Redirect to /profile after successful login
        navigate('/profile'); // Redirect to profile page
      }
    })
    .catch((err) => console.error('Error:', err));
  };

  const onError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GLogin;
