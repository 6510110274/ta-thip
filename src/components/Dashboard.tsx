import React from 'react';
import { TrendingUp, Users, Globe, AlertTriangle, FileText, Activity, FolderOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'เว็บไซต์ที่ตรวจสอบ',
      value: '1,234',
      change: '+12%',
      icon: Globe,
      color: 'text-cyan-400',
      bg: 'bg-cyan-900'
    },
    {
      title: 'ภาพที่วิเคราะห์',
      value: '456',
      change: '+8%',
      icon: FileText,
      color: 'text-green-400',
      bg: 'bg-green-900'
    },
    {
      title: 'บัญชีต้องสงสัย',
      value: '89',
      change: '+15%',
      icon: Users,
      color: 'text-red-400',
      bg: 'bg-red-900'
    },
    {
      title: 'คดีที่เปิดสืบสวน',
      value: '23',
      change: '+5%',
      icon: FolderOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-900'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'website',
      title: 'ตรวจพบเว็บไซต์พนันออนไลน์',
      description: 'พบเว็บไซต์ที่มีคำว่า "แทงบอล" และ "บาคาร่า"',
      time: '2 นาทีที่แล้ว',
      severity: 'high'
    },
    {
      id: 2,
      type: 'slip',
      title: 'วิเคราะห์ภาพสลิปโอนเงิน',
      description: 'พบการโอนเงินไปยังบัญชีที่อยู่ใน watchlist',
      time: '15 นาทีที่แล้ว',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'case',
      title: 'เปิดคดีสืบสวนใหม่',
      description: 'สร้างคดีสืบสวนเว็บไซต์พนันออนไลน์',
      time: '1 ชั่วโมงที่แล้ว',
      severity: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300 mt-1">ภาพรวมระบบสืบสวนอาชญากรรมทางไซเบอร์</p>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">ระบบทำงานปกติ</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-slate-700">
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} rounded-lg p-3 border border-slate-600`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-gray-300 text-sm mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">กิจกรรมล่าสุด</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className={`rounded-full p-2 ${
                activity.severity === 'high' ? 'bg-red-900 text-red-400' :
                activity.severity === 'medium' ? 'bg-orange-900 text-orange-400' :
                'bg-blue-900 text-blue-400'
              }`}>
                {activity.type === 'website' && <Globe className="w-4 h-4" />}
                {activity.type === 'slip' && <FileText className="w-4 h-4" />}
                {activity.type === 'case' && <FolderOpen className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{activity.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{activity.description}</p>
                <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity.severity === 'high' ? 'bg-red-900 text-red-300' :
                activity.severity === 'medium' ? 'bg-orange-900 text-orange-300' :
                'bg-blue-900 text-blue-300'
              }`}>
                {activity.severity === 'high' ? 'สูง' : activity.severity === 'medium' ? 'กลาง' : 'ต่ำ'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;