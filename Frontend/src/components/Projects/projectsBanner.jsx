import React, { useState, useEffect } from "react";
import CreateProjectModal from "./CreateProjectModal";
import { getRole } from "../../services/UserService";

const ProjectsBanner = ({ fetchProjects }) => {
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [currentUser, setCurrentUser] = useState(null); // State to store current user data

  const openModal = () => setModalOpen(true); // Open modal
  const closeModal = () => setModalOpen(false); // Close modal

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

  return (
    <>
      <div className="row align-items-center">
        <div className="border-0 mb-4">
          <div className="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <h3 className="fw-bold py-3 mb-0">Projects</h3>
            <div className="d-flex py-2 project-tab flex-wrap w-sm-100">
              {/* Conditionally render the Create Project button based on user role */}
              {currentUser && currentUser.role !== "Employee" && (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={openModal}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Create Project
                </button>
              )}

              <ul
                className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#All-list"
                    role="tab"
                  >
                    All
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#Started-list"
                    role="tab"
                  >
                    Started
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#Approval-list"
                    role="tab"
                  >
                    Approval
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#Completed-list"
                    role="tab"
                  >
                    Completed
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating a Project */}
      {modalOpen && (
        <CreateProjectModal
          setError={setError}
          closeModal={closeModal}
          fetchProjects={fetchProjects}
        />
      )}
    </>
  );
};

export default ProjectsBanner;
