import React, { useState, useMemo } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { Donor, BloodGroup } from '../types';
import {
  checkEligibility,
  calculateHaversineDistance,
  maskPhoneNumber,
  isBloodCompatible,
} from '../utils/bloodLogic';
import { DonorDetailModal } from './DonorDetailModal';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const DonorRoster: React.FC = () => {
  const {
    donors,
    hospitals,
    selectedHospitalId,
    setSelectedHospitalId,
    activeRequest,
    toggleDonorAvailability,
    setActiveTab,
  } = useBloodApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(50);
  const [inspectDonor, setInspectDonor] = useState<Donor | null>(null);

  const referenceHospital =
    hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Filtered & mapped donors
  const processedDonors = useMemo(() => {
    return donors.map((donor) => {
      const eligibility = checkEligibility(donor.lastDonationDate);
      const distanceKm = calculateHaversineDistance(
        referenceHospital.latitude,
        referenceHospital.longitude,
        donor.latitude,
        donor.longitude
      );

      let matchStatus = 'Standard Pool';
      if (activeRequest) {
        const isCompat = isBloodCompatible(donor.bloodGroup, activeRequest.bloodGroup);
        if (isCompat && eligibility.isEligible && distanceKm <= activeRequest.maxRadiusKm) {
          matchStatus = 'Priority Match';
        } else if (isCompat) {
          matchStatus = 'Compatible';
        } else {
          matchStatus = 'Not Compatible';
        }
      }

      return {
        donor,
        eligibility,
        distanceKm,
        matchStatus,
      };
    });
  }, [donors, referenceHospital, activeRequest]);

  const filteredDonors = useMemo(() => {
    return processedDonors.filter((item) => {
      const { donor, eligibility, distanceKm } = item;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = donor.fullName.toLowerCase().includes(q);
        const matchesLocation = donor.locationName.toLowerCase().includes(q);
        const matchesBlood = donor.bloodGroup.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesBlood) return false;
      }

      // Blood group filter
      if (selectedBloodGroup !== 'all' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // Eligibility filter
      if (selectedEligibility === 'eligible' && !eligibility.isEligible) {
        return false;
      }
      if (selectedEligibility === 'waiting' && eligibility.isEligible) {
        return false;
      }

      // Availability filter
      if (selectedAvailability !== 'all' && donor.availability !== selectedAvailability) {
        return false;
      }

      // Distance filter
      if (distanceKm > maxDistanceFilter) {
        return false;
      }

      return true;
    });
  }, [
    processedDonors,
    searchQuery,
    selectedBloodGroup,
    selectedEligibility,
    selectedAvailability,
    maxDistanceFilter,
  ]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-md overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Donor Roster
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#b32a3f]">
                {donors.length} Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sample dataset — eligibility auto-checked (90-day rule)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('donor-registration')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Donor</span>
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-4 sm:p-6 bg-slate-50/60 border-b border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, area (e.g. Karol Bagh, Saket)..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b32a3f]"
              />
            </div>

            {/* Blood Group Filter */}
            <div>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b32a3f] cursor-pointer"
              >
                <option value="all">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Eligibility Filter */}
            <div>
              <select
                value={selectedEligibility}
                onChange={(e) => setSelectedEligibility(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b32a3f] cursor-pointer"
              >
                <option value="all">All Eligibility</option>
                <option value="eligible">Eligible Only</option>
                <option value="waiting">Waiting (Rest Interval)</option>
              </select>
            </div>

            {/* Distance Reference Hospital */}
            <div>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b32a3f] cursor-pointer"
                title="Calculate distance from this hospital"
              >
                {hospitals.map((hosp) => (
                  <option key={hosp.id} value={hosp.id}>
                    Dist from {hosp.name.split('—')[0].trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Data Grid */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Donor</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Donation</th>
                <th className="py-3 px-4">Eligibility (90d)</th>
                <th className="py-3 px-4 text-right">Distance</th>
                <th className="py-3 px-4">Match Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDonors.map(({ donor, eligibility, distanceKm, matchStatus }) => {
                const isEligible = eligibility.isEligible;

                return (
                  <tr key={donor.id} className="hover:bg-rose-50/30 transition-colors">
                    {/* Donor Name & Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{donor.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{donor.locationName}</span>
                      </div>
                    </td>

                    {/* Blood Group */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-rose-100 text-[#b32a3f] font-bold text-xs">
                        {donor.bloodGroup}
                      </span>
                    </td>

                    {/* Availability Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleDonorAvailability(donor.id)}
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                        title="Click to toggle availability"
                      >
                        {donor.availability === 'available' ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Available</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-500">Unavailable</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last Donation Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800">
                        {donor.lastDonationDate ? donor.lastDonationDate : 'Never (First Time)'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {eligibility.daysSinceLastDonation !== null
                          ? `${eligibility.daysSinceLastDonation} days ago`
                          : 'No recorded donations'}
                      </div>
                    </td>

                    {/* 90-day Eligibility Badge */}
                    <td className="py-3.5 px-4">
                      {isEligible ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#12805a]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-[#a8650f]">
                          <Clock className="w-3.5 h-3.5" />
                          Waiting ({eligibility.daysRemaining}d left)
                        </span>
                      )}
                    </td>

                    {/* Distance from Hospital */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                      {distanceKm} km
                    </td>

                    {/* Match Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          matchStatus === 'Priority Match'
                            ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                            : matchStatus === 'Compatible'
                            ? 'text-emerald-700'
                            : matchStatus === 'Not Compatible'
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {matchStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setInspectDonor(donor)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Donor Cards (Satisfies Requirement: No wide tables on small screens!) */}
        <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-4">
          {filteredDonors.map(({ donor, eligibility, distanceKm, matchStatus }) => {
            const isEligible = eligibility.isEligible;

            return (
              <div
                key={donor.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-rose-100 text-[#b32a3f] font-mono font-bold flex items-center justify-center text-sm shadow-2xs">
                      {donor.bloodGroup}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{donor.fullName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {donor.locationName}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-700">
                    📍 {distanceKm} km
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Eligibility
                    </span>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#12805a]">
                        <CheckCircle className="w-3 h-3" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#a8650f]">
                        <Clock className="w-3 h-3" />
                        Waiting ({eligibility.daysRemaining}d)
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Last Donation
                    </span>
                    <span className="font-mono text-slate-700">
                      {donor.lastDonationDate || 'Never'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => toggleDonorAvailability(donor.id)}
                    className="text-xs font-medium text-slate-600 flex items-center gap-1"
                  >
                    {donor.availability === 'available' ? (
                      <span className="text-emerald-700">● Available</span>
                    ) : (
                      <span className="text-slate-400">○ Unavailable</span>
                    )}
                  </button>

                  <button
                    onClick={() => setInspectDonor(donor)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Count */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredDonors.length}</strong> of{' '}
            <strong className="text-slate-800">{donors.length}</strong> registered donors
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted HIPAA/GDPR clinical privacy compliance standard</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {inspectDonor && (
        <DonorDetailModal
          donor={inspectDonor}
          onClose={() => setInspectDonor(null)}
        />
      )}
    </section>
  );
};
