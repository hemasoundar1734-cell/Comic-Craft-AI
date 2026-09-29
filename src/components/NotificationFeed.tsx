import React, { useState } from 'react';
import { useBloodApp } from '../context/BloodAppContext';
import { NotificationItem } from '../types';
import {
  MessageSquare,
  Phone,
  Bell,
  Clock,
  CheckCheck,
  Check,
  Building2,
  Send,
  AlertCircle,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

export const NotificationFeed: React.FC = () => {
  const { notifications, showToast, fulfillRequest } = useBloodApp();
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'sms' | 'whatsapp' | 'push'>('all');
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);

  // Keep local state in sync or allow simulating donor reply
  const items = notifications;

  const filteredItems = items.filter(
    (n) => selectedChannel === 'all' || n.channel === selectedChannel
  );

  const simulateDonorResponse = (notif: NotificationItem, responseType: 'accepted' | 'declined') => {
    if (responseType === 'accepted') {
      showToast(
        `💬 Donor ${notif.donorName} replied: "YES! On my way to ${notif.hospitalName}, ETA 25 mins."`
      );
    } else {
      showToast(`💬 Donor ${notif.donorName} replied: "Currently out of station. Please notify next donor."`);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-rose-200/90 rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Notification Feed
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simulated SMS / WhatsApp alerts to matched donors.
            </p>
          </div>

          {/* Channel selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                selectedChannel === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              All Alerts ({items.length})
            </button>
            <button
              onClick={() => setSelectedChannel('whatsapp')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedChannel === 'whatsapp'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp
            </button>
            <button
              onClick={() => setSelectedChannel('sms')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedChannel === 'sms'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              SMS
            </button>
          </div>
        </div>

        {/* Demo Simulated Notice */}
        <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100 text-[11px] text-blue-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Simulated Telephony Dispatch:</strong> This live feed shows outgoing emergency alerts routed via simulated SMS and WhatsApp gateway pipelines.
          </span>
        </div>

        {/* Feed List */}
        <div className="p-4 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-[#b32a3f] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 opacity-60" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Alerts will appear here once a request is raised.
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When an emergency broadcast is initiated, compatible nearby donors are dispatched immediate text alerts with response prompts.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredItems.map((notif) => {
                const isWhatsApp = notif.channel === 'whatsapp';
                const formattedTime = new Date(notif.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={notif.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-rose-200 hover:shadow-xs transition-all space-y-2.5"
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                            isWhatsApp ? 'bg-emerald-600' : 'bg-slate-800'
                          }`}
                        >
                          {isWhatsApp ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Phone className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            {notif.donorName}
                          </span>
                          <span className="text-xs text-slate-400 font-mono ml-2">
                            ({notif.donorPhone})
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-[#b32a3f] border border-rose-200">
                          {notif.bloodGroup}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formattedTime}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCheck className="w-3 h-3" />
                          Delivered
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                      {notif.message}
                    </div>

                    {/* Meta info & interactive simulated replies */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Origin: {notif.hospitalName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Simulate Donor Response:</span>
                        <button
                          onClick={() => simulateDonorResponse(notif, 'accepted')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold transition-colors cursor-pointer"
                        >
                          👍 Reply "Available & On Way"
                        </button>
                        <button
                          onClick={() => simulateDonorResponse(notif, 'declined')}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        >
                          "Unavailable"
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
