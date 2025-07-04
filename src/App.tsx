import React, { useState } from 'react';
import { Shield, Eye, FileText, Globe, AlertTriangle, Users, BarChart3, Search, FolderOpen } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import OCRModule from './components/OCRModule';
import WebCrawler from './components/WebCrawler';
import Watchlist from './components/Watchlist';
import AlertSystem from './components/AlertSystem';
import Reports from './components/Reports';
import CaseManagement from './components/CaseManagement';

type Module = 'dashboard' | 'cases' | 'ocr' | 'crawler' | 'watchlist' | 'alerts' | 'reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [userInfo, setUserInfo] = useState<{ name: string; badge: string; unit: string } | null>(null);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simulate authentication
    if (credentials.username === 'officer001' && credentials.password === 'secure123') {
      setIsAuthenticated(true);
      setUserInfo({
        name: 'นายสมชาย สืบสวน',
        badge: 'บช.สอท. 001',
        unit: 'กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี'
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setActiveModule('dashboard');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-400' },
    { id: 'cases', label: 'Case Management', icon: FolderOpen, color: 'text-purple-400' },
    { id: 'ocr', label: 'OCR Classification', icon: FileText, color: 'text-green-400' },
    { id: 'crawler', label: 'Web Crawler', icon: Globe, color: 'text-cyan-400' },
    { id: 'watchlist', label: 'Watchlist', icon: Eye, color: 'text-red-400' },
    { id: 'alerts', label: 'Alert System', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'reports', label: 'Reports', icon: Search, color: 'text-gray-400' }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'cases':
        return <CaseManagement />;
      case 'ocr':
        return <OCRModule />;
      case 'crawler':
        return <WebCrawler />;
      case 'watchlist':
        return <Watchlist />;
      case 'alerts':
        return <AlertSystem />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-blue-900 text-white shadow-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 text-blue-300" />
              <div>
                <h1 className="text-xl font-bold text-white">TATHIP</h1>
                <p className="text-sm text-blue-200">ระบบผู้ช่วยสืบสวนอาชญากรรมทางไซเบอร์</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{userInfo?.name}</p>
                <p className="text-xs text-blue-200">{userInfo?.badge}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">เมนูหลัก</h2>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveModule(item.id as Module)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeModule === item.id
                            ? 'bg-blue-900 text-blue-200 border-l-4 border-blue-400'
                            : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${activeModule === item.id ? 'text-blue-400' : item.color}`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderModule()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;