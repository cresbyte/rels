import React from 'react';
import { Document, Page } from 'react-pdf';
import { Box, Typography } from '@mui/material';

const PageThumbnails = ({
  pdfFile,
  numPages,
  currentPage,
  onPageChange,
}) => {
  if (!pdfFile) return null;

  return (
    <Box sx={{ 
      height: '100%', 
      overflowY: 'auto', 
      bgcolor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      p: 2
    }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Pages
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: numPages }, (_, index) => index + 1).map((pageNum) => (
          <Box
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              overflow: 'hidden',
              border: currentPage === pageNum ? '2px solid #3b82f6' : '2px solid #e5e7eb',
              boxShadow: currentPage === pageNum ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: currentPage === pageNum ? '#3b82f6' : '#9ca3af',
              }
            }}
          >
            <Document file={pdfFile}>
              <Page
                pageNumber={pageNum}
                width={150}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <Box sx={{ textAlign: 'center', py: 0.5, bgcolor: 'white' }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Page {pageNum}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PageThumbnails;
