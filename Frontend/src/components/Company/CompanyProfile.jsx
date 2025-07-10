import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../services/CompanyService";
import { Link } from "react-router-dom";

const CompanyComponent = () => {
  const { companyId } = useParams(); // Extract company ID from URL parameters
  const [company, setCompany] = useState(null); // Initialize state to store company data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await getCompanyById(companyId); // Fetch company data using the service
        console.log(response);
        setCompany(response); // Set the company data to state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching company data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchCompany(); // Fetch company details on component mount
  }, [companyId]); // Dependency on companyId to re-fetch data when it changes

  if (loading) {
    return <div className="text-center">Loading...</div>; // Render loading message
  }

  if (!company) {
    return <div className="text-center">Company not found</div>; // Render error if company not found
  }

  return (
    <div className="container mt-5">
      {/* Company Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <img
              src={company.logo || "https://via.placeholder.com/150"}
              alt="Company Logo"
              className="img-fluid rounded-circle"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div className="ms-4">
              <h3 className="fs-2 mb-1">{company.name}</h3>
              <p className="fs-5 text-muted">{company.description || "No description available"}</p>
              <p>
                <strong>Website:</strong>{" "}
                <a href={company.website || "#"} target="_blank" rel="noopener noreferrer">
                  {company.website || "Not available"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="row">
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-semibold mb-3">Company Details</h4>
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-center gap-3 mb-3">
                  <i className="fa fa-envelope text-dark fs-6"></i>
                  <h6 className="fs-5 fw-semibold mb-0">{company.email || "No email provided"}</h6>
                </li>
                <li className="d-flex align-items-center gap-3 mb-3">
                  <i className="fa fa-phone text-dark fs-6"></i>
                  <h6 className="fs-5 fw-semibold mb-0">{company.phoneNumber || "No phone number"}</h6>
                </li>
                <li className="d-flex align-items-center gap-3 mb-3">
                  <i className="fa fa-map-marker-alt text-dark fs-6"></i>
                  <h6 className="fs-5 fw-semibold mb-0">{company.address || "No address available"}</h6>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-semibold mb-3">Employees</h4>
              <ul className="list-unstyled">
                {company.employees && company.employees.length > 0 ? (
                  company.employees.map((employee, index) => (
                    <li key={index} className="d-flex align-items-center mb-4">
                      <img
                        src={employee.profilePicture || "https://via.placeholder.com/50"}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="rounded-circle"
                        style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "15px" }}
                      />
                      <Link
                        to={`/profile/${employee._id}`}
                        className="text-dark fs-5 fw-semibold text-decoration-none"
                      >
                        {employee.firstName} {employee.lastName}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>No employees yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyComponent;
