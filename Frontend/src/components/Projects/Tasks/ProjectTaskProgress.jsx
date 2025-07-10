import React from 'react';
import { formatDate } from '../../../services/StyleService';

const ProjectTaskProgress = ({ tasks }) => {
  console.log(tasks, "project task progress");

  // Function to return progress percentage and color based on task status
  const getProgress = (status) => {
    switch (status) {
      case 'to do':
        return { percentage: 0, color: 'bg-lightgray' }; // Light gray for 'to do'
      case 'in progress':
        return { percentage: 33, color: 'bg-lightblue' }; // Light blue for 'in progress'
      case 'needs review':
        return { percentage: 66, color: 'bg-lightorange' }; // Light orange for 'needs review'
      case 'completed':
        return { percentage: 100, color: 'bg-lightgreen' }; // Light green for 'completed'
      default:
        return { percentage: 0, color: 'bg-lightgray' }; // Default case
    }
  };

  return (
    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
      <div className="card">
        <div className="card-header py-3">
          <h6 className="mb-0 fw-bold">Task Progress</h6>
        </div>
        <div className="card-body mem-list">
          {tasks.map((task) => {
            const { percentage, color } = getProgress(task.status); // Use 'task.status' instead of 'task.Status'

            return (
              <div key={task._id} className="progress-count mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="mb-0 fw-bold d-flex align-items-center">
                    {task.name}
                  </h6>
                  <span className="small text-muted">
                    {formatDate(task.endDate)}
                  </span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar ${color}`}
                    role="progressbar"
                    style={{ width: `${percentage}%` }}
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskProgress;
