import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title = 'Error', message, retry }) => {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {retry && <button onClick={retry}>Retry</button>}
    </div>
  );
};
