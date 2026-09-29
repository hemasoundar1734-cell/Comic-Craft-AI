import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { Building2, ShieldAlert, Users, HeartHandshake, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const {
    hospitals,
    selectedHospitalId,
    setSelectedHospitalId,
    activeRequest,
    requestHistory,
    notifications,
    matchedDonors,
    setActiveTab,
  } = useBloodApp();

  const currentHospital =
    hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const hospitalRequests = requestHistory.filter(
    (r) => r.hospital.id === currentHospital.id
  );
  const activeHospitalRequests = hospitalRequests.filter((r) => r.status !== 'fulfilled');
  const fulfilledHospitalRequests = hospitalRequests.filter((r) => r.status === 'fulfilled');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Building2 className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono text-slate-500 font-semibold">
              Hospital Operations Console
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentHospital.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentHospital.address} · Emergency Hotline: {currentHospital.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b32a3f] cursor-pointer"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                Switch Hospital: {h.name.split('—')[0].trim()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab('emergency-request')}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>Raise Emergency Need</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-rose-200 rounded-xl">
          <div className="text-xs font-semibold text-rose-700 flex items-center justify-between">
            <span>Active Emergency Alerts</span>
            <ShieldAlert className="w-4 h-4 text-[#b32a3f]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#b32a3f] mt-2">
            {activeHospitalRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Pending matched donors</div>
        </div>

        <div className="p-4 bg-white border border-blue-200 rounded-xl">
          <div className="text-xs font-semibold text-blue-700 flex items-center justify-between">
            <span>Dispatched Alerts</span>
            <PhoneCall className="w-4 h-4 text-[#2563a8]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#2563a8] mt-2">
            {notifications.filter((n) => n.hospitalName === currentHospital.name).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">SMS & WhatsApp dispatches</div>
        </div>

        <div className="p-4 bg-white border border-emerald-200 rounded-xl">
          <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>Fulfilled Transfusions</span>
            <CheckCircle2 className="w-4 h-4 text-[#12805a]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#12805a] mt-2">
            {fulfilledHospitalRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Life-saving units secured</div>
        </div>
      </div>

      {/* Active Request View or Action prompt */}
      {activeRequest && activeRequest.hospital.id === currentHospital.id ? (
        <div className="bg-white border border-rose-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#b32a3f] uppercase bg-rose-50 px-2 py-0.5 rounded">
                Live Broadcast In Progress
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                Patient: {activeRequest.patientName} ({activeRequest.bloodGroup} · {activeRequest.unitsNeeded} Units)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Radius: {activeRequest.maxRadiusKm} km · ID: {activeRequest.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('matching-radar')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Radar Tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Matched In-Radius Donors
              </span>
              <div className="text-2xl font-mono font-bold text-emerald-700">
                {matchedDonors.filter((m) => m.isCompatible && m.isEligible && m.withinRadius).length} Donors
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Passed compatibility, 90-day rest rule, and Haversine distance threshold.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Outreach Status
              </span>
              <div className="text-2xl font-mono font-bold text-blue-700">
                {activeRequest.contactedDonorIds.length} Contacted
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Awaiting responses or hospital arrival confirmation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">
            No live emergency alerts active for {currentHospital.name.split('—')[0].trim()}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            When urgent blood units are needed for surgery or ICU trauma, initiate an emergency request to broadcast to community donors.
          </p>
          <button
            onClick={() => setActiveTab('emergency-request')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg transition-colors cursor-pointer"
          >
            Broadcast Emergency Alert
          </button>
        </div>
      )}
    </section>
  );
};
