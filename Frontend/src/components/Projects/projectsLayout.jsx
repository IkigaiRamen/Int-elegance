import React, { useRef, useState, useEffect } from 'react';
import ProjectsCard from './projectCard';
import ProjectsBanner from './projectsBanner';
import { getProjectsByUserId } from '../../services/ProjectsService'; // Import the service

const ProjectsLayout = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Track modal state to trigger re-fetch after project creation

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const fetchProjects = async () => {
        try {
            const fetchedProjects = await getProjectsByUserId(); // Use the service method
            const formattedProjects = fetchedProjects.map((project) => ({
                ...project,
                startDate: formatDate(project.startDate),
                endDate: formatDate(project.endDate),
            }));
            setProjects(formattedProjects);
        } catch (error) {
            setError(error?.message || 'Failed to fetch projects');
        }
    };

    useEffect(() => {
        fetchProjects(); // Initial fetch when the component mounts
    }, []);

    // Toggle modal open/close and fetch projects after modal closes
    const handleModalClose = () => {
        setModalOpen(false);  // Close the modal
        fetchProjects();      // Re-fetch the projects
    };

    const focusRef = useRef(null); // Create a ref for focus management

    return (
        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl" ref={focusRef}>
                <ProjectsBanner 
                    fetchProjects={fetchProjects} 
                    focusRef={focusRef}
                    openModal={() => setModalOpen(true)} // Open modal when triggered
                />
                <div className="row align-items-center">
                    <div className="col-lg-12 col-md-12 flex-column">
                        <div className="tab-content mt-4">
                            <div className="tab-pane fade show active" id="All-list">
                                <div className="row g-3 gy-5 py-3 row-deck">
                                    {projects.map((project) => (
                                        <div key={project._id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                            <ProjectsCard 
                                                project={project} 
                                                fetchProjects={fetchProjects} 
                                            /> 
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Handling */}
                {modalOpen && (
                    <CreateProjectModal
                        closeModal={handleModalClose} // Close modal after creating a project
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectsLayout;
