import React, { useState } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { BloodGroup } from '../types';
import { RECIPIENT_CAN_RECEIVE_FROM } from '../utils/bloodLogic';
import { ShieldAlert, MapPin, Droplets, User, Sliders, CheckCircle2, Info } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const EmergencyRequestForm: React.FC = () => {
  const { hospitals, createEmergencyRequest, setActiveTab } = useBloodApp();

  const [patientName, setPatientName] = useState('Rahul Singh');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalId, setHospitalId] = useState<string>('hosp-1');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(20);
  const [notes, setNotes] = useState('Emergency surgery trauma unit. Immediate red blood cell concentrate required.');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const compatibleDonorGroups = RECIPIENT_CAN_RECEIVE_FROM[bloodGroup] || [];
  const selectedHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.patientName = 'Patient name is required.';
    }
    if (unitsNeeded < 1) {
      newErrors.unitsNeeded = 'At least 1 unit is required.';
    }
    if (maxRadiusKm < 1) {
      newErrors.maxRadiusKm = 'Search radius must be at least 1 km.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      createEmergencyRequest({
        patientName,
        bloodGroup,
        unitsNeeded,
        hospitalId,
        maxRadiusKm,
        notes,
      });
      setSubmitting(false);
      setActiveTab('matching-radar');
    }, 400);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#b32a3f] to-[#931f32] text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-rose-200 font-semibold">
                Urgent Hospital Submission
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Raise Emergency Request
              </h2>
            </div>
          </div>
          <p className="mt-2 text-rose-100 text-sm sm:text-base leading-relaxed">
            This simulates a hospital submitting an urgent need. Initiating this form triggers
            instant compatibility verification, 90-day rest validation, and Haversine proximity calculations.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rahul Singh"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b32a3f] transition-all"
                  required
                />
              </div>
              {errors.patientName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.patientName}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Required Blood Group <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b32a3f]">
                  <Droplets className="w-4 h-4" />
                </div>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b32a3f] transition-all cursor-pointer"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Units Needed */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Units Needed (Pints / 450ml) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b32a3f] transition-all"
                required
              />
              {errors.unitsNeeded && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.unitsNeeded}</p>
              )}
            </div>

            {/* Hospital / Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hospital / Request Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b32a3f] transition-all cursor-pointer"
                >
                  {hospitals.map((hosp) => (
                    <option key={hosp.id} value={hosp.id}>
                      {hosp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-1 text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <span>GPS:</span>
                <span>
                  {selectedHospital.latitude.toFixed(4)}, {selectedHospital.longitude.toFixed(4)}
                </span>
                <span className="text-slate-400">({selectedHospital.area})</span>
              </div>
            </div>
          </div>

          {/* Maximum Search Radius Slider */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Maximum Search Radius
                </label>
              </div>
              <span className="text-sm font-extrabold font-mono text-[#b32a3f] bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                {maxRadiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#b32a3f]"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>1 km (Immediate vicinity)</span>
              <span>20 km (Default NCR)</span>
              <span>50 km (Extended radius)</span>
            </div>
          </div>

          {/* Compatibility Preview Box */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#b32a3f] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">
                  RBC Transfusion Rule for Patient ({bloodGroup}):
                </div>
                <div>
                  This patient can safely receive red blood cells from:{' '}
                  <span className="font-bold text-[#b32a3f]">
                    {compatibleDonorGroups.join(', ')}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {bloodGroup === 'AB+'
                    ? 'AB+ is the Universal Recipient and can receive from all groups.'
                    : bloodGroup === 'O-'
                    ? 'O- patients can ONLY receive from O- donors.'
                    : 'System will prioritize exact matches, then universal/compatible matches.'}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Clinical Context / Urgency Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. ICU Bed 4, surgery in 30 mins, Crossmatch sample ready."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#b32a3f]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-base font-bold text-white bg-[#b32a3f] hover:bg-[#972234] disabled:bg-slate-400 rounded-xl shadow-lg shadow-rose-900/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>{submitting ? 'Calculating Proximity Matches...' : '🚨 Send Emergency Alert'}</span>
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Broadcasts immediate matching search across registered donors within {maxRadiusKm} km.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
