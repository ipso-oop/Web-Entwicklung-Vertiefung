import React from 'react';

function ModelSelector({ currentModel, onModelChange }) {
  return (
    <div className="model-selector">
      <h3>Select Model</h3>
      <div className="model-buttons">
        <button
          className={`model-button ${currentModel === 'local' ? 'active' : ''}`}
          onClick={() => onModelChange('local')}
        >
          Local Model
        </button>
        <button
          className={`model-button ${currentModel === 'external' ? 'active' : ''}`}
          onClick={() => onModelChange('external')}
        >
          External Model
        </button>
      </div>
    </div>
  );
}

export default ModelSelector; 