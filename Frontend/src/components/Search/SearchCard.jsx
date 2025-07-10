import React from 'react';
import './SearchCard.css';
import { useNavigate } from 'react-router-dom';

const TeamCard = ({ user }) => { // Accept user as a prop
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/profile/${user._id}`); // Navigate to the profile page with user ID
  };
  return (
    <div className="col-12 col-sm-6 col-lg-3" onClick={handleClick}>
      <div className="single_advisor_profile">
        {/* Team Thumb */}
        <div className="advisor_thumb">
          <img src={user.profilePicture || 'default-profile.png'} alt={user.firstName} />
        </div>
        {/* Team Details */}
        <div className="single_advisor_details_info">
          <h6>{`${user.firstName} ${user.lastName}`}</h6>
          <p className="designation">{user.techRole}</p> {/* Adjust this to match your user object */}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
