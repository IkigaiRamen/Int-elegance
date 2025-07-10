import React, { useState } from "react";

const DateEditableField = ({
  icon,
  value,
  placeholder,
  isEditing,
  onEditClick,
  onChange,
  onBlur,
  type,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);

  const handleFocus = () => {
    setIsInteracting(true);
  };

  const handleBlur = () => {
    setIsInteracting(false);
    onBlur();
  };

  return (
    <div className="col-xl-5">
      <div className="d-flex align-items-center">
      <i className={icon}></i>
      {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="form-control ms-2" // Add margin for spacing
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <span className="mt-2 small ms-2" onClick={onEditClick}>
            {value || placeholder}
          </span>
        )}
      </div>
    </div>
  );
};

export default DateEditableField;
