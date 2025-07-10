import React from 'react';
import './SearchCard.css';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/company/${company._id}`); // Navigate to the company details page using the company ID
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3" onClick={handleClick}>
      <div className="single_advisor_profile">
        {/* Company Logo */}
        <div className="advisor_thumb">
          <img src={company.logo || 'default-company-logo.png'} alt={company.name} />
        </div>
        {/* Company Details */}
        <div className="single_advisor_details_info">
          <h6>{company.name}</h6>
          <p className="designation">{company.description}</p> {/* Adjust description as necessary */}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
