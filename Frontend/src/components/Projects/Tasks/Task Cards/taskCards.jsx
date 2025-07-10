import React, { useEffect, useRef, useState } from "react";
import { fetchTasksByProjectId, changeTaskStatus } from "../../../../services/TaskService";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import "./subtask.css";
import TaskCard from "./taskCard";
import { toast } from "react-toastify";

const TaskCards = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const droppableRefs = useRef({});
  const draggedTaskRef = useRef(null);
  const registeredDraggables = useRef(new Set());
  const registeredDroppables = useRef(new Set());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetchTasksByProjectId(projectId);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const groupTasksByStatus = (tasks) => {
    return tasks.reduce((acc, task) => {
      const status = task.status || "unknown";
      acc[status] = acc[status] || [];
      acc[status].push(task);
      return acc;
    }, {});
  };

  const groupedTasks = groupTasksByStatus(tasks);

  const makeDraggable = (task) => {
    const element = document.getElementById(`task-${task._id}`);
    if (element && !registeredDraggables.current.has(task._id)) {
      draggable({
        element,
        onDragStart: () => {
          draggedTaskRef.current = task;
          element.classList.add("dragging");
        },
        onDragEnd: () => {
          draggedTaskRef.current = null;
          element.classList.remove("dragging");
        },
      });
      registeredDraggables.current.add(task._id);
    }
  };

  const registerDroppable = (status) => {
    const element = droppableRefs.current[status];
    if (element && !registeredDroppables.current.has(status)) {
      dropTargetForElements({
        element,
        onDrop: () => {
          const draggedTask = draggedTaskRef.current;
          if (draggedTask && draggedTask.status !== status) {
            // Update task status
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === draggedTask._id ? { ...task, status } : task
              )
            );
            // Update task status on the server
            changeTaskStatus(draggedTask._id, status)
              .then(() => {
                toast.success(`Task status updated to ${status}`);
              })
              .catch((error) => {
                console.error("Error updating task status:", error);
                toast.error("Failed to update task status.");
              });
          }
        },
      });
      registeredDroppables.current.add(status);
    }
  };

  useEffect(() => {
    registeredDraggables.current.clear();
    registeredDroppables.current.clear();
    ["to do", "in progress", "needs review", "completed"].forEach(registerDroppable);
    tasks.forEach(makeDraggable);
  }, [tasks]);

  const statusBackgroundColors = {
    "to do": "#dbeafe", // Light Blue
    "in progress": "#fff3cd", // Light Yellow
    "needs review": "#fde7e9", // Light Orange
    "completed": "#d4edda", // Light Green
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  return (
    <div className="body d-flex flex-column py-lg-3 py-md-2">
      <div className="container-xxl">
        <div className="row taskboard g-3 py-xxl-4">
          <h3 className="fw-bold mb-3 text-center">Kanban Board</h3>
          {["to do", "in progress", "needs review", "completed"].map((status) => (
            <div
              key={status}
              ref={(el) => {
                droppableRefs.current[status] = el;
              }}
              className="col-lg-3 col-md-3 col-sm-6 col-12"
            >
              <div
                className="card bg-light p-3 rounded"
                style={{
                  border: "1px solid black",
                  borderRadius: "5px",
                  position: "relative",
                  paddingBottom: "20px",
                  minHeight: "650px", // Maintain a minimum height
                  maxHeight:"650px",
                }}
              >
                <div
                  style={{
                    backgroundColor: statusBackgroundColors[status],
                    borderBottom: "3px solid black",
                    paddingBottom: "10px",
                    borderRadius: "5px",
                  }}
                  className="task-column-header"
                >
                  <h6 className="fw-bold py-1 mb-0 text-capitalize text-center">
                    {status}
                  </h6>
                </div>
                <div
                  className="task-list"
                  style={{
                    overflowY: "auto", // Make the task list scrollable
                  }}
                >
                  <ul className="dd-list">
                    {groupedTasks[status]?.map((task) => (
                      <li
                        id={`task-${task._id}`}
                        key={task._id}
                        className="task-card mb-3"
                      >
                        <TaskCard
                          task={task}
                          projectId={projectId}
                          onTaskUpdate={handleTaskUpdate}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default TaskCards;
