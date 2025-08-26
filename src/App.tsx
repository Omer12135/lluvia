import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import SuccessPage from './components/SuccessPage';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/AdminLogin';

import { AutomationProvider } from './context/AutomationContext';
import { BlogProvider } from './context/BlogContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AdminProvider>
          <AutomationProvider>
            <BlogProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            </BlogProvider>

          </AutomationProvider>
        </AdminProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;