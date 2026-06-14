import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { SidebarProvider } from './context/SidebarContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CreateInterview from './pages/CreateInterview';
import InterviewSession from './pages/InterviewSession';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function NavigationWrapper() {
  const { user, loading } = useAuth();
  const { currentPath, navigate, matchRoute } = useRouter();

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner spinner-lg"></span>
        <span className="loader-text">Verifying security token...</span>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPath === '/') {
      if (user) {
        setTimeout(() => navigate('/dashboard'), 0);
        return null;
      }
      return <Landing />;
    }

    if (currentPath === '/login') {
      if (user) {
        setTimeout(() => navigate('/dashboard'), 0);
        return null;
      }
      return <Login />;
    }

    if (currentPath === '/register') {
      if (user) {
        setTimeout(() => navigate('/dashboard'), 0);
        return null;
      }
      return <Register />;
    }

    if (currentPath === '/forgot-password') {
      if (user) {
        setTimeout(() => navigate('/dashboard'), 0);
        return null;
      }
      return <ForgotPassword />;
    }

    if (!user) {
      setTimeout(() => navigate('/login'), 0);
      return null;
    }

    if (currentPath === '/dashboard') {
      return <Dashboard />;
    }

    if (currentPath === '/setup') {
      return <CreateInterview />;
    }

    if (matchRoute('/interview/:id')) {
      return <InterviewSession />;
    }

    if (matchRoute('/results/:id')) {
      return <Results />;
    }

    if (currentPath === '/profile') {
      return <Profile />;
    }

    if (currentPath === '/admin') {
      return <Admin />;
    }

    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', fontWeight: 800 }}>404 - Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>The interview resource you requested doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="bg-glows">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <div className="botanical-corner-tr"></div>
      <div className="botanical-corner-bl"></div>

      <Navbar />

      {user ? (
        <div className="app-layout">
          <Sidebar />
          <main className="app-content">
            {renderPage()}
          </main>
        </div>
      ) : (
        renderPage()
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <SidebarProvider>
          <NavigationWrapper />
        </SidebarProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
