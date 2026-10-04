import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
