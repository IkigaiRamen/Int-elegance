import React from "react";

const EditProjectModal = ({
  closeModal,
  projectData,
  handleChange,
  handleMultiSelectChange,
  handleSubmit,
  users,
}) => {
  return (
    <div
      className="modal fade show"
      id="editproject"
      tabIndex="-1"
      aria-hidden="true"
      style={{ display: "block",  }} // Make sure the modal is on top
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="editprojectLabel">
                Edit Project
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal} // Call closeModal when clicked
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter Project Name"
                  value={projectData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Project Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Website Design">Website Design</option>
                  <option value="App Development">App Development</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Development">Development</option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="Software Testing">Software Testing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="SEO">SEO</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="startDate" className="form-label">
                      Project Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={projectData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="endDate" className="form-label">
                      Project End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={projectData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label">Assigned Users</label>
                  <select
                    className="form-select"
                    multiple
                    value={projectData.users || []}
                    onChange={handleMultiSelectChange}
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm">
                  <label htmlFor="priority" className="form-label">
                    Project Priority
                  </label>
                  <select
                    className="form-select"
                    name="priority"
                    value={projectData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal} // Call closeModal when clicked
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProjectModal;
