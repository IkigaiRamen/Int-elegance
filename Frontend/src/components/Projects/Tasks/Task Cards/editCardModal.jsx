import React, { useState, useEffect } from "react";
import { getProjectById } from "../../../../services/ProjectsService";
import EditSubtaskModal from "./editSubtaskModal";
import { editTask } from "../../../../services/TaskService";

const TaskModal = ({
  isVisible,
  onClose,
  task,
  project,
  editingTask,
  handleTaskChange,
  handleAssignedToChange,
  handleSaveTask,
}) => {
  const [assignedUsers, setAssignedUsers] = useState(task?.assignedTo || []);
  const [projectAssignedUsers, setProjectAssignedUsers] = useState([]);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);

  // Fetch project data to get assigned users
  useEffect(() => {
    if (project) {
      const fetchProjectAssignedUsers = async () => {
        try {
          const response = await getProjectById(project);
          if (response && response.users) {
            setProjectAssignedUsers(response.users);
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
      fetchProjectAssignedUsers();
    }
  }, [project]);

  // Update the local assigned users when task is updated
  useEffect(() => {
    if (task?.assignedTo) {
      setAssignedUsers(task.assignedTo);
    }
    if (task?.subtasks) {
      setSubtasks(task.subtasks);
    }
  }, [task]);

  // Handle selection of users to be assigned to the task
  const handleUserSelection = (userId) => {
    const isSelected = assignedUsers.includes(userId);
    const newAssignedUsers = isSelected
      ? assignedUsers.filter((id) => id !== userId)
      : [...assignedUsers, userId];
    setAssignedUsers(newAssignedUsers);
    handleAssignedToChange(newAssignedUsers); // Propagate the changes to parent
  };

  // Format the date to 'YYYY-MM-DD'
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  // Handle subtask creation/editing
  const handleSubtaskAction = (subtask) => {
    setSubtaskToEdit(subtask);
    setIsSubtaskModalVisible(true);
  };

  const addSubtask = () => {
    setSubtaskToEdit(null);
    setIsSubtaskModalVisible(true);
  };

  const removeSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  // Handle task save (including editing)
  const saveTask = async () => {
    console.log
    try {
      const updatedTask = {
        ...task,
        assignedTo: assignedUsers,
        subtasks,
      };
      console.log("Updated Task:", updatedTask);
      // Call the editTask API function
      await editTask(task._id, updatedTask); // Assuming task._id is the task ID and updatedTask contains the new values

      handleSaveTask(updatedTask); // If you want to propagate the change to the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving task:", error);
      // Handle error (e.g., show an alert)
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {editingTask ? "Edit Task" : "Create Task"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Task Name */}
            <div className="mb-3 text-center">
              <label className="form-label">Task Name</label>
              <input
                type="text"
                className="form-control"
                value={task.name}
                onChange={handleTaskChange("name")}
                required
              />
            </div>

            {/* Task Start and End Dates */}
            <div className="row g-3 mb-3">
              <div className="col-md">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(task.startDate)}
                  onChange={handleTaskChange("startDate")}
                  required
                />
              </div>
              <div className="col-md">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(task.endDate)}
                  onChange={handleTaskChange("endDate")}
                  required
                />
              </div>
            </div>

            {/* Task Priority */}
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={task.priority}
                onChange={handleTaskChange("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Assigned Users */}
            <div className="mb-3">
              <label className="form-label">Assigned Users</label>
              <div className="user-list">
                {projectAssignedUsers.length > 0 ? (
                  projectAssignedUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`user-item ${
                        assignedUsers.includes(user._id) ? "selected" : ""
                      }`}
                      onClick={() => handleUserSelection(user._id)}
                    >
                      <img
                        src={user.profilePicture || "/default-avatar.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="avatar lg rounded-circle img-thumbnail"
                      />
                      <span className="user-name">
                        {user.firstName} {user.lastName}
                      </span>
                      {assignedUsers.includes(user._id) && (
                        <span className="check-mark">&#10003;</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No users available for this project</p>
                )}
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mb-3">
              <label className="form-label">Subtasks</label>
              <div className="subtasks-list">
                {subtasks.length > 0 ? (
                  subtasks.map((subtask, index) => (
                    <div key={index} className="subtask-item d-flex align-items-center">
                      <span>{subtask.name}</span>
                      <button
                        type="button"
                        className="btn btn-info btn-sm ms-2"
                        onClick={() => handleSubtaskAction(subtask)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => removeSubtask(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No subtasks added</p>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm mt-2"
                  onClick={addSubtask}
                >
                  Add Subtask
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveTask} // Use the saveTask function here
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* EditSubtaskModal for creating or editing a subtask */}
      {isSubtaskModalVisible && (
  <EditSubtaskModal
    onAddSubtask={(newSubtask) => {
      if (subtaskToEdit) {
        // Update subtask if we are editing
        const updatedSubtasks = subtasks.map((subtask) =>
          subtask._id === subtaskToEdit._id ? newSubtask : subtask
        );
        setSubtasks(updatedSubtasks); // Update subtasks
      } else {
        // Add new subtask
        setSubtasks([...subtasks, newSubtask]); // Add to the list
      }
      setIsSubtaskModalVisible(false); // Close the modal
      setSubtaskToEdit(null); // Reset the edit state
    }}
    taskId={task._id} // Pass task ID
    onClose={() => setIsSubtaskModalVisible(false)} // Close modal
    subtask={subtaskToEdit} // Pass the subtask being edited (or null)
  />
)}

    </div>
  );
};

export default TaskModal;
