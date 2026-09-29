import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  const isEmergency = message.includes('🚨') || message.includes('Emergency');

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`px-4 py-3 rounded-xl shadow-xl border flex items-start gap-3 ${
          isEmergency
            ? 'bg-slate-900 text-white border-rose-500/40 shadow-rose-900/20'
            : 'bg-white text-slate-900 border-slate-200 shadow-slate-900/10'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isEmergency ? (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};
