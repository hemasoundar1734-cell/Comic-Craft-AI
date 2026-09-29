import React, { useState } from 'react';
import { useBloodApp, ActiveTab, UserRole } from '../context/BloodAppContext';
import { Menu, X, ShieldAlert, Heart, Building2, User, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, userRole, setUserRole, resetToInitialDemoData } = useBloodApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: ActiveTab }[] = [
    { label: 'Overview', tab: 'overview' },
    { label: 'Emergency Request', tab: 'emergency-request' },
    { label: 'Donor Roster', tab: 'donor-roster' },
    { label: 'Matching Radar', tab: 'matching-radar' },
    { label: 'Notifications', tab: 'notifications' },
    { label: 'Analytics', tab: 'analytics' },
    { label: 'About', tab: 'about' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf2f3]/90 backdrop-blur-md border-b border-rose-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#b32a3f] text-white flex items-center justify-center font-bold shadow-sm shadow-rose-900/20 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Smart Blood Donor Finder
              </span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#b32a3f] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b32a3f] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role switch toggle */}
            <div className="hidden sm:flex items-center bg-[#f5e9ea] p-1 rounded-lg border border-rose-200/80">
              <button
                onClick={() => {
                  setUserRole('hospital');
                  setActiveTab('hospital-dashboard');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  userRole === 'hospital' && activeTab === 'hospital-dashboard'
                    ? 'bg-white text-[#b32a3f] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hospital Staff View"
              >
                <Building2 className="w-3.5 h-3.5" />
                Hospital
              </button>
              <button
                onClick={() => {
                  setUserRole('donor');
                  setActiveTab('donor-dashboard');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  userRole === 'donor' && activeTab === 'donor-dashboard'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Donor Portal View"
              >
                <User className="w-3.5 h-3.5" />
                Donor
              </button>
            </div>

            {/* Quick Emergency Action */}
            <button
              onClick={() => handleNavClick('emergency-request')}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg shadow-sm shadow-rose-900/20 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Raise Request</span>
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-rose-100/50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-rose-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-rose-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Role
            </span>
            <div className="flex items-center gap-1 bg-[#f5e9ea] p-1 rounded-lg">
              <button
                onClick={() => setUserRole('hospital')}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  userRole === 'hospital' ? 'bg-white text-[#b32a3f] shadow-xs' : 'text-slate-600'
                }`}
              >
                Hospital
              </button>
              <button
                onClick={() => setUserRole('donor')}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  userRole === 'donor' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Donor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.tab
                    ? 'bg-rose-50 text-[#b32a3f] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('donor-registration')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
            >
              + Register as Blood Donor
            </button>

            <button
              onClick={() => {
                resetToInitialDemoData();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Reset Demo Dataset (7 Donors)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
