import React from "react";

const ProfileLayout = ({
  ProfileBanner,
  PersonalInformation,
  ProjectProfileBanner,
  TaskProfile,
  user, // Make sure to pass the user object as a prop
}) => {
  return (
    <div className="body d-flex py-lg-3 py-md-2">
      <div className="container-xxl">

        <div className="row clearfix">
          <div className="col-md-12">
            <div className="card border-0 mb-4 no-bg">
              <div className="card-header py-3 px-0 d-flex align-items-center justify-content-between border-bottom">
                <h3 className="fw-bold flex-fill mb-0">Profile</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-xl-8 col-lg-12 col-md-12">

            {/* New Banner Section */}
           
             
            {ProfileBanner}
            
            {/* End of Banner Section */}


            <h6 className="fw-bold py-3 mb-3">Current Work Project</h6>
            <div className="teachercourse-list">
              <div className="row g-3 gy-5 py-3 row-deck">
                {ProjectProfileBanner}
              </div>
            </div>

            <div className="row g-3">{PersonalInformation}</div>
          </div>

          <div className="col-xl-4 col-lg-12 col-md-12">{TaskProfile}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
