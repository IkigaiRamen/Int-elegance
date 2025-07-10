import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { getCurrentUserProfile } from '../services/UserService';

const Layout = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setRole(userProfile.role); // Assuming the role is returned in the userProfile object
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (role === null) {
    // You can add a loader here if needed
    return <div>Loading...</div>;
  }

  return (
    <div id="mytask-layout">
      <Sidebar role={role} /> {/* Pass role to Sidebar */}
      <div className="main px-lg-4 px-md-4">
        <Navbar /> {/* Navbar Component */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
