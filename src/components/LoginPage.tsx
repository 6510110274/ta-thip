import React, { useState } from 'react';
import { Shield, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    // Simulate login validation
    if (credentials.username === 'officer001' && credentials.password === 'secure123') {
      onLogin(credentials);
      setError('');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Shield className="w-12 h-12 text-blue-700" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">TATHIP</h2>
          <p className="text-blue-200 text-lg">ระบบผู้ช่วยสืบสวนอาชญากรรมทางไซเบอร์</p>
          <p className="text-blue-300 text-sm mt-2">สำหรับเจ้าหน้าที่ตำรวจที่ได้รับอนุญาตเท่านั้น</p>
        </div>

        <form className="bg-white rounded-lg shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้งาน
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกชื่อผู้ใช้งาน"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            เข้าสู่ระบบ
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo: Username: officer001, Password: secure123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;