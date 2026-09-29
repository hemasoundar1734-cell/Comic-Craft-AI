import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Donor,
  Hospital,
  EmergencyRequest,
  MatchedDonor,
  NotificationItem,
  DonationRecord,
  BloodGroup,
  AvailabilityStatus,
} from '../types';
import { INITIAL_DONORS, INITIAL_HOSPITALS } from '../data/initialData';
import {
  checkEligibility,
  matchDonorsForRequest,
  maskPhoneNumber,
} from '../utils/bloodLogic';

export type UserRole = 'hospital' | 'donor' | 'admin';

export type ActiveTab =
  | 'overview'
  | 'emergency-request'
  | 'donor-registration'
  | 'donor-roster'
  | 'matching-radar'
  | 'notifications'
  | 'analytics'
  | 'history'
  | 'about'
  | 'hospital-dashboard'
  | 'donor-dashboard';

interface BloodAppContextType {
  donors: Donor[];
  hospitals: Hospital[];
  selectedHospitalId: string;
  setSelectedHospitalId: (id: string) => void;
  activeRequest: EmergencyRequest | null;
  requestHistory: EmergencyRequest[];
  notifications: NotificationItem[];
  donations: DonationRecord[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeDonorId: string; // for donor dashboard simulation
  setActiveDonorId: (id: string) => void;
  matchedDonors: MatchedDonor[];
  stats: {
    registeredDonors: number;
    eligibleRightNow: number;
    requestsRaised: number;
    requestsFulfilled: number;
    donationsRecorded: number;
  };
  createEmergencyRequest: (data: {
    patientName: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    hospitalId: string;
    maxRadiusKm: number;
    notes?: string;
  }) => { request: EmergencyRequest; matchesCount: number };
  registerDonor: (data: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup: BloodGroup;
    phone: string;
    email: string;
    locationName: string;
    latitude?: number;
    longitude?: number;
    lastDonationDate: string | null;
    weightKg?: number;
    notes?: string;
  }) => Donor;
  notifyDonor: (
    requestId: string,
    donorId: string,
    channel: 'sms' | 'whatsapp' | 'push'
  ) => void;
  markDonorContacted: (requestId: string, donorId: string) => void;
  fulfillRequest: (requestId: string, donorId: string) => void;
  toggleDonorAvailability: (donorId: string) => void;
  setActiveRequestById: (requestId: string) => void;
  resetToInitialDemoData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const BloodAppContext = createContext<BloodAppContextType | undefined>(undefined);

const STORAGE_KEY = 'smart_blood_donor_finder_data_v1';

export const BloodAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_donors`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DONORS;
  });

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-1');

  const [requestHistory, setRequestHistory] = useState<EmergencyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeRequest`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_donations`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>('hospital');
  const [activeDonorId, setActiveDonorId] = useState<string>('donor-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_donors`, JSON.stringify(donors));
      localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requestHistory));
      localStorage.setItem(`${STORAGE_KEY}_activeRequest`, JSON.stringify(activeRequest));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_donations`, JSON.stringify(donations));
    } catch (e) {
      console.error(e);
    }
  }, [donors, requestHistory, activeRequest, notifications, donations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  // Dynamic calculations
  const stats = useMemo(() => {
    const eligibleCount = donors.filter(
      (d) => checkEligibility(d.lastDonationDate).isEligible
    ).length;
    const fulfilledCount = requestHistory.filter((r) => r.status === 'fulfilled').length;

    return {
      registeredDonors: donors.length,
      eligibleRightNow: eligibleCount,
      requestsRaised: requestHistory.length,
      requestsFulfilled: fulfilledCount,
      donationsRecorded: donations.length,
    };
  }, [donors, requestHistory, donations]);

  // Dynamic matches for active request
  const matchedDonors = useMemo(() => {
    if (!activeRequest) return [];
    const hospital =
      hospitals.find((h) => h.id === activeRequest.hospital.id) || activeRequest.hospital;
    return matchDonorsForRequest(
      donors,
      hospital,
      activeRequest.bloodGroup,
      activeRequest.maxRadiusKm
    );
  }, [activeRequest, donors, hospitals]);

  // Create Emergency Request
  const createEmergencyRequest = (data: {
    patientName: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    hospitalId: string;
    maxRadiusKm: number;
    notes?: string;
  }) => {
    const hospital =
      hospitals.find((h) => h.id === data.hospitalId) || hospitals[0];

    const reqId = `REQ-${Date.now().toString().slice(-6)}`;
    const newRequest: EmergencyRequest = {
      id: reqId,
      patientName: data.patientName.trim(),
      bloodGroup: data.bloodGroup,
      unitsNeeded: data.unitsNeeded,
      hospital,
      maxRadiusKm: data.maxRadiusKm,
      urgency: 'critical',
      status: 'active',
      createdAt: new Date().toISOString(),
      matchedDonorIds: [],
      contactedDonorIds: [],
      notes: data.notes,
    };

    // Calculate matches immediately
    const computedMatches = matchDonorsForRequest(
      donors,
      hospital,
      data.bloodGroup,
      data.maxRadiusKm
    );

    const eligibleMatches = computedMatches.filter(
      (m) => m.isCompatible && m.isEligible && m.withinRadius
    );

    newRequest.matchedDonorIds = eligibleMatches.map((m) => m.donor.id);

    // Generate simulated notifications for matched donors
    const newNotifications: NotificationItem[] = eligibleMatches.map((match) => {
      const channel: 'sms' | 'whatsapp' | 'push' =
        match.distanceKm < 5 ? 'whatsapp' : 'sms';
      return {
        id: `NOTIF-${Date.now()}-${match.donor.id.slice(-4)}`,
        requestId: reqId,
        donorId: match.donor.id,
        donorName: match.donor.fullName,
        donorPhone: maskPhoneNumber(match.donor.phone),
        bloodGroup: match.donor.bloodGroup,
        hospitalName: hospital.name,
        channel,
        message: `🚨 Emergency blood request: ${data.bloodGroup} required for patient ${data.patientName} at ${hospital.name}. You are a compatible nearby donor (${match.distanceKm} km away). Please respond if available to donate!`,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
    });

    setActiveRequest(newRequest);
    setRequestHistory((prev) => [newRequest, ...prev]);
    setNotifications((prev) => [...newNotifications, ...prev]);

    showToast(
      `🚨 Emergency alert broadcasted! ${eligibleMatches.length} compatible donor(s) located within ${data.maxRadiusKm} km.`
    );

    return {
      request: newRequest,
      matchesCount: eligibleMatches.length,
    };
  };

  // Register Donor
  const registerDonor = (data: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup: BloodGroup;
    phone: string;
    email: string;
    locationName: string;
    latitude?: number;
    longitude?: number;
    lastDonationDate: string | null;
    weightKg?: number;
    notes?: string;
  }) => {
    // Generate realistic coordinates around Delhi if not explicitly given
    const randomOffsetLat = (Math.random() - 0.5) * 0.12;
    const randomOffsetLon = (Math.random() - 0.5) * 0.12;
    const lat = data.latitude ?? 28.6300 + randomOffsetLat;
    const lon = data.longitude ?? 77.2200 + randomOffsetLon;

    const newDonor: Donor = {
      id: `donor-${Date.now().toString().slice(-5)}`,
      fullName: data.fullName.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      phone: data.phone.trim(),
      email: data.email.trim(),
      locationName: data.locationName.trim() || 'Central Delhi',
      latitude: lat,
      longitude: lon,
      lastDonationDate: data.lastDonationDate || null,
      availability: 'available',
      weightKg: data.weightKg,
      notes: data.notes,
      donationCount: data.lastDonationDate ? 1 : 0,
      createdAt: new Date().toISOString(),
    };

    setDonors((prev) => [newDonor, ...prev]);
    setActiveDonorId(newDonor.id);

    showToast(
      `✅ Registered! You've been added to the donor roster on the dashboard.`
    );

    return newDonor;
  };

  // Notify individual donor
  const notifyDonor = (
    requestId: string,
    donorId: string,
    channel: 'sms' | 'whatsapp' | 'push'
  ) => {
    const targetDonor = donors.find((d) => d.id === donorId);
    if (!targetDonor) return;

    const req = requestHistory.find((r) => r.id === requestId) || activeRequest;
    const hospitalName = req?.hospital.name || 'Emergency Center';
    const patientName = req?.patientName || 'Emergency Patient';
    const bloodGroup = req?.bloodGroup || targetDonor.bloodGroup;

    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}-${donorId.slice(-4)}`,
      requestId,
      donorId,
      donorName: targetDonor.fullName,
      donorPhone: maskPhoneNumber(targetDonor.phone),
      bloodGroup: targetDonor.bloodGroup,
      hospitalName,
      channel,
      message: `Priority Alert: Urgent ${bloodGroup} blood required at ${hospitalName} for ${patientName}. Can you report within 60 minutes? Reply YES to confirm arrival.`,
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    markDonorContacted(requestId, donorId);
    showToast(
      `📲 ${channel.toUpperCase()} dispatch sent to ${targetDonor.fullName} (${maskPhoneNumber(targetDonor.phone)})`
    );
  };

  // Mark donor contacted
  const markDonorContacted = (requestId: string, donorId: string) => {
    setRequestHistory((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updatedContacted = Array.from(new Set([...r.contactedDonorIds, donorId]));
          return {
            ...r,
            contactedDonorIds: updatedContacted,
            status: r.status === 'active' ? 'donor_contacted' : r.status,
          };
        }
        return r;
      })
    );

    if (activeRequest && activeRequest.id === requestId) {
      setActiveRequest((prev) =>
        prev
          ? {
              ...prev,
              contactedDonorIds: Array.from(new Set([...prev.contactedDonorIds, donorId])),
              status: prev.status === 'active' ? 'donor_contacted' : prev.status,
            }
          : null
      );
    }
  };

  // Fulfill request with a specific donor
  const fulfillRequest = (requestId: string, donorId: string) => {
    const targetDonor = donors.find((d) => d.id === donorId);
    const req = requestHistory.find((r) => r.id === requestId) || activeRequest;
    if (!targetDonor || !req) return;

    const todayIso = new Date().toISOString().split('T')[0];

    // 1. Update Donor's last donation date to today -> Automatically becomes 'waiting' for 90 days!
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? {
              ...d,
              lastDonationDate: todayIso,
              donationCount: d.donationCount + 1,
            }
          : d
      )
    );

    // 2. Mark request fulfilled
    const updatedRequest: EmergencyRequest = {
      ...req,
      status: 'fulfilled',
      fulfilledAt: new Date().toISOString(),
    };

    setRequestHistory((prev) =>
      prev.map((r) => (r.id === requestId ? updatedRequest : r))
    );

    if (activeRequest && activeRequest.id === requestId) {
      setActiveRequest(updatedRequest);
    }

    // 3. Add to donation history record
    const newDonation: DonationRecord = {
      id: `DON-${Date.now().toString().slice(-6)}`,
      donorId: targetDonor.id,
      donorName: targetDonor.fullName,
      bloodGroup: targetDonor.bloodGroup,
      hospitalName: req.hospital.name,
      requestId: req.id,
      donationDate: todayIso,
      units: req.unitsNeeded,
    };
    setDonations((prev) => [newDonation, ...prev]);

    // 4. Send thank you notification
    const thankYouNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}-THX`,
      requestId,
      donorId,
      donorName: targetDonor.fullName,
      donorPhone: maskPhoneNumber(targetDonor.phone),
      bloodGroup: targetDonor.bloodGroup,
      hospitalName: req.hospital.name,
      channel: 'sms',
      message: `❤️ Donation recorded: Thank you ${targetDonor.fullName}! Your blood donation at ${req.hospital.name} saved a life today. Next eligible donation in 90 days.`,
      timestamp: new Date().toISOString(),
      status: 'accepted',
    };
    setNotifications((prev) => [thankYouNotif, ...prev]);

    showToast(
      `🎉 Request ${requestId} fulfilled! Life-saving donation recorded for ${targetDonor.fullName}.`
    );
  };

  // Toggle donor availability
  const toggleDonorAvailability = (donorId: string) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const nextState: AvailabilityStatus =
            d.availability === 'available' ? 'unavailable' : 'available';
          showToast(
            `${d.fullName} availability set to ${
              nextState === 'available' ? 'Available' : 'Temporarily Unavailable'
            }`
          );
          return { ...d, availability: nextState };
        }
        return d;
      })
    );
  };

  const setActiveRequestById = (requestId: string) => {
    const found = requestHistory.find((r) => r.id === requestId);
    if (found) {
      setActiveRequest(found);
      setActiveTab('matching-radar');
    }
  };

  const resetToInitialDemoData = () => {
    setDonors(INITIAL_DONORS);
    setRequestHistory([]);
    setActiveRequest(null);
    setNotifications([]);
    setDonations([]);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_donors`);
      localStorage.removeItem(`${STORAGE_KEY}_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_activeRequest`);
      localStorage.removeItem(`${STORAGE_KEY}_notifications`);
      localStorage.removeItem(`${STORAGE_KEY}_donations`);
    } catch (e) {
      console.error(e);
    }
    showToast('Demo dataset reset to initial state (7 donors, 4 eligible right now).');
  };

  return (
    <BloodAppContext.Provider
      value={{
        donors,
        hospitals,
        selectedHospitalId,
        setSelectedHospitalId,
        activeRequest,
        requestHistory,
        notifications,
        donations,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        activeDonorId,
        setActiveDonorId,
        matchedDonors,
        stats,
        createEmergencyRequest,
        registerDonor,
        notifyDonor,
        markDonorContacted,
        fulfillRequest,
        toggleDonorAvailability,
        setActiveRequestById,
        resetToInitialDemoData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </BloodAppContext.Provider>
  );
};

export const useBloodApp = () => {
  const context = useContext(BloodAppContext);
  if (!context) {
    throw new Error('useBloodApp must be used within a BloodAppProvider');
  }
  return context;
};
