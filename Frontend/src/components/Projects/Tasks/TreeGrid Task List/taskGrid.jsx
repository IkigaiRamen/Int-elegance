import React, { useState, useEffect, useRef } from "react";
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
 
} from "@syncfusion/ej2-react-treegrid";
import { fetchTasksByProjectId } from "../../../../services/TaskService";
import "./TaskGrid.css"; // Add custom styles for the context menu

const TaskGrid = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const treeGridRef = useRef();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetchTasksByProjectId(projectId);

        const formattedTasks = response.map((task) => {
          if (task.assignedTo && Array.isArray(task.assignedTo)) {
            task.assignedTo = task.assignedTo.map((user) => user.profilePicture);
          }
          return task;
        });

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);



  return (
    <div className="task-grid" onContextMenu={(e) => e.preventDefault()}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TreeGridComponent
            ref={treeGridRef}
            dataSource={tasks}
            treeColumnIndex={1}
            childMapping="subtasks"
            height={400}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="_id"
                headerText="Task ID"
                width="200"
                isPrimaryKey={true}
                visible={false}
              />
              <ColumnDirective field="name" headerText="Task Name" width="200" />
              <ColumnDirective field="priority" headerText="Priority" width="120" />
              <ColumnDirective
                field="startDate"
                headerText="Start Date"
                width="150"
                textAlign="Center"
                format="dd MMM yyyy"
                type="date"
              />
              <ColumnDirective
                field="endDate"
                headerText="End Date"
                width="150"
                textAlign="Center"
                format="dd MMM yyyy"
                type="date"
              />
              <ColumnDirective field="status" headerText="Status" width="130" />
              <ColumnDirective
                field="assignedTo"
                headerText="Assigned To"
                width="200"
              />
            </ColumnsDirective>
          </TreeGridComponent>)
        </>
      )}
    </div>
  );
};

export default TaskGrid;
