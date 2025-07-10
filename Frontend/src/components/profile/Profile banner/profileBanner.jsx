import React, { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";
import UserInfo from "./UserInfo";
import BannerImage from "./ProfileBannerImage"; // Assuming this component handles both display and upload of the banner image
import "./profile.css";
import {
  updateUserProfile,
  updateProfilePicture,
  updateBannerPicture
} from "../../../services/UserService"; // Ensure that updateBannerPicture is properly imported

const ProfileBanner = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [bannerImage, setBannerImage] = useState(user.bannerPicture || "assets/images/banner.png"); // Default to user's bannerPicture
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(false);

  // This effect sets the initial banner image if it's available in the user object
  useEffect(() => {
    console.log("User data updated:", user);  // Debugging user object change
    setBannerImage(user.bannerPicture || "assets/images/banner.png");
  }, [user]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log("Profile image selected:", file);  // Debugging selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleProfileUpload(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = async (imageData) => {
    const base64String = imageData.replace("data:", "").replace(/^.+,/, "");
    console.log("Uploading profile image data:", base64String);  // Debugging base64 string

    setLoadingProfile(true); // Set loading state to true

    try {
      const updatedUser = await updateProfilePicture(base64String);
      setProfilePicture(updatedUser.profilePicture);
      console.log("Profile picture updated:", updatedUser);  // Debugging success
    } catch (error) {
      console.error("Profile picture upload failed", error.message);  // Debugging error
    } finally {
      setLoadingProfile(false); // Reset loading state
    }
  };

  const handleBannerChange = async (event) => {
    const file = event.target.files[0];
    console.log("Banner image selected:", file);  // Debugging selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleBannerUpload(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = async (imageData) => {
    const base64String = imageData.replace("data:", "").replace(/^.+,/, "");
    console.log("Uploading banner image data:", base64String);  // Log base64 string

    setLoadingBanner(true);

    try {
        const updatedUser = await updateBannerPicture(base64String);
        console.log("Banner image updated:", updatedUser);  // Log the response
        setBannerImage(updatedUser.bannerPicture || bannerImage);
    } catch (error) {
        console.error("Banner image upload failed", error.message);
    } finally {
        setLoadingBanner(false);
    }
};


  const handleUpdate = async (field, value) => {
    console.log(`Updating ${field} with value:`, value);  // Debugging update operation
    try {
      await updateUserProfile(user._id, { [field]: value });
      console.log(`${field} updated successfully`);  // Debugging success
    } catch (error) {
      console.error("Update failed", error.message);  // Debugging error
    }
  };

  return (
    <div className="card-body p-0">
      <BannerImage bannerSrc={bannerImage} onBannerChange={handleBannerChange} />
      {loadingBanner && <p>Uploading Banner...</p>} {/* Display loading message for banner */}
      
      <div className="card teacher-card mb-3">
        <div className="card-body d-flex teacher-fulldeatil">
          <ProfileImage profilePicture={profilePicture} onImageChange={handleImageChange} />
          {loadingProfile && <p>Uploading Profile Picture...</p>} {/* Display loading message for profile */}
          <UserInfo user={user} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
