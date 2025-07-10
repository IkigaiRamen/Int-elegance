import React from 'react';
import TaskNotifications from '../../Projects/Tasks/taskNotifications';
import TaskProgress from './taskProgress';
import TaskAssigned from './taskAssigned';
import TaskMembers from '../../Projects/Tasks/AllocateTaskMember';
const TasksFunctionLayout = () => {
    return (
                <div className="row g-3 row-deck">

                    <TaskProgress  />
                    {/* Task Progress Component */}

                    {/* Task Notifications Component */}
                    <TaskNotifications />

                    {/* Task Assigned Component */}
                    <TaskMembers/>

                   
                </div>
        
    );
};

export default TasksFunctionLayout;
