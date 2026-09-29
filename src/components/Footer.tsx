import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useBloodApp();

  return (
    <footer className="mt-16 bg-white border-t border-rose-200/80 pt-10 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Brand & Tagline */}
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-slate-900 text-base">
              <div className="w-6 h-6 rounded-md bg-[#b32a3f] text-white flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
              <span>Smart Blood Donor Finder</span>
            </div>
            <p className="text-sm font-semibold text-[#b32a3f]">
              “Every Second Matters. Every Donor Can Save a Life.”
            </p>
            <p className="text-[11px] text-slate-400">
              Smart Blood Donor Finder — Demo Build
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Privacy & Security
            </button>
            <button
              onClick={() => setActiveTab('emergency-request')}
              className="text-[#b32a3f] font-semibold hover:underline transition-colors cursor-pointer"
            >
              Emergency Request
            </button>
            <button
              onClick={() => setActiveTab('donor-registration')}
              className="text-emerald-800 font-semibold hover:underline transition-colors cursor-pointer"
            >
              Become a Donor
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Analytics Matrix
            </button>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Donor information is used only for active matching and emergency coordination.</span>
          </div>
          <div>
            Emergency response matching demo prototype · Built for rapid hospital-to-donor dispatch.
          </div>
        </div>
      </div>
    </footer>
  );
};
