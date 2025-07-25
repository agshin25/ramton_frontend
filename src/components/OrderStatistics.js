import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Package,
  DollarSign,
  Target,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download
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
  Filler
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

const OrderStatistics = () => {
  const [dateFilter, setDateFilter] = useState('month');

  // Sample data
  const orders = [
    { id: '#12345', employee: 'Əli Məmmədov', product: 'iPhone 15 Pro', quantity: 2, price: 2999, status: 'Tamamlandı', date: '2024-01-15', courier: 'Express Kuryer' },
    { id: '#12346', employee: 'Aysu Həsənli', product: 'Samsung Galaxy S24', quantity: 1, price: 1899, status: 'Yeni', date: '2024-01-15', courier: 'Fast Delivery' },
    { id: '#12347', employee: 'Əli Məmmədov', product: 'MacBook Air M2', quantity: 1, price: 3499, status: 'Gözləmədə', date: '2024-01-14', courier: 'Speed Kuryer' },
    { id: '#12348', employee: 'Fatma Əliyeva', product: 'iPad Pro 12.9', quantity: 3, price: 1299, status: 'Yönləndirilib', date: '2024-01-14', courier: 'Express Kuryer' },
    { id: '#12349', employee: 'Aysu Həsənli', product: 'AirPods Pro', quantity: 5, price: 299, status: 'Tamamlandı', date: '2024-01-13', courier: 'Fast Delivery' },
    { id: '#12350', employee: 'Əli Məmmədov', product: 'Apple Watch Series 9', quantity: 2, price: 599, status: 'Ləğv', date: '2024-01-13', courier: 'Speed Kuryer' },
    { id: '#12351', employee: 'Fatma Əliyeva', product: 'Sony WH-1000XM5', quantity: 1, price: 399, status: 'Tamamlandı', date: '2024-01-12', courier: 'Express Kuryer' },
    { id: '#12352', employee: 'Aysu Həsənli', product: 'Dell XPS 13', quantity: 1, price: 2499, status: 'Yeni', date: '2024-01-12', courier: 'Fast Delivery' },
    { id: '#12353', employee: 'Əli Məmmədov', product: 'Samsung QLED TV', quantity: 1, price: 1899, status: 'Gözləmədə', date: '2024-01-11', courier: 'Speed Kuryer' },
    { id: '#12354', employee: 'Fatma Əliyeva', product: 'Nintendo Switch', quantity: 4, price: 299, status: 'Tamamlandı', date: '2024-01-11', courier: 'Express Kuryer' },
    { id: '#12355', employee: 'Aysu Həsənli', product: 'GoPro Hero 11', quantity: 2, price: 399, status: 'Yönləndirilib', date: '2024-01-10', courier: 'Fast Delivery' },
    { id: '#12356', employee: 'Əli Məmmədov', product: 'Canon EOS R6', quantity: 1, price: 2499, status: 'Tamamlandı', date: '2024-01-10', courier: 'Speed Kuryer' }
  ];

  // Statistics calculations
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const completedOrders = orders.filter(order => order.status === 'Tamamlandı').length;
  const cancelledOrders = orders.filter(order => order.status === 'Ləğv').length;
  const completionRate = ((completedOrders / totalOrders) * 100).toFixed(1);
  const cancellationRate = ((cancelledOrders / totalOrders) * 100).toFixed(1);

  // Employee performance
  const employeeStats = orders.reduce((acc, order) => {
    if (!acc[order.employee]) {
      acc[order.employee] = { orders: 0, value: 0, completed: 0, cancelled: 0 };
    }
    acc[order.employee].orders++;
    acc[order.employee].value += order.price * order.quantity;
    if (order.status === 'Tamamlandı') acc[order.employee].completed++;
    if (order.status === 'Ləğv') acc[order.employee].cancelled++;
    return acc;
  }, {});

  // Product sales
  const productStats = orders.reduce((acc, order) => {
    if (!acc[order.product]) {
      acc[order.product] = { quantity: 0, value: 0, orders: 0 };
    }
    acc[order.product].quantity += order.quantity;
    acc[order.product].value += order.price * order.quantity;
    acc[order.product].orders++;
    return acc;
  }, {});

  // Courier statistics
  const courierStats = orders.reduce((acc, order) => {
    if (!acc[order.courier]) {
      acc[order.courier] = { orders: 0, value: 0 };
    }
    acc[order.courier].orders++;
    acc[order.courier].value += order.price * order.quantity;
    return acc;
  }, {});

  // Status distribution
  const statusStats = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const salesTrendData = {
    labels: ['Yan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Satış Trendi',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const employeePerformanceData = {
    labels: Object.keys(employeeStats),
    datasets: [
      {
        label: 'Sifariş Sayı',
        data: Object.values(employeeStats).map(emp => emp.orders),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  const productSalesData = {
    labels: Object.keys(productStats).slice(0, 8),
    datasets: [
      {
        label: 'Satış Miqdarı',
        data: Object.values(productStats).slice(0, 8).map(prod => prod.quantity),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ]
      }
    ]
  };

  const orderStatusData = {
    labels: Object.keys(statusStats),
    datasets: [
      {
        data: Object.values(statusStats),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sifariş Statistikası</h1>
          <p className="text-gray-600">Sifarişlərin ətraflı analizi və hesabatları</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Bu həftə</option>
            <option value="month">Bu ay</option>
            <option value="quarter">Bu rüb</option>
            <option value="year">Bu il</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Sifariş</p>
              <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">keçən aydan</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Dəyər</p>
              <p className="text-3xl font-bold text-gray-800">₼{totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+8.3%</span>
            <span className="text-gray-500 ml-1">keçən aydan</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanma Faizi</p>
              <p className="text-3xl font-bold text-gray-800">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+2.1%</span>
            <span className="text-gray-500 ml-1">keçən aydan</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ləğv Faizi</p>
              <p className="text-3xl font-bold text-gray-800">{cancellationRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-red-600">-1.8%</span>
            <span className="text-gray-500 ml-1">keçən aydan</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Satış Trendi</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64">
            <Line data={salesTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Employee Performance Chart */}
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Əməkdaş Performansı</h3>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64">
            <Bar data={employeePerformanceData} options={chartOptions} />
          </div>
        </div>

        {/* Product Sales Chart */}
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Məhsul Satışları</h3>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-64">
            <Bar data={productSalesData} options={chartOptions} />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Status Bölgüsü</h3>
            <PieChart className="w-5 h-5 text-orange-600" />
          </div>
          <div className="h-64">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Statistics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Statistics */}
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Əməkdaş Statistikası</h3>
          <div className="space-y-3">
            {Object.entries(employeeStats).map(([employee, stats]) => (
              <div key={employee} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{employee}</p>
                  <p className="text-sm text-gray-600">{stats.orders} sifariş • ₼{stats.value.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{((stats.completed / stats.orders) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">tamamlanma</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Statistics */}
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Məhsul Statistikası</h3>
          <div className="space-y-3">
            {Object.entries(productStats)
              .sort((a, b) => b[1].value - a[1].value)
              .slice(0, 5)
              .map(([product, stats]) => (
                <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{product}</p>
                    <p className="text-sm text-gray-600">{stats.quantity} ədəd • {stats.orders} sifariş</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">₼{stats.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">ümumi dəyər</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Courier Statistics */}
      <div className="bg-white p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Kuryer Statistikası</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(courierStats).map(([courier, stats]) => (
            <div key={courier} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{courier}</h4>
                <span className="text-sm text-gray-500">{stats.orders} sifariş</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₼{stats.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">ümumi dəyər</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics; 