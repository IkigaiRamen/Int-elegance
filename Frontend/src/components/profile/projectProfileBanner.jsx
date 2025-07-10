import React, { useState, useEffect } from 'react';
import ProjectsCard from '../Projects/projectCard';
import { jwtDecode } from 'jwt-decode';
import { getProjectsByUserId } from '../../services/ProjectsService';

const ProjectProfileBanner = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    // Fetch projects for the logged-in user
    const fetchProjects = async () => {
        try {
            const projects = await getProjectsByUserId(); // Call the helper method
            // Format the project data
            const formattedProjects = projects.map(project => ({
                ...project,
                startDate: new Date(project.startDate).toISOString().split('T')[0],
                endDate: new Date(project.endDate).toISOString().split('T')[0]
            }));

            setProjects(formattedProjects);
        } catch (error) {
            setError(error?.message || 'Failed to fetch projects');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            {projects.length === 1 ? (
                <ProjectsCard key={projects[0]._id} project={projects[0]} />
            ) : null} {/* Render nothing if no projects or multiple projects */}
        </div>
    );
};

export default ProjectProfileBanner;
