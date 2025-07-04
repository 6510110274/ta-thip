import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, BarChart3, TrendingUp } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'custom';
  date: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
  description: string;
}

const Reports: React.FC = () => {
  const [selectedDateFrom, setSelectedDateFrom] = useState('2024-01-01');
  const [selectedDateTo, setSelectedDateTo] = useState('2024-01-16');
  const [reportType, setReportType] = useState('summary');

  const reports: Report[] = [
    {
      id: '1',
      title: 'รายงานสรุปประจำวัน 16 มกราคม 2024',
      type: 'daily',
      date: '2024-01-16',
      status: 'ready',
      size: '2.3 MB',
      description: 'สรุปกิจกรรมการตรวจสอบเว็บไซต์และภาพ'
    },
    {
      id: '2',
      title: 'รายงานสรุปประจำสัปดาห์ 8-14 มกราคม 2024',
      type: 'weekly',
      date: '2024-01-14',
      status: 'ready',
      size: '5.7 MB',
      description: 'สรุปสถิติและแนวโน้มการพบเว็บไซต์ต้องสงสัย'
    },
    {
      id: '3',
      title: 'รายงานวิเคราะห์บัญชีต้องสงสัย',
      type: 'custom',
      date: '2024-01-15',
      status: 'generating',
      size: '--',
      description: 'รายงานการวิเคราะห์รูปแบบการโอนเงินที่ต้องสงสัย'
    }
  ];

  const generateReport = () => {
    console.log('Generating report...', {
      type: reportType,
      from: selectedDateFrom,
      to: selectedDateTo
    });
  };

  const downloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-900';
      case 'generating': return 'text-orange-400 bg-orange-900';
      case 'error': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'พร้อมดาวน์โหลด';
      case 'generating': return 'กำลังสร้าง';
      case 'error': return 'เกิดข้อผิดพลาด';
      default: return 'ไม่ทราบ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3">
          <Search className="w-8 h-8 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <p className="text-gray-300 mt-1">ระบบรายงานและการส่งออกข้อมูล</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900 rounded-lg p-3">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">1,234</h3>
              <p className="text-gray-300 text-sm">เว็บไซต์ที่ตรวจสอบ</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-green-900 rounded-lg p-3">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">456</h3>
              <p className="text-gray-300 text-sm">ภาพที่วิเคราะห์</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-red-900 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">89</h3>
              <p className="text-gray-300 text-sm">รายการต้องสงสัย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">สร้างรายงานใหม่</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ประเภทรายงาน</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="summary">สรุปกิจกรรม</option>
              <option value="websites">เว็บไซต์ต้องสงสัย</option>
              <option value="accounts">บัญชีต้องสงสัย</option>
              <option value="transactions">การโอนเงิน</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={selectedDateFrom}
              onChange={(e) => setSelectedDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={selectedDateTo}
              onChange={(e) => setSelectedDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              สร้างรายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">รายงานที่มีอยู่</h2>
        
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow bg-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white">{report.title}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      <span>{getStatusText(report.status)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{report.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{report.date}</span>
                    </div>
                    <span>ขนาดไฟล์: {report.size}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {report.status === 'ready' && (
                    <button
                      onClick={() => downloadReport(report.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-700 text-green-200 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>ดาวน์โหลด</span>
                    </button>
                  )}
                  {report.status === 'generating' && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-700 text-orange-200 rounded text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                      <span>กำลังสร้าง...</span>
                    </div>
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

export default Reports;