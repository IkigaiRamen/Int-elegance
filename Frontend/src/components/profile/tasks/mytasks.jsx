import React, { useEffect, useState } from "react";
import { getProjectsByUserId } from "../../../services/ProjectsService";
import { getCurrentUserProfile } from "../../../services/UserService";

const MyTasks = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setUserId(profile._id);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjectsByUserId(userId);
        setProjects(fetchedProjects);
        console.log("Fetched projects with tasks:", fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userId]);

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="my-tasks">
      <h3 className="mb-4">My Tasks</h3>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id} className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{project.name}</h5>
              <small>{project.description}</small>
            </div>
            <div className="card-body">
              {project.tasks && project.tasks.length > 0 ? (
                <div className="row">
                  {project.tasks
                    .filter((task) =>
                      task.assignedTo?.some((user) => user._id === userId)
                    )
                    .map((task) => (
                      <div key={task._id} className="col-md-6 col-lg-4 mb-3">
                        <div
                          className="card shadow-sm"
                          onClick={() => toggleTaskExpansion(task._id)}
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className={`card-header ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            <h6 className="mb-0 d-flex justify-content-between">
                              {task.name}
                              <span className="badge bg-secondary ms-2">
                                {task.subtasks?.length || 0} Subtasks
                              </span>
                            </h6>
                          </div>
                          <div className="card-body">
                            <p className="mb-2">{task.description}</p>
                            <div className="d-flex justify-content-between">
                              <span
                                className={`badge ${
                                  task.status === "in progress"
                                    ? "bg-warning"
                                    : task.status === "needs review"
                                    ? "bg-info"
                                    : "bg-success"
                                }`}
                              >
                                {task.status}
                              </span>
                              <span className="text-muted small">
                                Due:{" "}
                                {new Date(task.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            {task.assignedTo?.length > 0 && (
                              <div className="mt-3">
                                <strong>Assigned To:</strong>
                                <div className="d-flex flex-wrap mt-2">
                                  {task.assignedTo.map((user) => (
                                    <div
                                      key={user._id}
                                      className="d-flex align-items-center me-3 mb-2"
                                    >
                                      <img
                                        src={user.profilePicture}
                                        alt={user.firstName}
                                        className="rounded-circle"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          objectFit: "cover",
                                          marginRight: "10px",
                                        }}
                                      />
                                      <span>
                                        {user.firstName} {user.lastName}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {expandedTasks[task._id] && (
                            <div className="card-footer">
                              <strong>Subtasks:</strong>
                              {task.subtasks && task.subtasks.length > 0 ? (
                                <ul className="list-group mt-2">
                                  {task.subtasks
                                    .filter((subtask) =>
                                      subtask.assignedTo?.some(
                                        (user) => user._id === userId
                                      )
                                    )
                                    .map((subtask) => (
                                      <li
                                        key={subtask._id}
                                        className="list-group-item"
                                      >
                                        {subtask.name} -{" "}
                                        <span
                                          className={`badge ${
                                            subtask.status === "completed"
                                              ? "bg-success"
                                              : "bg-secondary"
                                          }`}
                                        >
                                          {subtask.status}
                                        </span>
                                        <div className="justify-content-end">
                                        <span className="text-muted small">
                                          Due:{" "}
                                          {new Date(
                                            subtask.endDate
                                          ).toLocaleDateString()}
                                        </span>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              ) : ( 
                              null
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted">No tasks assigned to this project.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No projects found.</p>
      )}
    </div>
  );
};

// Utility function to determine priority class
const getPriorityClass = (priority) => {
  switch (priority) {
    case "high":
      return "bg-danger text-white";
    case "medium":
      return "bg-warning text-dark";
    case "low":
      return "bg-light text-dark";
    default:
      return "bg-secondary text-white";
  }
};

export default MyTasks;
