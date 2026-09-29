import React, { useState, useMemo } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { BloodGroup } from '../types';
import { checkEligibility, calculateAge } from '../utils/bloodLogic';
import {
  HeartHandshake,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  Shield,
  Info,
  Sparkles,
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const DonorRegistration: React.FC = () => {
  const { registerDonor, setActiveTab } = useBloodApp();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1997-06-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('+91 98110 54321');
  const [email, setEmail] = useState('donor@example.com');
  const [locationName, setLocationName] = useState('Green Park, New Delhi');
  const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number>(65);
  const [notes, setNotes] = useState('Healthy volunteer, readily available for Delhi emergency units.');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live age calculation
  const calculatedAge = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);

  // Live eligibility evaluation
  const eligibilityPreview = useMemo(() => {
    if (!hasDonatedBefore || !lastDonationDate) {
      return { isEligible: true, daysSince: null, daysRemaining: 0 };
    }
    const res = checkEligibility(lastDonationDate);
    return {
      isEligible: res.isEligible,
      daysSince: res.daysSinceLastDonation,
      daysRemaining: res.daysRemaining,
    };
  }, [hasDonatedBefore, lastDonationDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!locationName.trim()) newErrors.locationName = 'Location area is required.';
    if (calculatedAge === null || calculatedAge < 18 || calculatedAge > 65) {
      newErrors.dateOfBirth = 'Blood donors must be between 18 and 65 years old.';
    }
    if (weightKg < 45) {
      newErrors.weightKg = 'Minimum donor weight is 45 kg (recommended 50 kg).';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must confirm voluntary consent for emergency dispatch.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      registerDonor({
        fullName,
        dateOfBirth,
        gender,
        bloodGroup,
        phone,
        email,
        locationName,
        lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
        weightKg,
        notes,
      });

      setSubmitting(false);
      setActiveTab('donor-roster');
    }, 450);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 font-semibold">
                DONOR REGISTRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Join the donor network
              </h2>
            </div>
          </div>
          <p className="mt-2 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            “Registered details are only shared with a hospital when there is an active matching
            emergency request nearby.”
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvi Deshmukh"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Blood Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth & Live Age */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                {calculatedAge !== null && (
                  <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Age: {calculatedAge} yrs {calculatedAge >= 18 && calculatedAge <= 65 ? '✓ Eligible' : '✕ Out of range'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-rose-600">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number (Encrypted) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donor@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            {/* Location Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location Area / Locality <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Rohini Sector 14, Delhi"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
              {errors.locationName && (
                <p className="mt-1 text-xs text-rose-600">{errors.locationName}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Body Weight (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="45"
                max="150"
                value={weightKg}
                onChange={(e) => setWeightKg(parseInt(e.target.value) || 50)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                required
              />
              {errors.weightKg && (
                <p className="mt-1 text-xs text-rose-600">{errors.weightKg}</p>
              )}
            </div>
          </div>

          {/* 90-Day Donation Interval Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Prior Blood Donation History
              </span>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDonatedBefore}
                  onChange={(e) => setHasDonatedBefore(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <span>I have donated blood previously</span>
              </label>
            </div>

            {hasDonatedBefore && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Donation Date
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            )}

            {/* Live 90-day status preview */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                eligibilityPreview.isEligible
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {eligibilityPreview.isEligible ? (
                  <CheckCircle className="w-4 h-4 text-[#12805a]" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-xs font-semibold">
                  Initial Status Preview: {eligibilityPreview.isEligible ? 'Eligible' : 'Waiting'}
                </span>
              </div>
              <span className="text-xs font-mono">
                {eligibilityPreview.isEligible
                  ? 'Ready for emergency alerts'
                  : `${eligibilityPreview.daysRemaining} days remaining in 90-day rest rule`}
              </span>
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Medical Notes / Availability (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Free after 5 PM on weekdays. Available in South Delhi."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Privacy & Consent */}
          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Emergency Privacy Guarantee</span>
            </div>
            <p>
              Donor information is used only for active matching and emergency coordination. Your
              phone number is never published openly.
            </p>
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
              />
              <span className="text-[11px] text-slate-700 font-medium">
                I volunteer as a blood donor and agree to receive emergency alerts for compatible hospital requests.
              </span>
            </label>
            {errors.terms && <p className="text-xs text-rose-600">{errors.terms}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-base font-bold text-white bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-400 rounded-xl shadow-lg shadow-emerald-950/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span>{submitting ? 'Registering...' : 'Register as Blood Donor'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
