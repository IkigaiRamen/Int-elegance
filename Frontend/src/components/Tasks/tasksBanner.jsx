import React from 'react';

const TasksBanner = () => {
    return (
        <div className="row align-items-center">
            <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h3 className="fw-bold mb-0">Task Management</h3>
                    <div className="col-auto d-flex w-sm-100">
                        <button
                            type="button"
                            className="btn btn-dark btn-set-task w-sm-100"
                            data-bs-toggle="modal"
                            data-bs-target="#createtask"
                        >
                            <i className="icofont-plus-circle me-2 fs-6"></i>Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksBanner;
