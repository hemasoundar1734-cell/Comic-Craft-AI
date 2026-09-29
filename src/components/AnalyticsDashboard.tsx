import React, { useMemo } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { BloodGroup } from '../types';
import { checkEligibility, DONOR_CAN_DONATE_TO, RECIPIENT_CAN_RECEIVE_FROM } from '../utils/bloodLogic';
import {
  Users,
  CheckCircle,
  AlertOctagon,
  HeartHandshake,
  Droplets,
  TrendingUp,
  BarChart3,
  Award,
} from 'lucide-react';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const AnalyticsDashboard: React.FC = () => {
  const { stats, donors, requestHistory, donations } = useBloodApp();

  // Calculate blood group distribution
  const bloodGroupCounts = useMemo(() => {
    const counts: Record<BloodGroup, number> = {
      'O-': 0,
      'O+': 0,
      'A-': 0,
      'A+': 0,
      'B-': 0,
      'B+': 0,
      'AB-': 0,
      'AB+': 0,
    };

    donors.forEach((d) => {
      if (counts[d.bloodGroup] !== undefined) {
        counts[d.bloodGroup]++;
      }
    });

    return counts;
  }, [donors]);

  // Max count for chart scaling
  const maxGroupCount = useMemo(() => {
    const values = Object.values(bloodGroupCounts);
    return Math.max(...values, 4);
  }, [bloodGroupCounts]);

  // Eligibility breakdown
  const eligibilityBreakdown = useMemo(() => {
    let eligible = 0;
    let waiting = 0;
    donors.forEach((d) => {
      const res = checkEligibility(d.lastDonationDate);
      if (res.isEligible) eligible++;
      else waiting++;
    });
    return { eligible, waiting };
  }, [donors]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Donors</span>
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
            {stats.registeredDonors}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Voluntary roster</div>
        </div>

        <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold">Eligible Donors</span>
            <CheckCircle className="w-4 h-4 text-[#12805a]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#12805a]">
            {stats.eligibleRightNow}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">Ready for alerts</div>
        </div>

        <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold">Emergency Requests</span>
            <AlertOctagon className="w-4 h-4 text-[#b32a3f]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#b32a3f]">
            {stats.requestsRaised}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Raised by hospitals</div>
        </div>

        <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-semibold">Requests Fulfilled</span>
            <HeartHandshake className="w-4 h-4 text-[#2563a8]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#2563a8]">
            {stats.requestsFulfilled}
          </div>
          <div className="text-[11px] text-blue-600/80 mt-0.5">Successfully matched</div>
        </div>

        <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold">Donations Recorded</span>
            <Award className="w-4 h-4 text-[#a8650f]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#a8650f]">
            {stats.donationsRecorded}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">Units transferred</div>
        </div>
      </div>

      {/* Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Blood Group Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#b32a3f]" />
                Blood Group Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Live census across all 8 ABO / Rh blood classifications.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
              N = {donors.length} Donors
            </span>
          </div>

          {/* Responsive SVG Bar Chart */}
          <div className="space-y-3 pt-2">
            {ALL_BLOOD_GROUPS.map((bg) => {
              const count = bloodGroupCounts[bg] || 0;
              const percentage = donors.length > 0 ? Math.round((count / donors.length) * 100) : 0;
              const widthRatio = (count / maxGroupCount) * 100;

              return (
                <div key={bg} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-6 text-left">{bg}</span>
                      {bg === 'O-' && (
                        <span className="text-[10px] text-rose-600 font-sans font-semibold">
                          (Universal Donor)
                        </span>
                      )}
                      {bg === 'AB+' && (
                        <span className="text-[10px] text-blue-600 font-sans font-semibold">
                          (Universal Recipient)
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-600">
                      <strong>{count}</strong> ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.max(widthRatio, 2)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        count > 0
                          ? bg.startsWith('O')
                            ? 'bg-[#b32a3f]'
                            : bg.startsWith('A')
                            ? 'bg-[#2563a8]'
                            : bg.startsWith('B')
                            ? 'bg-[#12805a]'
                            : 'bg-purple-700'
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eligibility Breakdown & Transfusion Matrix Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          {/* Eligibility 90-Day Ring/Status */}
          <div className="bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              90-Day Clinical Eligibility Ratio
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Rest interval status required before next whole blood draw.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-900">Eligible Donors</div>
                  <div className="text-[11px] text-emerald-700">&gt; 90 days or first-time</div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-[#12805a]">
                  {eligibilityBreakdown.eligible}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">Rest Interval (Waiting)</div>
                  <div className="text-[11px] text-amber-700">Donated within last 90 days</div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-[#a8650f]">
                  {eligibilityBreakdown.waiting}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Universal Compatibility Rule Card */}
          <div className="bg-white border border-rose-200/90 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#b32a3f]" />
              <span>Transfusion Compatibility Guide</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              O- is the universal red blood cell donor, compatible with all recipients in immediate acute trauma cases when type matching cannot wait.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div>• <strong>O-</strong> can donate to: All 8 groups</div>
              <div>• <strong>AB+</strong> can receive from: All 8 groups</div>
              <div>• <strong>Rh-</strong> can donate to Rh+ and Rh-</div>
              <div>• <strong>Rh+</strong> can ONLY donate to Rh+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Blood Group Compatibility Interactive Reference Table */}
      <div className="bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          Red Blood Cell (RBC) Compatibility Matrix
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Clinical matrix governing all matching algorithms within Smart Blood Donor Finder.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono">
                <th className="py-2.5 px-3">Recipient Group</th>
                <th className="py-2.5 px-3">Compatible Donor Groups</th>
                <th className="py-2.5 px-3">Emergency Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {ALL_BLOOD_GROUPS.map((recipient) => {
                const donorsCompatible = RECIPIENT_CAN_RECEIVE_FROM[recipient];
                return (
                  <tr key={recipient} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-bold text-[#b32a3f]">
                      {recipient}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">
                      {donorsCompatible.join(', ')}
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px] font-sans">
                      {recipient === 'AB+'
                        ? 'Universal Recipient'
                        : recipient === 'O-'
                        ? 'Strict constraint: only O- can be infused'
                        : `${donorsCompatible.length} donor categories compatible`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
