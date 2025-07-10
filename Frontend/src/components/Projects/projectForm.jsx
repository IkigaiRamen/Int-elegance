import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    files: [null],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProjectData({ ...projectData, profilePicture: e.target.files[0] });
  };

  const handleFilesChange = (e) => {
    setProjectData({ ...projectData, files: e.target.files });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', projectData.name);
    formData.append('description', projectData.description);
    formData.append('category', projectData.category);
    formData.append('priority', projectData.priority);
    formData.append('startDate', projectData.startDate);
    formData.append('endDate', projectData.endDate);

    Array.from(projectData.files).forEach((file) => {
        formData.append('files', file);
    });

    // Debugging: Log form data to console
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    try {
        const response = axios.post('http://localhost:5000/api/projects/create', formData);
        console.log('Project created:', response.data);
    } catch (error) {
        console.error('Error creating project:', error);
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={projectData.name}
        onChange={handleChange}
        placeholder="Project Name"
        required
      />
      <textarea
        name="description"
        value={projectData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="category"
        value={projectData.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <select
        name="priority"
        value={projectData.priority}
        onChange={handleChange}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        name="startDate"
        value={projectData.startDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="endDate"
        value={projectData.endDate}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="profilePicture"
        onChange={handleFileChange}
        
      />
      <input
        type="file"
        name="files"
        onChange={handleFilesChange}
        multiple
      />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;
