import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { ShieldAlert, Navigation } from 'lucide-react';

export const MobileStickyEmergencyButton: React.FC = () => {
  const { activeTab, setActiveTab, activeRequest } = useBloodApp();

  // If already on emergency-request or matching-radar, we can minimize or hide
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200 px-4 py-2 sm:hidden shadow-lg">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('emergency-request')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
            activeTab === 'emergency-request'
              ? 'bg-[#972234] text-white'
              : 'bg-[#b32a3f] text-white hover:bg-[#972234]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>🚨 Raise Emergency Alert</span>
        </button>

        {activeRequest && (
          <button
            onClick={() => setActiveTab('matching-radar')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
              activeTab === 'matching-radar'
                ? 'bg-rose-100 border-rose-300 text-[#b32a3f]'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="View Live Radar"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>
        )}
      </div>
    </div>
  );
};
