import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  Search,
  PieChart,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample data for reports
  const salesData = [
    { month: 'Yanvar', sales: 45000, orders: 125, customers: 89 },
    { month: 'Fevral', sales: 52000, orders: 142, customers: 95 },
    { month: 'Mart', sales: 48000, orders: 138, customers: 87 },
    { month: 'Aprel', sales: 61000, orders: 165, customers: 112 },
    { month: 'May', sales: 55000, orders: 148, customers: 98 },
    { month: 'İyun', sales: 67000, orders: 178, customers: 125 }
  ];

  const productPerformance = [
    { product: 'iPhone 15 Pro', sales: 45, revenue: 22500, growth: '+12%' },
    { product: 'MacBook Air', sales: 32, revenue: 19200, growth: '+8%' },
    { product: 'Apple Watch', sales: 28, revenue: 8400, growth: '+15%' },
    { product: 'iPad Pro', sales: 22, revenue: 13200, growth: '+5%' },
    { product: 'AirPods Pro', sales: 38, revenue: 7600, growth: '+20%' }
  ];

  const customerSegments = [
    { segment: 'Yeni Müştərilər', count: 45, percentage: 25 },
    { segment: 'Daimi Müştərilər', count: 89, percentage: 50 },
    { segment: 'VIP Müştərilər', count: 23, percentage: 13 },
    { segment: 'Passiv Müştərilər', count: 21, percentage: 12 }
  ];

  const zonePerformance = [
    { zone: 'Bakı Mərkəz', orders: 89, revenue: 44500, deliveryTime: '1.2h' },
    { zone: 'Sumqayıt', orders: 45, revenue: 22500, deliveryTime: '2.1h' },
    { zone: 'Gəncə', orders: 32, revenue: 16000, deliveryTime: '3.5h' },
    { zone: 'Mingəçevir', orders: 18, revenue: 9000, deliveryTime: '4.2h' },
    { zone: 'Bakı - Binəqədi', orders: 56, revenue: 28000, deliveryTime: '1.5h' }
  ];

  const courierPerformance = [
    { name: 'Əli Məmmədov', deliveries: 45, rating: 4.8, earnings: 1350 },
    { name: 'Aysu Hüseynova', deliveries: 38, rating: 4.9, earnings: 1140 },
    { name: 'Məhəmməd Əliyev', deliveries: 42, rating: 4.7, earnings: 1260 },
    { name: 'Səbinə Əliyeva', deliveries: 35, rating: 4.6, earnings: 1050 },
    { name: 'Rəşad Əhmədov', deliveries: 29, rating: 4.5, earnings: 870 }
  ];

  const exportReport = (reportType) => {
    let data = [];
    let filename = '';
    let sheetName = '';

    switch (reportType) {
      case 'sales':
        data = salesData.map(item => ({
          'Ay': item.month,
          'Satış (₼)': item.sales,
          'Sifariş Sayı': item.orders,
          'Müştəri Sayı': item.customers
        }));
        filename = 'Ramton_CRM_Satış_Hesabatı';
        sheetName = 'Satış Hesabatı';
        break;
      
      case 'products':
        data = productPerformance.map(item => ({
          'Məhsul': item.product,
          'Satış Sayı': item.sales,
          'Gəlir (₼)': item.revenue,
          'Böyümə': item.growth
        }));
        filename = 'Ramton_CRM_Məhsul_Hesabatı';
        sheetName = 'Məhsul Hesabatı';
        break;
      
      case 'customers':
        data = customerSegments.map(item => ({
          'Segment': item.segment,
          'Sayı': item.count,
          'Faiz (%)': item.percentage
        }));
        filename = 'Ramton_CRM_Müştəri_Hesabatı';
        sheetName = 'Müştəri Hesabatı';
        break;
      
      case 'zones':
        data = zonePerformance.map(item => ({
          'Zona': item.zone,
          'Sifariş Sayı': item.orders,
          'Gəlir (₼)': item.revenue,
          'Çatdırılma Vaxtı': item.deliveryTime
        }));
        filename = 'Ramton_CRM_Zona_Hesabatı';
        sheetName = 'Zona Hesabatı';
        break;
      
      case 'couriers':
        data = courierPerformance.map(item => ({
          'Kuryer': item.name,
          'Çatdırılma Sayı': item.deliveries,
          'Reytinq': item.rating,
          'Qazanc (₼)': item.earnings
        }));
        filename = 'Ramton_CRM_Kuryer_Hesabatı';
        sheetName = 'Kuryer Hesabatı';
        break;
      
      default:
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const date = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${date}.xlsx`;
    XLSX.writeFile(workbook, fullFilename);
  };

  const getReportData = () => {
    switch (selectedReport) {
      case 'sales':
        return salesData;
      case 'products':
        return productPerformance;
      case 'customers':
        return customerSegments;
      case 'zones':
        return zonePerformance;
      case 'couriers':
        return courierPerformance;
      default:
        return [];
    }
  };

  const renderReportContent = () => {
    const data = getReportData();

    switch (selectedReport) {
      case 'sales':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Satış</p>
                    <p className="text-3xl font-bold text-blue-600">₼328,000</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Sifariş</p>
                    <p className="text-3xl font-bold text-green-600">896</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orta Sifariş Dəyəri</p>
                    <p className="text-3xl font-bold text-purple-600">₼366</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Aylıq Satış Trendi</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.month}</p>
                        <p className="text-sm text-gray-600">{item.orders} sifariş</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₼{item.sales.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{item.customers} müştəri</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Satış</p>
                    <p className="text-3xl font-bold text-blue-600">165</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Gəlir</p>
                    <p className="text-3xl font-bold text-green-600">₼70,900</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orta Böyümə</p>
                    <p className="text-3xl font-bold text-purple-600">+12%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Məhsul Performansı</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.product}</p>
                        <p className="text-sm text-gray-600">{item.sales} ədəd satılıb</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₼{item.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{item.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Müştəri</p>
                    <p className="text-3xl font-bold text-blue-600">178</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiv Müştəri</p>
                    <p className="text-3xl font-bold text-green-600">134</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Yeni Müştəri</p>
                    <p className="text-3xl font-bold text-purple-600">45</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Müştəri Segmentləri</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.segment}</p>
                        <p className="text-sm text-gray-600">{item.count} müştəri</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{item.percentage}%</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'zones':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiv Zonalar</p>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Sifariş</p>
                    <p className="text-3xl font-bold text-green-600">240</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orta Çatdırılma</p>
                    <p className="text-3xl font-bold text-purple-600">2.5h</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Zona Performansı</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.zone}</p>
                        <p className="text-sm text-gray-600">{item.orders} sifariş</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₼{item.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{item.deliveryTime} çatdırılma</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'couriers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiv Kuryer</p>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ümumi Çatdırılma</p>
                    <p className="text-3xl font-bold text-green-600">189</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orta Reyting</p>
                    <p className="text-3xl font-bold text-purple-600">4.7</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Kuryer Performansı</h3>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.deliveries} çatdırılma</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₼{item.earnings}</p>
                      <p className="text-sm text-yellow-600">⭐ {item.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hesabatlar
        </h1>
        <p className="text-gray-600 text-lg">Ramton CRM sisteminin ətraflı analitik hesabatları</p>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Hesabat Növü</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedReport('sales')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedReport === 'sales'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Satış Hesabatı</span>
              </button>
              <button
                onClick={() => setSelectedReport('products')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedReport === 'products'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Məhsul Hesabatı</span>
              </button>
              <button
                onClick={() => setSelectedReport('customers')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedReport === 'customers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Müştəri Hesabatı</span>
              </button>
              <button
                onClick={() => setSelectedReport('zones')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedReport === 'zones'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Zona Hesabatı</span>
              </button>
              <button
                onClick={() => setSelectedReport('couriers')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedReport === 'couriers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Kuryer Hesabatı</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarix Aralığı</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Bu Həftə</option>
                <option value="month">Bu Ay</option>
                <option value="quarter">Bu Rüb</option>
                <option value="year">Bu İl</option>
                <option value="custom">Xüsusi</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlanğıc Tarixi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə Tarixi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <button
                onClick={() => exportReport(selectedReport)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default Reports; 