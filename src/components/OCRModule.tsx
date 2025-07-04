import React, { useState } from 'react';
import { Upload, FileText, Search, CheckCircle, AlertCircle, FolderOpen } from 'lucide-react';

interface SlipData {
  id: string;
  fileName: string;
  imageType: 'slip' | 'weapon' | 'drugs' | 'adult' | 'other';
  accountName?: string;
  accountNumber?: string;
  bank?: string;
  amount?: number;
  date: string;
  time: string;
  status: 'safe' | 'suspicious' | 'flagged';
  confidence: number;
  caseId?: string;
}

interface Case {
  id: string;
  title: string;
}

const OCRModule: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  
  // Mock cases data
  const cases: Case[] = [
    { id: 'CASE-2024-001', title: 'เว็บไซต์พนันออนไลน์ suspicious-betting.com' },
    { id: 'CASE-2024-002', title: 'การโอนเงินต้องสงสัยบัญชี 123-456-7890' },
    { id: 'CASE-2024-003', title: 'คดีหลอกลวงออนไลน์ - การลงทุนปลอม' }
  ];

  const [results, setResults] = useState<SlipData[]>([
    {
      id: '1',
      fileName: 'slip_001.jpg',
      imageType: 'slip',
      accountName: 'นายสมหมาย ใจดี',
      accountNumber: '123-456-7890',
      bank: 'ธนาคารกรุงไทย',
      amount: 50000,
      date: '2024-01-15',
      time: '14:30',
      status: 'suspicious',
      confidence: 95,
      caseId: 'CASE-2024-001'
    },
    {
      id: '2',
      fileName: 'weapon_001.jpg',
      imageType: 'weapon',
      date: '2024-01-14',
      time: '10:15',
      status: 'flagged',
      confidence: 88,
      caseId: 'CASE-2024-002'
    },
    {
      id: '3',
      fileName: 'document_001.jpg',
      imageType: 'other',
      date: '2024-01-13',
      time: '16:20',
      status: 'safe',
      confidence: 92,
      caseId: 'CASE-2024-003'
    }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && selectedCase) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && selectedCase) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!selectedCase) {
      alert('กรุณาเลือกคดีที่จะเพิ่มหลักฐาน');
      return;
    }

    setProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const imageTypes = ['slip', 'weapon', 'drugs', 'adult', 'other'];
      const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)] as SlipData['imageType'];
      
      const newResult: SlipData = {
        id: Date.now().toString(),
        fileName: file.name,
        imageType: randomType,
        date: '2024-01-16',
        time: '16:45',
        status: randomType === 'slip' ? 'suspicious' : randomType === 'other' ? 'safe' : 'flagged',
        confidence: Math.floor(Math.random() * 20) + 80,
        caseId: selectedCase
      };

      // Add slip-specific data if it's a slip
      if (randomType === 'slip') {
        newResult.accountName = 'นายจารุวิทย์ ลาภใหญ่';
        newResult.accountNumber = '555-777-9999';
        newResult.bank = 'ธนาคารกสิกรไทย';
        newResult.amount = Math.floor(Math.random() * 500000) + 10000;
      }
      
      setResults(prev => [newResult, ...prev]);
      setProcessing(false);
    }, 2000);
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
      case 'suspicious': return <AlertCircle className="w-4 h-4" />;
      case 'flagged': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getImageTypeText = (type: string) => {
    switch (type) {
      case 'slip': return 'สลิปโอนเงิน';
      case 'weapon': return 'อาวุธปืน';
      case 'drugs': return 'ยาเสพติด';
      case 'adult': return 'เนื้อหาผู้ใหญ่';
      case 'other': return 'อื่นๆ';
      default: return 'ไม่ทราบ';
    }
  };

  const getImageTypeColor = (type: string) => {
    switch (type) {
      case 'slip': return 'text-blue-400 bg-blue-900';
      case 'weapon': return 'text-red-400 bg-red-900';
      case 'drugs': return 'text-purple-400 bg-purple-900';
      case 'adult': return 'text-pink-400 bg-pink-900';
      case 'other': return 'text-gray-400 bg-gray-800';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">OCR Classification</h1>
            <p className="text-gray-300 mt-1">ระบบแยกประเภทและอ่านข้อมูลภาพอัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Case Selection */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <FolderOpen className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">เลือกคดีที่จะเพิ่มหลักฐาน</h3>
        </div>
        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
        >
          <option value="">-- เลือกคดี --</option>
          {cases.map((caseItem) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.id}: {caseItem.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-green-500 bg-green-900/20' : 
            selectedCase ? 'border-slate-500 hover:border-green-400' : 'border-slate-600 opacity-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">อัปโหลดภาพเพื่อวิเคราะห์</h3>
          <p className="text-gray-300 mb-4">
            {selectedCase ? 'ลากไฟล์มาวางหรือคลิกเพื่อเลือกไฟล์' : 'กรุณาเลือกคดีก่อนอัปโหลดไฟล์'}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={!selectedCase}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedCase 
                ? 'bg-green-700 text-white hover:bg-green-600' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            เลือกไฟล์
          </label>
        </div>
      </div>

      {/* Processing Status */}
      {processing && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <div>
              <h3 className="font-medium text-white">กำลังวิเคราะห์ภาพ...</h3>
              <p className="text-gray-300 text-sm">ระบบกำลังแยกประเภทและอ่านข้อมูลจากรูปภาพ</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">ผลการวิเคราะห์</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow bg-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-medium text-white">{result.fileName}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getImageTypeColor(result.imageType)}`}>
                      <span>{getImageTypeText(result.imageType)}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span>
                        {result.status === 'safe' ? 'ปกติ' : 
                         result.status === 'suspicious' ? 'น่าสงสัย' : 'ต้องสงสัย'}
                      </span>
                    </div>
                  </div>
                  
                  {result.imageType === 'slip' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-400">ชื่อบัญชี</p>
                        <p className="font-medium text-white">{result.accountName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">เลขบัญชี</p>
                        <p className="font-medium text-white">{result.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ธนาคาร</p>
                        <p className="font-medium text-white">{result.bank}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">จำนวนเงิน</p>
                        <p className="font-medium text-green-400">{result.amount?.toLocaleString()} บาท</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>วันที่: {result.date}</span>
                    <span>เวลา: {result.time}</span>
                    <span>ความแม่นยำ: {result.confidence}%</span>
                    {result.caseId && (
                      <span className="text-purple-400">คดี: {result.caseId}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OCRModule;