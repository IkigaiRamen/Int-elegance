import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { getProjectsByUserId } from '../../services/ProjectsService';
import { getCurrentUserProfile } from '../../services/UserService';

const ProjectCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching current user profile...');
        const user = await getCurrentUserProfile();
        console.log('User profile fetched:', user);

        const userId = user._id;

        console.log('Fetching projects for user ID:', userId);
        const projects = await getProjectsByUserId(userId);
        console.log('Projects fetched:', projects);

        // Function to map project status to color
        const getProjectColor = (status) => {
          switch (status) {
            case 'in progress': return 'blue';
            case 'completed': return 'green';
            case 'waiting for approval': return 'yellow';
            case 'cancelled': return 'red';
            default: return 'gray';
          }
        };

        // Map projects to calendar events
        const projectEvents = projects.map((project) => ({
          title: `Project: ${project.name}`,
          start: project.startDate,
          end: project.endDate,
          color: getProjectColor(project.status), // Set color based on project status
        }));
        console.log('Mapped project events:', projectEvents);

        // Function to map task status to color
        const getTaskColor = (status) => {
          switch (status) {
            case 'to do': return 'gray';
            case 'in progress': return 'blue';
            case 'needs review': return 'orange';
            case 'completed': return 'green';
            default: return 'gray';
          }
        };

        // Extract and filter tasks and subtasks
        const taskEvents = projects.flatMap((project) =>
          project.tasks.flatMap((task) => {
            // Check if the current user is assigned to the task (matching _id)
            const taskEvent = task.assignedTo.some(user => user._id === userId) // Check if user is assigned to the task
              ? {
                  title: `${task.name}`,
                  start: task.startDate, // Adjust to the relevant date field in your schema
                  end: task.endDate,
                  color: getTaskColor(task.status), // Set color based on task status
                }
              : null;

            // Filter and map subtasks if assigned to the current user
            const subtaskEvents = task.subtasks?.filter((subtask) =>
              subtask.assignedTo.some(user => user._id === userId) // Check if user is assigned to the subtask
            ).map((subtask) => ({
              title: `${subtask.name}`,
              start: subtask.startDate, // Adjust to the relevant date field in your schema
              end: subtask.endDate,
              color: getTaskColor(subtask.status), // Set color based on subtask status
            })) || [];

            return taskEvent ? [taskEvent, ...subtaskEvents] : subtaskEvents;
          })
        );
        console.log('Mapped task and subtask events:', taskEvents);

        // Combine projects and tasks (including subtasks) into a single events array
        setEvents([...projectEvents, ...taskEvents]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl" >
            <div className="row align-items-center">
        <div className="border-0 mb-4">
          <div className="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <h3 className="fw-bold py-3 mb-0">Calendar</h3>
            </div>
            </div>
            </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={false} // Set to true if you want drag-and-drop
      />
      </div>
    </div>
  );
};

export default ProjectCalendar;
