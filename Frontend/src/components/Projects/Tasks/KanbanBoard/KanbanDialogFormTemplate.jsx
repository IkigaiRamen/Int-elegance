const KanbanDialogFormTemplate = (props) => {
    const [taskData, setTaskData] = useState(props.data || {}); // Pre-fill form data
    const { users } = props; // Get users from props
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData({ ...taskData, [name]: value });
    };
  
    const formatToDateInputValue = (dateString) => {
      if (!dateString) return ""; // Return empty string if no date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString); // Log invalid date
        return ""; // Return empty string for invalid date
      }
      return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    };
    const userDataSource = users.map((user) => ({
      id: user._id, // This is the unique ID for the dropdown item
      name: `${user.firstName} ${user.lastName}`, // This is what will be displayed
    }));
    console.log(
      users.map((user) => `${user.firstName} ${user.lastName}`),
      "users in kanban template"
    );
  
    const handleSubmit = async () => {
      try {
        if (taskData.Id) {
          await editTask(taskData.Id, taskData);
        } else {
          await createTask(taskData);
        }
        props.refreshTasks(); // Refresh task list after submission
        props.closeDialog(); // Close dialog after submission
      } catch (error) {
        console.error("Error saving task:", error);
      }
    };
  
    return (
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Task Name</label>
              <input
                name="Summary"
                type="text"
                className="form-control"
                value={taskData.Summary}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <DropDownListComponent
                id="Status"
                name="Status"
                dataSource={["to do", "in progress", "needs review", "completed"]}
                className="form-select"
                placeholder="Status"
                value={taskData.Status}
                onChange={(e) =>
                  handleChange({ target: { name: "Status", value: e.value } })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <DropDownListComponent
                id="Priority"
                name="Priority"
                dataSource={["low", "normal", "high"]}
                className="form-select"
                placeholder="Priority"
                value={taskData.Priority}
                onChange={(e) =>
                  handleChange({ target: { name: "Priority", value: e.value } })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                name="StartDate"
                type="date"
                className="form-control"
                value={formatToDateInputValue(taskData.startDate)} // Use the format function
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                name="endDate"
                type="date"
                className="form-control"
                value={formatToDateInputValue(taskData.endDate)}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned Users</label>
              <DropDownListComponent
                id="AssignedUsers"
                name="AssignedUsers"
                dataSource={userDataSource} // Use userDataSource containing all users
                fields={{ text: "name", value: "id" }} // Specify the fields for display and value
                mode="MultiSelect" // Allow multiple selections
                className="form-select"
                placeholder="Select Users"
                value={taskData.AssignedUsers} // Bind to the AssignedUsers state
                onChange={(e) => {
                  // Update the state with selected users
                  handleChange({
                    target: { name: "AssignedUsers", value: e.value }, // Assign the selected values
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };