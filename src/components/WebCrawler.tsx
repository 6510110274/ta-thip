import React, { useState } from 'react';
import { Globe, Search, PlayCircle, PauseCircle, AlertTriangle, CheckCircle, Plus, FolderOpen } from 'lucide-react';

interface CrawlResult {
  id: string;
  url: string;
  title: string;
  keywords: string[];
  status: 'safe' | 'suspicious' | 'flagged';
  lastCrawled: string;
  screenshot?: string;
}

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteData: CrawlResult | null;
  onCreateCase: (caseData: any) => void;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose, websiteData, onCreateCase }) => {
  const [caseData, setCaseData] = useState({
    title: '',
    description: '',
    category: 'gambling' as const,
    priority: 'high' as const
  });

  React.useEffect(() => {
    if (websiteData) {
      setCaseData({
        title: `เว็บไซต์ต้องสงสัย: ${websiteData.url}`,
        description: `ตรวจพบเว็บไซต์ "${websiteData.title}" ที่มีคำสำคัญต้องสงสัย: ${websiteData.keywords.join(', ')}`,
        category: 'gambling',
        priority: websiteData.status === 'flagged' ? 'high' : 'medium'
      });
    }
  }, [websiteData]);

  const handleSubmit = () => {
    onCreateCase(caseData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">สร้างคดีสืบสวนใหม่</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อคดี</label>
            <input
              type="text"
              value={caseData.title}
              onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ประเภทคดี</label>
            <select
              value={caseData.category}
              onChange={(e) => setCaseData({ ...caseData, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="gambling">การพนันออนไลน์</option>
              <option value="fraud">การหลอกลวง</option>
              <option value="cybercrime">อาชญากรรมไซเบอร์</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ระดับความสำคัญ</label>
            <select
              value={caseData.priority}
              onChange={(e) => setCaseData({ ...caseData, priority: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="low">ต่ำ</option>
              <option value="medium">กลาง</option>
              <option value="high">สูง</option>
              <option value="critical">วิกฤต</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">รายละเอียด</label>
            <textarea
              value={caseData.description}
              onChange={(e) => setCaseData({ ...caseData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            สร้างคดี
          </button>
        </div>
      </div>
    </div>
  );
};

const WebCrawler: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [keywords] = useState(['แทงบอล', 'บาคาร่า', 'คาสิโน', 'พนันออนไลน์', 'เดิมพัน']);
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<CrawlResult | null>(null);
  
  const [results, setResults] = useState<CrawlResult[]>([
    {
      id: '1',
      url: 'https://suspicious-betting.com',
      title: 'เว็บแทงบอลออนไลน์ - รับโปรโมชั่นพิเศษ',
      keywords: ['แทงบอล', 'เดิมพัน', 'บาคาร่า'],
      status: 'flagged',
      lastCrawled: '2024-01-16 10:30:00',
    },
    {
      id: '2',
      url: 'https://news-sports.com',
      title: 'ข่าวกีฬาวันนี้ - ผลบอลล่าสุด',
      keywords: ['ข่าวกีฬา', 'ผลบอล'],
      status: 'safe',
      lastCrawled: '2024-01-16 09:15:00',
    },
    {
      id: '3',
      url: 'https://casino-online.net',
      title: 'คาสิโนออนไลน์ อันดับ 1 ในไทย',
      keywords: ['คาสิโน', 'บาคาร่า', 'พนันออนไลน์'],
      status: 'flagged',
      lastCrawled: '2024-01-16 08:45:00',
    }
  ]);

  const toggleCrawler = () => {
    setIsRunning(!isRunning);
  };

  const addUrl = () => {
    if (targetUrl.trim()) {
      console.log('Adding URL to crawler:', targetUrl);
      setTargetUrl('');
    }
  };

  const handleCreateCase = (website: CrawlResult) => {
    setSelectedWebsite(website);
    setShowCreateCaseModal(true);
  };

  const onCreateCase = (caseData: any) => {
    console.log('Creating case:', caseData);
    // Here you would typically call an API to create the case
    alert(`สร้างคดี "${caseData.title}" เรียบร้อยแล้ว`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 bg-green-900';
      case 'suspicious': return 'text-orange-400 bg-orange-900';
      case 'flagged': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      case 'suspicious': return <AlertTriangle className="w-4 h-4" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Web Crawler</h1>
            <p className="text-gray-300 mt-1">ระบบตรวจสอบเว็บไซต์ต้องสงสัยอัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">ควบคุมระบบ</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-300">
              {isRunning ? 'กำลังทำงาน' : 'หยุดทำงาน'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crawler Control */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                เพิ่ม URL เป้าหมาย
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  onClick={addUrl}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 transition-colors"
                >
                  เพิ่ม
                </button>
              </div>
            </div>

            <button
              onClick={toggleCrawler}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                isRunning
                  ? 'bg-red-700 hover:bg-red-600 text-white'
                  : 'bg-green-700 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>หยุดการทำงาน</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>เริ่มการทำงาน</span>
                </>
              )}
            </button>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              คำสำคัญที่ตรวจสอบ
            </label>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-cyan-900 text-cyan-300 rounded-full text-sm border border-cyan-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">ผลการตรวจสอบ</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา URL..."
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow bg-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white">{result.title}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span>
                        {result.status === 'safe' ? 'ปกติ' : 
                         result.status === 'suspicious' ? 'น่าสงสัย' : 'ต้องสงสัย'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{result.url}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-600 text-gray-300 rounded text-xs border border-slate-500"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    ตรวจสอบล่าสุด: {result.lastCrawled}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-700 text-blue-200 rounded text-sm hover:bg-blue-600 transition-colors">
                    ดูรายละเอียด
                  </button>
                  {(result.status === 'flagged' || result.status === 'suspicious') && (
                    <>
                      <button
                        onClick={() => handleCreateCase(result)}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-700 text-purple-200 rounded text-sm hover:bg-purple-600 transition-colors"
                      >
                        <FolderOpen className="w-3 h-3" />
                        <span>สร้างคดี</span>
                      </button>
                      <button className="px-3 py-1 bg-red-700 text-red-200 rounded text-sm hover:bg-red-600 transition-colors">
                        เพิ่มใน Watchlist
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={showCreateCaseModal}
        onClose={() => setShowCreateCaseModal(false)}
        websiteData={selectedWebsite}
        onCreateCase={onCreateCase}
      />
    </div>
  );
};

export default WebCrawler;