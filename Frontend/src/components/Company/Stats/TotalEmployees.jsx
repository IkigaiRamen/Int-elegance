import React, { useState, useEffect } from 'react';
import { getTotalEmployees } from '../../../services/StatsService';
import { Card, Spinner } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TotalEmployees = () => {
  const [totalEmployees, setTotalEmployees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const data = await getTotalEmployees();
        setTotalEmployees(data);
        console.log('Fetched Total Employees:', data); // For debugging
      } catch (error) {
        console.error('Error fetching total employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEmployees();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Total Employees</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{ name: 'Total Employees', value: totalEmployees }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default TotalEmployees;
