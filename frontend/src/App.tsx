import { useState } from 'react';
import TopBar from './components/layout/TopBar';
// import SideBar from './components/layout/SideBar';
// import BottomBar from './components/layout/BottomBar';
// import { SidebarTab, FileMetadata } from './types';

export default function App() {
  // We keep this state because TopBar requires the toggle function prop
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* Only rendering TopBar for debugging */}
      <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* <div className="flex flex-1 overflow-hidden">
        <SideBar ... />
        <main ... />
      </div>
      <BottomBar ... /> 
      */}
    </div>
  );
}
