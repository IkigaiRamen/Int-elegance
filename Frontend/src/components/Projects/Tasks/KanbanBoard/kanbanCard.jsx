import React from "react";
import {
  formatDate,
  renderPriorityBadge,
  getTaskClassName,
} from "../../../../services/StyleService";
import "./Kanban.css";
const KanbanCard = ({ task }) => {
  console.log(task, " this is the task in kanban")
  return (
    <div className="dd">
      <div className="dd-list">
        <div className="dd-item" id={task.Id}>
          <div className={getTaskClassName(task.Status)}>
            <div className="dd-handle">
              <div className="task-info d-flex align-items-center justify-content-between">
                <div className="py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0 bg-lightgreen">
                  {task.summary}
                </div>
                <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                  <div className="avatar-list avatar-list-stacked m-0">
                    {task.AssignedTo.map((user) => (
                      <img
                        key={user._id}
                        className="avatar rounded-circle small-avt"
                        src={
                          user.profilePicture || "path/to/default/avatar.jpg"
                        }
                        alt="avatar"
                      />
                    ))}
                    <span className="avatar rounded-circle text-center pointer small-avt sm">
                      <i className="icofont-ui-add" />
                    </span>
                  </div>
                  {renderPriorityBadge(task.Priority)}
                </div>
              </div>

              <div className="tikit-info row g-3 align-items-center">
                <div className="col-sm">
                  <ul className="d-flex list-unstyled align-items-center flex-wrap">
                    <li className="me-2">
                      <div className="d-flex align-items-center">
                        <i className="icofont-calendar"></i>
                        <span className="ms-1">
                          {formatDate(task.startDate)}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        <i className="icofont-calendar"></i>
                        <span className="ms-1">{formatDate(task.endDate)}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-sm text-end">
                  <div className="small light-primary-bg py-1 px-2 rounded-1 d-inline-block fw-bold">
                    <i className="icofont-tasks me-1"></i>
                    <span>{task.subtasks?.length || 0}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
