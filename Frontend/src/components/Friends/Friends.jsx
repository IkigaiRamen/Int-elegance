import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFriends, removeFriend } from "../../services/UserService"; // Assuming you have a service for fetching friends and removing them
import { toast } from "react-toastify";

const Friends = () => {
  const [friends, setFriends] = useState([]); // State for storing friends
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [friendToRemove, setFriendToRemove] = useState(null); // Friend to be removed
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getUserFriends(); // Use the service method to fetch friends
        setFriends(data.friends); // Assuming 'friends' is the structure of the response
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchFriends();
  }, []); // No dependencies, runs once on mount

  const handleNavigateToProfile = (friendId) => {
    navigate(`/profile/${friendId}`); // Navigate to the friend's profile page
  };

  const removeFriendFromList = async (friendId) => {
    try {
      const data = await removeFriend(friendId); // Call the service method to remove a friend
      console.log("Friend removed successfully:", data);
      setFriends(friends.filter((friend) => friend._id !== friendId)); // Remove friend from state
      toast.success("Friend removed successfully!"); // Success toast
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRemoveFriend = (friend) => {
    setFriendToRemove(friend); // Set the friend to be removed
    setIsModalOpen(true); // Open modal
  };

  // Modal and form management functions
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix">
        <div className="col-md-12">
          <div className="card border-0 mb-4 no-bg">
            <div className="card-header py-3 px-0 d-sm-flex align-items-center  justify-content-between border-bottom">
              <h3 className="fw-bold flex-fill mb-0 mt-sm-0">Friends</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
        {friends.map((friend) => (
          <div className="col" key={friend._id}>
            <div className="card teacher-card">
              <div className="card-body d-flex">
                <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                  <img
                    src={friend.profilePicture} // Use profilePicture instead of avatar
                    alt=""
                    className="avatar xl rounded-circle img-thumbnail shadow-sm"
                  />
                </div>
                <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                  <h6 className="mb-0 mt-2 fw-bold d-block fs-6">
                    {friend.firstName} {friend.lastName}
                  </h6>
                  <div className="video-setting-icon mt-3 pt-3 border-top">
                    <p>{friend.bio}</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    onClick={() => handleNavigateToProfile(friend._id)} // Trigger navigation to friend's profile
                  >
                    <i className="icofont-invisible me-2 fs-6"></i>Profile
                  </button>
                  <button
                    className="btn btn-danger btn-sm mt-1 ms-2"
                    onClick={() => handleRemoveFriend(friend)} // Trigger remove friend on button click
                  >
                    <i className="icofont-minus-circle me-2 fs-6"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RemoveFriendModal directly integrated */}
      {isModalOpen && friendToRemove && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          aria-labelledby="removeFriendLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="removeFriendLabel">
                  Remove Friend
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove this friend?</p>
                <p>
                  <strong>
                    {friendToRemove.firstName} {friendToRemove.lastName}
                  </strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    removeFriendFromList(friendToRemove._id)
                  }
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
