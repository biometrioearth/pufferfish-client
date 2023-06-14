import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ projectList, toggleDropdown, selectedProject, isDropdownOpen, selectProject }) => {

  return (
    <div className="relative">
      <button
        className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={toggleDropdown}
      >
        <span className="mr-2">{selectedProject}</span>
        <svg
          className="w-5 h-5 text-F2EEE3 transform duration-300 ease-in-out"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.293 8.707a1 1 0 0 0 1.414 0L10 6.414l2.293 2.293a1 1 0 1 0 1.414-1.414l-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 0 1.414zM10 18a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 0-2h-3V7a1 1 0 0 0-2 0v3H7a1 1 0 0 0 0 2h3v3a1 1 0 0 0 1 1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 w-40 bg-white rounded-md shadow-lg">
          <ul>
            {projectList.map((project) => (
              <li
                key={project}
                className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                onClick={() => selectProject(project)}
              >
                {project}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Modal.propTypes = {
  projectList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectProject:PropTypes.func,
  toggleDropdown:PropTypes.func,
  selectedProject:PropTypes.string,
  isDropdownOpen:PropTypes.bool,
};

export default Modal;
