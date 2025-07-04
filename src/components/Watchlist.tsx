import React, { useState } from 'react';
import { Eye, Plus, Search, AlertTriangle, Globe, User } from 'lucide-react';

interface WatchlistItem {
  id: string;
  type: 'account' | 'website';
  name: string;
  details: string;
  status: 'active' | 'flagged' | 'investigated';
  addedDate: string;
  lastActivity?: string;
}

const Watchlist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'websites'>('accounts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const watchlistItems: WatchlistItem[] = [
    {
      id: '1',
      type: 'account',
      name: 'นายจารุวิทย์ ลาภใหญ่',
      details: '123-456-7890 (ธนาคารกสิกรไทย)',
      status: 'flagged',
      addedDate: '2024-01-15',
      lastActivity: '2024-01-16 16:45'
    },
    {
      id: '2',
      type: 'website',
      name: 'suspicious-betting.com',
      details: 'เว็บแทงบอลออนไลน์ - พบคำสำคัญต้องสงสัย',
      status: 'active',
      addedDate: '2024-01-14',
      lastActivity: '2024-01-16 10:30'
    },
    {
      id: '3',
      type: 'account',
      name: 'นายสมชาย ใจดี',
      details: '987-654-3210 (ธนาคารไทยพาณิชย์)',
      status: 'investigated',
      addedDate: '2024-01-13',
      lastActivity: '2024-01-15 14:20'
    }
  ];

  const filteredItems = watchlistItems.filter(item => 
    (activeTab === 'accounts' ? item.type === 'account' : item.type === 'website') &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-900';
      case 'flagged': return 'text-red-400 bg-red-900';
      case 'investigated': return 'text-gray-400 bg-gray-800';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'กำลังเฝ้าระวัง';
      case 'flagged': return 'พบความเสี่ยง';
      case 'investigated': return 'สอบสวนแล้ว';
      default: return 'ไม่ทราบ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Watchlist</h1>
              <p className="text-gray-300 mt-1">ระบบเฝ้าระวังบัญชีและเว็บไซต์ต้องสงสัย</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มรายการ</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-red-600">
          <h3 className="text-lg font-semibold text-white mb-4">เพิ่มรายการเฝ้าระวังใหม่</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ประเภท</label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-white">
                <option value="account">บัญชีธนาคาร</option>
                <option value="website">เว็บไซต์</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อ/URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="ระบุชื่อหรือ URL"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">รายละเอียด</label>
              <textarea
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                rows={3}
                placeholder="ระบุรายละเอียดเพิ่มเติม"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors">
              เพิ่มรายการ
            </button>
          </div>
        </div>
      )}

      {/* Tabs and Search */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'accounts'
                  ? 'bg-red-700 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              บัญชีธนาคาร
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'websites'
                  ? 'bg-red-700 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              เว็บไซต์
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารายการ..."
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="border border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow bg-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {item.type === 'account' ? (
                      <User className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status === 'flagged' && <AlertTriangle className="w-3 h-3" />}
                        <span>{getStatusText(item.status)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{item.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>เพิ่มเมื่อ: {item.addedDate}</span>
                      {item.lastActivity && (
                        <span>กิจกรรมล่าสุด: {item.lastActivity}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-700 text-blue-200 rounded text-sm hover:bg-blue-600 transition-colors">
                    ดูประวัติ
                  </button>
                  <button className="px-3 py-1 bg-red-700 text-red-200 rounded text-sm hover:bg-red-600 transition-colors">
                    ลบ
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

export default Watchlist;