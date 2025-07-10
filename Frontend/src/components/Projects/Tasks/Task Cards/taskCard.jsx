import React, { useEffect, useState } from "react";
import TaskModal from "./Modal/taskModal";
import SubtaskCard from "./subtaskCard";
import { deleteTask } from "../../../../services/TaskService";
import { getRole } from "../../../../services/UserService";
import { toast } from "react-toastify";
import "./subtask.css";

const TaskCard = ({ task, projectId, onTaskUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const currentUserResponse = await getRole();
        setCurrentUser(currentUserResponse);
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };

    fetchRole();
  }, []);

  const toggleSubtasks = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditTask = () => {
    setIsModalOpen(true);
  };

  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      try {
        const response = await deleteTask(task._id);
        if (response) {
          toast.success("Task deleted successfully.");
          if (onTaskUpdate) {
            onTaskUpdate(null); // Pass `null` to indicate that the task is deleted
          }
        } else {
          toast.error("Failed to delete task.");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleEditSubtask = (subtask) => {
    setSubtaskToEdit(subtask);
    setIsModalOpen(true);
  };

  const handleSubtaskEdit = (updatedSubtask) => {
    const updatedSubtasks = updatedTask.subtasks.map((subtask) =>
      subtask._id === updatedSubtask._id ? updatedSubtask : subtask
    );

    setUpdatedTask((prevTask) => ({
      ...prevTask,
      subtasks: updatedSubtasks,
    }));

    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short" };
    return new Date(date)
      .toLocaleDateString("en-GB", options)
      .replace(",", "")
      .toLowerCase();
  };

  return (
    <>
      <div
        className="dd-item"
        data-id={task._id}
        onClick={toggleSubtasks}
        style={{
          border: "1px solid black",
          borderRadius: "5px",
        }}
      >
        <div className="dd-handle">
          <div className="task-info d-flex align-items-center justify-content-between">
            <h6
              className={`py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0 ${
                updatedTask.priority === "high"
                  ? "light-danger-bg" // High priority - red
                  : updatedTask.priority === "medium"
                  ? "light-warning-bg" // Medium priority - yellow
                  : "light-info-bg" // Low priority - green
              }`}
            >
              {updatedTask.name}
            </h6>
            <div className="task-priority d-flex flex-column align-items-center justify-content-center">
              <div className="avatar-list avatar-list-stacked m-0">
                {updatedTask.assignedTo.map((user, index) => (
                  <img
                    key={index}
                    className="avatar rounded-circle small-avt"
                    src={
                      user.profilePicture || "assets/images/default-avatar.jpg"
                    }
                    alt={user.firstName}
                  />
                ))}
              </div>
              <span
                className={`badge mt-2 ${
                  updatedTask.priority === "high"
                    ? "bg-danger" // High priority - red
                    : updatedTask.priority === "medium"
                    ? "bg-warning" // Medium priority - yellow
                    : "light-info-bg" // Low priority - green
                } text-end`}
              >
                {updatedTask.priority.toUpperCase()}
              </span>
            </div>
          </div>
          <p className="py-2 mb-0"></p>
          <div className="tikit-info row g-3 align-items-center">
            <div className="col-sm">
              <ul className="d-flex list-unstyled align-items-center flex-wrap">
                <li className="me-2">
                  <div className="d-flex align-items-center">
                    <i className="icofont-calendar"></i>
                    <span className="ms-1">
                      {formatDate(updatedTask.startDate)}
                    </span>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <i className="icofont-calendar"></i>
                    <span className="ms-1">
                      {formatDate(updatedTask.endDate)}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-sm text-end">
              <div className="small light-primary-bg py-1 px-2 rounded-1 d-inline-block fw-bold">
                <i className="icofont-tasks me-1"></i>
                <span>{updatedTask.subtasks?.length || 0}</span>
              </div>
            </div>
          </div>
          {currentUser && currentUser.role !== "Employee" && (
            <div
              className="task-actions d-flex justify-content-end"
              style={{
                bottom: "5px",
                right: "5px",
              }}
            >
              <button
                className="btn btn-sm btn-primary"
                style={{
                  borderRadius: "50%",
                  padding: "5px",
                  width: "30px",
                  height: "30px",
                }}
                onClick={handleEditTask}
              >
                <i className="icofont-edit"></i>
              </button>
              <button
                className="btn btn-sm btn-danger ms-2"
                style={{
                  borderRadius: "50%",
                  padding: "5px",
                  width: "30px",
                  height: "30px",
                }}
                onClick={handleDeleteTask}
              >
                <i className="icofont-trash"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded &&
        updatedTask.subtasks?.map((subtask) => (
          <SubtaskCard
            key={subtask._id}
            subtask={subtask}
            projectId={projectId}
            task={task}
            onEdit={() => handleEditSubtask(subtask)}
          />
        ))}

      <TaskModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={updatedTask}
        project={projectId}
        editingTask={true}
        handleTaskChange={(field) => (e) => {
          setUpdatedTask({ ...updatedTask, [field]: e.target.value });
        }}
        handleAssignedToChange={(userId) => {
          setUpdatedTask({
            ...updatedTask,
            assignedTo: updatedTask.assignedTo.includes(userId)
              ? updatedTask.assignedTo.filter((id) => id !== userId)
              : [...updatedTask.assignedTo, userId],
          });
        }}
        handleSaveTask={() => {
          setIsModalOpen(false);
          if (onTaskUpdate) {
            onTaskUpdate(updatedTask);
          }
        }}
        onAddSubtask={(updatedSubtask) => {
          const updatedSubtasks = updatedTask.subtasks.map((subtask) =>
            subtask._id === updatedSubtask._id ? updatedSubtask : subtask
          );
          setUpdatedTask({
            ...updatedTask,
            subtasks: updatedSubtasks,
          });
        }}
      />
    </>
  );
};

export default TaskCard;
