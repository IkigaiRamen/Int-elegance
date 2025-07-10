import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectTaskBanner from "./projectTaskBanner";
import TaskMembers from "./AllocateTaskMember";
import { getProjectById } from "../../../services/ProjectsService";
import ProjectTaskProgress from "./ProjectTaskProgress";
import TaskNotifications from "./taskNotifications";
import Gantt from "./Gantt diagram/Gantt";
import TaskCards from "./Task Cards/taskCards";

const ProjectTaskLayout = () => {
  const { projectId } = useParams(); // Extract projectId from URL parameters
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("taskCards"); // State to track active tab

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response); // Assuming the response data contains the project with tasks
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update the active tab
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  return (
    <div className="body d-flex flex-column py-lg-3 py-md-2">
      <div className="container-xxl">
        <div className="row mb-4">
          <ProjectTaskBanner onTabChange={handleTabChange} /> {/* Pass the function to update the tab */}
        </div>
        <div className="col-lg-12 col-md-12 flex-column">
          <div className="row g-3">
            <ProjectTaskProgress tasks={project.tasks} />
            <TaskNotifications project={project} />
            <TaskMembers users={project.users} />
          </div>
        </div>

        {/* Conditionally render Task Cards or Gantt Chart */}
        <div className="row g-3">
          {activeTab === "taskCards" && <TaskCards projectId={projectId} />}
          {activeTab === "ganttChart" && <Gantt projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskLayout;
