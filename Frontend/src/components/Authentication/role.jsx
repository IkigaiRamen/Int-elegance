import React, { useState } from 'react';
import './role.css'; // Ensure this CSS file includes the new styles
import { updateUserProfile } from '../../services/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    try {
      setLoading(true);
      await updateUserProfile({ role }); // Update user profile with the selected role
      
      // Show success toast notification
      toast.success(`You have selected ${role}!`);

      // Navigate to /FirstTime after success
      navigate('/FirstTime');

    } catch (err) {
      console.error('Failed to update user profile:', err);
      setError('Failed to update role. Please try again.');
      
      // Show error toast notification
      toast.error('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="role-background" /> {/* Background div */}
      <h2 className="role-instruction section-instruction">
        First, let’s start by choosing your role
      </h2> {/* Added instruction text */}
      
      <div className="rowspecial">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="cardSpecial" onClick={() => handleRoleSelection('Company')}>
            <div
              className="cover item-a"
              style={{
                backgroundImage: "url('assets/images/company.jpg')", // Inline background image
                height: '400px', // Inline height
                width: '100%', // Inline width
                backgroundSize: 'cover', // Inline background size
                backgroundPosition: 'center', // Inline background position
              }}
            >
              <h1>Company</h1>
              <div className="cardSpecial-back">
                <p>
                  As a Company, you will oversee projects and teams, make strategic decisions, set company goals and objectives, and facilitate collaboration among your team members.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="cardSpecial" onClick={() => handleRoleSelection('Employee')}>
            <div
              className="cover item-b"
              style={{
                backgroundImage: "url('assets/images/employee.jpg')", // Inline background image
                height: '400px', // Inline height
                width: '100%', // Inline width
                backgroundSize: 'cover', // Inline background size
                backgroundPosition: 'center', // Inline background position
              }}
            >
              <h1>Employee</h1>
              <div className="cardSpecial-back">
                <p>
                  As an Employee, you will contribute to projects, collaborate with your team members, meet project deadlines, and develop your professional skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <div>Loading...</div>} {/* Loading indication */}
      {error && <div className="text-danger">{error}</div>} {/* Error message */}
      
      {/* Toast container */}
      <ToastContainer />
    </section>
  );
};

export default RoleSelection;
