// styleservices.jsx
import React from "react";

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};
export const formatDateWithYear = (dateString) => {
  const options = { day: "numeric", month: "short",year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const renderPriorityBadge = (priority) => {
  if (!priority) return null;
  switch (priority.toLowerCase()) {
    case "high":
      return <span className="badge bg-danger text-end mt-2">High</span>;
    case "medium":
      return <span className="badge bg-warning text-end mt-2">Medium</span>;
    case "low":
      return <span className="badge bg-success text-end mt-2">Low</span>;
    default:
      return null;
  }
};

export const getTaskClassName = (status) => {
  switch (status.toLowerCase()) {
    case "to do":
      return "planned_task dd-item"; // Class for "To Do"
    case "in progress":
      return "progress_task dd-item"; // Class for "In Progress"
    case "needs review":
      return "review_task dd-item"; // Class for "Needs Review"
    case "completed":
      return "completed_task dd-item"; // Class for "Completed"
    default:
      return "dd-item"; // Fallback class if no status matches
  }
};

const categoryStyles = {
  "UI/UX Design": "light-info-bg",
  "Website Design": "bg-lightgreen",
  "Quality Assurance": "light-success-bg",
  "App Development": "bg-warning",
  "Development": "bg-primary",
  "Backend Development": "bg-secondary",
  "Software Testing": "bg-danger",
  "Marketing": "bg-info",
  "SEO": "bg-dark",
  "Other": "bg-light",
};

export const getCategoryStyle = (category) => {
  return categoryStyles[category] || "bg-default";
};
