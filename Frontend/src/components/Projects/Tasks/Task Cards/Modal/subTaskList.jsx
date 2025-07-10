import React from "react";

const SubtasksList = ({
  subtasks,
  handleSubtaskAction,
  removeSubtask,
  addSubtask,
}) => {
  return (
    <div className="mb-3">
      <div className="subtasks-list">
        {subtasks.length > 0 ? (
          subtasks.map((subtask, index) => (
            <div
              key={index}
              className="subtask-item d-flex align-items-center justify-content-between p-2 mb-2"
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <span className="fw-semibold">{subtask.name}</span>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleSubtaskAction(subtask)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeSubtask(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
        null
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
  );
};

export default SubtasksList;
