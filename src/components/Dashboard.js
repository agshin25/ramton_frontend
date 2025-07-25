import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  Shield, 
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  // Satış Trendi Chart
  const salesTrendData = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun', 'İyul', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'],
    datasets: [
      {
        label: 'Satışlar (₼)',
        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Hədəf (₼)',
        data: [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 50000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  };

  const salesTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aylıq Satış Trendi',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₼' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Əməkdaş Performansı Chart
  const employeePerformanceData = {
    labels: ['Əli Məmmədov', 'Səbinə Əliyeva', 'Məhəmməd Əliyev', 'Aysu Hüseynova'],
    datasets: [
      {
        label: 'Satış Sayı',
        data: [15, 12, 10, 8],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const employeePerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Əməkdaş Performansı',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
      }
    }
  };

  // Məhsul Satışları Chart
  const productSalesData = {
    labels: ['iPhone 15 Pro', 'MacBook Air', 'Apple Watch', 'iPad Pro', 'AirPods Pro'],
    datasets: [
      {
        label: 'Satılan Miqdar',
        data: [25, 18, 15, 12, 30],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const productSalesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Məhsul Satışları',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 35,
      }
    }
  };

  // Sifariş Statusları Doughnut Chart
  const orderStatusData = {
    labels: ['Yeni', 'Gözləmədə', 'Yönləndirilib', 'Tamamlandı', 'Ləğv'],
    datasets: [
      {
        data: [12, 8, 18, 45, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const orderStatusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sifariş Statusları',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ramton CRM Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Ramton satış qrupu bot sistemi ilə inteqrasiya olunan CRM paneli</p>
      </div>
      
      {/* Ana Statistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gündəlik Satış</p>
              <p className="text-3xl font-bold text-gray-900">₼2,450</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15% dünənə görə
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aylıq Satış</p>
              <p className="text-3xl font-bold text-gray-900">₼45,230</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <BarChart3 className="w-4 h-4 mr-1" />
                +8% keçən aya görə
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktiv Sifariş</p>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Gözləyir
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ləğv Faizi</p>
              <p className="text-3xl font-bold text-gray-900">5.2%</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <XCircle className="w-4 h-4 mr-1" />
                -2% dünənə görə
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yeni Sifarişlər</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanmış</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yönləndirilmiş</p>
              <p className="text-2xl font-bold text-purple-600">18</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ləğv Edilmiş</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chartlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Satış Trendi */}
        <div className="bg-white p-6 rounded-2xl">
          <Line data={salesTrendData} options={salesTrendOptions} />
        </div>

        {/* Sifariş Statusları */}
        <div className="bg-white p-6 rounded-2xl">
          <Doughnut data={orderStatusData} options={orderStatusOptions} />
        </div>
      </div>

      {/* Əlavə Chartlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Əməkdaş Performansı */}
        <div className="bg-white p-6 rounded-2xl">
          <Bar data={employeePerformanceData} options={employeePerformanceOptions} />
        </div>

        {/* Məhsul Satışları */}
        <div className="bg-white p-6 rounded-2xl">
          <Bar data={productSalesData} options={productSalesOptions} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ən Çox Satan Əməkdaşlar */}
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Ən Çox Satan Əməkdaşlar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Əli Məmmədov</p>
                  <p className="text-sm text-gray-600">15 sifariş</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼2,450</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Səbinə Əliyeva</p>
                  <p className="text-sm text-gray-600">12 sifariş</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼1,890</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">M</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Məhəmməd Hüseynov</p>
                  <p className="text-sm text-gray-600">10 sifariş</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼1,650</span>
            </div>
          </div>
        </div>
        
        {/* Ən Çox Satılan Məhsullar */}
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
            Ən Çox Satılan Məhsullar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">iPhone 15 Pro</p>
                  <p className="text-sm text-gray-600">25 ədəd satılıb</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼3,250</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">💻</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">MacBook Air</p>
                  <p className="text-sm text-gray-600">18 ədəd satılıb</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼2,890</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">⌚</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Apple Watch</p>
                  <p className="text-sm text-gray-600">15 ədəd satılıb</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">₼1,450</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Son Fəaliyyətlər və Bot Monitorinq */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Son Ramton Mesajları
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Yeni sifariş: iPhone 15 Pro x2 ədəd</span>
                <p className="text-xs text-gray-500">Əli Məmmədov - 2 dəqiqə əvvəl</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Sifariş tamamlandı: MacBook Air</span>
                <p className="text-xs text-gray-500">Səbinə Əliyeva - 5 dəqiqə əvvəl</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Sifariş yönləndirildi: Apple Watch</span>
                <p className="text-xs text-gray-500">Məhəmməd Hüseynov - 8 dəqiqə əvvəl</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Bot Vəziyyəti
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Ramton Bot
              </span>
              <span className="text-sm font-medium text-green-600">Aktiv</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Mesaj Monitorinqi
              </span>
              <span className="text-sm font-medium text-green-600">Aktiv</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <span className="text-sm text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Excel Hesabatı
              </span>
              <span className="text-sm font-medium text-yellow-600">Gözləyir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 