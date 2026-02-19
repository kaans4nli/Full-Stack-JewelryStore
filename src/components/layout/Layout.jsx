import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout Component
 * Tüm sayfaları saran ana layout
 * Header ve Footer'ı içerir
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (Navbar) */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
