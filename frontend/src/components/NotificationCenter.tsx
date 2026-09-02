import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Clock, Mail, MessageSquare, Smartphone, Check } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = () => {
    fetch('http://localhost:8080/api/v1/notifications?userId=CITIZEN-001')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = (id: string) => {
    fetch(`http://localhost:8080/api/v1/notifications/${id}/read`, { method: 'POST' })
      .then(() => fetchNotifications())
      .catch(() => {});
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 font-sans shadow-sm text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wide">Multi-Channel Citizen Alerts</div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-755" />
            <span>Notification & Updates Center</span>
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500 font-semibold">{notifications.length} Messages</span>
      </div>

      <div className="space-y-3 text-xs font-semibold">
        {notifications.map((n: any, idx: number) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-slate-700 shadow-sm font-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <span className="font-extrabold text-slate-900 text-sm">{n.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  n.channel === 'IN_APP' ? 'bg-emerald-50 text-emerald-805 border-emerald-200' :
                  'bg-amber-50 text-amber-805 border-amber-200'
                }`}>
                  {n.channel} ({n.deliveryStatus})
                </span>
              </div>

              {!n.readAt && (
                <button
                  onClick={() => handleMarkRead(n.notificationId)}
                  className="text-slate-500 hover:text-emerald-700 text-[11px] flex items-center gap-1 font-bold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>

            <p className="text-slate-655 text-xs leading-relaxed">{n.message}</p>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Type: {n.notificationType} | Case: {n.caseId}</span>
              <span>{n.createdAt?.substring(11, 19) || 'Just Now'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
