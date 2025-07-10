// EditableField.jsx
import React from 'react';

const EditableField = ({
  icon,
  value,
  placeholder,
  isEditing,
  onEditClick,
  onChange,
  onBlur,
  type = "text",
}) => {
  return (
    <div className="col-xl-5">
      <div className="d-flex align-items-center">
        <i className={icon}></i>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="form-control ms-2"
            autoFocus
            placeholder={placeholder}
          />
        ) : (
          <span className="ms-2 small" onClick={onEditClick}>
            {value || placeholder}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditableField;
