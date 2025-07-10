import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CreateTaskModal from "./TreeGrid Task List/createTaskModal";
import { getProjectById } from "../../../services/ProjectsService";
import { getRole } from "../../../services/UserService";

const ProjectTaskBanner = ({ onTabChange }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const currentUserResponse = await getRole();
        setCurrentUserRole(currentUserResponse.role);
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="border-0 mb-4">
        <div className="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold py-3 mb-0">
            <Link
              to={`/projecttasks/${project._id}`}
              className="text-decoration-none text-dark"
            >
              {project.name}
            </Link>
          </h3>

          <ul className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100" role="tablist">
            <li className="nav-item">
              <button
                className="btn btn-primary mx-2 py-2 px-4 shadow-sm"
                onClick={() => onTabChange("taskCards")} // Pass the tab change function to parent
              >
                Task Cards
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-primary mx-2 py-2 px-4 shadow-sm"
                onClick={() => onTabChange("ganttChart")} // Pass the tab change function to parent
              >
                Gantt Chart
              </button>
            </li>

            {currentUserRole === "Company" && (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-dark mx-2 py-2 px-4 shadow-sm"
                  onClick={handleOpenModal}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Create Task
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Conditionally render the modal */}
      {isModalOpen && (
        <CreateTaskModal project={project} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ProjectTaskBanner;
