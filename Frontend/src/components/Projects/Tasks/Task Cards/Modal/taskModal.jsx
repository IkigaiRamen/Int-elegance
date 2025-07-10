import React, { useState, useEffect } from "react";
import { getProjectById } from "../../../../../services/ProjectsService";
import AssignedUsersList from "./assignedUserList";
import SubtaskComponent from "../subtaskModal/subtaskComponent ";
import { editTask } from "../../../../../services/TaskService";
import { toast } from "react-toastify";

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
  const [projectStartDate, setProjectStartDate] = useState();
  const [projectEndDate, setProjectEndDate] = useState();
  const [errors, setErrors] = useState({
    taskStartDate: "",
    taskEndDate: "",
  });
console.log("these are the subtasks in taks modal",subtasks)
console.log("this is the task passed ",task)
  useEffect(() => {
    if (project) {
      const fetchProjectDetails = async () => {
        try {
          const response = await getProjectById(project);
          if (response) {
            if (response.users) {
              setProjectAssignedUsers(response.users);
            }
            // Set project start and end dates
            if (response.startDate) {
              setProjectStartDate(response.startDate);  // Assuming setTaskStartDate is available for the task start date
            }
            if (response.endDate) {
              setProjectEndDate(response.endDate);  // Assuming setTaskEndDate is available for the task end date
            }
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
      fetchProjectDetails();
    }
  }, [project]);
  

  useEffect(() => {
    if (task?.assignedTo) {
      setAssignedUsers(task.assignedTo);
    }
    if (task?.subtasks) {
      setSubtasks(task.subtasks);
    }
  }, [task]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const validateForm = () => {
    let validationErrors = {};
  
    // Check if task dates are within the project dates
    if (!task.startDate || !task.endDate) {
      validationErrors.taskStartDate = "Both start and end dates are required.";
    } else if (new Date(task.startDate) > new Date(task.endDate)) {
      validationErrors.taskStartDate = "Start date cannot be after end date.";
    } else if (projectStartDate && new Date(task.startDate) < new Date(projectStartDate)) {
      validationErrors.taskStartDate = "Task start date cannot be before project start date.";
    } else if (projectEndDate && new Date(task.endDate) > new Date(projectEndDate)) {
      validationErrors.taskEndDate = "Task end date cannot be after project end date.";
    } else {
      validationErrors.taskStartDate = ""; // Clear the error if valid
      validationErrors.taskEndDate = ""; // Clear the error if valid
    }
  
    setErrors(validationErrors);
    console.log("Validation errors:", validationErrors);
    
    // Forcing return true for testing
    return true;
  };
  
  
  

  const saveTask = async () => {
    console.log("Saving task:", task);
  
    const isValid = validateForm();
    console.log("Is form valid?", isValid);
  
    if (!isValid) {
      console.log("Form validation failed, task will not be saved.");
      return; // Prevent saving if form is invalid
    }
  
    try {
      const assignedUserIds = assignedUsers.map((user) => user._id);
  
      const updatedTask = {
        ...task,
        assignedTo: assignedUserIds, // Use the array of user IDs
        subtasks,
      };
  
      console.log("Updated task:", updatedTask);  // Debugging the updated task before saving
  
      // Send the updated task with the user IDs
      await editTask(task._id, updatedTask); // Ensure this function is working
      toast.success("Task saved successfully!");
      // Handle saving the task
      handleSaveTask(updatedTask);
  
      // Close the modal or perform any other action
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error saving task. Please try again.");
    }
  };
    

  const handleDateChange = (field) => (e) => {
    handleTaskChange(field)(e);
    validateForm(); // Validate on change
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
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
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
            <div className="row g-3 mb-3">
              <div className="col-md">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(task.startDate)}
                  onChange={handleDateChange("startDate")}
                  required
                />
                {errors.taskStartDate && (
                  <div className="error text-danger">{errors.taskStartDate}</div>
                )}
              </div>
              <div className="col-md">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(task.endDate)}
                  onChange={handleDateChange("endDate")}
                  required
                />
                {errors.taskEndDate && (
                  <div className="error text-danger">{errors.taskEndDate}</div>
                )}
              </div>
            </div>
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
            <AssignedUsersList
              projectAssignedUsers={projectAssignedUsers}
              taskAssignedUsers={assignedUsers}
              onAssignedUsersChange={setAssignedUsers}
            />
            <SubtaskComponent
              taskId={task._id}
              subtasks={subtasks}
              onSubtasksChange={setSubtasks}
            />
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
              onClick={saveTask}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
