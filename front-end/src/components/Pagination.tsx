import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = []
  
    if(totalPages <= 6) {
      for(let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if(currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if(currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pages;
  }

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-4 mt-16 text-sm font-medium">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
        aria-label="previous page"
      >
        <IoIosArrowBack />
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-1 tracking-widest text-gray-400">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-1 py-1 transition-all cursor-pointer ${
                currentPage === page
                  ? "border-b border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
        aria-label="next page"
      >
        <IoIosArrowForward />
      </button>
    </div>
  )
}

export default Pagination
