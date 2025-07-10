import React, { useState } from "react";
import TaskForm from "./TaskForm";
import { createTask } from "../../../../services/TaskService";
import { toast } from "react-toastify";

const CreateTaskModal = ({ project, onClose }) => {
    const [taskName, setTaskName] = useState("");
    const [taskStartDate, setTaskStartDate] = useState("");
    const [taskEndDate, setTaskEndDate] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [assignedTo, setAssignedTo] = useState([]);
    const [subtasks, setSubtasks] = useState([]);

    const handleTaskChange = (field) => (e) => {
        const value = e.target.value;
        if (field === "taskName") setTaskName(value);
        else if (field === "taskStartDate") setTaskStartDate(value);
        else if (field === "taskEndDate") setTaskEndDate(value);
        else if (field === "taskPriority") setTaskPriority(value);
    };

    const handleAssignedToChange = (userId) => {
        setAssignedTo((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();

        const taskDuration = Math.ceil(
            (new Date(taskEndDate) - new Date(taskStartDate)) / (1000 * 60 * 60 * 24)
        );

        const taskData = {
            name: taskName,
            project: project._id,
            startDate: new Date(taskStartDate).toISOString().split('T')[0],
            endDate: new Date(taskEndDate).toISOString().split('T')[0],
            duration: taskDuration,
            priority: taskPriority,
            assignedTo,
            subtasks,
        };

        try {
            await createTask(taskData);
            toast.success("Task created successfully!", { autoClose: 5000 });
            onClose(); // Close the modal after task creation
        } catch (err) {
            console.error("Error saving task:", err.response ? err.response.data.message : err.message);
            toast.error("Error saving task. Please try again.", { autoClose: 5000 });
        }
    };

    return (
        <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Create Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <TaskForm
                            taskName={taskName}
                            taskStartDate={taskStartDate}
                            taskEndDate={taskEndDate}
                            taskPriority={taskPriority}
                            assignedTo={assignedTo}
                            project={project}
                            handleTaskChange={handleTaskChange}
                            handleAssignedToChange={handleAssignedToChange}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSaveTask}
                        >
                            Save Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
