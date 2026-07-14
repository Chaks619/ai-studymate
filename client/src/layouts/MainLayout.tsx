import { Outlet } from 'react-router-dom';
import { Navbar } from '@components/layout/Navbar';
import { Sidebar } from '@components/layout/Sidebar';
import { Footer } from '@components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
