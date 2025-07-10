import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GanttComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  CriticalPath,
  Selection,
  Toolbar,
  Filter,
  Sort,
  Reorder,
} from "@syncfusion/ej2-react-gantt";
import "@syncfusion/ej2-react-gantt/styles/material.css"; // Add the required CSS
import { getProjectById } from "../../../../services/ProjectsService";
import "./Gantt.css";
import ProjectTaskBanner from "../projectTaskBanner";

const Gantt = ( {projectId}) => {
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("going to fetch here");
        const response = await getProjectById(projectId);
        console.log("response",response);
        if (response && response.tasks) {
          const resourceMap = new Map();
  
          // Prepare tasks and resources
          const formattedTasks = response.tasks.map((task, index) => {
            // Generate task index
            const taskIndex = `${index + 1}`;  // Task 1, Task 2, ...
  
            // Handle main task resources
            const resourceIds = [];
            if (Array.isArray(task.assignedTo)) {
              task.assignedTo.forEach((user) => {
                const { _id, firstName, profilePicture } = user;
                if (!resourceMap.has(_id)) {
                  resourceMap.set(_id, {
                    resourceId: _id,
                    resourceName: firstName,
                    resourceImage: profilePicture,
                  });
                }
                resourceIds.push(_id);
              });
            }
  
            // Handle subtasks resources and naming
            const formattedSubtasks = task.subtasks?.map((subtask, subIndex) => {
              const subtaskResourceIds = [];
              if (Array.isArray(subtask.assignedTo)) {
                subtask.assignedTo.forEach((user) => {
                  const { _id, firstName, profilePicture } = user;
                  if (!resourceMap.has(_id)) {
                    resourceMap.set(_id, {
                      resourceId: _id,
                      resourceName: firstName,
                      resourceImage: profilePicture,
                    });
                  }
                  subtaskResourceIds.push(_id);
                });
              }
  
              // Generate subtask index (e.g., 1.1, 1.2)
              const subtaskIndex = `${taskIndex}.${subIndex + 1}`;
  
              // Return the formatted subtask with resources and index in name
              return {
                ...subtask,
                name: `${subtaskIndex} ${subtask.name}`, // Add the index to the subtask name
                resources: subtaskResourceIds.length > 0 ? subtaskResourceIds : subtask.resources, // Use assigned resources or fallback to existing `resources`
              };
            });
  
            // Return the main task with resources, formatted subtasks, and index in name
            return {
              ...task,
              name: `${taskIndex} ${task.name}`, // Add the index to the task name
              resources: resourceIds.length > 0 ? resourceIds : task.resources, // Use assigned resources or fallback to existing `resources`
              startDate: new Date(task.startDate),
              endDate: new Date(task.endDate),
              subtasks: formattedSubtasks, // Ensure subtasks are properly assigned and formatted
            };
          });
  
          // Set the formatted tasks and resource map
          setTasks(formattedTasks);
          console.log("tasks formmated",formattedTasks);
          setResources(Array.from(resourceMap.values()));
          console.log("resources",resources);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
  
    fetchTasks();
  }, [projectId]);
  
  // Resource fields
  const resourceFields = {
    id: "resourceId",
    name: "resourceImage",
    image: "resourceImage",
  };

  // Task fields
  const taskFields = {
    id: "_id",
    name: "name",
    startDate: "startDate",
    endDate: "endDate",
    duration: "duration",
    status: "status",
    priority: "priority",
    progress: "progress",
    child: "subtasks",
    dependency: "predecessor",
    resourceInfo: "resources", // Use `resources` to map the resource field
  };

  // Custom cell rendering for "Assigned To"
  const handleQueryCellInfo = (args) => {
    if (args.column.field === "resources") {
      const resourceData = args.data.resources;
      if (typeof resourceData === "string") {
        // Split the string by commas and trim any whitespace
        const resourceUrls = resourceData.split(",").map((url) => url.trim());
      
        // Start with the outer div
        let htmlContent = '<div class="resource-item">';
      
        // Generate the img elements for each URL
        htmlContent += resourceUrls
          .map(
            (url) =>
              `<img src="${url}" class="avatar  rounded-circle img-thumbnail" />`
          )
          .join(""); // Combine all img elements into a single string
      
        // Close the outer div
        htmlContent += "</div>";
      
        // Set the HTML content
        args.cell.innerHTML = htmlContent;
        return;
      }
    }

  if (args.column.field === "priority") {
    const priorityValue = args.data.priority; // Get the priority value

    // Create a badge with different classes depending on the priority
    let badgeClass = "";
    let badgeText = "";

    switch (priorityValue) {
      case "high":
        badgeClass = "bg-danger"; // Badge class for high priority (red)
        badgeText = "High"; // Text for high priority
        break;
      case "medium":
        badgeClass = "bg-warning"; // Badge class for medium priority (yellow)
        badgeText = "Medium"; // Text for medium priority
        break;
      case "low":
        badgeClass = "bg-success"; // Badge class for low priority (green)
        badgeText = "Low"; // Text for low priority
        break;
      default:
        badgeClass = "bg-secondary"; // Default badge class (gray)
        badgeText = "No Priority"; // Text for no priority
    }

    // Update the cell's innerHTML with a badge span element
    args.cell.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;
  }

 if (args.column.field === "startDate" || args.column.field === "endDate") {
    const dateValue = new Date(args.data[args.column.field]); // Get the date value from either startDate or endDate
    const currentDate = new Date(); // Get the current date
    let dateClass = "";
    
    // Format the date in "MMM dd, yyyy" format (e.g., "Feb 02, 2024")
    const formattedDate = dateValue.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });

    // Check if the date has passed or not
    if (dateValue < currentDate) {
      dateClass = "bg-danger"; // Red if the date has passed
    } else {
      dateClass = "bg-success"; // Green if the date hasn't passed yet
    }

    // Update the cell's innerHTML with the formatted date and span element
    args.cell.innerHTML = `<span class="badge ${dateClass}">${formattedDate}</span>`;
  }

   if (args.column.field === "duration") {
    const duration = args.data.duration; // Assuming duration is already calculated and available

    let durationClass = "";

    // Apply class based on duration value
    if (duration < 5) {
      durationClass = "bg-danger"; // Red for durations less than 5 days
    } else if (duration < 10) {
      durationClass = "bg-primary"; // Blue for durations less than 10 days
    } else if (duration < 15) {
      durationClass = "bg-success"; // Green for durations less than 15 days
    } else {
      durationClass = "bg-secondary"; // Default class if duration is more than 15 days
    }

    // Update the cell's innerHTML with the duration and badge class
    args.cell.innerHTML = `<span class="badge ${durationClass}">${duration} days</span>`;
  }
   if (args.column.field === "status") {
    const status = args.data.status; // Get the status value from the data

    let statusClass = "";
    let statusText = "";

    // Apply class and text based on the status value
    switch (status) {
      case "to do":
        statusClass = "bg-danger"; // Red for 'to do'
        statusText = "To Do";
        break;
      case "in progress":
        statusClass = "bg-warning"; // Yellow for 'in progress'
        statusText = "In Progress";
        break;
      case "needs review":
        statusClass = "bg-primary"; // Blue for 'needs review'
        statusText = "Needs Review";
        break;
      case "completed":
        statusClass = "bg-success"; // Green for 'completed'
        statusText = "Completed";
        break;
      default:
        statusClass = "bg-secondary"; // Default class for unknown status
        statusText = "Unknown";
    }

    // Update the cell's innerHTML with the status and corresponding badge class
    args.cell.innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;
  }

  };
  const labelSettings = {
    rightLabel: "name", // Display the task name as a label next to the task bar
  };
  const toolbarOptions = ['CriticalPath'];
  return (
    <div className="body d-flex flex-column py-lg-3 py-md-2">
    <div className="container-xxl">
  
    <div className="row taskboard g-3 py-xxl-4">
    <h3 className="fw-bold mb-3 text-center">Gantt Chart</h3>   
    {tasks.length > 0 && resources.length > 0 ? (
  <GanttComponent
    key={projectId}
    dataSource={tasks}
    resources={resources}
    resourceFields={resourceFields}
    taskFields={taskFields}
    rowHeight={40}
    gridLines="Both"
    enableCriticalPath={true}
    toolbar={toolbarOptions}
    height="800px"
    labelSettings={labelSettings} // Add labelSettings here
    queryCellInfo={handleQueryCellInfo}
    allowSorting={true}
    allowFiltering={true}
    allowReordering={true}
  >
    <ColumnsDirective>
      <ColumnDirective field="name" headerText="Task Name" width="250" />
      <ColumnDirective
        field="resources"
        headerText="Assigned To"
        width="250"
        textAlign="Center"
      />
      <ColumnDirective field="status" headerText="Status" width="150" textAlign="Center" />
      <ColumnDirective
        field="priority"
        headerText="Priority"
        width={150}
        textAlign="Center"
        queryCellInfo={handleQueryCellInfo}
      />
      <ColumnDirective
        field="startDate"
        headerText="Start Date"
        width="150"
        format="MMM dd yyyy"
      />
      <ColumnDirective
        field="endDate"
        headerText="End Date"
        width="150"
        format="MMM dd yyyy"
      />
      <ColumnDirective
        field="duration"
        headerText="Duration"
        width="150"
      />
    </ColumnsDirective>
    <Inject services={[CriticalPath, Toolbar,Filter,Sort,Reorder]} />
  </GanttComponent>
) : (
  <p>Loading tasks...</p>
)}

    </div>
    </div>
    </div>
  );
};

export default Gantt;
