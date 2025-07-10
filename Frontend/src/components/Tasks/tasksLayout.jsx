// Layout.js
import React from "react";
import TasksBanner from "./tasksBanner";
import TasksFunctionLayout from "./Task functions/TasksFunctionsLayout";
import TaskCards from "./tasksCards";
const TasksLayout = () => {
  return (
    <div className="container-xxl">
      <TasksBanner />
      <div className="row clearfix  g-3">
        <div className="col-lg-12 col-md-12 flex-column">
        
          <TasksFunctionLayout />
          
          <TaskCards />
          </div>
      </div>
    </div>
  );
};

export default TasksLayout;
