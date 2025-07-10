import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserById,
  getCurrentUserProfile,
  sendFriendRequest,
} from "../../services/UserService"; // Assuming checkIfFriends is added to check friendship
import {
  assignUserToCompany,
  getCompaniesByCreatorId,
  removeCompanyEmployee,
} from "../../services/CompanyService";

const ProfileComponent = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [areFriends, setAreFriends] = useState(false); // New state for friendship status

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserById(userId);
        setUser(userResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const checkIfUserIsEmployee = async () => {
      try {
        const currentUserProfile = await getCurrentUserProfile();
        const creatorId = currentUserProfile._id;
        const companies = await getCompaniesByCreatorId(creatorId);

        if (companies && companies[0]) {
          const currentCompany = companies[0];
          setCompanyId(currentCompany._id);

          const isEmployeeInCompany = currentCompany.employees.some(
            (employee) => employee._id === userId
          );
          setIsEmployee(isEmployeeInCompany);
        } else {
          console.log("No company found.");
        }
      } catch (error) {
        console.error("Error checking employee status:", error);
      }
    };

    const checkFriendshipStatus = async () => {
      try {
    
        const currentUserProfile = await getCurrentUserProfile();
        const myId = currentUserProfile._id;

        const isFriend = user?.friends?.includes(myId);
        setAreFriends(isFriend);
      } catch (error) {
        console.error("Error checking friendship status:", error);
      }
    };

    fetchUserData();
    checkIfUserIsEmployee();
    checkFriendshipStatus(); // Check friendship status when the component mounts
  }, [userId]);

  const handleInviteToCompany = async () => {
    try {
      await assignUserToCompany(companyId, user.email);
      toast.success("Invitation sent successfully!");
      setIsEmployee(true);
    } catch (error) {
      console.error("Error inviting user to company:", error);
      toast.error("Failed to send invitation.");
    }
  };

  const handleRemoveFromCompany = async () => {
    try {
      await removeCompanyEmployee(companyId, userId);
      toast.success("User removed from company!");
      setIsEmployee(false);
    } catch (error) {
      console.error("Error removing user from company:", error);
      toast.error("Failed to remove user.");
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent successfully!");
      setFriendRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container">
      <div className="card overflow-hidden">
        <div className="card-body p-0">
          <img
            src={
              user.bannerPicture ||
              "https://www.bootdey.com/image/1352x300/FF7F50/000000"
            }
            alt=""
            className="img-fluid"
          />
          <div className="row align-items-center">
            <div className="col-lg-4 order-lg-1 order-2">
              <div className="d-flex align-items-center justify-content-around m-4"></div>
            </div>
            <div className="col-lg-4 mt-n3 order-lg-2 order-1 d-flex justify-content-center">
              <div className="mt-n5 text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div
                    className="linear-gradient d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: "110px", height: "110px" }}
                  >
                    <div
                      className="border border-4 border-white d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <img
                        src={
                          user.profilePicture ||
                          "https://bootdey.com/img/Content/avatar/avatar1.png"
                        }
                        alt=""
                        className="w-100 h-100"
                      />
                    </div>
                  </div>
                </div>
                <h5 className="fs-5 mb-0 fw-semibold">
                  {user.firstName} {user.lastName}
                </h5>
                <p className="mb-0 fs-4">{user.techRole}</p>
              </div>
            </div>
            <div className="col-lg-4 order-last">
              <ul className="list-unstyled d-flex align-items-center justify-content-end my-3 gap-3">
                {/* Conditionally render based on friendship status */}
                {areFriends ? (
                  <li>
                    <button className="btn btn-secondary" disabled>
                      Friends
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      className="btn btn-success"
                      onClick={handleSendFriendRequest}
                      disabled={friendRequestSent}
                    >
                      {friendRequestSent
                        ? "Friend Request Sent"
                        : "Send Friend Request"}
                    </button>
                  </li>
                )}
                {isEmployee ? (
                  <li>
                    <button
                      className="btn btn-danger"
                      onClick={handleRemoveFromCompany}
                    >
                      Remove from Company
                    </button>
                  </li>
                ) : (
                  user.role === "Employee" && (
                    <li>
                      <button
                        className="btn btn-primary"
                        onClick={handleInviteToCompany}
                      >
                        Invite to Company
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Profile Tabs */}
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <div className="row">
            <div className="col-lg-4">
              <div className="card shadow-none border">
                <div className="card-body">
                  <h4 className="fw-semibold mb-3">Introduction</h4>
                  <p>{user.bio || "No bio available."}</p>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-center gap-3 mb-4">
                      <i className="fa fa-briefcase text-dark fs-6"></i>
                      <h6 className="fs-6 fw-semibold mb-0">
                        {user.techRole || "Not available"}
                      </h6>
                    </li>
                    <li className="d-flex align-items-center gap-3 mb-4">
                      <i className="fa fa-envelope text-dark fs-6"></i>
                      <h6 className="fs-6 fw-semibold mb-0">{user.email}</h6>
                    </li>
                    <li className="d-flex align-items-center gap-3 mb-4">
                      <i className="fa fa-flag text-dark fs-6"></i>
                      <h6 className="fs-6 fw-semibold mb-0">
                        {user.country || "No website"}
                      </h6>
                    </li>
                    <li className="d-flex align-items-center gap-3 mb-2">
                      <i className="fa fa-list text-dark fs-6"></i>
                      <h6 className="fs-6 fw-semibold mb-0">
                        {user.address || "Address not available"}
                      </h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card shadow-none border">
                <div className="card-body">
                  <h4 className="fw-semibold mb-3">Timeline</h4>
                  <p>{user.timeline || "No timeline events available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
