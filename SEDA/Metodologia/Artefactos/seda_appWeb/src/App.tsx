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

export default function App() {
  const { isAuthenticated, activeTab, fetchInitialData } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated, fetchInitialData]);

  if (!isAuthenticated) {
    return <LoginContainer />;
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
