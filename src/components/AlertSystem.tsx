import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'resolved';
  source: string;
}

const AlertSystem: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'high',
      title: 'ตรวจพบการโอนเงินต้องสงสัย',
      message: 'พบการโอนเงินจำนวน 500,000 บาท ไปยังบัญชีที่อยู่ใน watchlist',
      timestamp: '2024-01-16 16:45:00',
      status: 'unread',
      source: 'OCR System'
    },
    {
      id: '2',
      type: 'high',
      title: 'เว็บไซต์พนันใหม่',
      message: 'ตรวจพบเว็บไซต์ที่มีคำสำคัญ "แทงบอลออนไลน์" และ "บาคาร่า"',
      timestamp: '2024-01-16 15:30:00',
      status: 'unread',
      source: 'Web Crawler'
    },
    {
      id: '3',
      type: 'medium',
      title: 'บัญชีใหม่เข้าสู่ระบบเฝ้าระวัง',
      message: 'มีการเพิ่มบัญชีใหม่เข้าสู่ watchlist โดยเจ้าหน้าที่ สมหมาย',
      timestamp: '2024-01-16 14:20:00',
      status: 'read',
      source: 'Watchlist System'
    },
    {
      id: '4',
      type: 'low',
      title: 'รายงานประจำวันพร้อมแล้ว',
      message: 'รายงานสรุปกิจกรรมประจำวันที่ 16 มกราคม 2024 พร้อมดาวน์โหลด',
      timestamp: '2024-01-16 12:00:00',
      status: 'resolved',
      source: 'Report System'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high': return 'text-red-400 bg-red-900';
      case 'medium': return 'text-orange-400 bg-orange-900';
      case 'low': return 'text-blue-400 bg-blue-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'high': return 'สูง';
      case 'medium': return 'กลาง';
      case 'low': return 'ต่ำ';
      default: return 'ไม่ทราบ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Bell className="w-4 h-4" />;
      case 'read': return <CheckCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread': return alert.status === 'unread';
      case 'high': return alert.type === 'high';
      default: return true;
    }
  });

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'read' as const } : alert
    ));
  };

  const markAsResolved = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Alert System</h1>
              <p className="text-gray-300 mt-1">ระบบแจ้งเตือนและประเมินความเสี่ยง</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">
              {alerts.filter(a => a.status === 'unread').length} การแจ้งเตือนใหม่
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300">กรองตาม:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-orange-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ทั้งหมด ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-orange-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ยังไม่อ่าน ({alerts.filter(a => a.status === 'unread').length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'high'
                  ? 'bg-orange-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ความเสี่ยงสูง ({alerts.filter(a => a.type === 'high').length})
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">รายการแจ้งเตือน</h2>
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all ${
                alert.status === 'unread' ? 'border-orange-600 bg-orange-900/20' : 'border-slate-600 hover:shadow-lg bg-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(alert.type)}`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getTypeText(alert.type)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      {getStatusIcon(alert.status)}
                      <span className="text-xs">{alert.source}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-white mb-1">{alert.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.timestamp}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {alert.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="px-3 py-1 bg-blue-700 text-blue-200 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      อ่านแล้ว
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => markAsResolved(alert.id)}
                      className="px-3 py-1 bg-green-700 text-green-200 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      แก้ไขแล้ว
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-1 bg-red-700 text-red-200 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertSystem;