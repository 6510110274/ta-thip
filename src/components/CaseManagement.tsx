import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Calendar, User, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  description: string;
  category: 'cybercrime' | 'financial' | 'gambling' | 'fraud' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'closed' | 'suspended';
  createdDate: string;
  lastUpdated: string;
  assignedOfficer: string;
  evidenceCount: number;
}

const CaseManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [cases, setCases] = useState<Case[]>([
    {
      id: 'CASE-2024-001',
      title: 'เว็บไซต์พนันออนไลน์ suspicious-betting.com',
      description: 'ตรวจพบเว็บไซต์แทงบอลออนไลน์ที่มีการใช้คำสำคัญต้องสงสัย',
      category: 'gambling',
      priority: 'high',
      status: 'investigating',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-16',
      assignedOfficer: 'นายสมชาย สืบสวน',
      evidenceCount: 5
    },
    {
      id: 'CASE-2024-002',
      title: 'การโอนเงินต้องสงสัยบัญชี 123-456-7890',
      description: 'พบการโอนเงินจำนวนมากไปยังบัญชีที่อยู่ใน watchlist',
      category: 'financial',
      priority: 'critical',
      status: 'open',
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-16',
      assignedOfficer: 'นายสมหมาย ใจดี',
      evidenceCount: 12
    },
    {
      id: 'CASE-2024-003',
      title: 'คดีหลอกลวงออนไลน์ - การลงทุนปลอม',
      description: 'เว็บไซต์หลอกลวงการลงทุนที่ใช้ข้อมูลปลอม',
      category: 'fraud',
      priority: 'medium',
      status: 'closed',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-13',
      assignedOfficer: 'นางสาววิมล สุขใจ',
      evidenceCount: 8
    }
  ]);

  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    category: 'cybercrime' as Case['category'],
    priority: 'medium' as Case['priority']
  });

  const createCase = () => {
    if (!newCase.title || !newCase.description) return;

    const caseId = `CASE-2024-${String(cases.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newCaseData: Case = {
      id: caseId,
      title: newCase.title,
      description: newCase.description,
      category: newCase.category,
      priority: newCase.priority,
      status: 'open',
      createdDate: today,
      lastUpdated: today,
      assignedOfficer: 'นายสมชาย สืบสวน',
      evidenceCount: 0
    };

    setCases([newCaseData, ...cases]);
    setNewCase({ title: '', description: '', category: 'cybercrime', priority: 'medium' });
    setShowCreateForm(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cybercrime': return 'text-blue-400 bg-blue-900';
      case 'financial': return 'text-green-400 bg-green-900';
      case 'gambling': return 'text-red-400 bg-red-900';
      case 'fraud': return 'text-orange-400 bg-orange-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'cybercrime': return 'อาชญากรรมไซเบอร์';
      case 'financial': return 'อาชญากรรมทางการเงิน';
      case 'gambling': return 'การพนันออนไลน์';
      case 'fraud': return 'การหลอกลวง';
      default: return 'อื่นๆ';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-300 bg-red-900';
      case 'high': return 'text-orange-300 bg-orange-900';
      case 'medium': return 'text-yellow-300 bg-yellow-900';
      case 'low': return 'text-green-300 bg-green-900';
      default: return 'text-gray-300 bg-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'วิกฤต';
      case 'high': return 'สูง';
      case 'medium': return 'กลาง';
      case 'low': return 'ต่ำ';
      default: return 'ไม่ทราบ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'investigating': return <Search className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'เปิดคดี';
      case 'investigating': return 'กำลังสืบสวน';
      case 'closed': return 'ปิดคดี';
      case 'suspended': return 'ระงับการสืบสวน';
      default: return 'ไม่ทราบ';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesFilter = filter === 'all' || caseItem.status === filter;
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Case Management</h1>
              <p className="text-gray-300 mt-1">ระบบจัดการคดีสืบสวน</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างคดีใหม่</span>
          </button>
        </div>
      </div>

      {/* Create Case Form */}
      {showCreateForm && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-purple-600">
          <h3 className="text-lg font-semibold text-white mb-4">สร้างคดีสืบสวนใหม่</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อคดี</label>
              <input
                type="text"
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="ระบุชื่อคดี"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ประเภทคดี</label>
              <select
                value={newCase.category}
                onChange={(e) => setNewCase({ ...newCase, category: e.target.value as Case['category'] })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="cybercrime">อาชญากรรมไซเบอร์</option>
                <option value="financial">อาชญากรรมทางการเงิน</option>
                <option value="gambling">การพนันออนไลน์</option>
                <option value="fraud">การหลอกลวง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ระดับความสำคัญ</label>
              <select
                value={newCase.priority}
                onChange={(e) => setNewCase({ ...newCase, priority: e.target.value as Case['priority'] })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="low">ต่ำ</option>
                <option value="medium">กลาง</option>
                <option value="high">สูง</option>
                <option value="critical">วิกฤต</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">รายละเอียด</label>
              <textarea
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                rows={3}
                placeholder="ระบุรายละเอียดคดี"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={createCase}
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              สร้างคดี
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ทั้งหมด ({cases.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'open'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              เปิดคดี ({cases.filter(c => c.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('investigating')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'investigating'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              กำลังสืบสวน ({cases.filter(c => c.status === 'investigating').length})
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาคดี..."
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">รายการคดี</h2>
        <div className="space-y-4">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="border border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow bg-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white">{caseItem.title}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(caseItem.category)}`}>
                      <span>{getCategoryText(caseItem.category)}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                      <span>{getPriorityText(caseItem.priority)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{caseItem.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">รหัสคดี</p>
                      <p className="font-medium text-white">{caseItem.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">เจ้าหน้าที่</p>
                      <p className="font-medium text-white">{caseItem.assignedOfficer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">สถานะ</p>
                      <div className="flex items-center space-x-1 text-white">
                        {getStatusIcon(caseItem.status)}
                        <span>{getStatusText(caseItem.status)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400">หลักฐาน</p>
                      <div className="flex items-center space-x-1 text-white">
                        <FileText className="w-4 h-4" />
                        <span>{caseItem.evidenceCount} รายการ</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>สร้าง: {caseItem.createdDate}</span>
                    </div>
                    <span>อัปเดต: {caseItem.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-1 bg-blue-700 text-blue-200 rounded text-sm hover:bg-blue-600 transition-colors">
                    ดูรายละเอียด
                  </button>
                  <button className="px-3 py-1 bg-green-700 text-green-200 rounded text-sm hover:bg-green-600 transition-colors">
                    แก้ไข
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

export default CaseManagement;