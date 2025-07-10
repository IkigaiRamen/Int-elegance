import React from "react";

const InviteEmployeeModal = () => {
  return (
    <div
      className="modal fade"
      id="addUser"
      tabIndex="-1" // React uses camelCase
      aria-labelledby="addUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="addUserLabel">
              Employee Invitation
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput877" className="form-label">
                Email
              </label>
              <input
                type="email" // Better to use "email" input type for validation
                className="form-control"
                id="exampleFormControlInput877"
                placeholder="Put an email here!"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
            <button type="button" className="btn btn-primary">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteEmployeeModal;
