import React, { useState, useEffect } from "react";
import { getProjectById } from "../../../../../services/ProjectsService";

const SubtaskModal = ({
  isVisible,
  onClose,
  subtask,
  projectId,
  onSaveSubtask,
}) => {
  const [name, setName] = useState(subtask?.name || "");
  const [startDate, setStartDate] = useState(
    subtask?.startDate ? new Date(subtask.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    subtask?.endDate ? new Date(subtask.endDate).toISOString().split("T")[0] : ""
  );
  const [priority, setPriority] = useState(subtask?.priority || "low");
  const [assignedUsers, setAssignedUsers] = useState(subtask?.assignedTo || []);
  const [projectAssignedUsers, setProjectAssignedUsers] = useState([]);

  useEffect(() => {
    if (projectId) {
      const fetchProjectUsers = async () => {
        try {
          const response = await getProjectById(projectId);
          if (response && response.users) {
            setProjectAssignedUsers(response.users);
          }
        } catch (error) {
          console.error("Error fetching project users:", error);
        }
      };
      fetchProjectUsers();
    }
  }, [projectId]);

  const handleSave = () => {
    const newSubtask = {
      ...subtask,
      name,
      startDate,
      endDate,
      priority,
      assignedTo: assignedUsers.map((user) => user._id),
    };
    onSaveSubtask(newSubtask);
    onClose();
  };

  const toggleUserSelection = (user) => {
    if (assignedUsers.some((u) => u._id === user._id)) {
      setAssignedUsers(assignedUsers.filter((u) => u._id !== user._id));
    } else {
      setAssignedUsers([...assignedUsers, user]);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {subtask ? "Edit Subtask" : "Create Subtask"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Subtask Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned Users</label>
              <div className="d-flex flex-wrap">
                {projectAssignedUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    className={`btn me-2 mb-2 ${
                      assignedUsers.some((u) => u._id === user._id)
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save Subtask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskModal;
