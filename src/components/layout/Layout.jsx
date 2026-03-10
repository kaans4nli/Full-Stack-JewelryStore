import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout Component
 * Tüm sayfaları saran ana layout
 * Header ve Footer'ı içerir
 * Outlet ile nested routes destekler
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (Navbar) */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Outlet: nested route'ların render edildiği yer */}
        {children || <Outlet />}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
