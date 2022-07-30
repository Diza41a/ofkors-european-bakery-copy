/* eslint-disable import/extensions */
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter } from 'react-router-dom';

// Component imports
import MainLayout from './reusable/MainLayout';
import Landing from './components/Landing.jsx';
import Contact from './components/Contact.jsx';
import Menu from './components/Menu.jsx';
import About from './components/About.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';

// Multi Language support
import './i18n';

const root = createRoot(document.getElementById('root'));

function App() {
  return (
    <Suspense fallback="loading">
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="*" element={<Landing />} />
            <Route index element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
}

root.render(<App />);
