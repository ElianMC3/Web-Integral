import { useStore } from '../../context/useStore';
import LoginView1 from './LoginView1';
import LoginView2 from './LoginView2';
import LoginView3 from './LoginView3';
import { Layers } from 'lucide-react';

export default function LoginContainer() {
  const { loginView, setLoginView } = useStore();

  const renderActiveLogin = () => {
    switch (loginView) {
      case 1:
        return <LoginView1 />;
      case 2:
        return <LoginView2 />;
      case 3:
        return <LoginView3 />;
      default:
        return <LoginView1 />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating control bar for reviewer to switch between SEDA login versions */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex items-center space-x-3 z-50 animate-fade-in">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Layers className="w-4 h-4 text-[#9A6B4C]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Selector de Login:</span>
        </div>
        <div className="flex space-x-1 bg-slate-100/60 p-1 rounded-xl">
          {[1, 2, 3].map((v) => (
            <button
              key={v}
              onClick={() => setLoginView(v as 1 | 2 | 3)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                loginView === v
                  ? 'bg-white text-[#9A6B4C] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Versión {v}
            </button>
          ))}
        </div>
      </div>

      {/* Render selected version */}
      {renderActiveLogin()}
    </div>
  );
}
