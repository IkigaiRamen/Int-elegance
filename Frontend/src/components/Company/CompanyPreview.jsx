import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the hook
import CompanyBanner from "./CompanyBanner";
import CurrentMembersCard from "./CurrentMemberCard";
import TotalEmployeesCard from "./TotalEmployeesCard";
import { getCompaniesByCreatorId } from "../../services/CompanyService";
import ActiveProjectsTasks from "./Stats/ActiveProjectTasks";
import EmployeeProjectDistribution from "./Stats/EmployeeProjectDistribution";
import ProjectCompletionByPriority from "./Stats/ProjectCompletionByPriority";
import ProjectStatus from "./Stats/ProjectStatus";
import TaskCompletionRate from "./Stats/TaskCompletionRate";
import TotalEmployees from "./Stats/TotalEmployees";
import UpcomingProjectDeadlines from "./Stats/UpcomingProjectDeadlines";
import ApexCharts from "react-apexcharts"; // Import ApexCharts

// Mock Data for the implemented sections
const mockEmployeeInfo = {
  totalEmployees: 120,
  activeProjects: 35,
  totalTasks: 420,
  tasksCompleted: 150,
};

const mockTopPerformers = [
  { name: "Luke Short", tasksCompleted: 80, profileImage: "assets/images/lg/avatar2.jpg" },
  { name: "Jane Doe", tasksCompleted: 75, profileImage: "assets/images/lg/avatar3.jpg" },
  { name: "Samuel Lee", tasksCompleted: 90, profileImage: "assets/images/lg/avatar4.jpg" },
];

const mockActiveProjectsTasks = [
  { projectName: "Website Redesign", tasks: 10, completedTasks: 6 },
  { projectName: "Mobile App", tasks: 15, completedTasks: 12 },
  { projectName: "E-commerce Platform", tasks: 8, completedTasks: 3 },
];

const mockEmployeeProjectDistribution = {
  developers: 40,
  designers: 30,
  projectManagers: 20,
  marketers: 10,
};

const mockUpcomingProjectDeadlines = [
  { project: "Website Redesign", deadline: "2024-12-20" },
  { project: "Mobile App", deadline: "2024-12-25" },
  { project: "E-commerce Platform", deadline: "2024-12-30" },
];

const CompanyPreview = () => {
  const [company, setCompany] = useState(null); // State for a single company object
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await getCompaniesByCreatorId(); // Assuming it fetches a single company
        setCompany(companyData);
        console.log("Fetched company data:", companyData);
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError(err.message);
      }
    };

    fetchCompany(); // Trigger the function
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Mock chart data for Employee Info
  const employeeChartOptions = {
    chart: {
      id: "employee-info-chart",
      type: "donut",
    },
    labels: ["Total Employees", "Active Projects", "Tasks Completed", "Total Tasks"],
    colors: ["#f16f8d", "#8dea93", "#e592d1", "#fbca75"],
    series: [
      mockEmployeeInfo.totalEmployees,
      mockEmployeeInfo.activeProjects,
      mockEmployeeInfo.tasksCompleted,
      mockEmployeeInfo.totalTasks,
    ],
  };

  return (
    <div className="body d-flex py-3">
      <div className="container-xxl">
        <div className="row clearfix g-3">
          <div className="col-xl-8 col-lg-12 col-md-12 flex-column">
            <div className="row g-3">
              {/* Other sections */}
              <div className="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 row-cols-xxl-4">
                    <div className="col">
                        <div className="card bg-primary">
                            <div className="card-body text-white d-flex align-items-center">
                                <i className="icofont-data fs-3"></i>
                                <div className="d-flex flex-column ms-3">
                                    <h6 className="mb-0">Total Projects</h6>
                                    <span className="text-white">14</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card bg-primary">
                            <div className="card-body text-white d-flex align-items-center">
                                <i className="icofont-chart-flow fs-3"></i>
                                <div className="d-flex flex-column ms-3">
                                    <h6 className="mb-0">Coming Projects</h6>
                                    <span className="text-white">3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card bg-primary">
                            <div className="card-body text-white d-flex align-items-center">
                                <i className="icofont-chart-flow-2 fs-3"></i>
                                <div className="d-flex flex-column ms-3">
                                    <h6 className="mb-0">Progress Projects</h6>
                                    <span className="text-white">71%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card bg-primary">
                            <div className="card-body text-white d-flex align-items-center">
                                <i className="icofont-tasks fs-3"></i>
                                <div className="d-flex flex-column ms-3">
                                    <h6 className="mb-0">Finished Projects</h6>
                                    <span className="text-white">3</span>
                                </div>
                            </div>
                        </div>
                    </div>             
                </div>

                <div className="col-md-12">
  <div className="card light-danger-bg">
    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
      <h6 className="mb-0 fw-bold">Top Performers</h6>
    </div>
    <div className="card-body">
      <div className="row g-3 align-items-center">
        <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-2">
          <p>
            You have {company?.employees.length}{" "}
            <span className="fw-bold">top performers</span> in your company.
          </p>
          <div className="d-flex justify-content-between text-center">
            <div className="">
              <h3 className="fw-bold">22</h3>
              <span className="small">New Task</span>
            </div>
            <div className="">
              <h3 className="fw-bold">6</h3>
              <span className="small">Task Completed</span>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-10">
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-6 row-deck top-perfomer">
            {company?.employees?.slice(0, 6).map((employee, index) => (
              <div className="col" key={index}>
                <div className="card shadow">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <img
                      className="avatar lg rounded-circle img-thumbnail mx-auto"
                      src={employee.profilePicture || "default-avatar.jpg"} // Default fallback if no profileImage
                      alt="profile"
                    />
                    <h6 className="fw-bold my-2 small-14">
                      {employee.firstName} {employee.lastName}
                    </h6>
                   
                    <h4 className="fw-bold text-primary fs-3">
                      {Math.floor(Math.random() * 100)}% {/* Static mock completion */}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


              <div className="col-md-12">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold ">Employees Info</h6>
                  </div>
                  <div className="card-body">
                    <div
                      className="ac-line-transparent"
                      id="apex-emplyoeeAnalytics"
                    >
                    </div>
                    {/* ApexCharts */}
                    <ApexCharts
                      options={employeeChartOptions}
                      series={employeeChartOptions.series}
                      type="donut"
                      width="80%"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <ActiveProjectsTasks  />
              </div>
              <div className="col-md-6">
                <EmployeeProjectDistribution  />
              </div>

              <div className="col-md-12">
                <ProjectStatus />
              </div>
              <div className="col-md-12">
                <TaskCompletionRate />
              </div>
              <div className="col-md-12">
                <UpcomingProjectDeadlines />
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-12 col-md-12">
            <div className="row g-3 row-deck">
              {/* Render the CompanyBanner only if company data is available */}
              {company ? (
                <CompanyBanner company={company} />
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <p>Loading company details...</p>
              )}

              <div className="col-md-12 col-lg-12 col-xl-12">
                <CurrentMembersCard members={company?.employees || []} />
              </div>
            </div>
          </div>
          
        
        </div>
      </div>
    </div>
  );
};

export default CompanyPreview;
