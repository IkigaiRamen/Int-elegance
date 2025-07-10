import React, { useState, useEffect } from 'react';
import { getActiveProjectsAndTasks } from '../../../services/StatsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Spinner, Alert } from 'react-bootstrap';

const ActiveProjectsTasks = () => {
  const [activeProjectsAndTasks, setActiveProjectsAndTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveProjectsAndTasks = async () => {
      try {
        console.log("fetching now")
        const data = await getActiveProjectsAndTasks();
        
        setActiveProjectsAndTasks(data);
      } catch (error) {
        console.error('Error fetching active projects and tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProjectsAndTasks();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!activeProjectsAndTasks || activeProjectsAndTasks.activeProjects === 0) {
    return (
      <div className='card'>
        <div className='card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0'>
        Active Projects and Tasks
        </div>
        <div className='card-body'>
          <Alert variant="info">No active projects or tasks available.</Alert>
        </div>
      </div>
    );
  }

  // Convert the data to an array suitable for the chart
  const chartData = [
    { name: 'Active Projects', count: activeProjectsAndTasks.activeProjects },
    { name: 'Active Tasks', count: activeProjectsAndTasks.activeTasks },
  ];

  return (
    <div className='card'>
      <div className='card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0'>
     <h6 className='mb-0 fw-bold '> Active Projects and Tasks</h6>
      </div>
      <div className='card-body'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4c3575" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveProjectsTasks;
