import React, { useState } from "react";
import SubtasksList from "./subtaskList";
import SubtaskModal from "./subtaskModal";
const SubtaskComponent = ({ taskId, subtasks, onSubtasksChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);

  console.log("SubtaskComponent -> subtasks", subtasks);
  const handleAddSubtask = () => {
    setSubtaskToEdit(null);
    setIsModalVisible(true);
  };

  const handleEditSubtask = (subtask) => {
    setSubtaskToEdit(subtask);
    setIsModalVisible(true);
  };

  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    onSubtasksChange(updatedSubtasks);
  };

  const handleSaveSubtask = (newSubtask) => {
    if (subtaskToEdit) {
      // Update existing subtask
      const updatedSubtasks = subtasks.map((subtask) =>
        subtask.id === subtaskToEdit.id ? newSubtask : subtask
      );
      onSubtasksChange(updatedSubtasks);
    } else {
      // Add new subtask
      onSubtasksChange([...subtasks, newSubtask]);
    }
    setIsModalVisible(false);
    setSubtaskToEdit(null);
  };

  return (
    <div>
      <h5 className="fw-bold">Manage Subtasks</h5>
      <SubtasksList
        subtasks={subtasks}
        onEdit={handleEditSubtask}
        onRemove={handleRemoveSubtask}
        onAdd={handleAddSubtask}
      />
      {isModalVisible && (
        <SubtaskModal
          subtask={subtaskToEdit}
          taskId={taskId}
          onSave={handleSaveSubtask}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default SubtaskComponent;
