import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { Spinner, Alert } from 'react-bootstrap';

const TaskCompletionRate = () => {
  const [taskCompletionRate, setTaskCompletionRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskCompletionRate = async () => {
      // Mock data for the task completion rate
      const mockData = [
        { name: 'Week 1', completionRate: 50 },
        { name: 'Week 2', completionRate: 60 },
        { name: 'Week 3', completionRate: 70 },
        { name: 'Week 4', completionRate: 75 },
        { name: 'Week 5', completionRate: 80 },
      ];

      // Simulate a delay to mimic fetching data
      setTimeout(() => {
        setTaskCompletionRate(mockData);
        setLoading(false);
        console.log('Fetched Task Completion Rate:', mockData); // For debugging
      }, 1000);
    };

    fetchTaskCompletionRate();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  // Check if taskCompletionRate is empty or if completionRate is 0
  if (!taskCompletionRate || taskCompletionRate.length === 0 || taskCompletionRate.every(item => item.completionRate === 0)) {
    return (
      <div className="card" style={{ backgroundColor: '#f1c8db' }}>
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Task Completion Rate</h6>
        </div>
        <div className="card-body">
          <Alert variant="info">No tasks available or completion rate is 0.</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Task Completion Rate</h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={taskCompletionRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="#000000"
              dot={{ r: 6, fill: '#FF8042', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskCompletionRate;
