import { BloodGroup, Donor, Hospital, MatchedDonor } from '../types';

/**
 * Red Blood Cell (RBC) Compatibility Rules:
 * Donor blood group -> Array of recipient blood groups they can safely donate to
 */
export const DONOR_CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal RBC donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'], // Universal RBC recipient, can only donate to AB+
};

/**
 * Recipient blood group -> Array of compatible donor blood groups they can safely receive from
 */
export const RECIPIENT_CAN_RECEIVE_FROM: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal recipient
};

/**
 * Check if a donor's blood group is compatible with a recipient's blood group
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowedRecipients = DONOR_CAN_DONATE_TO[donorGroup] || [];
  return allowedRecipients.includes(recipientGroup);
}

/**
 * Check donor eligibility based on the 90-day donation interval rule
 */
export function checkEligibility(lastDonationDate: string | null): {
  isEligible: boolean;
  daysSinceLastDonation: number | null;
  daysRemaining: number;
} {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysSinceLastDonation: null,
      daysRemaining: 0,
    };
  }

  const lastDate = new Date(lastDonationDate);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysSince >= 90) {
    return {
      isEligible: true,
      daysSinceLastDonation: daysSince,
      daysRemaining: 0,
    };
  } else {
    return {
      isEligible: false,
      daysSinceLastDonation: daysSince,
      daysRemaining: Math.max(1, 90 - daysSince),
    };
  }
}

/**
 * Haversine Formula for geographic distance (in kilometers)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Calculate transparent matching score (0-100%)
 */
export function calculateMatchScore(
  donor: Donor,
  recipientGroup: BloodGroup,
  distanceKm: number,
  maxRadiusKm: number,
  isCompatible: boolean,
  isEligible: boolean
): { score: number; reason: string } {
  if (!isCompatible) {
    return {
      score: 0,
      reason: `Incompatible blood group (${donor.bloodGroup} cannot donate to ${recipientGroup})`,
    };
  }

  if (!isEligible) {
    return {
      score: 0,
      reason: `Unavailable — 90-day donation interval not completed`,
    };
  }

  if (distanceKm > maxRadiusKm) {
    return {
      score: 0,
      reason: `Outside requested radius (${distanceKm} km > ${maxRadiusKm} km)`,
    };
  }

  // Base score for being compatible and eligible
  let score = 70;

  // Exact blood match bonus vs compatible match
  const isExact = donor.bloodGroup === recipientGroup;
  if (isExact) {
    score += 12; // E.g. O+ to O+ is prioritized
  } else {
    score += 6; // E.g. O- universal to O+
  }

  // Proximity scoring: linear decay from 0 km to maxRadiusKm
  const distanceRatio = Math.max(0, Math.min(1, distanceKm / maxRadiusKm));
  const proximityBonus = Math.round((1 - distanceRatio) * 15);
  score += proximityBonus;

  // Availability bonus
  if (donor.availability === 'available') {
    score += 3;
  } else {
    score -= 20;
  }

  // Clamp score between 65 and 99 for valid matches
  score = Math.max(60, Math.min(99, score));

  // Construct clear reason
  const reason = `${isExact ? 'Exact blood match' : 'Compatible group'} · ${distanceKm} km away`;

  return { score, reason };
}

/**
 * Find and rank matching donors for an emergency request
 */
export function matchDonorsForRequest(
  donors: Donor[],
  hospital: Hospital,
  recipientGroup: BloodGroup,
  maxRadiusKm: number
): MatchedDonor[] {
  const matches: MatchedDonor[] = [];

  for (const donor of donors) {
    const isCompatible = isBloodCompatible(donor.bloodGroup, recipientGroup);
    const { isEligible, daysSinceLastDonation } = checkEligibility(donor.lastDonationDate);
    const distanceKm = calculateHaversineDistance(
      hospital.latitude,
      hospital.longitude,
      donor.latitude,
      donor.longitude
    );
    const withinRadius = distanceKm <= maxRadiusKm;
    const { score, reason } = calculateMatchScore(
      donor,
      recipientGroup,
      distanceKm,
      maxRadiusKm,
      isCompatible,
      isEligible
    );

    matches.push({
      donor,
      distanceKm,
      isCompatible,
      isEligible,
      daysSinceLastDonation,
      matchScore: score,
      matchReason: reason,
      withinRadius,
      contactStatus: 'uncontacted',
    });
  }

  // Filter and sort:
  // Primary criteria: Eligible AND Compatible AND within Radius
  // Then sorted by matchScore descending (which combines exactness and proximity)
  return matches.sort((a, b) => {
    // Both eligible and compatible first
    const aValid = a.isCompatible && a.isEligible && a.withinRadius;
    const bValid = b.isCompatible && b.isEligible && b.withinRadius;

    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;

    if (aValid && bValid) {
      return b.matchScore - a.matchScore;
    }

    // Secondary: distance
    return a.distanceKm - b.distanceKm;
  });
}

/**
 * Mask phone number for privacy
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  if (cleaned.length < 8) return cleaned;
  const start = cleaned.slice(0, 7);
  return `${start} •••••`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dobString: string): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
