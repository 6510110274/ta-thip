import React, { useState } from 'react';
import { Upload, FileText, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface SlipData {
  id: string;
  fileName: string;
  accountName: string;
  accountNumber: string;
  bank: string;
  amount: number;
  date: string;
  time: string;
  status: 'safe' | 'suspicious' | 'flagged';
  confidence: number;
}

const OCRModule: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<SlipData[]>([
    {
      id: '1',
      fileName: 'slip_001.jpg',
      accountName: 'นายสมหมาย ใจดี',
      accountNumber: '123-456-7890',
      bank: 'ธนาคารกรุงไทย',
      amount: 50000,
      date: '2024-01-15',
      time: '14:30',
      status: 'suspicious',
      confidence: 95
    },
    {
      id: '2',
      fileName: 'slip_002.jpg',
      accountName: 'นางสาววิมล สุขใจ',
      accountNumber: '987-654-3210',
      bank: 'ธนาคารไทยพาณิชย์',
      amount: 25000,
      date: '2024-01-14',
      time: '10:15',
      status: 'safe',
      confidence: 88
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
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const newResult: SlipData = {
        id: Date.now().toString(),
        fileName: file.name,
        accountName: 'นายจารุวิทย์ ลาภใหญ่',
        accountNumber: '555-777-9999',
        bank: 'ธนาคารกสิกรไทย',
        amount: 100000,
        date: '2024-01-16',
        time: '16:45',
        status: 'flagged',
        confidence: 92
      };
      
      setResults(prev => [newResult, ...prev]);
      setProcessing(false);
    }, 2000);
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
      case 'suspicious': return <AlertCircle className="w-4 h-4" />;
      case 'flagged': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OCR Slip Reader</h1>
            <p className="text-gray-600 mt-1">ระบบอ่านข้อมูลสลิปโอนเงินอัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">อัปโหลดสลิปโอนเงิน</h3>
          <p className="text-gray-600 mb-4">ลากไฟล์มาวางหรือคลิกเพื่อเลือกไฟล์</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            เลือกไฟล์
          </label>
        </div>
      </div>

      {/* Processing Status */}
      {processing && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <div>
              <h3 className="font-medium text-gray-900">กำลังวิเคราะห์สลิป...</h3>
              <p className="text-gray-600 text-sm">ระบบกำลังอ่านข้อมูลจากรูปภาพ</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">ผลการวิเคราะห์</h2>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-medium text-gray-900">{result.fileName}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span>
                        {result.status === 'safe' ? 'ปกติ' : 
                         result.status === 'suspicious' ? 'น่าสงสัย' : 'ต้องสงสัย'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">ชื่อบัญชี</p>
                      <p className="font-medium">{result.accountName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">เลขบัญชี</p>
                      <p className="font-medium">{result.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ธนาคาร</p>
                      <p className="font-medium">{result.bank}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">จำนวนเงิน</p>
                      <p className="font-medium text-green-600">{result.amount.toLocaleString()} บาท</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                    <span>วันที่: {result.date}</span>
                    <span>เวลา: {result.time}</span>
                    <span>ความแม่นยำ: {result.confidence}%</span>
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