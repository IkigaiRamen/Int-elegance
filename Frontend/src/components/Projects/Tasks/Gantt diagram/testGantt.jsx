import React from 'react';
import { GanttComponent, ColumnsDirective, ColumnDirective, Inject, Edit, Toolbar } from '@syncfusion/ej2-react-gantt';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-gantt/styles/material.css';

const TestGant = () => {
  // Static data for tasks with Resources field added
  const tasks = [
    {
      TaskID: 1,
      TaskName: 'Project Initiation',
      StartDate: new Date('2024-11-25'),
      EndDate: new Date('2024-12-01'),
      Progress: 30,
      Resources: ['John', 'Alice'],  // Resources assigned to this task
    },
    {
      TaskID: 2,
      TaskName: 'Planning Phase',
      StartDate: new Date('2024-12-02'),
      EndDate: new Date('2024-12-10'),
      Progress: 60,
      Resources: ['Bob', 'Charlie'],  // Resources assigned to this task
    },
    {
      TaskID: 3,
      TaskName: 'Execution Phase',
      StartDate: new Date('2024-12-11'),
      EndDate: new Date('2024-12-20'),
      Progress: 90,
      Resources: ['Alice', 'John'],  // Resources assigned to this task
    }
  ];

  // Handle cell custom rendering
  const queryCellInfo = (args) => {
    if (args.column.field === 'Resources') {
      // Check if the Resources column exists and format the content
      args.cell.innerHTML = args.data.Resources && Array.isArray(args.data.Resources)
        ? args.data.Resources.join(', ')  // Join resources with commas
        : 'No resources assigned';  // If no resources assigned, display this
    }
  };

  return (
    <div>
      <h1>Test Gantt Chart with Static Data</h1>
      <GanttComponent
        dataSource={tasks}
        taskFields={{
          id: 'TaskID',
          name: 'TaskName',
          startDate: 'StartDate',
          endDate: 'EndDate',
          progress: 'Progress',
          resources: 'Resources',  // Correct field mapping for resources
        }}
        height="450px"
        toolbar={['Add', 'Edit', 'Update', 'Delete']}
        editSettings={{ allowEditing: true, allowAdding: true }}
        queryCellInfo={queryCellInfo}  // Register queryCellInfo event
      >
        <ColumnsDirective>
          <ColumnDirective field="TaskName" headerText="Task" width="250" />
          <ColumnDirective field="StartDate" headerText="Start Date" format="yMd" width="150" />
          <ColumnDirective field="EndDate" headerText="End Date" format="yMd" width="150" />
          <ColumnDirective field="Progress" headerText="Progress" width="150" />
          
          {/* Resources column with default rendering */}
          <ColumnDirective field="Resources" headerText="Resources" width="200" />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar]} />
      </GanttComponent>
    </div>
  );
};

export default TestGant;
