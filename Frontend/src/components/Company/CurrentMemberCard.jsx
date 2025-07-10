import React from 'react';

const CurrentMembersCard = ({ members }) => {
  return (
    <div className="col-md-12 col-lg-12 col-xl-12">
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Current Members</h6>
        </div>
        <div className="card-body">
          <div className="flex-grow-1">
            {members.map((member, index) => (
              <div key={index} className="py-2 d-flex align-items-center border-bottom flex-wrap">
                <div className="d-flex align-items-center flex-fill">
                  <img
                    className="avatar lg rounded-circle img-thumbnail"
                    src={member.profilePicture} // Use the avatar from the member object
                    alt={member.firstName}
                  />
                  <div className="d-flex flex-column ps-3">
                    <h6 className="fw-bold mb-0 small-14">{member.firstName} {member.lastName}</h6>
                    <span className="text-muted">{member.techRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentMembersCard;
