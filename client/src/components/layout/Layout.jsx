import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AIAssistantWidget } from '../common/AIAssistantWidget';

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className="main-wrapper"
        style={{
          marginLeft: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'
        }}
      >
        <Navbar />

        <main className="content-container">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Inventra AI Assistant Floating Widget */}
      <AIAssistantWidget />
    </div>
  );
};
