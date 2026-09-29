export type BloodGroup = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type EligibilityStatus = 'eligible' | 'waiting';

export type AvailabilityStatus = 'available' | 'unavailable';

export interface Donor {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  locationName: string;
  latitude: number;
  longitude: number;
  lastDonationDate: string | null; // ISO string or null if never
  availability: AvailabilityStatus;
  weightKg?: number;
  notes?: string;
  donationCount: number;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
  phone: string;
  address?: string;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospital: Hospital;
  maxRadiusKm: number;
  urgency: 'critical' | 'high' | 'urgent';
  status: 'active' | 'matching' | 'donor_contacted' | 'fulfilled' | 'closed';
  createdAt: string;
  matchedDonorIds: string[];
  contactedDonorIds: string[];
  fulfilledAt?: string;
  notes?: string;
}

export interface MatchedDonor {
  donor: Donor;
  distanceKm: number;
  isCompatible: boolean;
  isEligible: boolean;
  daysSinceLastDonation: number | null;
  matchScore: number; // 0 to 100
  matchReason: string;
  withinRadius: boolean;
  contactStatus: 'uncontacted' | 'notified' | 'contacted' | 'fulfilled';
}

export interface NotificationItem {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  channel: 'sms' | 'whatsapp' | 'push';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'accepted' | 'declined';
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  requestId: string;
  donationDate: string;
  units: number;
}
