import React, { useState, useEffect } from 'react';

const TaskMembers = ({ users }) => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Log users prop to ensure data is being passed correctly
  console.log(users, "users");

  useEffect(() => {
    if (users && users.length > 0) {
      setMembers(users); // Directly use the `users` prop as the members
      setLoading(false); // Set loading to false once data is ready
    } else {
      setError("No members provided");
      setLoading(false); // Stop loading if no data
    }
  }, [users]); // Update the members whenever `users` prop changes

  return (
    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
      <div className="card" style={{ '--bs-card-spacer-y': '0rem ' }}>
        <div className="card-header py-3">
          <h6 className="mb-0 fw-bold">Allocated Task Members</h6>
        </div>
        <div className="card-body">
          <div className="flex-grow-1 mem-list">
            {loading ? (
              <p>Loading...</p> // Show loading message
            ) : error ? (
              <p>{error}</p>
            ) : members.length > 0 ? (
              members.map((member) => (
                <div key={member._id} className="py-2 d-flex align-items-center border-bottom">
                  <div className="d-flex ms-2 align-items-center flex-fill">
                    <img
                      src={member.profilePicture || '/default-avatar.png'} // Fallback image
                      className="avatar lg rounded-circle img-thumbnail"
                      alt="avatar"
                    />
                    <div className="d-flex flex-column ps-2">
                      <h6 className="fw-bold mb-0">
                        {member.firstName} {member.lastName}
                      </h6>
                      <span className="small text-muted">{member.techRole}</span>
                    </div>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`leader-checkbox-${member._id}`}
                    />
                    <label className="form-check-label" htmlFor={`leader-checkbox-${member._id}`}>
                      Team Leader
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn light-danger-bg text-end"
                    data-bs-toggle="modal"
                    data-bs-target="#dremovetask"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p>No members available.</p> // Display a message if no members
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMembers;
