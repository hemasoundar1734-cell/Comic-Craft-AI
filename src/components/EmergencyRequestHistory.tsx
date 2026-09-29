import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { EmergencyRequest } from '../types';
import { Clock, MapPin, CheckCircle, ShieldAlert, Eye, PlusCircle } from 'lucide-react';

export const EmergencyRequestHistory: React.FC = () => {
  const { requestHistory, setActiveRequestById, setActiveTab } = useBloodApp();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Emergency Request History
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#b32a3f]">
                {requestHistory.length} Raised
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete dispatch audit log for hospital emergency units.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('emergency-request')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Emergency Request</span>
          </button>
        </div>

        {/* Content */}
        {requestHistory.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#b32a3f] flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 opacity-60" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No emergency requests raised yet.</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Once an emergency alert is triggered from the request module, its matching trace, donor outreach, and fulfillment status will appear here.
            </p>
            <button
              onClick={() => setActiveTab('emergency-request')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#b32a3f] hover:bg-[#972234] rounded-lg transition-colors cursor-pointer"
            >
              Simulate First Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Hospital</th>
                  <th className="py-3 px-4">Radius</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4 text-center">Matched Donors</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requestHistory.map((req) => {
                  const formattedDate = new Date(req.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={req.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {req.patientName}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-[#b32a3f] font-bold">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {req.unitsNeeded} Pints
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="truncate max-w-[180px]">{req.hospital.name}</div>
                        <div className="text-[10px] text-slate-400">{req.hospital.area}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {req.maxRadiusKm} km
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                        {req.matchedDonorIds.length}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            req.status === 'fulfilled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'donor_contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {req.status === 'fulfilled' && <CheckCircle className="w-3 h-3" />}
                          {req.status === 'fulfilled'
                            ? 'Fulfilled'
                            : req.status === 'donor_contacted'
                            ? 'Donor Contacted'
                            : 'Active Matching'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setActiveRequestById(req.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#b32a3f] hover:text-white bg-rose-50 hover:bg-[#b32a3f] border border-rose-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Radar View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
