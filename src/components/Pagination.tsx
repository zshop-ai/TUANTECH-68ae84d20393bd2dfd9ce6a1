import React from 'react';
import { Box, Button, Text } from 'zmp-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  limitOptions = [10, 20, 50],
  className = '',
}) => {
  const { page, limit, total, totalPages, hasPrevious, hasNext } = meta;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; // Reduced for mobile
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <Box className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 mx-4 mb-4 ${className}`}>
      {/* Mobile-first design */}
      <Box className="flex flex-col space-y-4">
        {/* Page info */}
        <Box className="text-center">
          <Text className="text-sm text-gray-600">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total} kết quả
          </Text>
        </Box>

        {/* Limit selector (if enabled) */}
        {showLimitSelector && onLimitChange && (
          <Box className="flex items-center justify-center space-x-2">
            <Text className="text-sm text-gray-600">Hiển thị:</Text>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Box>
        )}

        {/* Navigation */}
        <Box className="flex items-center justify-center space-x-2">
          {/* Previous button */}
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious}
            variant="secondary"
            size="small"
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trước</span>
          </Button>

          {/* Page numbers */}
          <Box className="flex items-center space-x-1">
            {pageNumbers.map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <Text className="px-2 py-1 text-sm text-gray-500">...</Text>
                ) : (
                  <Button
                    onClick={() => onPageChange(pageNum as number)}
                    variant={pageNum === page ? "primary" : "secondary"}
                    size="small"
                    className="min-w-[32px] h-8 text-sm"
                  >
                    {pageNum}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Next button */}
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            variant="secondary"
            size="small"
            className="flex items-center space-x-1"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Box>

        {/* Quick jump (for larger screens) */}
        {totalPages > 10 && (
          <Box className="hidden sm:flex items-center justify-center space-x-2">
            <Text className="text-sm text-gray-600">Đi đến trang:</Text>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => {
                const newPage = Number(e.target.value);
                if (newPage >= 1 && newPage <= totalPages) {
                  onPageChange(newPage);
                }
              }}
              className="border border-gray-300 rounded px-2 py-1 w-16 text-sm text-center"
            />
            <Text className="text-sm text-gray-600">/ {totalPages}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Pagination;
