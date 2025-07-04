import React, { useState } from 'react';
import { Globe, Search, PlayCircle, PauseCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface CrawlResult {
  id: string;
  url: string;
  title: string;
  keywords: string[];
  status: 'safe' | 'suspicious' | 'flagged';
  lastCrawled: string;
  screenshot?: string;
}

const WebCrawler: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [keywords] = useState(['แทงบอล', 'บาคาร่า', 'คาสิโน', 'พนันออนไลน์', 'เดิมพัน']);
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
      // Simulate adding URL to crawler queue
      console.log('Adding URL to crawler:', targetUrl);
      setTargetUrl('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'suspicious': return 'text-orange-600 bg-orange-50';
      case 'flagged': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Web Crawler</h1>
            <p className="text-gray-600 mt-1">ระบบตรวจสอบเว็บไซต์ต้องสงสัยอัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">ควบคุมระบบ</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isRunning ? 'กำลังทำงาน' : 'หยุดทำงาน'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crawler Control */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เพิ่ม URL เป้าหมาย
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={addUrl}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  เพิ่ม
                </button>
              </div>
            </div>

            <button
              onClick={toggleCrawler}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              คำสำคัญที่ตรวจสอบ
            </label>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">ผลการตรวจสอบ</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา URL..."
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{result.title}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span>
                        {result.status === 'safe' ? 'ปกติ' : 
                         result.status === 'suspicious' ? 'น่าสงสัย' : 'ต้องสงสัย'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{result.url}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    ตรวจสอบล่าสุด: {result.lastCrawled}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors">
                    ดูรายละเอียด
                  </button>
                  {result.status === 'flagged' && (
                    <button className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm hover:bg-red-100 transition-colors">
                      เพิ่มใน Watchlist
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebCrawler;