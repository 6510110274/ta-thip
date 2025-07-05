import React, { useState } from 'react';
import { Upload, FileText, Search, CheckCircle, AlertCircle, FolderOpen, Archive, Image, Plus } from 'lucide-react';

interface ClassifiedImage {
  id: string;
  fileName: string;
  imageType: 'slip' | 'weapon' | 'drugs' | 'adult' | 'illegal' | 'normal';
  status: 'safe' | 'suspicious' | 'flagged';
  confidence: number;
  date: string;
  time: string;
  caseId?: string;
  // Additional data for slips
  accountName?: string;
  accountNumber?: string;
  bank?: string;
  amount?: number;
}

interface Case {
  id: string;
  title: string;
}

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: ClassifiedImage[];
  onCreateCase: (caseData: any) => void;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose, selectedImages, onCreateCase }) => {
  const [caseData, setCaseData] = useState({
    title: '',
    description: '',
    category: 'cybercrime' as const,
    priority: 'medium' as const
  });

  React.useEffect(() => {
    if (selectedImages.length > 0) {
      const flaggedCount = selectedImages.filter(img => img.status === 'flagged').length;
      const suspiciousCount = selectedImages.filter(img => img.status === 'suspicious').length;
      
      setCaseData({
        title: `คดีจากการวิเคราะห์รูปภาพ - พบหลักฐาน ${selectedImages.length} รายการ`,
        description: `พบรูปภาพต้องสงสัย ${flaggedCount} รายการ และน่าสงสัย ${suspiciousCount} รายการ จากการวิเคราะห์ไฟล์ ZIP`,
        category: 'cybercrime',
        priority: flaggedCount > 0 ? 'high' : suspiciousCount > 0 ? 'medium' : 'low'
      });
    }
  }, [selectedImages]);

  const handleSubmit = () => {
    onCreateCase({ ...caseData, evidenceImages: selectedImages });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">สร้างคดีจากหลักฐานรูปภาพ</h3>
        
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

          <div className="bg-slate-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">หลักฐานที่จะเพิ่มในคดี</h4>
            <p className="text-sm text-gray-400">รูปภาพทั้งหมด: {selectedImages.length} รายการ</p>
            <p className="text-sm text-red-400">ต้องสงสัย: {selectedImages.filter(img => img.status === 'flagged').length} รายการ</p>
            <p className="text-sm text-orange-400">น่าสงสัย: {selectedImages.filter(img => img.status === 'suspicious').length} รายการ</p>
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

const OCRClassification: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'suspicious'>('all');
  
  const [results, setResults] = useState<ClassifiedImage[]>([
    {
      id: '1',
      fileName: 'IMG_001.jpg',
      imageType: 'slip',
      status: 'suspicious',
      confidence: 94,
      date: '2024-01-16',
      time: '14:30',
      accountName: 'นายสมชาย ใจดี',
      accountNumber: '123-456-7890',
      bank: 'ธนาคารกรุงไทย',
      amount: 50000
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
      imageType: 'drugs',
      status: 'flagged',
      confidence: 89,
      date: '2024-01-16',
      time: '14:32'
    },
    {
      id: '4',
      fileName: 'IMG_004.jpg',
      imageType: 'adult',
      status: 'flagged',
      confidence: 92,
      date: '2024-01-16',
      time: '14:33'
    },
    {
      id: '5',
      fileName: 'IMG_005.jpg',
      imageType: 'normal',
      status: 'safe',
      confidence: 98,
      date: '2024-01-16',
      time: '14:34'
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
      const imageTypes: ClassifiedImage['imageType'][] = ['slip', 'weapon', 'drugs', 'adult', 'illegal', 'normal'];
      const newResults: ClassifiedImage[] = [];
      
      // Simulate processing 10-20 images from ZIP
      const imageCount = Math.floor(Math.random() * 11) + 10;
      
      for (let i = 0; i < imageCount; i++) {
        const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
        const confidence = Math.floor(Math.random() * 20) + 80;
        
        let status: ClassifiedImage['status'] = 'safe';
        if (randomType === 'weapon' || randomType === 'drugs' || randomType === 'adult' || randomType === 'illegal') {
          status = 'flagged';
        } else if (randomType === 'slip') {
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

        // Add slip-specific data if it's a slip
        if (randomType === 'slip') {
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

  const handleCreateCase = () => {
    if (selectedImages.length === 0) {
      alert('กรุณาเลือกรูปภาพที่จะเพิ่มในคดี');
      return;
    }
    setShowCreateCaseModal(true);
  };

  const onCreateCase = (caseData: any) => {
    console.log('Creating case with images:', caseData);
    alert(`สร้างคดี "${caseData.title}" พร้อมหลักฐาน ${selectedImages.length} รายการเรียบร้อยแล้ว`);
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

  const getImageTypeText = (type: string) => {
    switch (type) {
      case 'slip': return 'สลิปโอนเงิน';
      case 'weapon': return 'อาวุธปืน';
      case 'drugs': return 'ยาเสพติด';
      case 'adult': return 'เนื้อหาผู้ใหญ่';
      case 'illegal': return 'สิ่งผิดกฎหมาย';
      case 'normal': return 'รูปภาพทั่วไป';
      default: return 'ไม่ทราบ';
    }
  };

  const getImageTypeColor = (type: string) => {
    switch (type) {
      case 'slip': return 'text-blue-400 bg-blue-900';
      case 'weapon': return 'text-red-400 bg-red-900';
      case 'drugs': return 'text-purple-400 bg-purple-900';
      case 'adult': return 'text-pink-400 bg-pink-900';
      case 'illegal': return 'text-yellow-400 bg-yellow-900';
      case 'normal': return 'text-gray-400 bg-gray-800';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const filteredResults = results.filter(result => {
    switch (filter) {
      case 'flagged': return result.status === 'flagged';
      case 'suspicious': return result.status === 'suspicious';
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div className="flex items-center space-x-3">
          <Archive className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">OCR Classification</h1>
            <p className="text-gray-300 mt-1">ระบบแยกประเภทรูปภาพจากไฟล์ ZIP อัตโนมัติ</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-green-500 bg-green-900/20' : 'border-slate-500 hover:border-green-400'
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
            className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <div>
              <h3 className="font-medium text-white">กำลังแยกและวิเคราะห์รูปภาพ...</h3>
              <p className="text-gray-300 text-sm">ระบบกำลังแตกไฟล์ ZIP และแยกประเภทรูปภาพแต่ละไฟล์</p>
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
                onClick={handleCreateCase}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>สร้างคดีจากรูปภาพที่เลือก</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ทั้งหมด ({results.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'flagged'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              ต้องสงสัย ({results.filter(r => r.status === 'flagged').length})
            </button>
            <button
              onClick={() => setFilter('suspicious')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'suspicious'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              น่าสงสัย ({results.filter(r => r.status === 'suspicious').length})
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">ผลการแยกประเภทรูปภาพ</h2>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อไฟล์..."
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
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
                
                {result.imageType === 'slip' && result.accountName && (
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={showCreateCaseModal}
        onClose={() => setShowCreateCaseModal(false)}
        selectedImages={results.filter(r => selectedImages.includes(r.id))}
        onCreateCase={onCreateCase}
      />
    </div>
  );
};

export default OCRClassification;