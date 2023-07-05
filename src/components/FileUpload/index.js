import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GET_PROJECTS} from '../../lib/queries';
import { UPDATE_SAMPLING_POINT } from '../../lib/mutation';
import S3BucketUpload from '../S3BucketUpload';

const FileUpload = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [dateCollected, setDateCollected] = useState(null);
  const [samplingPoint, setSamplingPoint] = useState('');
  const [resultData, setResultData] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showNestedDropdown, setShowNestedDropdown] = useState(false);

  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [updateSamplingPoint, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_SAMPLING_POINT);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    setShowNestedDropdown(false);
    setSamplingPoint('');
  };

  const handleDateChange = (date) => {
    setDateCollected(date);
  };

  const handleSamplingPointChange = (event) => {
    setSamplingPoint(event.target.value);
  };

  const handleUploadData = async () => {
    try {
      const { data: updatedData } = await updateSamplingPoint({
        variables: { id: samplingPoint, dateCollected },
      });

      /* const {  data: getProjectInfo } = useQuery(GET_PROJECT_WITH_SAMPLING_POINT, {
        variables: {
          id: samplingPoint
        },
      }); */

      console.log("sampling point", samplingPoint)
      // Handle the updated data or display a success message if needed
      console.log('Updated Data:', updatedData);
      setResultData(JSON.stringify(updatedData, null, 2));
      setUploadSuccess(true);
    } catch (error) {
      // Handle the error or display an error message if needed
      // Handle the error or display an error message if needed
      console.error('Error:', error);
      setResultData(JSON.stringify(error, null, 2));
    }

    const projectTitle = selectedProject; // Store the selected project title

    setSelectedProject('');
    setDateCollected(null);
    setSamplingPoint('');

    setSelectedProject(projectTitle); // Set the selected project again
  };

  if (loading) {
    return (
      <div className='container mx-auto max-w-8xl px-4 pt-8 flex-col flex h-100' style={{ height: '100vh' }}>
      <div className='h-100'>
        <div className='mx-auto max-w-3xl' style={{ padding: '3rem 0rem' }} id="select-project">
          <div className='mb-4 w-full flex flex-row' style={{justifyContent:'space-between'}}>
            <p>Loading pufferfish .....</p>
            <div
              class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
  }

  if (error) {
    return (
      <div className='container mx-auto max-w-8xl px-4 pt-8 flex-col flex h-100' style={{ height: '100vh' }}>
        <p>Error: {error.message}</p>;
      </div>
    )
  }

  if (updateLoading) {
    return (
      <div className='container mx-auto max-w-8xl px-4 pt-8 flex-col flex h-100' style={{ height: '100vh' }}>
        <div className='h-100'>
          <div className='mx-auto max-w-3xl' style={{ padding: '3rem 0rem' }} id="select-project">
            <div className='mb-4 w-full flex flex-row' >
              <p>Loading file upload...</p>
              <div
                class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

if (updateError) {
  return (
    <div className='container mx-auto max-w-8xl px-4 pt-8 flex-col flex h-100' style={{ height: '100vh' }}>
      <p>Mutation Error: {error.message}</p>;
    </div>
  )
}

const handleMainDropdownMouseEnter = () => {
  setShowNestedDropdown(true);
};

const handleMainDropdownMouseLeave = () => {
  setShowNestedDropdown(false);
};

return (
  <div className='container mx-auto max-w-8xl px-4 pt-8 flex-col flex h-100' style={{ height: '100vh' }}>
    <div className='h-100'>
      {uploadSuccess ? (
        selectedProject && (
          <div className='h-100'>
            <div>
              <nav className="text-sm sm:text-base">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <a href="/dashboard" className="text-gray-500">Dashboard</a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.707 4.707a1 1 0 0 1 0 1.414L3.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z" />
                    </svg>
                  </li>
                  <li className="flex items-center">
                    <a href="/dashboard/pufferfish" className="text-gray-500">Pufferfish</a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.707 4.707a1 1 0 0 1 0 1.414L3.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z" />
                    </svg>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-700">{selectedProject}</span>
                  </li>
                </ol>
              </nav>
            </div>

            <S3BucketUpload selectedProject={selectedProject} />
          </div>
        )
      ) : (
        <form className='mx-auto max-w-3xl' style={{ padding: '3rem 0rem' }} id="select-project">
          <div className='mb-4 w-full'>
            <h2 className="text-5xl font-bold mb-4 text-center ant-page-header-heading-title mx-4 mb-4">
              Pufferfish
            </h2>
            <h2 className="text-2xl font-bold mb-4 text-center ant-page-header-heading-title mx-4">
              Please select project to upload data
            </h2>

            <div className="relative">
              <select
                id="project"
                value={selectedProject}
                onChange={handleProjectChange}
                onMouseEnter={handleMainDropdownMouseEnter}
                onMouseLeave={handleMainDropdownMouseLeave}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none"
              >
                <option value="">Select a project</option>
                {data.allProjects.items.map((project) => (
                  <option key={project.id} value={project.title}>
                    <span className="flex items-center justify-between">
                      {project.title}
                      {project.siteSet.items.length > 0 && (
                        <span className="text-gray-500 ml-2">▶</span>
                      )}
                    </span>
                  </option>
                ))}
              </select>
              {selectedProject && showNestedDropdown && (
                <div className="absolute left-0 mt-2 w-full">
                  <div className="w-100">
                    <ul className="bg-white border border-gray-300 rounded-md shadow-md">
                      <p className="px-3 py-2 bg-gray-100 border-b border-gray-300 font-bold">Sites</p>
                      {data.allProjects.items.map((project) => (
                        selectedProject === project.title && (
                          project.siteSet.items.map((site) => (
                            <li key={site.id} className="px-3 py-2">{site.identifier}</li>
                          ))
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
          <div className='mb-4 w-full'>
            <label htmlFor="date">Date Collected:</label>
            <DatePicker id="date" selected={dateCollected} onChange={handleDateChange} placeholderText="Select a date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          {selectedProject && (
            <div className='mb-4 w-full'>
              <label htmlFor="samplingPoint">Sampling Point:</label>
              <select id="samplingPoint" value={samplingPoint} onChange={handleSamplingPointChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select a sampling point</option>
                {data.allProjects.items
                  .filter((project) => project.title === selectedProject)
                  .flatMap((project) =>
                    project.siteSet.items.flatMap((site) =>
                      site.samplingpointSet.items.map((samplingPoint) => (
                        <option key={samplingPoint.id} value={samplingPoint.id}>
                          {samplingPoint.identifier}
                        </option>
                      ))
                    )
                  )}
              </select>
            </div>
          )}
          <div className="mb-4 w-full flex justify-center">
            <button type="button" onClick={handleUploadData} className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              Upload Data
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
};

export default FileUpload;
