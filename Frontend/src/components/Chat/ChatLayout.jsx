import React, { useState, useEffect } from "react";
import ChatCard from "./ChatCard";
import ChatContainer from "./ChatContainer";
import { getCurrentUserProfile } from "../../services/UserService";
import Sidebar from "../sidebar";

const ChatLayout = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Added state for selected user

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setRole(userProfile.role);
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (role === null || user === null) {
    return <div>Loading...</div>;
  }

  // Handle user selection from ChatCard
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Update the selected user
  };

  return (
    <div id="mytask-layout">
      <Sidebar role={role} />
      <div className="main">
        <div className="body d-flex">
          <div className="container-xxl p-0">
            <div className="row g-0">
              <div className="col-12 d-flex">
                <div className="chat-card-container" style={{ flex: 1 , paddingTop:"30px" }}>
                  <ChatCard onUserSelect={handleUserSelect} />
                </div>
                <div className="chat-container" style={{ flex: 2 ,paddingTop:"30px" }}>
                  {selectedUser ? (
                    <ChatContainer user={selectedUser} onBack={() => setSelectedUser(null)} />
                  ) : (
                    null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
