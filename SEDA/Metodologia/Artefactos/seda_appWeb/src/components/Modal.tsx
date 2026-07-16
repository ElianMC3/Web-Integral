import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, icon }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div className="flex items-center space-x-3">
            {icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">{icon}</div>}
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
