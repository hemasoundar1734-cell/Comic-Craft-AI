import React, { useState } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { MatchedDonor } from '../types';
import { Building2, Navigation, AlertCircle, Check, Phone, MessageSquare } from 'lucide-react';

export const ProximityRadar: React.FC = () => {
  const { activeRequest, matchedDonors, setActiveTab, notifyDonor, fulfillRequest } = useBloodApp();
  const [selectedDonorMatch, setSelectedDonorMatch] = useState<MatchedDonor | null>(null);

  if (!activeRequest) {
    return (
      <div className="bg-white border border-rose-200/80 rounded-2xl p-8 text-center max-w-xl mx-auto my-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-[#b32a3f] mb-4">
          <Navigation className="w-8 h-8 opacity-60 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Proximity Radar</h3>
        <p className="text-sm text-slate-500 mt-1">
          Matches plotted by distance from request site.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-slate-50 text-xs text-slate-600 font-medium">
          No active emergency request currently selected.
        </div>
        <button
          onClick={() => setActiveTab('emergency-request')}
          className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-xl shadow-xs transition-colors"
        >
          🚨 Raise Emergency Request Now
        </button>
      </div>
    );
  }

  const hospital = activeRequest.hospital;
  const maxRadius = Math.max(activeRequest.maxRadiusKm, 20);

  // Helper to map geographic coordinates to radar polar coordinates
  // Angle derived from delta Lat/Lon, distance scaled to radar radius percentage
  const getCoordinates = (donorLat: number, donorLon: number, distanceKm: number, index: number) => {
    const dLat = donorLat - hospital.latitude;
    const dLon = donorLon - hospital.longitude;
    // Calculate geometric angle
    let angleRad = Math.atan2(dLon, dLat);
    if (isNaN(angleRad)) {
      angleRad = (index * (2 * Math.PI)) / 7;
    }

    // Distance normalized to percentage of radar radius (max 90% so pins don't clip border)
    const distRatio = Math.min(distanceKm / maxRadius, 0.95);
    const radiusPercent = 10 + distRatio * 82; // from center (10%) to boundary (92%)

    // Convert polar to cartesian centered at 50%, 50%
    const x = 50 + radiusPercent * Math.sin(angleRad) * 0.46;
    const y = 50 - radiusPercent * Math.cos(angleRad) * 0.46;

    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  const eligibleMatches = matchedDonors.filter(
    (m) => m.isCompatible && m.isEligible && m.withinRadius
  );

  return (
    <div className="bg-white border border-rose-200/90 rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto my-6">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Proximity Radar</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-100 text-[#b32a3f] font-semibold">
              {activeRequest.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Matches plotted by distance from request site: <strong className="text-slate-700">{hospital.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Patient Need:</span>
          <span className="px-2 py-1 bg-rose-600 text-white font-mono font-bold rounded">
            {activeRequest.bloodGroup} ({activeRequest.unitsNeeded} Units)
          </span>
          <span className="font-mono text-slate-500">
            {eligibleMatches.length} Compatible in {maxRadius} km
          </span>
        </div>
      </div>

      {/* Main Radar Screen */}
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Circular Radar Container */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] rounded-full border border-rose-500/30 bg-radial from-slate-900 to-slate-950 shadow-2xl flex items-center justify-center">
          {/* Rotating radar sweep ray */}
          <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none overflow-hidden">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-transparent origin-bottom-right transform rotate-0" />
          </div>

          {/* Concentric Distance Rings */}
          {/* 25% Ring */}
          <div className="absolute w-1/4 h-1/4 rounded-full border border-dashed border-rose-500/20 pointer-events-none">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-300/60">
              {Math.round(maxRadius * 0.25)} km
            </span>
          </div>

          {/* 50% Ring */}
          <div className="absolute w-2/4 h-2/4 rounded-full border border-rose-500/25 pointer-events-none">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-300/60">
              {Math.round(maxRadius * 0.5)} km
            </span>
          </div>

          {/* 75% Ring */}
          <div className="absolute w-3/4 h-3/4 rounded-full border border-dashed border-rose-500/20 pointer-events-none">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-300/60">
              {Math.round(maxRadius * 0.75)} km
            </span>
          </div>

          {/* Outer Boundary Ring */}
          <div className="absolute inset-2 rounded-full border border-rose-500/40 pointer-events-none">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-rose-300 font-bold">
              {maxRadius} km Max Radius
            </span>
          </div>

          {/* Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-rose-500/15" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-px bg-rose-500/15" />
          </div>

          {/* Center Point: Hospital Request Site */}
          <div className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group">
            {/* Animated Beacon Ring */}
            <div className="absolute w-12 h-12 rounded-full bg-rose-600/30 animate-pulse-ring pointer-events-none" />
            <div className="w-7 h-7 rounded-full bg-[#b32a3f] text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-rose-500">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -bottom-6 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 border border-rose-500/40 text-[10px] font-bold text-white shadow-md">
              🏥 {hospital.name.split('—')[0].trim()}
            </div>
          </div>

          {/* Plotted Donors */}
          {matchedDonors.map((match, idx) => {
            const { x, y } = getCoordinates(
              match.donor.latitude,
              match.donor.longitude,
              match.distanceKm,
              idx
            );
            const isEligibleMatch = match.isCompatible && match.isEligible && match.withinRadius;
            const isSelected = selectedDonorMatch?.donor.id === match.donor.id;

            return (
              <div
                key={match.donor.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedDonorMatch(match)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                title={`${match.donor.fullName} (${match.donor.bloodGroup}) · ${match.distanceKm} km`}
              >
                {/* Ping beacon for top matches */}
                {isEligibleMatch && match.matchScore >= 90 && (
                  <div className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
                )}

                {/* Donor Pin */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-mono transition-transform duration-200 border-2 shadow-md ${
                    isSelected
                      ? 'scale-125 ring-4 ring-white z-40'
                      : 'hover:scale-125 group-hover:z-40'
                  } ${
                    isEligibleMatch
                      ? 'bg-[#12805a] border-white text-white shadow-emerald-900/50'
                      : !match.isCompatible
                      ? 'bg-slate-700 border-slate-500 text-slate-300 opacity-60'
                      : 'bg-[#a8650f] border-amber-300 text-white opacity-80'
                  }`}
                >
                  {match.donor.bloodGroup}
                </div>

                {/* Minimal Label */}
                <div className="hidden group-hover:block absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded shadow-lg z-50">
                  {match.donor.fullName} · {match.distanceKm}km
                  {isEligibleMatch ? ` (${match.matchScore}%)` : ' [Waiting]'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#12805a] border border-white" />
            <span>Eligible & Compatible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#a8650f] border border-amber-300" />
            <span>Waiting (Rest Interval)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500" />
            <span>Incompatible Group</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#b32a3f] border border-white" />
            <span>Hospital (Center)</span>
          </div>
        </div>
      </div>

      {/* Selected Donor Quick Inspector Bar */}
      {selectedDonorMatch && (
        <div className="p-4 sm:p-5 bg-rose-50/70 border-t border-rose-200 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-white text-base shadow-sm ${
                selectedDonorMatch.isEligible && selectedDonorMatch.isCompatible
                  ? 'bg-[#12805a]'
                  : 'bg-amber-600'
              }`}
            >
              {selectedDonorMatch.donor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {selectedDonorMatch.donor.fullName}
                </span>
                <span className="text-xs text-slate-500">
                  📍 {selectedDonorMatch.donor.locationName}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                <span>Distance: <strong className="font-mono text-slate-900">{selectedDonorMatch.distanceKm} km</strong></span>
                <span>·</span>
                <span>Match Score: <strong className="font-mono text-emerald-700">{selectedDonorMatch.matchScore}%</strong></span>
                <span>·</span>
                <span>{selectedDonorMatch.matchReason}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => notifyDonor(activeRequest.id, selectedDonorMatch.donor.id, 'whatsapp')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Alert
            </button>
            <button
              onClick={() => notifyDonor(activeRequest.id, selectedDonorMatch.donor.id, 'sms')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              SMS Alert
            </button>
            {activeRequest.status !== 'fulfilled' && (
              <button
                onClick={() => fulfillRequest(activeRequest.id, selectedDonorMatch.donor.id)}
                className="px-3 py-1.5 bg-[#b32a3f] hover:bg-[#972234] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Fulfill Request
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
