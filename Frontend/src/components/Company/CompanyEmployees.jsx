import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCompanyEmployees,
  removeCompanyEmployee, // Assuming you have a service function for removing employees
} from "../../services/CompanyService";
import { Link } from "react-router-dom";
import {  toast } from 'react-toastify';

const CompanyEmployees = () => {
  const [employees, setEmployees] = useState([]); // State for storing employees
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [email, setEmail] = useState(""); // State for email input
  const [error, setError] = useState(null); // Error state
  const [employeeToRemove, setEmployeeToRemove] = useState(null); // Employee to be removed
  const navigate = useNavigate(); // Hook for navigation
  const categoryStyles = {
    "UI/UX Design": "light-info-bg",
    "Website Design": "bg-lightgreen",
    "Quality Assurance": "light-success-bg",
    "App Development": "bg-warning",
    Development: "bg-primary",
    "Backend Development": "bg-secondary",
    "Software Testing": "bg-danger",
    Marketing: "bg-info",
    SEO: "bg-dark",
    Other: "bg-light",
  };

  const getCategoryStyle = (category) => {
    return categoryStyles[category] || "bg-default"; // Default class if category not found
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getCompanyEmployees(); // Use the service method
        setEmployees(data.employees); // Assuming 'employees' is the structure of the response
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployees();
  }, []); // No dependencies, runs once on mount

  const removeEmployeeFromCompany = async (employeeId) => {
    try {
      const data = await removeCompanyEmployee(employeeId); // Call the service method to remove an employee
      console.log("Employee removed successfully:", data);
      setEmployees(employees.filter((emp) => emp._id !== employeeId)); // Remove employee from state
      toast.success("Employee removed successfully!"); // Success toast
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleNavigateToProfile = (employeeId) => {
    navigate(`/profile/${employeeId}`); // Navigate to the profile page
  };
  // Modal and form management functions
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRemoveEmployee = (employee) => {
    setEmployeeToRemove(employee); // Set the employee to be removed
    setIsModalOpen(true); // Open modal
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix">
        <div className="col-md-12">
          <div className="card border-0 mb-4 no-bg">
            <div className="card-header py-3 px-0 d-sm-flex align-items-center  justify-content-between border-bottom">
              <h3 className="fw-bold flex-fill mb-0 mt-sm-0">Employees</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
        {employees.map((employee) => (
          <div className="col" key={employee._id}>
            <div className="card teacher-card">
              <div className="card-body d-flex">
                <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                  <img
                    src={employee.profilePicture} // Use profilePicture instead of avatar
                    alt=""
                    className="avatar xl rounded-circle img-thumbnail shadow-sm"
                  />
                </div>
                <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                  <h6 className="mb-0 mt-2 fw-bold d-block fs-6">
                    {employee.firstName} {employee.lastName}
                  </h6>
                  <span
                    className={`py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1 ${getCategoryStyle(
                      employee.techRole
                    )}`}
                  >
                    {employee.techRole}
                  </span>
                  <div className="video-setting-icon mt-3 pt-3 border-top">
                    <p>{employee.bio}</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    onClick={() => handleNavigateToProfile(employee._id)} // Trigger navigation on button click
                  >
                    <i className="icofont-invisible me-2 fs-6"></i>Profile
                  </button>
                  <button
                    className="btn btn-danger btn-sm mt-1 ms-2"
                    onClick={() => handleRemoveEmployee(employee)} // Trigger remove employee on button click
                  >
                    <i className="icofont-minus-circle me-2 fs-6"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RemoveEmployeeModal directly integrated */}
      {isModalOpen && employeeToRemove && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          aria-labelledby="removeUserLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="removeUserLabel">
                  Remove Employee
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove this employee?</p>
                <p>
                  <strong>
                    {employeeToRemove.firstName} {employeeToRemove.lastName}
                  </strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    removeEmployeeFromCompany(employeeToRemove._id)
                  }
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyEmployees;
