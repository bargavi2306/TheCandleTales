import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text font-sans">
      {/* Loading Overlay portal */}
      <LoadingScreen />

      {/* Main sticky navigation header */}
      <Navbar />

      {/* Page view content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer information section */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
