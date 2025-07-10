import React from "react";

const AssignedUsersList = ({
  projectAssignedUsers,
  taskAssignedUsers,
  onAssignedUsersChange
}) => {
  // Handle user click to toggle between assigned and unassigned in the task list
  const handleUserClick = (user) => {
    // Check if the user is already in the taskAssignedUsers list
    const isUserAssignedToTask = taskAssignedUsers.some(
      (assignedUser) => assignedUser._id === user._id
    );

    // Toggle between add/remove the user
    const updatedAssignedUsers = isUserAssignedToTask
      ? taskAssignedUsers.filter(
          (assignedUser) => assignedUser._id !== user._id
        )
      : [...taskAssignedUsers, user];
        console.log(updatedAssignedUsers,"assigned users");
    // Only notify the parent if there is a change in the list
    if (updatedAssignedUsers.length !== taskAssignedUsers.length || 
        !updatedAssignedUsers.every((user, index) => user._id === taskAssignedUsers[index]._id)) {
      onAssignedUsersChange(updatedAssignedUsers); // Notify parent with updated list
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Assigned Users</label>
      <div className="user-list">
        {projectAssignedUsers.length > 0 ? (
          projectAssignedUsers.map((user) => {
            // Check if the user is assigned to the task
            const isAssignedToTask = taskAssignedUsers.some(
              (taskUser) => taskUser._id === user._id
            );

            return (
              <div
                key={user._id}
                className="user-item"
                onClick={() => handleUserClick(user)} // Toggle user on click for task
                style={{
                  cursor: "pointer",
                  backgroundColor: isAssignedToTask ? "lightgreen" : "transparent", // Highlight if assigned to task
                  border: isAssignedToTask ? "2px solid green" : "1px solid gray", // Add a border to highlight better
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
                {/* Display checkmark if the user is assigned to the task */}
                {isAssignedToTask && (
                  <span className="check-mark" style={{ color: "green" }}>
                    &#10003; {/* Check mark */}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p>No users available for this project</p>
        )}
      </div>
    </div>
  );
};

export default AssignedUsersList;
