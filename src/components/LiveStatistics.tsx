import React from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { Users, CheckCircle, AlertOctagon, HeartHandshake, Award } from 'lucide-react';

export const LiveStatistics: React.FC = () => {
  const { stats, setActiveTab } = useBloodApp();

  const statCards = [
    {
      label: 'Registered Donors',
      value: stats.registeredDonors,
      subtext: 'Verified voluntary network',
      icon: Users,
      color: 'text-slate-800',
      bgColor: 'bg-white',
      borderColor: 'border-slate-200',
      actionTab: 'donor-roster' as const,
    },
    {
      label: 'Eligible Right Now',
      value: stats.eligibleRightNow,
      subtext: 'Passed 90-day rest rule',
      icon: CheckCircle,
      color: 'text-[#12805a]',
      bgColor: 'bg-white',
      borderColor: 'border-emerald-200',
      actionTab: 'donor-roster' as const,
    },
    {
      label: 'Requests Raised',
      value: stats.requestsRaised,
      subtext: 'Emergency alerts triggered',
      icon: AlertOctagon,
      color: 'text-[#b32a3f]',
      bgColor: 'bg-white',
      borderColor: 'border-rose-200',
      actionTab: 'emergency-request' as const,
    },
    {
      label: 'Requests Fulfilled',
      value: stats.requestsFulfilled,
      subtext: `${stats.donationsRecorded} units dispatched`,
      icon: HeartHandshake,
      color: 'text-[#2563a8]',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      actionTab: 'analytics' as const,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => setActiveTab(card.actionTab)}
              className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div
                  className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${card.color}`}
                >
                  {card.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
