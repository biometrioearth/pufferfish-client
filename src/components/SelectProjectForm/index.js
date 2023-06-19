import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const projects = [
  { id: 1, name: 'Project 1', samplingPoints: ['Point A', 'Point B', 'Point C'] },
  { id: 2, name: 'Project 2', samplingPoints: ['Point D', 'Point E', 'Point F'] },
  { id: 3, name: 'Project 3', samplingPoints: ['Point G', 'Point H', 'Point I'] },
];

const SelectProjectForm = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSamplingPoint, setSelectedSamplingPoint] = useState('');

  const handleProjectChange = (event) => {
    const projectId = parseInt(event.target.value);
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
    setSelectedSamplingPoint('');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSamplingPointChange = (event) => {
    setSelectedSamplingPoint(event.target.value);
  };

  const handleUploadData = () => {
    // Do something with the captured data

    const data = {
      project: selectedProject,
      date: selectedDate,
      sampling: selectedSamplingPoint
    };
    console.log('Data captures:', data);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Please select project details and date</h2>

      <div className="mb-4">
        <label htmlFor="project" className="block font-bold mb-2">
          Select Project:
        </label>
        <select
          id="project"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={selectedProject.id}
          onChange={handleProjectChange}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 w-full">
        <label htmlFor="date" className="block font-bold mb-2">
          Select Date:
        </label>
        <DatePicker
          id="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select a date"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="samplingPoint" className="block font-bold mb-2">
          Select Sampling Point:
        </label>
        <select
          id="samplingPoint"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={selectedSamplingPoint}
          onChange={handleSamplingPointChange}
        >
          <option value="">Select a sampling point</option>
          {selectedProject.samplingPoints.map((point) => (
            <option key={point} value={point}>
              {point}
            </option>
          ))}
        </select>
      </div>

      <button
        className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={handleUploadData}
      >
        Upload Data
      </button>
    </div>
  );
};

export default SelectProjectForm;
