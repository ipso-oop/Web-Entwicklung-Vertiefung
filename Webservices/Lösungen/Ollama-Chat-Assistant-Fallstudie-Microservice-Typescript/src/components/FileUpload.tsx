import React from 'react';
import { FileUploadProps, UploadedFile } from '../types';

const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFiles,
  onFileUpload,
  onRemoveFile
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  const handleRemove = (fileId: string): void => {
    onRemoveFile(fileId);
  };

  const renderUploadedFiles = (): JSX.Element[] => {
    const files: JSX.Element[] = [];
    uploadedFiles.forEach((file: UploadedFile, id: string) => {
      files.push(
        <div key={id} className="uploaded-file">
          <span className="file-name">{file.name}</span>
          <button
            onClick={() => handleRemove(id)}
            className="remove-file"
          >
            ×
          </button>
        </div>
      );
    });
    return files;
  };

  return (
    <div className="file-upload">
      <h3>Uploaded Files</h3>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-input"
      />
      <div className="uploaded-files">
        {renderUploadedFiles()}
      </div>
    </div>
  );
};

export default FileUpload; 