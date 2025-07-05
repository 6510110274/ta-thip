import React, { useState } from 'react';
import { Upload, FileText, Search, CheckCircle, AlertCircle, FolderOpen, Archive, Image, Plus, Filter } from 'lucide-react';

interface ClassifiedImage {
  id: string;
  fileName: string;
  imageType: 'transaction-slip' | 'weapon' | 'drug' | 'pornography' | 'other';
  status: 'safe' | 'suspicious' | 'flagged';
  confidence: number;
  date: string;
  time: string;
  caseId?: string;
  // Additional data for transaction slips
  accountName?: string;
  accountNumber?: string;
  bank?: string;
  amount?: number;
}

interface Case {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'closed' | 'suspended';
}

interface AddToCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: ClassifiedImage[];
  cases: Case[];
  onAddToCase: (caseId: string) => void;
}

const AddToCaseModal: React.FC<AddToCaseModalProps> = ({ isOpen, onClose, selectedImages, cases, onAddToCase }) => {
  const [selectedCaseId, setSelectedCaseId] = useState('');

  const handleSubmit = () => {
    if (!selectedCaseId) {
      alert('กรุณาเลือกคดีที่ต้องการเพิ่มหลักฐาน');
      return;
    }
    onAddToCase(selectedCaseId);
    onClose();
  };

  if (!isOpen) return null;

  const activeCases = cases.filter(c => c.status === 'open' || c.status === 'investigating');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">เพิ่มหลักฐานในคดี</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">เลือกคดี</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="">-- เลือกคดี --</option>
              {activeCases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.id}: {caseItem.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">หลักฐานที่จะเพิ่ม</h4>
            <p className="text-sm text-gray-400">รูปภาพทั้งหมด: {selectedImages.length} รายการ</p>
            <div className="mt-2 space-y-1">
              {Object.entries(
                selectedImages.reduce((acc, img) => {
                  acc[img.imageType] = (acc[img.imageType] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <p key={type} className="text-xs text-gray-400">
                  {getImageTypeText(type)}: {count} รายการ
                </p>
              ))}
            </div>
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
            เพิ่มในคดี
          </button>
        </div>
      </div>
    </div>
  );
};

const getImageTypeText = (type: string) => {
  switch (type) {
    case 'transaction-slip': return 'สลิปโอนเงิน';
    case 'weapon': return 'อาวุธปืน';
    case 'drug': return 'ยาเสพติด';
    case 'pornography': return 'ภาพลามก';
    case 'other': return 'อื่นๆ';
    default: return 'ไม่ทราบ';
  }
};

const getImageTypeColor = (type: string) => {
  switch (type) {
    case 'transaction-slip': return 'text-blue-400 bg-blue-900';
    case 'weapon': return 'text-red-400 bg-red-900';
    case 'drug': return 'text-purple-400 bg-purple-900';
    case 'pornography': return 'text-pink-400 bg-pink-900';
    case 'other': return 'text-gray-400 bg-gray-800';
    default: return 'text-gray-400 bg-gray-800';
  }
};

const IllegalImageDetection: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showAddToCaseModal, setShowAddToCaseModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'suspicious'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ClassifiedImage['imageType']>('all');
  
  // Mock cases data
  const cases: Case[] = [
    { id: 'CASE-2024-001', title: 'เว็บไซต์พนันออนไลน์ suspicious-betting.com', status: 'investigating' },
    { id: 'CASE-2024-002', title: 'การโอนเงินต้องสงสัยบัญชี 123-456-7890', status: 'open' },
    { id: 'CASE-2024-003', title: 'คดีหลอกลวงออนไลน์ - การลงทุนปลอม', status: 'closed' },
    { id: 'CASE-2024-004', title: 'เครือข่ายค้ายาเสพติดออนไลน์', status: 'investigating' },
    { id: 'CASE-2024-005', title: 'เว็บไซต์เนื้อหาผิดกฎหมาย', status: 'open' }
  ];

  const [results, setResults] = useState<ClassifiedImage[]>([
    {
      id: '1',
      fileName: 'IMG_001.jpg',
      imageType: 'transaction-slip',
      status: 'suspicious',
      confidence: 94,
      date: '2024-01-16',
      time: '14:30',
      accountName: 'นายสมชาย ใจดี',
      accountNumber: '123-456-7890',
      bank: 'ธนาคารกรุงไทย',
      amount: 50000,
      caseId: 'CASE-2024-002'
    },
    {
      id: '2',
      fileName: 'IMG_002.jpg',
      imageType: 'weapon',
      status: 'flagged',
      confidence: 96,
      date: '2024-01-16',
      time: '14:31'
    },
    {
      id: '3',
      fileName: 'IMG_003.jpg',
      imageType: 'drug',
      status: 'flagged',
      confidence: 89,
      date: '2024-01-16',
      time: '14:32'
    },
    {
      id: '4',
      fileName: 'IMG_004.jpg',
      imageType: 'pornography',
      status: 'flagged',
      confidence: 92,
      date: '2024-01-16',
      time: '14:33'
    },
    {
      id: '5',
      fileName: 'IMG_005.jpg',
      imageType: 'other',
      status: 'safe',
      confidence: 98,
      date: '2024-01-16',
      time: '14:34'
    },
    {
      id: '6',
      fileName: 'IMG_006.jpg',
      imageType: 'transaction-slip',
      status: 'flagged',
      confidence: 91,
      date: '2024-01-16',
      time: '14:35',
      accountName: 'นายจารุวิทย์ ลาภใหญ่',
      accountNumber: '555-777-9999',
      bank: 'ธนาคารกสิกรไทย',
      amount: 250000
    },
    {
      id: '7',
      fileName: 'IMG_007.jpg',
      imageType: 'weapon',
      status: 'suspicious',
      confidence: 85,
      date: '2024-01-16',
      time: '14:36'
    },
    {
      id: '8',
      fileName: 'IMG_008.jpg',
      imageType: 'drug',
      status: 'flagged',
      confidence: 93,
      date: '2024-01-16',
      time: '14:37'
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
      processZipFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processZipFile(files[0]);
    }
  };

  const processZipFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('กรุณาเลือกไฟล์ ZIP เท่านั้น');
      return;
    }

    setProcessing(true);
    
    // Simulate ZIP processing and image classification
    setTimeout(() => {
      const imageTypes: ClassifiedImage['imageType'][] = ['transaction-slip', 'weapon', 'drug', 'pornography', 'other'];
      const newResults: ClassifiedImage[] = [];
      
      // Simulate processing 10-20 images from ZIP
      const imageCount = Math.floor(Math.random() * 11) + 10;
      
      for (let i = 0; i < imageCount; i++) {
        const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
        const confidence = Math.floor(Math.random() * 20) + 80;
        
        let status: ClassifiedImage['status'] = 'safe';
        if (randomType === 'weapon' || randomType === 'drug' || randomType === 'pornography') {
          status = 'flagged';
        } else if (randomType === 'transaction-slip') {
          status = Math.random() > 0.5 ? 'suspicious' : 'safe';
        }

        const newResult: ClassifiedImage = {
          id: (Date.now() + i).toString(),
          fileName: `IMG_${String(i + 1).padStart(3, '0')}.jpg`,
          imageType: randomType,
          status,
          confidence,
          date: '2024-01-16',
          time: `${14 + Math.floor(i / 60)}:${String((30 + i) % 60).padStart(2, '0')}`
        };

        // Add slip-specific data if it's a transaction slip
        if (randomType === 'transaction-slip') {
          newResult.accountName = `นายสมชาย ใจดี${i}`;
          newResult.accountNumber = `${123 + i}-456-${7890 + i}`;
          newResult.bank = ['ธนาคารกรุงไทย', 'ธนาคารกสิกรไทย', 'ธนาคารไทยพาณิชย์'][i % 3];
          newResult.amount = Math.floor(Math.random() * 500000) + 10000;
        }

        newResults.push(newResult);
      }
      
      setResults(prev => [...newResults, ...prev]);
      setProcessing(false);
      
      // Show summary
      const flaggedCount = newResults.filter(r => r.status === 'flagged').length;
      const suspiciousCount = newResults.filter(r => r.status === 'suspicious').length;
      alert(`วิเคราะห์เสร็จสิ้น!\nรูปภาพทั้งหมด: ${newResults.length}\nต้องสงสัย: ${flaggedCount}\nน่าสงสัย: ${suspiciousCount}`);
    }, 3000);
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllSuspicious = () => {
    const suspiciousIds = filteredResults
      .filter(result => result.status === 'flagged' || result.status === 'suspicious')
      .map(result => result.id);
    setSelectedImages(suspiciousIds);
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  const handleAddToCase = () => {
    if (selectedImages.length === 0) {
      alert('กรุณาเลือกรูปภาพที่จะเพิ่มในคดี');
      return;
    }
    setShowAddToCaseModal(true);
  };

  const onAddToCase = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId);
    console.log('Adding images to case:', caseId, selectedImages);
    
    // Update the results to include case ID
    setResults(prev => prev.map(result => 
      selectedImages.includes(result.id) 
        ? { ...result, caseId }
        : result
    ));
    
    alert(`เพิ่มหลักฐาน ${selectedImages.length} รายการในคดี "${selectedCase?.title}" เรียบร้อยแล้ว`);
    setSelectedImages([]);
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

  // Sort results by image type
  const sortedResults = [...results].sort((a, b) => {
    const typeOrder = ['transaction-slip', 'weapon', 'drug', 'pornography', 'other'];
    return typeOrder.indexOf(a.imageType) - typeOrder.indexOf(b.imageType);
  });

  const filteredResults = sortedResults.filter(result => {
    const statusMatch = filter === 'all' || result.status === filter;
    const typeMatch = typeFilter === 'all' || result.imageType === typeFilter;
    return statusMatch && typeMatch;
  });

  // Group results by image type for display
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.imageType]) {
      acc[result.imageType] = [];
    }
    acc[result.imageType].push(result);
    return acc;
  }, {} as Record<ClassifiedImage['imageType'], ClassifiedImage[]>);

  const imageTypeOrder: ClassifiedImage['imageType'][] = ['transaction-slip', 'weapon', 'drug', 'pornography', 'other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3">
          <Archive className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Illegal Image Detection</h1>
            <p className="text-gray-300 mt-1">ระบบตรวจจับภาพผิดกฎหมายจากไฟล์ ZIP อัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-500 hover:border-emerald-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">อัปโหลดไฟล์ ZIP จากโทรศัพท์</h3>
          <p className="text-gray-300 mb-4">
            ลากไฟล์ ZIP มาวางหรือคลิกเพื่อเลือกไฟล์ (รองรับเฉพาะไฟล์ .zip)
          </p>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            className="hidden"
            id="zip-upload"
          />
          <label
            htmlFor="zip-upload"
            className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            เลือกไฟล์ ZIP
          </label>
        </div>
      </div>

      {/* Processing Status */}
      {processing && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <div>
              <h3 className="font-medium text-white">กำลังแยกและวิเคราะห์รูปภาพ...</h3>
              <p className="text-gray-300 text-sm">ระบบกำลังแตกไฟล์ ZIP และตรวจจับภาพผิดกฎหมายแต่ละไฟล์</p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      {results.length > 0 && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">เลือกรูปภาพ:</span>
              <button
                onClick={selectAllSuspicious}
                className="px-3 py-1 bg-orange-700 text-orange-200 rounded text-sm hover:bg-orange-600 transition-colors"
              >
                เลือกทั้งหมดที่ต้องสงสัย
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                ยกเลิกการเลือก
              </button>
              <span className="text-sm text-gray-400">
                เลือกแล้ว: {selectedImages.length} รายการ
              </span>
            </div>
            
            {selectedImages.length > 0 && (
              <button
                onClick={handleAddToCase}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มในคดี</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">สถานะ:</span>
            </div>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ทั้งหมด ({results.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'flagged'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ต้องสงสัย ({results.filter(r => r.status === 'flagged').length})
            </button>
            <button
              onClick={() => setFilter('suspicious')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'suspicious'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              น่าสงสัย ({results.filter(r => r.status === 'suspicious').length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-300">ประเภท:</span>
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ทั้งหมด
            </button>
            {imageTypeOrder.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {getImageTypeText(type)} ({results.filter(r => r.imageType === type).length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results - Grouped by Type */}
      {results.length > 0 && (
        <div className="space-y-6">
          {imageTypeOrder.map(imageType => {
            const typeResults = groupedResults[imageType];
            if (!typeResults || typeResults.length === 0) return null;

            return (
              <div key={imageType} className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${getImageTypeColor(imageType)}`}>
                      <span>{getImageTypeText(imageType)}</span>
                      <span className="bg-slate-600 px-2 py-1 rounded-full text-xs">
                        {typeResults.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeResults.map((result) => (
                    <div 
                      key={result.id} 
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedImages.includes(result.id)
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-slate-600 hover:shadow-lg bg-slate-700'
                      }`}
                      onClick={() => toggleImageSelection(result.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Image className="w-5 h-5 text-gray-400" />
                          <h3 className="font-medium text-white text-sm">{result.fileName}</h3>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(result.id)}
                          onChange={() => toggleImageSelection(result.id)}
                          className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {getStatusIcon(result.status)}
                          <span>
                            {result.status === 'safe' ? 'ปกติ' : 
                             result.status === 'suspicious' ? 'น่าสงสัย' : 'ต้องสงสัย'}
                          </span>
                        </div>
                      </div>
                      
                      {result.imageType === 'transaction-slip' && result.accountName && (
                        <div className="text-xs text-gray-300 mb-2">
                          <p><span className="text-gray-400">บัญชี:</span> {result.accountName}</p>
                          <p><span className="text-gray-400">เลขบัญชี:</span> {result.accountNumber}</p>
                          <p><span className="text-gray-400">จำนวน:</span> <span className="text-green-400">{result.amount?.toLocaleString()} บาท</span></p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{result.date} {result.time}</span>
                        <span>แม่นยำ: {result.confidence}%</span>
                      </div>
                      
                      {result.caseId && (
                        <div className="mt-2 flex items-center space-x-1 text-xs">
                          <FolderOpen className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400">{result.caseId}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to Case Modal */}
      <AddToCaseModal
        isOpen={showAddToCaseModal}
        onClose={() => setShowAddToCaseModal(false)}
        selectedImages={results.filter(r => selectedImages.includes(r.id))}
        cases={cases}
        onAddToCase={onAddToCase}
      />
    </div>
  );
};

export default IllegalImageDetection;