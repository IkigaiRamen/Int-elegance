import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner, Alert } from 'react-bootstrap';

const ProjectStatus = () => {
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      // Mock data for the project status
      const mockData = {
        "In Progress": 50,
        "Completed": 30,
        "Needs Review": 10,
        "Waiting for Approval": 10,
      };

      // Simulate a delay to mimic fetching data
      setTimeout(() => {
        setProjectStatus(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchProjectStatus();
  }, []);

  const colors = ['#4c3575', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!projectStatus || Object.keys(projectStatus).length === 0) {
    return (
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Project Status</h6>
        </div>
        <div className="card-body">
          <Alert variant="info">No project status data available.</Alert>
        </div>
      </div>
    );
  }

  // Convert the object into an array of objects with 'name' and 'value' properties
  const chartData = Object.keys(projectStatus).map(status => ({
    name: status,
    value: projectStatus[status],
  }));

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Project Status</h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectStatus;
