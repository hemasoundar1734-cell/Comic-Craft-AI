import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { checkEligibility, maskPhoneNumber, isBloodCompatible } from '../utils/bloodLogic';
import {
  User,
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Bell,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const {
    donors,
    activeDonorId,
    setActiveDonorId,
    toggleDonorAvailability,
    activeRequest,
    notifications,
    donations,
    setActiveTab,
  } = useBloodApp();

  const currentDonor = donors.find((d) => d.id === activeDonorId) || donors[0];
  const eligibility = checkEligibility(currentDonor.lastDonationDate);

  // Check if active request matches this donor
  const isMatchingActiveRequest =
    activeRequest &&
    isBloodCompatible(currentDonor.bloodGroup, activeRequest.bloodGroup) &&
    eligibility.isEligible;

  // Donor-specific notifications
  const myNotifications = notifications.filter((n) => n.donorId === currentDonor.id);

  // Donor lifetime donations
  const myDonations = donations.filter((d) => d.donorId === currentDonor.id);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Donor Persona Switcher */}
      <div className="bg-white border border-rose-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Simulate Donor Portal Account:
          </span>
        </div>
        <select
          value={activeDonorId}
          onChange={(e) => setActiveDonorId(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 cursor-pointer"
        >
          {donors.map((d) => {
            const el = checkEligibility(d.lastDonationDate);
            return (
              <option key={d.id} value={d.id}>
                {d.fullName} ({d.bloodGroup}) — {el.isEligible ? 'Eligible' : 'Waiting'}
              </option>
            );
          })}
        </select>
      </div>

      {/* Main Donor Profile Card */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#b32a3f] text-white flex items-center justify-center font-mono font-extrabold text-2xl shadow-md">
              {currentDonor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {currentDonor.fullName}
                </h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {currentDonor.gender.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentDonor.locationName}</span>
                <span>·</span>
                <span className="font-mono">{maskPhoneNumber(currentDonor.phone)}</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800">Available to Donate</div>
              <div className="text-[11px] text-slate-500">
                {currentDonor.availability === 'available'
                  ? 'Open to receive urgent SMS alerts'
                  : 'Temporarily paused'}
              </div>
            </div>
            <button
              onClick={() => toggleDonorAvailability(currentDonor.id)}
              className="cursor-pointer focus:outline-none"
              title="Toggle donor availability"
            >
              {currentDonor.availability === 'available' ? (
                <ToggleRight className="w-8 h-8 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* 90-Day Rest Rule Status */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              eligibility.isEligible
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}
          >
            {eligibility.isEligible ? (
              <CheckCircle className="w-5 h-5 text-[#12805a] shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                {eligibility.isEligible ? 'Clinical Status: Eligible' : 'Clinical Status: Resting'}
              </div>
              <div className="text-slate-600 text-[11px] mt-0.5">
                {eligibility.isEligible
                  ? 'You are clear to donate whole blood for emergency hospital requests.'
                  : `${eligibility.daysRemaining} days remaining in mandatory 90-day recovery.`}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] uppercase font-bold mb-1">
              Last Donation Record
            </span>
            <div className="font-mono text-base font-bold text-slate-900">
              {currentDonor.lastDonationDate || 'First Time / Never'}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {eligibility.daysSinceLastDonation !== null
                ? `${eligibility.daysSinceLastDonation} days ago`
                : 'No prior clinical records'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] uppercase font-bold mb-1">
              Lifetime Impact
            </span>
            <div className="font-mono text-base font-bold text-[#b32a3f]">
              {currentDonor.donationCount + myDonations.length} Donations
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Estimated ~{(currentDonor.donationCount + myDonations.length) * 3} lives touched
            </div>
          </div>
        </div>
      </div>

      {/* Active Nearby Requests for this Donor */}
      {isMatchingActiveRequest ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-mono font-bold text-[#b32a3f] uppercase">
                Active Hospital Match In Your Area!
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">
              {activeRequest.id}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {activeRequest.hospital.name} requires {activeRequest.unitsNeeded} units of {activeRequest.bloodGroup} for patient {activeRequest.patientName}.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('matching-radar')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg transition-colors cursor-pointer"
            >
              View In Radar & Respond
            </button>
          </div>
        </div>
      ) : null}

      {/* My Notifications Feed */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>My Alerts & Dispatches ({myNotifications.length})</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          All emergency notifications transmitted to your contact number.
        </p>

        {myNotifications.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No active emergency dispatches received yet. You will be alerted when a nearby hospital requests your blood group.
          </div>
        ) : (
          <div className="space-y-3">
            {myNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    🏥 {notif.hospitalName} ({notif.channel.toUpperCase()})
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
