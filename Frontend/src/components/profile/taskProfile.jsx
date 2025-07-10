import React, { useEffect, useState } from "react";
import { getProjectsByUserId } from "../../services/ProjectsService";

const TaskProfile = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsByUserId(user._id); // Fetch projects by user ID
        // Map over the projects, attach project name to each task
        const extractedTasks = projects.flatMap((project) =>
          project.tasks.map((task) => ({
            ...task,
            projectName: project.name, // Add project name to each task
          }))
        );
        setTasks(extractedTasks);
        console.log("Fetched tasks with project names:", extractedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProjects();
  }, [user._id]);

  return (
    <div className="card mb-3">
      <div className="card-header py-3">
        <h6 className="mb-0 fw-bold">Current Tasks</h6>
      </div>
      <div className="card-body">
        <div className="planned_task client_task">
          <div className="dd" data-plugin="nestable">
            <ol className="dd-list">
              {tasks.length > 0 ? (
                tasks
                  .filter((task) => task.status !== "completed") // Exclude tasks with "completed" status
                  .slice(0, 2) // Limit to 2 tasks
                  .map((task) => (
                    <li key={task._id} className="dd-item mb-3">
                      <div className="dd-handle">
                        <div className="task-info d-flex align-items-center justify-content-between">
                          <h6
                            className={`py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0 ${
                              task.priority === "high"
                                ? "bg-danger"
                                : "bg-lightgreen"
                            }`}
                          >
                            {task.name}
                          </h6>
                          <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                            <div className="avatar-list avatar-list-stacked m-0">
                              {task.assignedTo.map((user) => (
                                <img
                                  key={user._id}
                                  className="avatar rounded-circle small-avt sm"
                                  src={user.profilePicture}
                                  alt="Avatar"
                                />
                              ))}
                            </div>

                            <span
                              className={`badge mt-1 ${
                                task.status === "in progress"
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <p className="py-2 mb-0">{task.description}</p>
                        <div className="tikit-info row g-3 align-items-center">
                          <div className="col-sm"></div>
                          <div className="col-sm text-end">
                            <div className="small text-truncate light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small">
                              {task.projectName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
              ) : (
                <li>No tasks found</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskProfile;
