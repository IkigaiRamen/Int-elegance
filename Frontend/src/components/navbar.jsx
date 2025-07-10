import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import {
  getCurrentUserProfile,
  fetchUserInvitations,
  getUserById,
} from "../services/UserService";
import {
  acceptFriendRequest,
  declineFriendRequest,
  updateInvitationStatus,
} from "../services/UserService";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [friendRequests, setFriendRequests] = useState([]); // State for friend requests
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the combined dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); // State for settings modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getCurrentUserProfile();
        setUser(userData);
        setNotifications(userData.notifications || []); // Set notifications from user data
        if (userData.friendRequests && userData.friendRequests.length > 0) {
          const requests = await Promise.all(
            userData.friendRequests.map(async (friendId) => {
              const friendData = await getUserById(friendId); // Fetch friend details
              return friendData;
            })
          );
          setFriendRequests(requests); // Set the friend requests
        }
        console.log(userData, "user data");
      } catch (error) {
        setError(error.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Assuming fetchUserInvitations fetches the data from your backend
        const response = await fetchUserInvitations();
        console.log("Fetched invitations raw data:", response);

        // Ensure data integrity before setting it
        setInvitations(response || []);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      }
    };

    fetchInvitations();
  }, []);
  useEffect(() => {
    if (query) {
      const delayDebounceFn = setTimeout(() => {
        navigate(`/search-users?query=${query}`);
        setQuery("");
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query, navigate]);

  const handleLogout = () => {
    // Show a success toast message
    toast.success("Logged out successfully!");

    // Set a timeout to delay the logout and navigation
    setTimeout(() => {
      // Remove token from localStorage or sessionStorage
      localStorage.removeItem("token"); // Use this if you stored the token in localStorage
      sessionStorage.removeItem("token"); // Use this if you stored the token in sessionStorage

      // Navigate to the login page
      navigate("/login");
    }, 1000); // 1000ms (1 second) delay before logging out
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
    setProfileOpen(false); // Ensure only one dropdown is open at a time
  };

  const toggleProfile = (e) => {
    e.preventDefault();
    setProfileOpen(!profileOpen);
    setDropdownOpen(false); // Ensure only one dropdown is open at a time
  };

  const handleAcceptRequest = (friend) => {
    acceptFriendRequest(friend._id)
      .then(() => {
        toast.success(
          `Successfully accepted friend request from ${friend.firstName} ${friend.lastName}`
        );
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friend._id)
        ); // Remove the accepted request
      })
      .catch(() => {
        toast.error(
          `Failed to accept friend request from ${friend.firstName} ${friend.lastName}`
        );
      });
  };

  const handleRefuseRequest = (friend) => {
    declineFriendRequest(friend._id)
      .then(() => {
        toast.success(
          `Successfully declined friend request from ${friend.firstName} ${friend.lastName}`
        );
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friend._id)
        ); // Remove the declined request
      })
      .catch(() => {
        toast.error(
          `Failed to decline friend request from ${friend.firstName} ${friend.lastName}`
        );
      });
  };

  const handleInvitationAction = async (invitationId,companyId, action) => {
    try {
      const response = await updateInvitationStatus({ invitationId,companyId, action });
      toast.success(`Invitation ${action}ed successfully`);

      // Update local invitations state
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation._id !== invitationId)
      );
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error);
      toast.error(`Failed to ${action} invitation`);
    }
  };

  return (
    <div className="header">
      <nav className="navbar py-4">
        <div className="container-xxl">
          <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
            {/* Combined Notifications and Invitations Dropdown */}
            <div className="dropdown notifications-invitations">
              <a
                className={`nav-link pulse ${dropdownOpen ? "active" : ""}`}
                href="#"
                onClick={toggleDropdown}
              >
                <i className="icofont-alarm fs-5"></i>
                {(notifications.length > 0 ||
                  invitations.length > 0 ||
                  friendRequests.length > 0) && (
                  <span className="badge bg-danger rounded-circle">
                    {notifications.length +
                      invitations.length +
                      friendRequests.length}
                  </span>
                )}
              </a>
              {dropdownOpen && (
                <div
                  id="NotificationsInvitationsDiv"
                  className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0 show"
                >
                  <div className="card border-0 w380">
                    <div className="card-header border-0 p-3">
                      <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                        <span>Notifications & Invitations</span>
                        <span className="badge text-white">
                          {notifications.length +
                            invitations.length +
                            friendRequests.length}
                        </span>
                      </h5>
                    </div>
                    <div className="card-body">
                      {friendRequests.length > 0 && (
                        <div>
                          <h6>Friend Requests</h6>
                          <ul className="list-unstyled list mb-0">
                            {friendRequests.map((friend) => (
                              <li
                                key={friend._id}
                                className="py-2 d-flex justify-content-between align-items-center"
                              >
                                <div className="d-flex align-items-center">
                                  <img
                                    src={
                                      friend.profilePicture ||
                                      "assets/images/profile_av.png"
                                    }
                                    alt={friend.firstName}
                                    className="avatar avatar-sm rounded-circle me-2"
                                  />
                                  <span>
                                    {friend.firstName} {friend.lastName}
                                  </span>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleAcceptRequest(friend)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRefuseRequest(friend)}
                                  >
                                    Refuse
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {invitations.length > 0 && (
                        <div>
                          <h6>Invitations</h6>
                          <ul className="list-unstyled list mb-0">
                            {invitations.map((invitation) => (
                              <li
                                key={invitation._id}
                                className="py-2 d-flex justify-content-between align-items-center"
                              >
                                <span>
                                  You have been invited to{" "}
                                  <Link
                                    to={`/company/${invitation.companyId}`}
                                    className="text-decoration-none text-primary"
                                  >
                                    {invitation.companyName}
                                  </Link>
                                </span>{" "}
                                <div>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() =>
                                      handleInvitationAction(
                                        invitation._id,
                                        invitation.companyId,
                                        "accept"
                                      )
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      handleInvitationAction(
                                        invitation._id,
                                        invitation.companyId,
                                        "refuse"
                                      )
                                    }
                                  >
                                    Refuse
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {notifications.length > 0 && (
                        <ul className="list-unstyled list mb-0">
                          {notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className="py-2 d-flex justify-content-between align-items-center"
                            >
                              <span>{notification.message}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {notifications.length === 0 &&
                        invitations.length === 0 &&
                        friendRequests.length === 0 && (
                          <p className="text-center mb-0">
                            No notifications or invitations
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center">
              <div className="u-info me-2">
                <p className="mb-0 text-end line-height-sm">
                  <span className="font-weight-bold">
                    {user.firstName} {user.lastName}
                  </span>
                </p>
                <small>{user.email}</small>
              </div>
              <a
                className={`nav-link pulse p-0 ${profileOpen ? "active" : ""}`}
                href="#"
                onClick={toggleProfile}
              >
                <img
                  className="avatar lg rounded-circle img-thumbnail"
                  src={user.profilePicture || "assets/images/profile_av.png"}
                  alt="profile"
                />
              </a>
              {profileOpen && (
                <div className="dropdown-menu dropdown-animation show">
                  <a href="#" className="dropdown-item">
                    <i className="icofont-lock fs-5 me-2"></i> Change Password
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="icofont-exclamation fs-5 me-2"></i> Forgot
                    Password
                  </a>
                  <div className="dropdown-divider"></div>{" "}
                  <a href="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="icofont-logout fs-5 me-2"></i> Logout
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0">
            <div className="input-group flex-nowrap input-group-lg">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                aria-label="search"
                aria-describedby="addon-wrapping"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
