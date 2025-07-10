import React, { useEffect } from "react";

const AssignedSubtaskUserList = ({
  taskAssignedUsers,
  subtaskAssignedUsers,
  onSubtaskUsersChange,
}) => {


  // Handle user click to toggle between assigned and unassigned in the subtask list
  const handleUserClick = (user) => {

    const isUserAssignedToSubtask = subtaskAssignedUsers.some(
      (assignedUser) => assignedUser._id === user._id
    );

    const updatedAssignedUsers = isUserAssignedToSubtask
      ? subtaskAssignedUsers.filter(
          (assignedUser) => assignedUser._id !== user._id
        )
      : [...subtaskAssignedUsers, user];
    

    // Simplified change detection
    if (updatedAssignedUsers.length !== subtaskAssignedUsers.length) {
      onSubtaskUsersChange(updatedAssignedUsers);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Subtask Assigned Users</label>
      <div className="user-list">
        {taskAssignedUsers.length > 0 ? (
          taskAssignedUsers.map((user) => {
            const isAssignedToSubtask = subtaskAssignedUsers.some(
              (subtaskUser) => subtaskUser._id === user._id
            );

            return (
              <div
                key={user._id}
                className="user-item"
                onClick={() => handleUserClick(user)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isAssignedToSubtask
                    ? "lightblue"
                    : "transparent",
                  border: isAssignedToSubtask
                    ? "2px solid blue"
                    : "1px solid gray",
                }}
              >
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="avatar lg rounded-circle img-thumbnail"
                />
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
                {isAssignedToSubtask && (
                  <span className="check-mark" style={{ color: "blue" }}>
                    &#10003;
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p>No users available for this task</p>
        )}
      </div>
    </div>
  );
};

export default AssignedSubtaskUserList;
