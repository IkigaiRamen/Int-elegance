import React, { useState, useEffect } from 'react';
import { getUpcomingProjectDeadlines } from '../../../services/StatsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { Spinner, Alert } from 'react-bootstrap';

const UpcomingProjectDeadlines = () => {
  const [upcomingProjectDeadlines, setUpcomingProjectDeadlines] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingProjectDeadlines = async () => {
      try {
        const data = await getUpcomingProjectDeadlines();

        // Format the data to include `daysRemaining`
        const formattedData = data.map((project) => {
          const endDate = new Date(project.endDate);
          const today = new Date();
          const timeDifference = endDate - today;
          const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days

          return {
            name: project.name, // Using project name
            daysRemaining, // Calculated days remaining
          };
        });

        setUpcomingProjectDeadlines(formattedData);
        console.log('Fetched Upcoming Project Deadlines:', formattedData); // For debugging
      } catch (error) {
        console.error('Error fetching upcoming project deadlines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingProjectDeadlines();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!upcomingProjectDeadlines || upcomingProjectDeadlines.length === 0) {
    return (
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h6 className="mb-0 fw-bold">Upcoming Project Deadlines</h6>
        </div>
        <div className="card-body">
          <Alert variant="info">No upcoming project deadlines available.</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Upcoming Project Deadlines</h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={upcomingProjectDeadlines}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="daysRemaining"
              stroke="#FF8042"
              strokeWidth={3}
              dot={{ r: 6, fill: '#FF8042', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UpcomingProjectDeadlines;
