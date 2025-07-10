// ProfileBannerImage.jsx
import React from "react";
import './profile.css'; // Ensure your styles are imported

const ProfileBannerImage = ({ bannerSrc, onBannerChange }) => {
  return (
    <div className="banner-container">
      <input
        type="file"
        accept="image/*"
        onChange={onBannerChange}
        style={{ display: "none" }}
        id="banner-upload"
      />
      <label htmlFor="banner-upload" className="profile-teacher">
        <img src={bannerSrc} alt="Banner" className="img-fluid" />
        <div className="overlay">
          <span className="upload-icon">📤</span>
          <span className="upload-text">Change Banner</span>
        </div>
      </label>
    </div>
  );
};

export default ProfileBannerImage;
