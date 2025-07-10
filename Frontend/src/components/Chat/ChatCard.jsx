import React, { useEffect, useState } from 'react';
import { getCurrentUserProfile } from '../../services/UserService';
import { getUserFriends } from '../../services/UserService';  // Assuming you have this service
import { getProjectsByUserId } from '../../services/ProjectsService';
import "./ChatCard.css";
const ChatCard = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('chat-recent');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUserProfile();
        const userId = currentUser._id;

        // Fetch friends of the current user
        const friendsResponse = await getUserFriends(userId);  // Fetch friends
        const friends = friendsResponse.friends.map((friend) => ({
          _id: friend._id,
          firstName: friend.firstName,
          lastName: friend.lastName,
          profilePicture: friend.profilePicture,
          initials: friend.firstName[0].toUpperCase() + friend.lastName[0].toUpperCase(),
          message: 'Available',
          time: new Date().toLocaleTimeString(),
        }));

        // Fetch projects assigned to the current user (optional, if you want to display groups)
        const projectsResponse = await getProjectsByUserId(userId);
        const projectGroups = projectsResponse.map((project) => ({
          name: project.name,
          description: `Project Group: ${project.name}`,
          initials: project.name[0].toUpperCase(),
          time: new Date(project.startDate).toLocaleDateString(),
          members: project.assignedUsers,
        }));

        setUsers(friends);  // Set users as friends
        setGroups(projectGroups);  // Set groups (optional, based on your need)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="card card-chat border-right border-top-0 border-bottom-0 w380">
      <div className="px-4 py-3 py-md-4">
        <div className="nav nav-pills justify-content-between text-center" role="tablist">
          <a
            className={`flex-fill rounded border-0 nav-link ${activeTab === 'chat-recent' ? 'active' : ''}`}
            onClick={() => handleTabClick('chat-recent')}
            role="tab"
            aria-selected={activeTab === 'chat-recent'}
          >
            Chat
          </a>
          <a
            className={`flex-fill rounded border-0 nav-link ${activeTab === 'chat-groups' ? 'active' : ''}`}
            onClick={() => handleTabClick('chat-groups')}
            role="tab"
            aria-selected={activeTab === 'chat-groups'}
          >
            Members Groups
          </a>
        </div>
      </div>

      <div className="tab-content border-top">
        <div
          className={`tab-pane fade ${activeTab === 'chat-recent' ? 'show active' : ''}`}
          id="chat-recent"
          role="tabpanel"
        >
          <div className="scrollable-content">
            <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item px-md-4 py-3 py-md-4"
                  onClick={() => onUserSelect(user)} // Trigger onUserSelect with the selected user
                >
                  <a href="#" className="d-flex">
                    {user.profilePicture ? (
                      <img className="avatar rounded-circle" src={user.profilePicture} alt={user.firstName} />
                    ) : (
                      <div className="avatar rounded-circle no-thumbnail">
                        {user.initials}
                      </div>
                    )}
                    <div className="flex-fill ms-3 text-truncate">
                      <h6 className="d-flex justify-content-between mb-0">
                        <span>{user.firstName} {user.lastName}</span>
                        <small className="msg-time">{user.time}</small>
                      </h6>
                      <span className="text-muted">{user.message}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'chat-groups' ? 'show active' : ''}`}
          id="chat-groups"
          role="tabpanel"
        >
          <div className="scrollable-content">
            <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
              {groups.map((group, index) => (
                <li key={index} className="list-group-item px-md-4 py-3 py-md-4">
                  <a href="#" className="d-flex">
                    <div className="avatar rounded-circle no-thumbnail">{group.initials}</div>
                    <div className="flex-fill ms-3 text-truncate">
                      <h6 className="d-flex justify-content-between mb-0">
                        <span>{group.name}</span>
                        <small className="msg-time">{group.time}</small>
                      </h6>
                      <span className="text-muted">{group.description}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
