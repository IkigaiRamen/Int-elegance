import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileBanner from './Profile banner/profileBanner';
import ProfileLayout from './profileLayout';
import PersonalInformation from './personalInformationCard';
import ProjectProfileBanner from './projectProfileBanner';
import TaskProfile from './taskProfile';
import { updateUserProfile } from '../../services/UserService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        // Retrieve the token from localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          throw new Error('No token found'); // Handle the case where no token is available
        }

        // Make the API request with the token
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`, // Use the retrieved token
          },
        });

        setUser(response.data); // Set the retrieved user data
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Failed to fetch user profile'); // Handle errors
      } finally {
        setLoading(false); // Always set loading to false after fetch completes
      }
    };

    fetchUserProfile();
  }, []);
  const handleUpdate = async (field, value) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    try {
      // Call the updateUserProfile function for other field updates
      await updateUserProfile(user._id, { [field]: value });
      console.log(`${field} updated successfully`);
    } catch (error) {
      console.error("Update failed", error.message);
    }
  };

  if (loading) return <div>Loading...</div>; // Render loading state
  if (error) return <div>Error: {error}</div>; // Render error message
  
  // Render the profile layout with user data
  return (
    <ProfileLayout 
      ProfileBanner={<ProfileBanner user={user} />}
      ProjectProfileBanner={<ProjectProfileBanner user={user} />}
      PersonalInformation={<PersonalInformation user={user} onUpdate={handleUpdate}/>}
      TaskProfile={<TaskProfile user={user} />}
    />
  );
};

export default Profile;
