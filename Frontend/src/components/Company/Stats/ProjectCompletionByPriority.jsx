import React, { useState, useEffect } from 'react';
import { getProjectCompletionByPriority } from '../../../services/StatsService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner, Alert } from 'react-bootstrap';

const ProjectCompletionByPriority = () => {
  const [projectCompletionByPriority, setProjectCompletionByPriority] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectCompletionByPriority = async () => {
      try {
        const data = await getProjectCompletionByPriority();
        console.log(data, "data");
        setProjectCompletionByPriority(data);
      } catch (error) {
        console.error('Error fetching project completion by priority:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectCompletionByPriority();
  }, []);

  const colors = ['#0088FE', '#00C49F', '#FFBB28']; // You can add more colors based on your data

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  // Check if no completed projects exist (all priority counts are zero)
  if (
    projectCompletionByPriority &&
    Object.values(projectCompletionByPriority).every(value => value === 0)
  ) {
    return (
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Project Completion by Priority</h6>
        </div>
        <div className="card-body">
          <Alert variant="info">No completed projects available for any priority.</Alert>
        </div>
      </div>
    );
  }

  if (!projectCompletionByPriority || Object.keys(projectCompletionByPriority).length === 0) {
    return (
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Project Completion by Priority</h6>
        </div>
        <div className="card-body">
          <Alert variant="info">No project completion data available.</Alert>
        </div>
      </div>
    );
  }

  // Convert the object into an array of objects for the chart
  const chartData = Object.keys(projectCompletionByPriority).map(priority => ({
    priority,
    value: projectCompletionByPriority[priority],
  }));

  return (
    <div className="card" >
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Project Completion by Priority</h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="priority" outerRadius={100}>
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

export default ProjectCompletionByPriority;
