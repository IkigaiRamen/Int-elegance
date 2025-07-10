import React from "react";
import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";


const KanbanBoard = () => {
  const kanbanData = [
    { Id: 1, Status: "Open", Summary: "Task 1" },
    { Id: 2, Status: "InProgress", Summary: "Task 2" },
    { Id: 3, Status: "Testing", Summary: "Task 3" },
    { Id: 4, Status: "Close", Summary: "Task 4" },
  ];

  const kanbanColumns = [
    { headerText: "Open", keyField: "Open" },
    { headerText: "In Progress", keyField: "InProgress" },
    { headerText: "Testing", keyField: "Testing" },
    { headerText: "Done", keyField: "Close" },
  ];

  return (
    <div className="kanban-board">
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={kanbanData}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
      >
        <ColumnsDirective>
          {kanbanColumns.map((col, index) => (
            <ColumnDirective key={index} headerText={col.headerText} keyField={col.keyField} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default KanbanBoard;
