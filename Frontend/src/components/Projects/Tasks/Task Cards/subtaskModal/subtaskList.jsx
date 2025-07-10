import React from "react";
import { deleteSubtask } from "../../../../../services/SubtaskService";
import { toast } from "react-toastify";

const SubtasksList = ({ subtasks, onEdit, onRemove, onAdd }) => {
  const handleDelete = async (index, subtaskId) => {
    try {
      await deleteSubtask(subtaskId); // Call the delete API
      toast.success("Subtask deleted successfully!");
      onRemove(index); // Notify the parent to update the subtasks list
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask. Please try again.");
    }
  };

  return (
    <div className="mb-3">
      <div className="subtasks-list">
        {subtasks.length > 0 ? (
          subtasks.map((subtask, index) => (
            <div
              key={index}
              className="subtask-item d-flex justify-content-between align-items-center mb-2 p-2"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <span className="fw-semibold">{subtask.name}</span>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => onEdit(subtask)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(index, subtask._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : null}
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-2"
          onClick={onAdd}
        >
          Add Subtask
        </button>
      </div>
    </div>
  );
};

export default SubtasksList;
