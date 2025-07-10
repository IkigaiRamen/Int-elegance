import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchTasksByProjectId, changeTaskStatus } from "../../../../services/TaskService";
import KanbanCard from "./kanbanCard";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
const KanbanTest = () => {
  const { projectId } = useParams();
  const [kanbanData, setKanbanData] = useState([]);
  
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetchTasksByProjectId(projectId);
      const tasks = response || [];
      const formattedTasks = tasks.map((task) => ({
        Id: task._id,
        Status: task.status.toLowerCase(),
        Summary: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        Priority: task.priority || "low",
        AssignedTo: task.assignedTo || [],
        Project: task.project,
      }));
      setKanbanData(formattedTasks);  // Updates state asynchronously
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId]);
  
  useEffect(() => {
  }, [kanbanData]);  // Log kanbanData after it changes
  

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onDragStop = async (args) => {
    const taskId = args.data[0].Id;
    const newStatus = args.data[0].Status;

    if (!taskId) {
      console.error("Task ID is undefined:", args.data);
      return;
    }

    try {
      await changeTaskStatus(taskId, newStatus);
      fetchTasks(); // Refresh the Kanban board after the update
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <div className="container-xxl">
      <div className="row g-3">
      
      </div>
      <div className="row clearfix">
        <div className="border-0 mb-4">
          <div className="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <h3 className="fw-bold py-3 mb-0">Taskboard</h3>
          </div>
        </div>
        <div className="App col-12">
          <KanbanComponent
            id="kanban"
            keyField="Status"
            dataSource={kanbanData}
            cardSettings={{
              contentField: "Summary",
              headerField: "Id",
              template: (data) => <KanbanCard task={data} />,
            }}
            dragStop={onDragStop}
          >
            <ColumnsDirective>
              <ColumnDirective headerText="To Do" keyField="to do" />
              <ColumnDirective headerText="In Progress" keyField="in progress" />
              <ColumnDirective headerText="Needs Review" keyField="needs review" />
              <ColumnDirective headerText="Completed" keyField="completed" />
            </ColumnsDirective>
          </KanbanComponent>
        </div>
      </div>
    </div>
  );
};

export default KanbanTest;
