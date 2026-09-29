import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { ShieldAlert, UserPlus, Radio, Activity, MapPin, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/emergency_blood_matching_1790658326951.jpg';

export const HeroSection: React.FC = () => {
  const { setActiveTab, stats, activeRequest } = useBloodApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf2f3] via-[#f7ebed] to-[#faf2f3] border-b border-rose-200/50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-[#b32a3f] text-xs font-semibold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b32a3f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b32a3f]"></span>
              </span>
              LIVE MATCHING ENGINE
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Find the Right Blood Donor.{' '}
              <span className="text-[#b32a3f] underline decoration-rose-300 decoration-wavy decoration-2">Faster.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Raise an emergency request and instantly identify compatible, eligible, nearby donors.
              Replace frantic phone calls with an automated geographic compatibility engine.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => setActiveTab('emergency-request')}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-xl shadow-lg shadow-rose-900/25 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>🚨 Raise Emergency Request</span>
              </button>

              <button
                onClick={() => setActiveTab('donor-registration')}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Become a Donor →</span>
              </button>
            </div>

            {/* Key trust badges */}
            <div className="pt-3 border-t border-rose-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#12805a]" />
                <span>Automated 90-Day Rest Check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#2563a8]" />
                <span>Haversine GPS Radius Matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#b32a3f]" />
                <span>Simulated SMS & WhatsApp Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Representation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white border border-rose-200/80 shadow-xl overflow-hidden p-2">
              {/* Image banner */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={heroImg}
                  alt="Emergency Blood Donor Matching Console"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to styled SVG container
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase text-rose-300 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        Active Hospital Dispatch
                      </div>
                      <div className="text-sm font-bold mt-0.5">
                        {activeRequest ? `${activeRequest.hospital.name}` : 'Ready for Emergency Broadcast'}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs text-slate-300">Live Pool</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {stats.eligibleRightNow} / {stats.registeredDonors} Eligible
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time mini pulse strip */}
              <div className="p-3.5 bg-[#fdf8f9] rounded-xl mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-[#b32a3f]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Delhi-NCR Grid Connected</div>
                    <div className="text-slate-500 text-[11px]">3 Partner Hospitals Online</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('matching-radar')}
                  className="px-2.5 py-1 text-xs font-medium text-[#b32a3f] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                >
                  View Radar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
