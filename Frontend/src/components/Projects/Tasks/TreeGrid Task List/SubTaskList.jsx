import React, { useState, useEffect } from "react";
import SubtaskModal from "./subTaskModal";
import { fetchTaskById } from "../../../../services/TaskService";

const SubtaskList = ({ taskId, handleRemoveSubtask, handleAddSubtask }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null); // Track selected subtask for editing

  const openModal = (subtask = null) => {
    setSelectedSubtask(subtask); // Set the subtask to be edited (or null if adding new)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubtask(null); // Reset selected subtask when closing the modal
    setIsModalOpen(false);
  };

  // Function to handle the addition of a new subtask
  const handleSubtaskAdd = (subtaskData) => {
    // Add the subtask to the parent task
    handleAddSubtask(subtaskData);

    // Refresh the subtasks after adding
    fetchSubtasks();
    closeModal();
  };

  // Fetch task by ID and update subtasks
  const fetchSubtasks = async () => {
    try {
      const response = await fetchTaskById(taskId); // Fetch task by ID
      setSubtasks(response.task.subtasks || []); // Update subtasks from the task data
    } catch (error) {
      setError("Error fetching task data");
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subtasks whenever taskId changes
  useEffect(() => {
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="text-center">
      <h5>Subtasks</h5>
      {subtasks.length > 0 ? (
        <ul className="list-unstyled">
          {subtasks.map((subtask) => (
            <li
              key={subtask._id} // Use subtask ID as key
              className="d-flex justify-content-between align-items-center"
            >
              <button
                type="button"
                className="btn btn-link"
                onClick={() => openModal(subtask)} // Open modal to edit the clicked subtask
              >
                {subtask.name} (Priority: {subtask.priority})
              </button>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent modal from opening
                  handleRemoveSubtask(subtask._id); // Pass subtask ID to remove
                  fetchSubtasks(); // Refresh subtasks after removal
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subtasks available</p>
      )}

      <button
        type="button"
        className="btn btn-success mt-3"
        onClick={() => openModal()} // Open modal to add a new subtask
      >
        + Add Subtask
      </button>

      {isModalOpen && (
        <SubtaskModal
          onAddSubtask={handleSubtaskAdd}
          onClose={closeModal}
          taskId={taskId}
          subtask={selectedSubtask} // Pass the selected subtask for editing
        />
      )}
    </div>
  );
};

export default SubtaskList;
