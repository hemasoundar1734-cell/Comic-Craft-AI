import React from 'react';
import { BloodAppProvider, useBloodApp } from './context/BloodAppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStatistics } from './components/LiveStatistics';
import { EmergencyRequestForm } from './components/EmergencyRequestForm';
import { ProximityRadar } from './components/ProximityRadar';
import { RecommendedDonors } from './components/RecommendedDonors';
import { DonorRoster } from './components/DonorRoster';
import { DonorRegistration } from './components/DonorRegistration';
import { NotificationFeed } from './components/NotificationFeed';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EmergencyRequestHistory } from './components/EmergencyRequestHistory';
import { HospitalDashboard } from './components/HospitalDashboard';
import { DonorDashboard } from './components/DonorDashboard';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { MobileStickyEmergencyButton } from './components/MobileStickyEmergencyButton';

const MainContent: React.FC = () => {
  const { activeTab, userRole, toastMessage, activeRequest } = useBloodApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf2f3] text-slate-800 pb-16 sm:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* Render role-specific dashboards if selected */}
        {userRole === 'hospital' && activeTab === 'hospital-dashboard' && <HospitalDashboard />}
        {userRole === 'donor' && activeTab === 'donor-dashboard' && <DonorDashboard />}

        {/* Overview Tab: High-Impact Connected Experience */}
        {activeTab === 'overview' && (
          <>
            <HeroSection />
            <LiveStatistics />
            {activeRequest ? (
              <>
                <ProximityRadar />
                <RecommendedDonors />
              </>
            ) : null}
            <EmergencyRequestForm />
            <DonorRoster />
            <NotificationFeed />
            <AnalyticsDashboard />
            <AboutSection />
          </>
        )}

        {/* Individual Focused Tabs */}
        {activeTab === 'emergency-request' && (
          <div className="py-4">
            <LiveStatistics />
            <EmergencyRequestForm />
            {activeRequest && (
              <>
                <ProximityRadar />
                <RecommendedDonors />
              </>
            )}
          </div>
        )}

        {activeTab === 'donor-registration' && (
          <div className="py-4">
            <DonorRegistration />
          </div>
        )}

        {activeTab === 'donor-roster' && (
          <div className="py-4">
            <LiveStatistics />
            <DonorRoster />
          </div>
        )}

        {activeTab === 'matching-radar' && (
          <div className="py-4">
            <LiveStatistics />
            <ProximityRadar />
            <RecommendedDonors />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="py-4">
            <NotificationFeed />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="py-4">
            <LiveStatistics />
            <AnalyticsDashboard />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="py-4">
            <EmergencyRequestHistory />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="py-4">
            <AboutSection />
          </div>
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} />
      <MobileStickyEmergencyButton />
    </div>
  );
};

export default function App() {
  return (
    <BloodAppProvider>
      <MainContent />
    </BloodAppProvider>
  );
}
