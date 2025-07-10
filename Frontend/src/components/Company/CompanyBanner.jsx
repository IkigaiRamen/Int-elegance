import React from "react";

const CompanyBanner = ({ company }) => {
  return (
    <div className="col-md-6 col-lg-6 col-xl-12">
      <div className="card custom-bg">
        
        <div className="card-body row">
          <div className="col">
            <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center">
              <img src={company.logo} height="40" width="40" alt="company logo" />
            </span>
            <h1 className="mt-3 mb-0 fw-bold text-white">{company.name}</h1>
            <span className="text-white">{company.description}</span>
          </div>
          <div className="col"> 
            <img
              className="img-fluid"
              src="/assets/images/interview.svg"
              alt="interview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBanner;
