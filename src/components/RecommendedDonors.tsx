import React, { useState } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { MatchedDonor, Donor } from '../types';
import { DonorDetailModal } from './DonorDetailModal';
import {
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Check,
  Eye,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

export const RecommendedDonors: React.FC = () => {
  const {
    activeRequest,
    matchedDonors,
    notifyDonor,
    markDonorContacted,
    fulfillRequest,
  } = useBloodApp();

  const [inspectDonor, setInspectDonor] = useState<Donor | null>(null);
  const [filterMode, setFilterMode] = useState<'eligible_only' | 'all'>('eligible_only');

  if (!activeRequest) return null;

  const eligibleMatches = matchedDonors.filter(
    (m) => m.isCompatible && m.isEligible && m.withinRadius
  );

  const displayedMatches = filterMode === 'eligible_only' ? eligibleMatches : matchedDonors;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-md overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/60 via-white to-rose-50/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b32a3f] animate-ping" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recommended Donors
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ranked by compatibility, 90-day eligibility, and Haversine distance from{' '}
              <strong className="text-slate-800">{activeRequest.hospital.name}</strong>.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilterMode('eligible_only')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'eligible_only'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eligible Matches ({eligibleMatches.length})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Donors Evaluated ({matchedDonors.length})
            </button>
          </div>
        </div>

        {/* System Scoring Disclaimer */}
        <div className="px-5 py-2.5 bg-rose-50/40 border-b border-rose-100 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>System Matching Score:</strong> Calculated objectively from geographic proximity, blood group compatibility, and eligibility. Not medical certainty.
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
            Target: {activeRequest.bloodGroup} · Radius: {activeRequest.maxRadiusKm} km
          </span>
        </div>

        {/* Donor Cards Grid */}
        <div className="p-5 sm:p-6">
          {displayedMatches.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/30">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-[#b32a3f] flex items-center justify-center mx-auto mb-3">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                No compatible eligible donor found within the selected radius.
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Try expanding the maximum search radius ({activeRequest.maxRadiusKm} km) or switch to view all evaluated donors.
              </p>
              <button
                onClick={() => setFilterMode('all')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#b32a3f] bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Inspect All In-Range Donors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedMatches.map((match) => {
                const donor = match.donor;
                const isContacted = activeRequest.contactedDonorIds.includes(donor.id);
                const isFulfilled = activeRequest.status === 'fulfilled';
                const isEligibleMatch = match.isCompatible && match.isEligible && match.withinRadius;

                return (
                  <div
                    key={donor.id}
                    className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                      isEligibleMatch
                        ? 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-md'
                        : 'bg-slate-50/80 border-slate-200 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Top Row: Blood Group & Match Score */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shadow-xs ${
                              isEligibleMatch ? 'bg-[#b32a3f]' : 'bg-slate-600'
                            }`}
                          >
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900 leading-tight">
                              {donor.fullName}
                            </h4>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{donor.locationName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Display */}
                        {isEligibleMatch ? (
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                              Match Score
                            </div>
                            <div className="text-xl font-extrabold font-mono text-[#12805a]">
                              {match.matchScore}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Criteria Proof Lines */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Compatibility:</span>
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              match.isCompatible ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {match.isCompatible ? '✓ Compatible' : '✕ Incompatible'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">90-Day Eligibility:</span>
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              match.isEligible ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {match.isEligible ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-[#12805a]" />
                                Eligible
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-600" />
                                Waiting ({match.daysSinceLastDonation}d ago)
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Distance:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            📍 {match.distanceKm} km away
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Availability:</span>
                          <span
                            className={`font-medium capitalize ${
                              donor.availability === 'available'
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {donor.availability}
                          </span>
                        </div>
                      </div>

                      {/* Contact Status tag if already contacted */}
                      {isContacted && (
                        <div className="mt-3 p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-medium text-blue-800 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Emergency alert dispatched to donor</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setInspectDonor(donor)}
                        className="p-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="View Full Donor Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => notifyDonor(activeRequest.id, donor.id, 'whatsapp')}
                        className="flex-1 py-2 px-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => notifyDonor(activeRequest.id, donor.id, 'sms')}
                        className="flex-1 py-2 px-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>SMS</span>
                      </button>

                      {!isFulfilled && isEligibleMatch && (
                        <button
                          onClick={() => fulfillRequest(activeRequest.id, donor.id)}
                          className="w-full mt-1 py-2 px-3 text-xs font-bold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Fulfilled (Donation Completed)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details modal */}
      {inspectDonor && (
        <DonorDetailModal
          donor={inspectDonor}
          onClose={() => setInspectDonor(null)}
          onNotify={(ch) => notifyDonor(activeRequest.id, inspectDonor.id, ch)}
        />
      )}
    </section>
  );
};
