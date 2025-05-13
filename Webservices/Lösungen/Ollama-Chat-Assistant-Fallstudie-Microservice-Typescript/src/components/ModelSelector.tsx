import React from 'react';
import { ModelSelectorProps } from '../types';

const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange
}) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onModelChange(e.target.value);
  };

  return (
    <div className="model-selector">
      <h3>Select Model</h3>
      <select
        value={currentModel}
        onChange={handleModelChange}
        className="model-select"
      >
        <option value="local">Local Model</option>
        <option value="cloud">Cloud Model</option>
      </select>
    </div>
  );
};

export default ModelSelector; 