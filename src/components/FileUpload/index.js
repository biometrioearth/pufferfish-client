import React, { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon } from '@heroicons/react/solid';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import Filter from '../Filter';
import ProjectModal from '../ProjectModal';

const projectList = ['Project 1', 'Project 2', 'Project 3'];

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


// ButtonGroup component for rendering buttons with options
// ButtonGroup component for rendering buttons with options
const ButtonGroup = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-1 rounded-md ${selectedOption === option.value
            ? 'bg-black text-bodydark2 border-black'
            : 'bg-bodydark2 text-black border-bodydark2'
            }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Pagination component for rendering pagination links
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex space-x-2">
        {currentPage > 1 && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage - 1)} className="page-link flex items-center justify-center w-10 h-6 text-indigo-600 transition-colors duration-150 rounded-full focus:border-black hover:border-black">
              <svg className="w-4 h-4 black" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
            </button>
          </li>
        )}
        {getPageNumbers().map((number) => (
          <li
            key={number}
            className={`page-item w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:outline-red-600 hover:outline-red-600 ${number === currentPage ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage + 1)} className="page-link flex items-center justify-center w-10 h-6 text-indigo-600 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100">
              <svg class="w-4 h-4 black" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
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
  console.log("this is current files", currentFiles)
  return (
    <div className=''>
      <main className="mx-auto max-w-6xl px-4 pt-8">
        {/*   <button
          className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <CloudUploadIcon className="w-5 h-5 mr-2 text-F2EEE3" />
          Select project
        </button> */}
        <ProjectModal
          projectList={projectList}
          selectProject={selectProject}
          toggleDropdown={toggleDropdown}
          selectedProject={selectedProject || "Select project" }
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
                        /*  { value: 'video', label: 'Video' },
                         { value: 'image', label: 'Image' },
                         { value: 'document', label: 'Document' },
                         { value: 'zip', label: 'Zip' },
                         { value: 'csv', label: 'CSV' }, */
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

                <div className="w-full flex  md:flex-row sm:justify-start md:justify-end lg:justify-end" style={{ margin: '1rem 0rem' }}>
                  <Filter />
                </div>


                <div className="max-w-full overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                          Name
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                          File Type
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                          Size
                        </th>

                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Date Uploaded
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Project
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>


                    <tbody>
                      {currentFiles.map((file, index) => (
                        <tr key={index}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {file.name}
                            </h5>

                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{file.type}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{file.size}</p>
                          </td>


                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                              {new Date(file.lastModified).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <button onClick={openModal} className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                            {selectedProject}
                            </button>
                          </td>

                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button className="hover:text-primary" onClick={() => handleDelete(index)}>
                                <svg
                                  className="text-black"
                                  style={{ fill: '#164A1A' }}
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                              <button className="hover:text-primary">
                                <svg
                                  className="text-black"
                                  style={{ fill: '#164A1A' }}
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                    fill=""
                                  />
                                  <path
                                    d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>

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
              </div>
            )}
          </div>
        )}



      </main>
      <footer className="text-black text-center py-4" style={{ margin: "3rem 0rem" }}>
        &copy; 2023 Biometrio. All rights reserved.
      </footer>

      <div className="h-400">
        {/* Content goes here */}
      </div>

    </div>
  );
};

export default FileUpload;
