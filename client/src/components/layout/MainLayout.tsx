import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutComponentsProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<LayoutComponentsProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
