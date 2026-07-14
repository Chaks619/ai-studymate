import React from 'react';

interface PageLoaderProps {
  fullPage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PageLoader: React.FC<PageLoaderProps> = ({ fullPage = false, size = 'medium' }) => {
  const loaderContent = <div className={`loader loader-${size}`} />;

  if (fullPage) {
    return (
      <div className="page-loader-container">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};
