import React, { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon } from '@heroicons/react/solid';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import Filter from '../Filter';
import DropDown from '../DropDown';
import ButtonGroup from '../ButtonGroup';
import Pagination from '../Pagination';
import { projectList } from '../config';
import ListTable from '../ListTable';


const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#164A1A',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  justifyContent: 'center', // Vertically center the content
  height: '200px',
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};



const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    setDropdownOpen(false);
  };

  const openModal = (snippet) => {

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsProgressOpen(false);
  };

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject } = useDropzone({ onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);
  const handleFileUpload = async () => {
    setIsUploading(true);
    setUploadProgress({});
    setOverallProgress(0);
    setCurrentFile(files[0]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await uploadFile(formData);
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress((prevProgress) => ({ ...prevProgress, [file.name]: progress }));

        // Calculate overall progress
        const totalProgress = Math.round(((i + 1) / files.length) * 100);
        setOverallProgress(totalProgress);

        // Do something with the response, such as displaying a success message
        console.log('File uploaded:', response);
      } catch (error) {
        // Handle upload error
        console.error('File upload error:', error);
      }
    }

    setIsUploading(false);
    setCurrentPage(1);
    setShowFiles(true);
  };

  const uploadFile = (formData) => {
    // Simulating file upload with a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Upload complete');
      }, 2000);
    });
  };

  const handleDelete = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOption = (option) => {
    setSortOption(option);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort files based on the selected sort option
  let sortedFiles = filteredFiles;
  if (sortOption === 'recent') {
    sortedFiles = filteredFiles.sort((a, b) => b.lastModified - a.lastModified);
  } else if (sortOption === 'older') {
    sortedFiles = filteredFiles.sort((a, b) => a.lastModified - b.lastModified);
  }

  useEffect(() => {
    const totalPagesCount = Math.ceil(sortedFiles.length / filesPerPage);
    setTotalPages(totalPagesCount);
  }, [sortedFiles, filesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

  return (
    <div className=''>
      <main className="mx-auto max-w-6xl px-4 pt-8">
        <DropDown
          projectList={projectList}
          selectProject={selectProject}
          toggleDropdown={toggleDropdown}
          selectedProject={selectedProject || "Select project"}
          isDropdownOpen={isDropdownOpen} />


        <div className='mt-5 mb-5'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 className="text-black text-xl">File Upload</h1>
            <div className="mt-4">
              <button
                className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={handleFileUpload}
                disabled={isUploading}
              >
                <CloudUploadIcon className="w-5 h-5 mr-2 text-F2EEE3" />
                Upload files
              </button>
            </div>
          </div>

        </div>
        <div
          {...getRootProps({ style })}
          className="p-4 border-2 border-gray-300 border-dashed rounded-md"
        >
          <input {...getInputProps()} style={{ zIndex: '-1' }} />
          {isDragActive ? (
            <p className="text-gray-600 text-center">Drop the files here...</p>
          ) : (
            <p className="text-gray-600">
              Drag and drop some files here, or click to select files
            </p>
          )}
        </div>

        {isUploading !== null && (
          <>
            {isUploading ? (
              <div style={{ margin: '2rem 0rem', background: 'white' }}>
                <div style={{ padding: '2rem 2rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ padding: '1rem 0rem' }}>Uploading files ....</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-black">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-8" style={{ background: '#F2EEE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="bg-light relative h-4 w-full rounded-2xl">
                      <div className="bg-black absolute top-0 left-0 flex h-full items-center justify-center rounded-2xl text-xs font-semibold text-white" style={{ width: `${overallProgress}%` }}>
                        {overallProgress}%
                      </div>
                    </div>
                  </div>
                  <h2>{currentFile && `Uploading: ${currentFile.name}`}</h2>
                </div>
              </div>
            ) : (
              <div style={{ margin: '2rem 0rem', background: 'white', position: 'relative' }}>

                <div style={{ padding: '2rem 2rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Upload complete <CheckIcon className="h-8 w-8 text-green-500 mt-4 inline-block" /></h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-black">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </>
        )}

        {showFiles && (
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1" style={{ marginBottom: '10rem' }}>
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Files Uploaded
            </h4>

            {files.length > 0 && !isUploading && (
              <div className="mt-4" >
                <div className="flex flex-col md:flex-row justify-between" style={{ padding: '2rem 0rem' }}>
                  <div className="flex items-center mb-4 md:mb-0">
                    <ButtonGroup
                      options={[
                        { value: 'all', label: 'View All' },
                        { value: 'recent', label: 'Most Recent' },
                        { value: 'older', label: 'Older Files' },
                      ]}
                      selectedOption={sortOption}
                      onChange={handleSortOption}
                    />
                  </div>

                  <div className="flex flex-col items-start md:flex-row mb-4 md:mb-0">
                    <label htmlFor="search" className="block text-md font-medium text-black mr-2">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="p-2 border border-black rounded-md"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <Filter />
                <ListTable
                  currentFiles={currentFiles}
                  onClick={openModal}
                  handleDelete={handleDelete}
                  selectedProject={selectedProject} />
                <div className="flex justify-end mt-4">
                  {totalPages > 1 && (
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="text-black text-center py-4" style={{ margin: "3rem 0rem" }}>
        &copy; 2023 Biometrio. All rights reserved.
      </footer>
      <div className="h-400">{/* Content goes here */}</div>
    </div>
  );
};

export default FileUpload;
