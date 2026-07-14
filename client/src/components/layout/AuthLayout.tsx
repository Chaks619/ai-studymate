import React from 'react';

interface LayoutComponentsProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<LayoutComponentsProps> = ({ children }) => {
  return <div className="auth-layout">{children}</div>;
};
