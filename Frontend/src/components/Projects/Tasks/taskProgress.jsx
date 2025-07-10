import React from 'react';
import { useState } from 'react';

const TaskProgress = () => {
    const [Tasks, setMembers] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const userId = getUserIdFromToken(); // Call the function to get user ID
    
            if (!userId) {
              setError("No user ID found");
              return;
            }
    
            // Fetch employees data from the API
            const response = await getCompanyEmployees(userId);
    
            // Assuming the employees data is inside response.employees
            const { employees } = response;
    
            setMembers(employees || []); // Set the state with the employees array
            console.log('Fetched employees:', employees);
          } catch (error) {
            console.error('Error fetching employees:', error);
            setError("Error fetching employees");
          }
        };
    
        fetchTasks(); // Fetch the employees when the component mounts
      }, []); // Em

    return (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
            <div className="card">
                <div className="card-header py-3">
                    <h6 className="mb-0 fw-bold">Task Progress</h6>
                </div>
                <div className="card-body mem-list">
                    <div className="progress-count mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold d-flex align-items-center">UI/UX Design</h6>
                            <span className="small text-muted">02/07</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar light-info-bg"
                                role="progressbar"
                                style={{ width: '92%' }}
                                aria-valuenow="92"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progress-count mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold d-flex align-items-center">Website Design</h6>
                            <span className="small text-muted">01/03</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar bg-lightgreen"
                                role="progressbar"
                                style={{ width: '60%' }}
                                aria-valuenow="60"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progress-count mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold d-flex align-items-center">Quality Assurance</h6>
                            <span className="small text-muted">02/07</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar light-success-bg"
                                role="progressbar"
                                style={{ width: '40%' }}
                                aria-valuenow="40"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progress-count mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold d-flex align-items-center">Development</h6>
                            <span className="small text-muted">01/05</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar light-orange-bg"
                                role="progressbar"
                                style={{ width: '40%' }}
                                aria-valuenow="40"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progress-count mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold d-flex align-items-center">Testing</h6>
                            <span className="small text-muted">01/08</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar bg-lightyellow"
                                role="progressbar"
                                style={{ width: '30%' }}
                                aria-valuenow="30"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskProgress;
