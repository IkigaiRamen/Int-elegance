import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner'; // Import the spinner component
import './role.css'; // Ensure you have appropriate styles for this component

const EmailVerification = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setMessage('Verification token is missing.');
      setLoading(false);
      return;
    }

    let isVerified = false; // Guard to prevent multiple toasts

    // Send POST request to backend to verify the email with the token
    const verifyEmail = async () => {
      try {
        console.log('the token is:', token);
        await axios.post('http://localhost:5000/api/users/verify-email', { token });
        if (!isVerified) {
          setMessage('Your account is now verified! You can now log in.');
          toast.success('Verification successful! Redirecting to login...');
          isVerified = true;
          setTimeout(() => {
            navigate('/login'); // Redirect after a delay
          }, 5000); // 5-second delay before redirecting to /login
        }
      } catch (error) {
        if (!isVerified) {
          setMessage('Failed to verify email. Please try again.');
          toast.error('Verification failed. Please try again.');
          isVerified = true;
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();

    // Cleanup function to avoid setting state if the component unmounts
    return () => {
      isVerified = true;
    };
  }, [location.search, navigate]);

  return (
    <section>
      <div className="role-background" /> {/* Background div */}
      <div className="rowspecial">
        {loading ? (
          <div className="loading-container">
            <Rings
              height="100"
              width="100"
              color="#4fa94d"
              radius="6"
              wrapperClass="loading-spinner"
              visible={true}
            />
            <p>Verifying...</p>
          </div>
        ) : (
          <div className="verification-content">
            <h2>{message}</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmailVerification;
