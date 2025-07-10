const TaskDetailsForm = ({ task, handleTaskChange }) => {
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toISOString().split("T")[0];
    };
  
    return (
      <>
        <div className="mb-3 text-center">
          <label className="form-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            value={task.name}
            onChange={handleTaskChange("name")}
            required
          />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={formatDate(task.startDate)}
              onChange={handleTaskChange("startDate")}
              required
            />
          </div>
          <div className="col-md">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={formatDate(task.endDate)}
              onChange={handleTaskChange("endDate")}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={task.priority}
            onChange={handleTaskChange("priority")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </>
    );
  };
  
  export default TaskDetailsForm;
  