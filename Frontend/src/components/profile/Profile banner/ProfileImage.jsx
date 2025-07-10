// ProfileImage.jsx
import React from "react";

const ProfileImage = ({ profilePicture, onImageChange }) => {
  return (
    <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-0 text-center w220 mx-sm-0 mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={onImageChange}
        style={{ display: "none" }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <img
          src={profilePicture || "assets/images/lg/avatar3.jpg"}
          alt="Avatar"
          className="avatar xl rounded-circle img-thumbnail shadow-sm"
        />
        <div className="overlay">
          <span className="upload-icon">📤</span>
          <span className="upload-text">Change Picture</span>
        </div>
      </label>
    </div>
  );
};

export default ProfileImage;
