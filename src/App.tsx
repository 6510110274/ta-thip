import React, { useState } from 'react';
import { Shield, Eye, FileText, Globe, AlertTriangle, Users, BarChart3, Search } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import OCRModule from './components/OCRModule';
import WebCrawler from './components/WebCrawler';
import Watchlist from './components/Watchlist';
import AlertSystem from './components/AlertSystem';
import Reports from './components/Reports';

type Module = 'dashboard' | 'ocr' | 'crawler' | 'watchlist' | 'alerts' | 'reports';

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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
    { id: 'ocr', label: 'OCR Slip Reader', icon: FileText, color: 'text-green-600' },
    { id: 'crawler', label: 'Web Crawler', icon: Globe, color: 'text-purple-600' },
    { id: 'watchlist', label: 'Watchlist', icon: Eye, color: 'text-red-600' },
    { id: 'alerts', label: 'Alert System', icon: AlertTriangle, color: 'text-orange-600' },
    { id: 'reports', label: 'Reports', icon: Search, color: 'text-gray-600' }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-200" />
              <div>
                <h1 className="text-xl font-bold">TATHIP</h1>
                <p className="text-sm text-blue-200">ระบบผู้ช่วยสืบสวนอาชญากรรมทางไซเบอร์</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userInfo?.name}</p>
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
            <nav className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">เมนูหลัก</h2>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveModule(item.id as Module)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeModule === item.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${activeModule === item.id ? 'text-blue-700' : item.color}`} />
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