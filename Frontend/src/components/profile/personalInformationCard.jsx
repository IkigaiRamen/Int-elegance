import React, { useState } from "react";

const PersonalInformation = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState({
    country: false,
    maritalStatus: false,
    emergencyContact: false,
  });

  const [editedValues, setEditedValues] = useState({
    country: user.country || "",
    maritalStatus: user.maritalStatus || "", // Corrected spelling
    emergencyContact: user.emergencyContact || "", // Corrected case
  });

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    if (editedValues[field] !== user[field]) {
      onUpdate(field, editedValues[field]);
    }
  };

  return (
    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between">
          <h6 className="mb-0 fw-bold">Personal Information</h6>
        </div>
        <div className="card-body">
          <ul className="list-unstyled mb-0">
            <li className="row flex-wrap mb-3">
              <div className="col-6">
                <span className="fw-bold">Country</span>
              </div>
              <div className="col-6">
                {isEditing.country ? (
                  <select
                    value={editedValues.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    onBlur={() => handleBlur("country")}
                    className="form-control text-muted"
                    autoFocus
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                ) : (
                  <span className="text-muted" onClick={() => handleEditClick("country")}>
                    {editedValues.country || "Select Country"}
                  </span>
                )}
              </div>
            </li>
            <li className="row flex-wrap mb-3">
              <div className="col-6">
                <span className="fw-bold">Marital Status</span>
              </div>
              <div className="col-6">
                {isEditing.maritalStatus ? (
                  <select
                    value={editedValues.maritalStatus}
                    onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                    onBlur={() => handleBlur("maritalStatus")}
                    className="form-control text-muted"
                    autoFocus
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    {/* Add more options as needed */}
                  </select>
                ) : (
                  <span className="text-muted" onClick={() => handleEditClick("maritalStatus")}>
                    {editedValues.maritalStatus || "Select Marital Status"}
                  </span>
                )}
              </div>
            </li>
            <li className="row flex-wrap">
              <div className="col-6">
                <span className="fw-bold">Emergency Contact</span>
              </div>
              <div className="col-6">
                {isEditing.emergencyContact ? (
                  <input
                    type="text"
                    value={editedValues.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    onBlur={() => handleBlur("emergencyContact")}
                    className="form-control text-muted"
                    autoFocus
                  />
                ) : (
                  <span className="text-muted" onClick={() => handleEditClick("emergencyContact")}>
                    {editedValues.emergencyContact || "Enter Emergency Contact"}
                  </span>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
