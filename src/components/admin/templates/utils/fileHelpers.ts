
// Helper functions for file operations in templates

/**
 * Determines the file type from a File object
 */
export const getFileType = (file: File | null): 'pdf' | 'doc' | 'docx' | 'unknown' => {
  if (!file) return 'unknown';
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return 'pdf';
  if (extension === 'doc') return 'doc';
  if (extension === 'docx') return 'docx';
  
  return 'unknown';
};

/**
 * Provides the appropriate icon component based on file type
 */
export const getFileIcon = (fileType: 'pdf' | 'doc' | 'docx' | 'unknown') => {
  // Just return the string name since we'll import the icons in the component
  return fileType === 'pdf' ? 'FileText' : 'File';
};
