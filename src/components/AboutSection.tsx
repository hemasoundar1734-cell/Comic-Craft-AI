import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import {
  ShieldAlert,
  GitBranch,
  ShieldCheck,
  MapPin,
  TrendingUp,
  BellRing,
  HeartHandshake,
  Lock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { resetToInitialDemoData, setActiveTab } = useBloodApp();

  const steps = [
    {
      num: '01',
      title: 'Emergency Request',
      desc: 'Hospital trauma/ICU team submits patient blood group, required units, and hospital coordinates.',
      icon: ShieldAlert,
      color: 'bg-rose-100 text-[#b32a3f]',
    },
    {
      num: '02',
      title: 'Compatibility Check',
      desc: 'Algorithmic filtering based on clinical ABO / Rh(D) red blood cell antigen rules.',
      icon: GitBranch,
      color: 'bg-blue-100 text-[#2563a8]',
    },
    {
      num: '03',
      title: 'Eligibility Check',
      desc: 'Enforces clinical 90-day whole blood rest intervals. Ineligible donors are filtered out.',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-[#12805a]',
    },
    {
      num: '04',
      title: 'Distance Calculation',
      desc: 'High-precision Haversine formula calculates donor geodesic distance from hospital.',
      icon: MapPin,
      color: 'bg-amber-100 text-[#a8650f]',
    },
    {
      num: '05',
      title: 'Donor Ranking',
      desc: 'Transparent composite scoring weighting exact match bonuses and proximity.',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      num: '06',
      title: 'Notification Dispatch',
      desc: 'Simulated priority SMS and WhatsApp dispatch alerts to ranked candidate donors.',
      icon: BellRing,
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      num: '07',
      title: 'Fulfillment',
      desc: 'Donor arrives at hospital, unit is drawn, and donation history automatically updates.',
      icon: HeartHandshake,
      color: 'bg-rose-100 text-[#b32a3f]',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Intro Hero Box */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-6 sm:p-10 shadow-sm text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b32a3f] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          HEALTHCARE EMERGENCY PLATFORM
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Smart Blood Donor Finder
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
          Smart Blood Donor Finder is a digital emergency blood matching platform designed to reduce
          the time required to identify suitable nearby donors.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          By replacing slow manual phone-tree calls with digital geospatial and hematological matching,
          critical transfusion lead time is reduced from hours to minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setActiveTab('emergency-request')}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            🚨 Try Emergency Matching Workflow
          </button>
          <button
            onClick={() => resetToInitialDemoData()}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo to Initial 7 Donors</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Timeline */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            Emergency Matching Workflow Architecture
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Emergency Request → Compatibility Check → Eligibility Check → Distance Calculation → Donor Ranking → Notification → Fulfillment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between hover:bg-white hover:border-rose-200 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STEP {st.num}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${st.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy and Security Assurance */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Privacy & Clinical Security</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              “Donor information is used only for active matching and emergency coordination.”
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-400">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <strong className="text-white block mb-0.5">Masked Telephony</strong>
                Full donor contact numbers are masked and only revealed through secure SMS/WhatsApp gateways.
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <strong className="text-white block mb-0.5">Geographic Coarseness</strong>
                Public listings only show neighborhood localities, preventing exact physical address leaks.
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <strong className="text-white block mb-0.5">Medical Confidentiality</strong>
                Strict 90-day intervals safeguard donor health and comply with blood bank guidelines.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
