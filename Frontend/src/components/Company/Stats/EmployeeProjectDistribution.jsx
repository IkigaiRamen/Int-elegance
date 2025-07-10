import React, { useState, useEffect } from 'react';
import { getEmployeeProjectDistribution } from '../../../services/StatsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner } from 'react-bootstrap';

const EmployeeProjectDistribution = () => {
  const [employeeProjectDistribution, setEmployeeProjectDistribution] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeeProjectDistribution = async () => {
      try {
        const data = await getEmployeeProjectDistribution();
        setEmployeeProjectDistribution(data);
      } catch (error) {
        console.error('Error fetching employee project distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProjectDistribution();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Employee Project Distribution</h6>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={employeeProjectDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="projectName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="employeeCount" fill="#4c3575" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeProjectDistribution;
