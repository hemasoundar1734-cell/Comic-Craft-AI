import React from 'react';
import { Donor, BloodGroup } from '../types';
import { checkEligibility, DONOR_CAN_DONATE_TO, RECIPIENT_CAN_RECEIVE_FROM, maskPhoneNumber } from '../utils/bloodLogic';
import { X, Heart, Calendar, Phone, Mail, MapPin, Scale, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface DonorDetailModalProps {
  donor: Donor | null;
  onClose: () => void;
  onNotify?: (channel: 'sms' | 'whatsapp') => void;
}

export const DonorDetailModal: React.FC<DonorDetailModalProps> = ({ donor, onClose, onNotify }) => {
  if (!donor) return null;

  const { isEligible, daysSinceLastDonation, daysRemaining } = checkEligibility(donor.lastDonationDate);
  const canDonateTo = DONOR_CAN_DONATE_TO[donor.bloodGroup] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-50 via-white to-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#b32a3f] text-white flex items-center justify-center font-mono font-bold text-xl shadow-sm">
              {donor.bloodGroup}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{donor.fullName}</h3>
              <p className="text-xs text-slate-500">
                Registered Volunteer Donor · {donor.gender.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Eligibility Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isEligible
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}
          >
            {isEligible ? (
              <ShieldCheck className="w-5 h-5 text-[#12805a] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <div className="font-bold text-sm">
                {isEligible ? 'Eligible to Donate Right Now' : 'Currently in 90-Day Waiting Interval'}
              </div>
              <div className="mt-0.5 text-slate-600">
                {daysSinceLastDonation !== null
                  ? `Last donated ${daysSinceLastDonation} days ago.`
                  : 'First-time registered donor.'}{' '}
                {isEligible
                  ? 'Exceeds the 90-day clinical recovery guideline.'
                  : `${daysRemaining} days remaining until full red blood cell recovery.`}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location</span>
              </div>
              <div className="font-semibold text-slate-800">{donor.locationName}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {donor.latitude.toFixed(4)}, {donor.longitude.toFixed(4)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact (Privacy Masked)</span>
              </div>
              <div className="font-semibold font-mono text-slate-800">
                {maskPhoneNumber(donor.phone)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Shared only during emergency dispatch
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Donation</span>
              </div>
              <div className="font-semibold text-slate-800">
                {donor.lastDonationDate ? donor.lastDonationDate : 'Never / First Time'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Lifetime donations: {donor.donationCount}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Weight / Status</span>
              </div>
              <div className="font-semibold text-slate-800">
                {donor.weightKg ? `${donor.weightKg} kg` : 'Eligible weight (>=50kg)'}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5 capitalize">
                Status: {donor.availability}
              </div>
            </div>
          </div>

          {/* Compatibility Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#b32a3f]" />
              <span>Red Blood Cell Donation Compatibility</span>
            </div>
            <div className="text-xs text-slate-600">
              Donors with blood group <strong className="text-[#b32a3f]">{donor.bloodGroup}</strong> can donate to:
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {canDonateTo.map((group) => (
                <span
                  key={group}
                  className="px-2 py-0.5 bg-white border border-rose-200 font-mono text-xs font-bold text-[#b32a3f] rounded shadow-2xs"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          {donor.notes && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-0.5">Donor Record Notes:</strong>
              {donor.notes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          {onNotify && (
            <>
              <button
                onClick={() => {
                  onNotify('whatsapp');
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                Send WhatsApp Alert
              </button>
              <button
                onClick={() => {
                  onNotify('sms');
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg transition-colors cursor-pointer"
              >
                Send SMS Alert
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
