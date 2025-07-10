import React, { useEffect, useState } from 'react';

const TotalEmployeesCard = ({ employees }) => {
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  useEffect(() => {
    if (employees) {
      const male = employees.filter(user => user.gender === 'Male').length; // Adjusted for case sensitivity
      const female = employees.filter(user => user.gender === 'Female').length;

      setMaleCount(male);
      setFemaleCount(female);
    }
  }, [employees]);

  const totalEmployees = maleCount + femaleCount;

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Total Employees</h6>
        <h4 className="mb-0 fw-bold">{totalEmployees}</h4>
      </div>
      <div className="card-body">
      </div>
    </div>
  );
};

export default TotalEmployeesCard;
