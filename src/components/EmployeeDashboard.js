import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Award,
  BarChart3,
  Activity,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Plus,
  X
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    priority: 'medium',
    category: 'sales'
  });

  // Sample employees data
  const employees = [
    {
      id: 1,
      name: 'Əli Məmmədov',
      role: 'Satış Məsləkatçısı',
      avatar: 'AM',
      performance: 95,
      status: 'online'
    },
    {
      id: 2,
      name: 'Aysu Hüseynova',
      role: 'Müştəri Xidməti',
      avatar: 'AH',
      performance: 88,
      status: 'online'
    },
    {
      id: 3,
      name: 'Məhəmməd Əliyev',
      role: 'Satış Məsləkatçısı',
      avatar: 'MƏ',
      performance: 92,
      status: 'offline'
    },
    {
      id: 4,
      name: 'Səbinə Əliyeva',
      role: 'Müştəri Xidməti',
      avatar: 'SƏ',
      performance: 87,
      status: 'online'
    }
  ];

  // Sample goals data
  const goals = [
    {
      id: 1,
      title: 'Aylıq Satış Hədəfi',
      description: 'Bu ay 50 məhsul satmaq',
      target: '50 məhsul',
      current: 35,
      deadline: '2024-02-29',
      priority: 'high',
      category: 'sales',
      status: 'in-progress',
      employee: 'Əli Məmmədov'
    },
    {
      id: 2,
      title: 'Müştəri Məmnuniyyəti',
      description: 'Müştəri məmnuniyyət dərəcəsini 95%-ə çatdırmaq',
      target: '95%',
      current: 92,
      deadline: '2024-02-15',
      priority: 'medium',
      category: 'service',
      status: 'in-progress',
      employee: 'Aysu Hüseynova'
    },
    {
      id: 3,
      title: 'Yeni Müştəri Qazanmaq',
      description: 'Həftədə 10 yeni müştəri qazanmaq',
      target: '10 müştəri',
      current: 7,
      deadline: '2024-02-07',
      priority: 'high',
      category: 'sales',
      status: 'in-progress',
      employee: 'Məhəmməd Əliyev'
    }
  ];

  // Sample work statistics
  const workStats = {
    totalOrders: 156,
    completedOrders: 142,
    pendingOrders: 14,
    totalRevenue: 23450.75,
    averageOrderValue: 165.15,
    customerSatisfaction: 94.2,
    responseTime: '2.3 saat',
    weeklyGrowth: 12.5,
    monthlyGrowth: 8.7
  };

  // Sample recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'order_completed',
      message: 'Sifariş #12345 tamamlandı',
      time: '2 saat əvvəl',
      employee: 'Əli Məmmədov',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'new_customer',
      message: 'Yeni müştəri qeydiyyatdan keçdi',
      time: '4 saat əvvəl',
      employee: 'Aysu Hüseynova',
      icon: Users
    },
    {
      id: 3,
      type: 'goal_achieved',
      message: 'Həftəlik satış hədəfi yerinə yetirildi',
      time: '6 saat əvvəl',
      employee: 'Məhəmməd Əliyev',
      icon: Target
    },
    {
      id: 4,
      type: 'customer_feedback',
      message: 'Müştəri rəyi alındı - 5 ulduz',
      time: '8 saat əvvəl',
      employee: 'Səbinə Əliyeva',
      icon: Star
    }
  ];

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'sales': return <TrendingUp className="w-4 h-4" />;
      case 'service': return <Users className="w-4 h-4" />;
      case 'marketing': return <BarChart3 className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Calculate goal progress
  const calculateProgress = (current, target) => {
    if (typeof target === 'string') {
      const targetNum = parseInt(target.match(/\d+/)[0]);
      return Math.min((current / targetNum) * 100, 100);
    }
    return Math.min((current / target) * 100, 100);
  };

  // Handle add goal
  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goalToAdd = {
        id: Date.now(),
        ...newGoal,
        current: 0,
        status: 'in-progress',
        employee: selectedEmployee === 'all' ? 'Ümumi' : employees.find(e => e.id === parseInt(selectedEmployee))?.name
      };
      
      // In a real app, this would be saved to backend
      console.log('Yeni hədəf əlavə edildi:', goalToAdd);
      
      setNewGoal({
        title: '',
        description: '',
        target: '',
        deadline: '',
        priority: 'medium',
        category: 'sales'
      });
      setShowAddGoalModal(false);
    }
  };

  // Handle edit goal
  const handleEditGoal = () => {
    if (selectedGoal && newGoal.title && newGoal.target && newGoal.deadline) {
      const updatedGoal = {
        ...selectedGoal,
        ...newGoal
      };
      
      // In a real app, this would update the backend
      console.log('Hədəf yeniləndi:', updatedGoal);
      
      setShowEditGoalModal(false);
      setSelectedGoal(null);
    }
  };

  // Open edit modal
  const openEditModal = (goal) => {
    setSelectedGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      target: goal.target,
      deadline: goal.deadline,
      priority: goal.priority,
      category: goal.category
    });
    setShowEditGoalModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Əməkdaş Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Komanda performansı, hədəflər və iş statistikaları</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold text-gray-800">Filtrlər</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Əməkdaşlar</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.role}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Bu Həftə</option>
              <option value="month">Bu Ay</option>
              <option value="quarter">Bu Rüb</option>
              <option value="year">Bu İl</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Sifarişlər</p>
              <p className="text-3xl font-bold text-gray-900">{workStats.totalOrders}</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{workStats.weeklyGrowth}%</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanmış</p>
              <p className="text-3xl font-bold text-green-600">{workStats.completedOrders}</p>
              <div className="flex items-center space-x-1 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">{(workStats.completedOrders / workStats.totalOrders * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Gəlir</p>
              <p className="text-3xl font-bold text-purple-600">₼{workStats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{workStats.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Məmnuniyyət</p>
              <p className="text-3xl font-bold text-orange-600">{workStats.customerSatisfaction}%</p>
              <div className="flex items-center space-x-1 mt-2">
                <Star className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-600">Əla</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-2xl mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Hədəflər və Performans</h2>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Hədəf</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(goal.category)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                      {goal.priority === 'high' ? 'Yüksək' : goal.priority === 'medium' ? 'Orta' : 'Aşağı'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hədəf:</span>
                    <span className="font-medium text-gray-800">{goal.target}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cari:</span>
                    <span className="font-medium text-gray-800">{goal.current}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bitmə Tarixi:</span>
                    <span className="font-medium text-gray-800">{goal.deadline}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                      {goal.status === 'completed' ? 'Tamamlandı' : goal.status === 'in-progress' ? 'Davam edir' : 'Gecikdi'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Əməkdaş:</span>
                    <span className="font-medium text-gray-800">{goal.employee}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tərəqqi</span>
                    <span className="font-medium text-gray-800">{calculateProgress(goal.current, goal.target).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Komanda Performansı</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Performans:</span>
                    <span className="font-medium text-gray-800">{employee.performance}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${employee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-600">{employee.status === 'online' ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${employee.performance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Son Fəaliyyətlər</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.message}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{activity.employee}</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Hədəf Əlavə Et</h3>
              <button 
                onClick={() => setShowAddGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hədəf başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Hədəf təsviri"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hədəf</label>
                  <input
                    type="text"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məsələn: 50 məhsul"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə Tarixi</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Aşağı</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksək</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sales">Satış</option>
                      <option value="service">Xidmət</option>
                      <option value="marketing">Marketinq</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Hədəfi Redaktə Et</h3>
              <button 
                onClick={() => setShowEditGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hədəf başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Hədəf təsviri"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hədəf</label>
                  <input
                    type="text"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məsələn: 50 məhsul"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə Tarixi</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Aşağı</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksək</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sales">Satış</option>
                      <option value="service">Xidmət</option>
                      <option value="marketing">Marketinq</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditGoalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditGoal}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
