import React from 'react'

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

export default Pagination
