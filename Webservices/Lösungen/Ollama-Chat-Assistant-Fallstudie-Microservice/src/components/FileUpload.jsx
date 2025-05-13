import React from 'react';

function FileUpload({ uploadedFiles, onFileUpload, onRemoveFile }) {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="file-upload">
      <h3>Uploaded Files</h3>
      <input
        type="file"
        id="file-input"
        multiple
        onChange={handleFileChange}
        className="file-input"
      />
      <div className="file-list">
        {Array.from(uploadedFiles.values()).map((file) => (
          <div key={file.id} className="file-item">
            <span>{file.name}</span>
            <button onClick={() => onRemoveFile(file.id)} className="remove-file">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload; 