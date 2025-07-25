import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Package, 
  DollarSign, 
  Clock, 
  Target,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react';

const BotMonitoring = () => {
  const [isConnected] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      timestamp: '2024-01-20 14:30:25',
      employee: 'Əli Məmmədov',
      rawMessage: 'iPhone 15 Pro x2 ədəd - 150₼',
      parsedData: {
        product: 'iPhone 15 Pro',
        quantity: 2,
        price: 150,
        status: 'Yeni'
      },
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2024-01-20 14:28:15',
      employee: 'Səbinə Əliyeva',
      rawMessage: 'MacBook Air x1 ədəd - 75.50₼',
      parsedData: {
        product: 'MacBook Air',
        quantity: 1,
        price: 75.50,
        status: 'Yeni'
      },
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2024-01-20 14:25:42',
      employee: 'Məhəmməd Əliyev',
      rawMessage: 'Apple Watch x3 ədəd - 200₼',
      parsedData: {
        product: 'Apple Watch',
        quantity: 3,
        price: 200,
        status: 'Yeni'
      },
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2024-01-20 14:22:18',
      employee: 'Aysu Hüseynova',
      rawMessage: 'iPad Pro x1 ədəd - 120₼',
      parsedData: {
        product: 'iPad Pro',
        quantity: 1,
        price: 120,
        status: 'Yeni'
      },
      status: 'success'
    },
    {
      id: 5,
      timestamp: '2024-01-20 14:20:05',
      employee: 'Əli Məmmədov',
      rawMessage: 'AirPods Pro x5 ədəd - 85₼ (LƏĞV)',
      parsedData: {
        product: 'AirPods Pro',
        quantity: 5,
        price: 85,
        status: 'Ləğv'
      },
      status: 'cancelled'
    }
  ]);

  const [stats, setStats] = useState({
    totalMessages: 156,
    successfulParsing: 142,
    failedParsing: 14,
    todayMessages: 23,
    averageResponseTime: '2.3s'
  });

  useEffect(() => {
    // Simulate real-time message updates
    const interval = setInterval(() => {
      if (isMonitoring) {
        // Add new message simulation
        const newMessage = {
          id: Date.now(),
          timestamp: new Date().toLocaleString('az-AZ'),
          employee: 'Əli Məmmədov',
          rawMessage: 'Samsung Galaxy S24 x1 ədəd - 280₼',
          parsedData: {
            product: 'Samsung Galaxy S24',
            quantity: 1,
            price: 280,
            status: 'Yeni'
          },
          status: 'success'
        };
        setMessages(prev => [newMessage, ...prev.slice(0, 9)]);
        setStats(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          successfulParsing: prev.successfulParsing + 1,
          todayMessages: prev.todayMessages + 1
        }));
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'cancelled': return 'bg-red-50 border-red-200';
      case 'error': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ramton Bot Monitorinq
        </h1>
        <p className="text-gray-600 text-lg">Real-time mesaj monitorinqi və avtomatik məlumat çıxarma</p>
      </div>

      {/* Bot Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bot Status</p>
              <p className={`text-lg font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Aktiv' : 'Deaktiv'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              {isConnected ? <Wifi className="w-6 h-6 text-green-600" /> : <WifiOff className="w-6 h-6 text-red-600" />}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monitorinq</p>
              <p className={`text-lg font-bold ${isMonitoring ? 'text-blue-600' : 'text-gray-600'}`}>
                {isMonitoring ? 'Aktiv' : 'Dayandırılıb'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bu Gün</p>
              <p className="text-lg font-bold text-gray-900">{stats.todayMessages}</p>
              <p className="text-sm text-green-600">Mesaj</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orta Cavab</p>
              <p className="text-lg font-bold text-gray-900">{stats.averageResponseTime}</p>
              <p className="text-sm text-blue-600">Vaxt</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Messages */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Real-time Mesajlar
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isMonitoring 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isMonitoring ? 'Dayandır' : 'Başlat'}</span>
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Yenilə</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`p-4 rounded-xl border ${getStatusColor(message.status)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(message.status)}
                      <div>
                        <p className="font-medium text-gray-800">{message.employee}</p>
                        <p className="text-sm text-gray-500">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Ham mesaj:</p>
                    <p className="text-sm font-medium text-gray-800 bg-white p-2 rounded border">
                      "{message.rawMessage}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{message.parsedData.product}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{message.parsedData.quantity} ədəd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">₼{message.parsedData.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">{message.parsedData.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics and Settings */}
        <div className="space-y-6">
          {/* Parsing Statistics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Parsing Statistikası
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ümumi Mesaj</span>
                <span className="font-semibold text-gray-800">{stats.totalMessages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uğurlu Parsing</span>
                <span className="font-semibold text-green-600">{stats.successfulParsing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uğursuz Parsing</span>
                <span className="font-semibold text-red-600">{stats.failedParsing}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.successfulParsing / stats.totalMessages) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {((stats.successfulParsing / stats.totalMessages) * 100).toFixed(1)}% Uğur Faizi
              </p>
            </div>
          </div>

          {/* Bot Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Bot Tənzimləmələri
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avtomatik Parsing</span>
                <div className="w-12 h-8 bg-green-500 rounded-full relative">
                  <div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time Bildiriş</span>
                <div className="w-12 h-8 bg-green-500 rounded-full relative">
                  <div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Error Logging</span>
                <div className="w-12 h-8 bg-gray-300 rounded-full relative">
                  <div className="w-6 h-6 bg-white rounded-full absolute left-1 top-1 transition-transform"></div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Tənzimləmələri Saxla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotMonitoring; 