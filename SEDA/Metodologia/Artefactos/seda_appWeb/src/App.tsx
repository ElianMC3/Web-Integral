import { useEffect } from 'react';
import { useStore } from './context/useStore';
import LoginContainer from './views/Logins/LoginContainer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './views/Dashboard';
import Reception from './views/Reception';
import Packaging from './views/Packaging';
import Logistics from './views/Logistics';
import Users from './views/Users';

export default function App() {
  const { isAuthenticated, activeTab, isLoading, initAuth } = useStore();

  // Check for existing JWT on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!isAuthenticated) {
    return <LoginContainer />;
  }

  // Show loading overlay while fetching initial data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 tracking-wide">Cargando datos del sistema...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reception':
        return <Reception />;
      case 'packaging':
        return <Packaging />;
      case 'logistics':
        return <Logistics />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Navigation sidebar (Fixed, w-64) */}
      <Sidebar />

      {/* Main dashboard content container */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Dynamic header (Fixed, h-16) */}
        <Header />

        {/* View panels with spacing for fixed navbar */}
        <main className="flex-grow pt-16 bg-slate-50/40">
          {renderActiveView()}
        </main>

        {/* Global footer — Aviso de Privacidad */}
        <Footer />
      </div>
    </div>
  );
}
