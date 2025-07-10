import React from 'react';

const TaskAssigned = () => {
    return (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
            <div className="card">
                <div className="card-header py-3">
                    <h6 className="mb-0 fw-bold">Allocated Task Members</h6>
                </div>
                    <div className="card-body">
                    <div className="flex-grow-1 mem-list">
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar6.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Lucinda Massey</h6>
                                    <span className="small text-muted">UI/UX Designer</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar4.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Ryan Nolan</h6>
                                    <span className="small text-muted">Website Designer</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar9.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Oliver Black</h6>
                                    <span className="small text-muted">App Developer</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar10.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Adam Walker</h6>
                                    <span className="small text-muted">Quality Checker</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar4.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Brian Skinner</h6>
                                    <span className="small text-muted">Quality Checker</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar11.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Dan Short</h6>
                                    <span className="small text-muted">App Developer</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                        <div className="py-2 d-flex align-items-center border-bottom">
                            <div className="d-flex ms-2 align-items-center flex-fill">
                                <img src="assets/images/xs/avatar3.jpg" className="avatar lg rounded-circle img-thumbnail" alt="avatar" />
                                <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">Jack Glover</h6>
                                    <span className="small text-muted">UI/UX Designer</span>
                                </div>
                            </div>
                            <button type="button" className="btn light-danger-bg text-end" data-bs-toggle="modal" data-bs-target="#dremovetask">Remove</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="dremovetask" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" id="dremovetaskLabel">Remove From Task?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body justify-content-center flex-column d-flex">
                            <i className="icofont-ui-rate-remove text-danger display-2 text-center mt-2"></i>
                            <p className="mt-4 fs-5 text-center">You can Remove only From Task</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger color-fff">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal */}
        </div>
    );
};

export default TaskAssigned;
