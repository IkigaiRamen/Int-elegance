import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ChatB from "../../Chat/Chat";

const TaskDetails = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const task = location.state?.task; // Access the task passed via Link
  const { _id: taskId, assignedUsers } = task;


  // Get all user IDs from the assigned members
  const userIds = task.AssignedTo.map((member) => {
    console.log(`Member: ${JSON.stringify(member)}`); // Log each member object
    return member; // Ensure _id exists
  });

  console.log("User IDs: for taskdetails", userIds); // Log the resulting userIds array

  return (
    <div className="container-xxl">
      <div className="row taskboard">
        <div className="col-xxl">
          <div className="card">
            <h2 className="fw-bold py-3 mb-0">Task Details</h2>
            <div className="task-detail-container">
              <div className="task-header d-flex justify-content-between align-items-center mb-4">
                <h6 className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
                  {task.Category || "Task Name"}
                </h6>
              </div>

              <div className="task-body">
                <p className="py-2 mb-0">
                  {task.description || "Task description goes here."}
                </p>

                <div className="tikit-info row g-3 align-items-center mt-3">
                  <div className="col-sm">
                    <ul className="d-flex list-unstyled align-items-center flex-wrap">
                      <li className="me-2">
                        <div className="d-flex align-items-center">
                          <i className="icofont-flag"></i>
                          <span className="ms-1">
                            {task.DueDate || "Due date"}
                          </span>
                        </div>
                      </li>
                      <li className="me-2">
                        <div className="d-flex align-items-center">
                          <i className="icofont-ui-text-chat"></i>
                          <span className="ms-1">{task.comments || 0}</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <i className="icofont-paper-clip"></i>
                          <span className="ms-1">{task.attachments || 0}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm text-end">
                    <div className="small text-truncate light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small">
                      {task.projectName || "Project Name"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
          <div className="card">
            <div className="card-header py-3">
              <h6 className="mb-0 fw-bold">Allocated Task Members</h6>
            </div>
            <div className="card-body">
              <div className="flex-grow-1 mem-list">
                {error ? (
                  <p>{error}</p>
                ) : task.AssignedTo.length > 0 ? (
                  task.AssignedTo.map((member) => (
                    <div
                      key={member._id}
                      className="py-2 d-flex align-items-center border-bottom"
                    >
                      <div className="d-flex ms-2 align-items-center flex-fill">
                        <img
                          src={member.profilePicture}
                          className="avatar lg rounded-circle img-thumbnail"
                          alt="avatar"
                        />
                        <div className="d-flex flex-column ps-2">
                          <h6 className="fw-bold mb-0">
                            {member.firstName} {member.lastName}
                          </h6>
                          <span className="small text-muted">
                            {member.techRole}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn light-danger-bg text-end"
                        data-bs-toggle="modal"
                        data-bs-target="#dremovetask"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No members allocated.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-12 col-xl-12">
          <ChatB channelId={taskId} userIds={userIds} />{" "}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
