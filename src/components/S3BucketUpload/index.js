import React, { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon } from '@heroicons/react/solid';
import { CloudUploadIcon } from '@heroicons/react/outline';
import AWS from 'aws-sdk';
import ListTable from '../ListTable';
import ButtonGroup from '../ButtonGroup';
import Pagination from '../Pagination';
import axios from 'axios';

// Set your AWS S3 bucket configuration
AWS.config.update({
  accessKeyId: process.env.REACT_APP_A_K,
  secretAccessKey: process.env.REACT_APP_S_K,
  region: process.env.REGION
});

const s3 = new AWS.S3();

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
  justifyContent: 'center',
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

const S3BucketUpload = ({ selectedProject, ...props }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [bucketObjects, setBucketObjects] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBucketObjects();
  }, []);

  const fetchBucketObjects = async () => {
    try {
      const response = await s3.listObjectsV2({ Bucket: process.env.REACT_APP_BUCKET, Prefix: 'data/brenda/final-test-url/2023_05_18-SD1-device1/' }).promise();
      setBucketObjects(response.Contents);
    } catch (error) {
      console.error('Error fetching bucket objects:', error);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await s3.deleteObject({ Bucket: process.env.REACT_APP_BUCKET, Key: fileName }).promise();
      fetchBucketObjects(); // Fetch updated bucket objects after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const uploadFile = async (file) => {
    const fileName = file.name;
    const params = {
      Bucket: process.env.REACT_APP_BUCKET,
      Key: `${process.env.REACT_APP_TARGET}/${process.env.REACT_APP_SOURCE}/${fileName}`,
      Body: process.env.REACT_APP_REGION
    };

    return new Promise((resolve, reject) => {
      const uploader = s3.upload(params, { partSize: 10 * 1024 * 1024 });

      uploader.on('httpUploadProgress', (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setOverallProgress(progress);
      });

      uploader.send((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  };

  const handleFileUpload = async () => {
    setIsUploading(true);
    if (files?.length === 0) {
      alert('Please select files to upload');
      setIsUploading(false);
      return;
    }

    try {
      for (const file of files) {
        setCurrentFile(file);
        const fileUrl = await uploadFile(file);
        console.log('Uploaded file URL:', fileUrl);

        // Send POST request to the API for each uploaded file
        const apiUrl = `https://6pq11i2mul.execute-api.eu-west-1.amazonaws.com/api-sqs/sqs?MessageBody=%7B%22bucket%22%3A%22pufferfish-test%22%2C%22directory_path%22%3A%22data/brenda/final-test-url/2023_05_18-SD1-device1%22%2C%22shortname%22%3A%22sipecam%22%2C%22username%22%3A%22brenda%22%7D`;

        await axios.post(apiUrl, null, {
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': '*',
          },
        });
        await fetchBucketObjects();
      }

      setFiles([]);

    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      setCurrentFile(null);
      setOverallProgress(0);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredObjects = bucketObjects?.filter((object) => {
    const fileName = object.Key;
    return fileName?.toLowerCase().includes(searchValue?.toLowerCase());
  });


  // Apply sorting based on the selected sort option
  let sortedObjects = filteredObjects;
  if (sortOption === 'recent') {
    sortedObjects = filteredObjects.sort((a, b) => b.LastModified.toString().localeCompare(a.LastModified.toString()));
  } else if (sortOption === 'older') {
    sortedObjects = filteredObjects.sort((a, b) => a.LastModified.toString().localeCompare(b.LastModified.toString()));
  }

  useEffect(() => {
    const totalPagesCount = Math.ceil(sortedObjects.length / itemsPerPage);
    setTotalPages(totalPagesCount);
  }, [sortedObjects, itemsPerPage]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedObjects.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteFile = (index, event) => {
    event.stopPropagation();
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };
  console.log("this is the uploading state", isUploading)

  return (
    <div className="h-100">
      <div className="mt-5 mb-5">
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

      <div {...getRootProps({ style })} className="p-4 border-2 border-gray-300 border-dashed rounded-md">
        {files?.length > 0 && isUploading === false ? (
          <div className="flex flex-col items-start w-100">
            <ul className="mt-2">
              {files?.map((file, index) => (
                <li key={index} className="flex items-center">
                  {file.name}
                  <button
                    className="ml-2 text-red-600"
                    onClick={(event) => handleDeleteFile(index, event)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1a9 9 0 100 18A9 9 0 0010 1zm0 2a7 7 0 100 14 7 7 0 000-14zm4 6a1 1 0 01-2 0V8.414l-1.293 1.293a1 1 0 11-1.414-1.414L8 7.586 6.707 8.879a1 1 0 01-1.414-1.414L6.586 6 5.293 4.707a1 1 0 011.414-1.414L8 4.586l1.293-1.293a1 1 0 011.414 1.414L9.414 6H11a1 1 0 110 2h-1.586l1.293 1.293a1 1 0 11-1.414 1.414L10 9.414V11a1 1 0 102 0V9.414l1.293 1.293a1 1 0 11-1.414 1.414L11 10.414H9a1 1 0 110-2h1.586L9.293 6.707a1 1 0 111.414-1.414L10 7.586V6a1 1 0 012 0v1.586l1.293-1.293a1 1 0 111.414 1.414L13.414 8H15a1 1 0 110 2h-1.586l1.293 1.293a1 1 0 11-1.414 1.414L12 11.414V13a1 1 0 102 0v-1.586l1.293 1.293a1 1 0 01-1.414 1.414L13.414 12H12a1 1 0 110-2h1.586L12.293 8.707a1 1 0 111.414-1.414L14 9.414V8a1 1 0 012 0v1.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10H18a1 1 0 010 2h-1.586L17.293 12.707a1 1 0 11-1.414 1.414L16 13.414V15a1 1 0 102 0v-1.586l1.293 1.293a1 1 0 11-1.414 1.414L17.414 16H16a1 1 0 110-2h1.586L17.293 12.707a1 1 0 111.414-1.414L19 13.414V12a1 1 0 012 0v1.586l.001-.001A9 9 0 0110 3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {isDragActive ? (
              <p className="text-gray-600 text-center">Drop the files here...</p>
            ) : (
              <p className="text-gray-600">
                Drag and drop some files here, or click to select files
              </p>
            )}
          </>
        )}
        <input {...getInputProps()} style={{ zIndex: '-1' }} />
      </div>

      {isUploading && (
        <div style={{ margin: '2rem 0rem', background: 'white' }}>
          <div style={{ padding: '2rem 2rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ padding: '1rem 0rem' }}>Uploading files ....</h2>
              <button className="text-gray-500 hover:text-black" onClick={() => setIsUploading(false)}>
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
            <h2>{currentFile && `Uploading: ${currentFile?.name}`}</h2>
          </div>
        </div>
      )}

      <div style={{ margin: "4rem 0rem" }}>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1" style={{ marginBottom: '10rem' }}>
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Files Uploaded
          </h4>

          <div className="flex justify-between" style={{ padding: '2rem 0rem' }}>
            <div className="flex items-center mb-4 md:mb-0">
              <ButtonGroup
                options={[
                  { value: 'all', label: 'View All' },
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'older', label: 'Older Files' },
                ]}
                selected={sortOption}
                onChange={handleSortChange}
              />
            </div>

            <div className="flex items-start md:flex-row mb-4 md:mb-0">
              <label htmlFor="search" className="block text-md font-medium text-black mr-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="p-2 border border-black rounded-md"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <ListTable
            selectedProject={selectedProject}
            handleDelete={handleDelete}
            currentFiles={currentItems}
            {...props}
          />
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
    </div>
  );
};

export default S3BucketUpload;
