import React, { useEffect } from "react";

const TaskForm = ({
  taskName,
  taskStartDate,
  taskEndDate,
  taskPriority,
  assignedTo,
  project,
  handleTaskChange,
  handleAssignedToChange,
  onErrorChange, // New prop to report errors to the parent component
}) => {
  const [startDateError, setStartDateError] = React.useState("");
  const [endDateError, setEndDateError] = React.useState("");

  // New state for project date errors
  const [projectStartDateError, setProjectStartDateError] = React.useState("");
  const [projectEndDateError, setProjectEndDateError] = React.useState("");

  const validateDates = () => {
    let startError = "";
    let endError = "";
    let projectStartError = "";
    let projectEndError = "";

    // Task dates must be in the future
    if (taskStartDate && new Date(taskStartDate) < new Date()) {
      startError = "Start date must be in the future.";
    }

    if (taskEndDate && new Date(taskEndDate) < new Date(taskStartDate)) {
      endError = "End date must be after start date.";
    }

    // Task dates must be within the project start and end dates
    if (taskStartDate && new Date(taskStartDate) < new Date(project.startDate)) {
      projectStartError = "Task start date must be on or after the project start date.";
    }

    if (taskEndDate && new Date(taskEndDate) > new Date(project.endDate)) {
      projectEndError = "Task end date must be on or before the project end date.";
    }

    setStartDateError(startError);
    setEndDateError(endError);
    setProjectStartDateError(projectStartError);
    setProjectEndDateError(projectEndError);

    // Notify parent about errors
    if (onErrorChange) {
      onErrorChange({
        startDateError: startError,
        endDateError: endError,
        projectStartDateError: projectStartError,
        projectEndDateError: projectEndError,
      });
    }
  };

  // Validate dates whenever they change
  useEffect(() => {
    validateDates();
  }, [taskStartDate, taskEndDate, project.startDate, project.endDate]);

  return (
    <>
      <div className="mb-3 text-center">
        <label className="form-label">Task Name</label>
        <input
          type="text"
          className="form-control"
          value={taskName}
          onChange={handleTaskChange("taskName")}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col">
          <label className="form-label">Task Start Date</label>
          <input
            type="date"
            className="form-control"
            value={taskStartDate}
            onChange={handleTaskChange("taskStartDate")}
            required
          />
          {startDateError && (
            <div className="text-danger">{startDateError}</div>
          )}
          {projectStartDateError && (
            <div className="text-danger">{projectStartDateError}</div>
          )}
        </div>

        <div className="col">
          <label className="form-label">Task End Date</label>
          <input
            type="date"
            className="form-control"
            value={taskEndDate}
            onChange={handleTaskChange("taskEndDate")}
            required
          />
          {endDateError && <div className="text-danger">{endDateError}</div>}
          {projectEndDateError && (
            <div className="text-danger">{projectEndDateError}</div>
          )}
        </div>
      </div>

      <div className="mb-3 text-center">
        <label className="form-label d-block">Priority</label>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className={`btn ${
              taskPriority === "lowest"
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() =>
              handleTaskChange("taskPriority")({ target: { value: "lowest" } })
            }
          >
            Lowest
          </button>
          <button
            type="button"
            className={`btn ${
              taskPriority === "low" ? "btn-success" : "btn-outline-success"
            } me-2`}
            onClick={() =>
              handleTaskChange("taskPriority")({ target: { value: "low" } })
            }
          >
            Low
          </button>
          <button
            type="button"
            className={`btn ${
              taskPriority === "medium" ? "btn-warning" : "btn-outline-warning"
            } me-2`}
            onClick={() =>
              handleTaskChange("taskPriority")({ target: { value: "medium" } })
            }
          >
            Medium
          </button>
          <button
            type="button"
            className={`btn ${
              taskPriority === "high" ? "btn-danger" : "btn-outline-danger"
            } me-2`}
            onClick={() =>
              handleTaskChange("taskPriority")({ target: { value: "high" } })
            }
          >
            High
          </button>
        </div>
      </div>

      <div className="mb-3 text-center">
        <label className="form-label">Assigned To</label>
        <div className="custom-dropdown">
          {project.users && project.users.length > 0 ? (
            <div className="user-list">
              {project.users.map((user) => (
                <div
                  key={user._id}
                  className={`user-item ${
                    assignedTo.includes(user._id) ? "selected" : ""
                  }`}
                  onClick={() => handleAssignedToChange(user._id)}
                >
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="avatar lg rounded-circle img-thumbnail"
                  />
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  {assignedTo.includes(user._id) && (
                    <i className="check-icon">✔</i>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-users">No users available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskForm;
