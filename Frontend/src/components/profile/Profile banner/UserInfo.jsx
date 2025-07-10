// UserInfo.jsx
import React, { useState } from "react";
import { formatDateWithYear } from "../../../services/StyleService";
import EditableField from "./EditableField"; // Import the EditableField component
import DateEditableField from "./DateEditableField"; // Import the DateEditableField component

const UserInfo = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState({
    phone: false,
    address: false,
    dateOfBirth: false,
    techRole: false,
    bio: false,
  });

  const [editedValues, setEditedValues] = useState({
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    dateOfBirth: user.dateOfBirth || "",
    techRole: user.techRole || "",
    bio: user.bio || "",
  });

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    onUpdate(field, editedValues[field]);
  };

  const techRoles = [
    "UI/UX Design",
    "Website Design",
    "App Development",
    "Quality Assurance",
    "Development",
    "Backend Development",
    "Software Testing",
    "Marketing",
    "SEO",
    "Other",
  ];

  return (
    <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
      <h6 className="mb-0 mt-2 fw-bold d-block fs-6">
        {user.firstName} {user.lastName}
      </h6>
      <div className="py-1 fw-bold small-11 mb-0 mt-1 text-muted">
        {isEditing.techRole ? (
          <select
            value={editedValues.techRole}
            onChange={(e) => handleInputChange("techRole", e.target.value)}
            onBlur={() => handleBlur("techRole")}
            className="form-select"
            autoFocus
          >
            <option value="" disabled>
              Select your tech role
            </option>
            {techRoles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        ) : (
          <span
            className="py-1 fw-bold small-11 mb-0 mt-1 text-muted"
            onClick={() => handleEditClick("techRole")}
          >
            {editedValues.techRole || "Select your tech role"}
          </span>
        )}
      </div>
      <div className="mt-2 small">
        {isEditing.bio ? (
          <input
            type="text"
            value={editedValues.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            onBlur={() => handleBlur("bio")}
            className="form-control"
            autoFocus
            placeholder="Say something about yourself"
          />
        ) : (
          <span className="mt-2 small" onClick={() => handleEditClick("bio")}>
            {editedValues.bio || "Say something about yourself"}
          </span>
        )}
      </div>
      <div className="row g-2 pt-2">
        <EditableField
          icon="icofont-ui-touch-phone"
          value={editedValues.phoneNumber}
          placeholder="Phone Number"
          isEditing={isEditing.phone}
          onEditClick={() => handleEditClick("phone")}
          onChange={(value) => handleInputChange("phoneNumber", value)}
          onBlur={() => handleBlur("phone")}
        />
        {/* Move Address Field Left by 50px */}
        <div className="col-xl-5" style={{ marginLeft: '+50px' }}> {/* Adjust margin to move left */}
          <EditableField
            icon="icofont-address-book"
            value={editedValues.address}
            placeholder="Address"
            isEditing={isEditing.address}
            onEditClick={() => handleEditClick("address")}
            onChange={(value) => handleInputChange("address", value)}
            onBlur={() => handleBlur("address")}
          />
        </div>
        <DateEditableField
          icon="icofont-birthday-cake"
          value={formatDateWithYear(editedValues.dateOfBirth)}
          placeholder="Birthday"
          isEditing={isEditing.dateOfBirth}
          onEditClick={() => handleEditClick("dateOfBirth")}
          onChange={(value) => handleInputChange("dateOfBirth", value)}
          onBlur={() => handleBlur("dateOfBirth")}
          type="date"
        />
        {/* Email Field */}
        <div className="col-xl-5" style={{ marginLeft: '+50px' }}> {/* Optional adjustment for email */}
          <div className="d-flex align-items-center">
            <i className="icofont-email"></i>
            <span className="ms-2 small">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
