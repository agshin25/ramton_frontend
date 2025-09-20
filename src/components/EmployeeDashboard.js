import React, { useState } from 'react';
import {
  Target,
  CheckCircle,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  Activity,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  Edit,
  Plus,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  useGetTargetsQuery,
  useCreateTargetMutation,
  useUpdateTargetMutation,
  useDeleteTargetMutation,
} from '../services/targetsApi';
import { useGetAdminsQuery } from '../services/adminsApi';

const EmployeeDashboard = () => {
  // API hooks
  const { data: targetsData, isLoading: targetsLoading, isError: targetsError } = useGetTargetsQuery();
  const { data: adminsData } = useGetAdminsQuery();
  const [createTarget, { isLoading: isCreating }] = useCreateTargetMutation();
  const [updateTarget, { isLoading: isUpdating }] = useUpdateTargetMutation();
  const [deleteTarget, { isLoading: isDeleting }] = useDeleteTargetMutation();

  // Extract data from API responses
  const targets = targetsData?.data || [];
  const employees = adminsData?.data?.filter(admin => 
    admin.role_type === 'employee'
  ) || [];

  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    current: '',
    deadline: '',
    priority: 'Orta',
    category: 'Satış',
    status: 'Gözləyir',
    responsible_employee_id: ''
  });

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [errors, setErrors] = useState({});

  // Toast notification function
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Error message handler
  const getErrorMessage = (error) => {
    if (error?.data?.errors) {
      // Handle validation errors - show unified message
      return 'Zəhmət olmasa bütün xətaları düzəldin!';
    }
    
    return error?.data?.message || 'Xəta baş verdi!';
  };

  // Date utility functions
  const getDateRange = (period) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'week':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return { start: startOfWeek, end: endOfWeek };
      
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: startOfMonth, end: endOfMonth };
      
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
        const endOfQuarter = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        return { start: startOfQuarter, end: endOfQuarter };
      
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        return { start: startOfYear, end: endOfYear };
      
      default:
        return { start: null, end: null };
    }
  };

  // Filter targets based on selected employee and period
  const filteredTargets = targets.filter(target => {
    // Filter by employee
    const employeeMatch = selectedEmployee === 'all' || 
      target.responsible_employee_id.toString() === selectedEmployee;
    
    // Filter by period
    const periodMatch = (() => {
      if (selectedPeriod === 'all') return true; // Include all targets when "all" is selected
      if (!target.deadline) return true; // Include targets without deadline
      
      const targetDate = new Date(target.deadline);
      const { start, end } = getDateRange(selectedPeriod);
      
      if (!start || !end) return true; // If no date range, include all
      
      return targetDate >= start && targetDate <= end;
    })();
    
    return employeeMatch && periodMatch;
  });

  // Calculate goal progress
  const calculateProgress = (current, target) => {
    if (!current || !target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // Calculate statistics from targets data
  const calculateStats = () => {
    if (!targets.length) {
      return {
        totalTargets: 0,
        completedTargets: 0,
        inProgressTargets: 0,
        overdueTargets: 0,
        averageProgress: 0,
        highPriorityTargets: 0,
        completionRate: 0
      };
    }

    const totalTargets = targets.length;
    const completedTargets = targets.filter(target => target.status === 'Tamamlandı').length;
    const inProgressTargets = targets.filter(target => target.status === 'Davam edir').length;
    const overdueTargets = targets.filter(target => target.status === 'Gecikdi').length;
    const highPriorityTargets = targets.filter(target => target.priority === 'Yüksək' || target.priority === 'Təcili').length;
    
    const totalProgress = targets.reduce((sum, target) => sum + calculateProgress(target.current, target.target), 0);
    const averageProgress = totalProgress / totalTargets;
    
    const completionRate = totalTargets > 0 ? (completedTargets / totalTargets) * 100 : 0;

    return {
      totalTargets,
      completedTargets,
      inProgressTargets,
      overdueTargets,
      averageProgress,
      highPriorityTargets,
      completionRate
    };
  };

  const stats = calculateStats();

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Yüksək': return 'bg-red-100 text-red-800 border-red-200';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aşağı': return 'bg-green-100 text-green-800 border-green-200';
      case 'Təcili': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı': return 'bg-green-100 text-green-800 border-green-200';
      case 'Davam edir': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Gecikdi': return 'bg-red-100 text-red-800 border-red-200';
      case 'Gözləyir': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Satış': return <TrendingUp className="w-4 h-4" />;
      case 'Müştəri Xidməti': return <Users className="w-4 h-4" />;
      case 'Marketinq': return <BarChart3 className="w-4 h-4" />;
      case 'Maliyyə': return <DollarSign className="w-4 h-4" />;
      case 'İnsan Resursları': return <Users className="w-4 h-4" />;
      case 'İT və Sistemlər': return <Activity className="w-4 h-4" />;
      case 'Təlim və İnkişaf': return <Award className="w-4 h-4" />;
      case 'Strategiya': return <Target className="w-4 h-4" />;
      case 'İnkişaf': return <TrendingUp className="w-4 h-4" />;
      case 'Əməliyyatlar': return <Package className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Reset form function
  const resetForm = () => {
      setNewGoal({
        title: '',
        description: '',
        target: '',
      current: '',
        deadline: '',
      priority: 'Orta',
      category: 'Satış',
      status: 'Gözləyir',
      responsible_employee_id: ''
    });
    setErrors({});
  };

  // Handle add goal
  const handleAddGoal = async () => {
    try {
      setErrors({});
      const targetData = {
        title: newGoal.title,
        description: newGoal.description,
        target: parseInt(newGoal.target),
        current: parseInt(newGoal.current) || 0,
        deadline: newGoal.deadline,
        priority: newGoal.priority,
        category: newGoal.category,
        status: newGoal.status,
        responsible_employee_id: parseInt(newGoal.responsible_employee_id)
      };

      await createTarget(targetData).unwrap();
      showToastNotification('Hədəf uğurla əlavə edildi!', 'success');
      resetForm();
      setShowAddGoalModal(false);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Show toaster notification for validation errors
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      }
    }
  };

  // Handle edit goal
  const handleEditGoal = async () => {
    try {
      setErrors({});
      
      // Only include changed properties
      const targetData = {};
      
      if (newGoal.title !== selectedGoal.title) {
        targetData.title = newGoal.title;
      }
      
      if (newGoal.description !== (selectedGoal.description || '')) {
        targetData.description = newGoal.description;
      }
      
      if (parseInt(newGoal.target) !== selectedGoal.target) {
        targetData.target = parseInt(newGoal.target);
      }
      
      if (parseInt(newGoal.current) !== selectedGoal.current) {
        targetData.current = parseInt(newGoal.current) || 0;
      }
      
      if (newGoal.deadline !== selectedGoal.deadline) {
        targetData.deadline = newGoal.deadline;
      }
      
      if (newGoal.priority !== selectedGoal.priority) {
        targetData.priority = newGoal.priority;
      }
      
      if (newGoal.category !== selectedGoal.category) {
        targetData.category = newGoal.category;
      }
      
      if (newGoal.status !== selectedGoal.status) {
        targetData.status = newGoal.status;
      }
      
      if (parseInt(newGoal.responsible_employee_id) !== selectedGoal.responsible_employee_id) {
        targetData.responsible_employee_id = parseInt(newGoal.responsible_employee_id);
      }

      // Only send request if there are changes
      if (Object.keys(targetData).length === 0) {
        showToastNotification('Heç bir dəyişiklik edilməyib!', 'info');
        return;
      }

      await updateTarget({ id: selectedGoal.id, ...targetData }).unwrap();
      showToastNotification('Hədəf uğurla yeniləndi!', 'success');
      resetForm();
      setShowEditGoalModal(false);
      setSelectedGoal(null);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Show toaster notification for validation errors
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      }
    }
  };

  // Handle delete goal
  const handleDeleteGoal = async () => {
    try {
      await deleteTarget(selectedGoal.id).unwrap();
      showToastNotification('Hədəf uğurla silindi!', 'success');
      setShowDeleteGoalModal(false);
      setSelectedGoal(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToastNotification(errorMessage, 'error');
    }
  };

  // Open edit modal
  const openEditModal = (goal) => {
    setSelectedGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      target: goal.target.toString(),
      current: goal.current.toString(),
      deadline: goal.deadline,
      priority: goal.priority,
      category: goal.category,
      status: goal.status,
      responsible_employee_id: goal.responsible_employee_id.toString()
    });
    setShowEditGoalModal(true);
  };

  // Open delete modal
  const openDeleteModal = (goal) => {
    setSelectedGoal(goal);
    setShowDeleteGoalModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowAddGoalModal(true);
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
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Filtrlər</h2>
            {(() => {
              if (selectedPeriod === 'all') {
                return (
                  <p className="text-sm text-gray-600 mt-1">
                    Seçilmiş dövr: Bütün dövrlər (bütün hədəflər)
                  </p>
                );
              }
              const { start, end } = getDateRange(selectedPeriod);
              if (start && end) {
                return (
                  <p className="text-sm text-gray-600 mt-1">
                    Seçilmiş dövr: {start.toLocaleDateString('az-AZ')} - {end.toLocaleDateString('az-AZ')}
                  </p>
                );
              }
              return null;
            })()}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Əməkdaşlar</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} - {employee.roles?.[0]?.name || 'Əməkdaş'}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Dövrlər</option>
              <option value="week">Bu Həftə</option>
              <option value="month">Bu Ay</option>
              <option value="quarter">Bu Rüb</option>
              <option value="year">Bu İl</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">{filteredTargets.length}</span> hədəf tapıldı
            {selectedEmployee !== 'all' && (
              <span className="ml-2">
                ({employees.find(emp => emp.id.toString() === selectedEmployee)?.first_name} {employees.find(emp => emp.id.toString() === selectedEmployee)?.last_name} üçün)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Hədəflər</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTargets}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Aktiv hədəflər</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanmış</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedTargets}</p>
              <div className="flex items-center space-x-1 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">{stats.completionRate.toFixed(1)}%</span>
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
              <p className="text-sm font-medium text-gray-600">Orta Tərəqqi</p>
              <p className="text-3xl font-bold text-purple-600">{stats.averageProgress.toFixed(1)}%</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600">Ümumi performans</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yüksək Prioritet</p>
              <p className="text-3xl font-bold text-orange-600">{stats.highPriorityTargets}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Star className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-600">Vacib hədəflər</span>
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
              onClick={openAddModal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Hədəf</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {targetsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : targetsError ? (
            <div className="text-center text-red-600 py-8">
              Xəta baş verdi: {targetsError.message}
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTargets.map((goal) => (
              <div key={goal.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(goal.category)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                      <button
                        onClick={() => openDeleteModal(goal)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      <span className="font-medium text-gray-800">{new Date(goal.deadline).toLocaleDateString('az-AZ')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                        {goal.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Əməkdaş:</span>
                      <span className="font-medium text-gray-800">
                        {goal.responsible_employee?.first_name} {goal.responsible_employee?.last_name}
                      </span>
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
          )}
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Komanda Performansı</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-800 truncate">{employee.first_name} {employee.last_name}</h3>
                    <p className="text-sm text-gray-600 truncate">{employee.roles?.[0]?.name || 'Əməkdaş'}</p>
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-600">{employee.status === 'active' ? 'Aktiv' : 'Deaktiv'}</span>
                  </div>
                </div>
                
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-600 truncate ml-2">{employee.email}</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hədəf başlığı"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir *</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Hədəf təsviri"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hədəf *</label>
                  <input
                      type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.target ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Məsələn: 50"
                    />
                    {errors.target && <p className="text-red-500 text-xs mt-1">{errors.target[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
                    <input
                      type="number"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                  />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə Tarixi *</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məsul Əməkdaş *</label>
                  <select
                    value={newGoal.responsible_employee_id}
                    onChange={(e) => setNewGoal({...newGoal, responsible_employee_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.responsible_employee_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Əməkdaş seçin</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.responsible_employee_id && <p className="text-red-500 text-xs mt-1">{errors.responsible_employee_id[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Aşağı">Aşağı</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksək">Yüksək</option>
                      <option value="Təcili">Təcili</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya *</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Satış">Satış</option>
                      <option value="Müştəri Xidməti">Müştəri Xidməti</option>
                      <option value="Marketinq">Marketinq</option>
                      <option value="Maliyyə">Maliyyə</option>
                      <option value="İnsan Resursları">İnsan Resursları</option>
                      <option value="İT və Sistemlər">İT və Sistemlər</option>
                      <option value="Təlim və İnkişaf">Təlim və İnkişaf</option>
                      <option value="Strategiya">Strategiya</option>
                      <option value="İnkişaf">İnkişaf</option>
                      <option value="Əməliyyatlar">Əməliyyatlar</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={newGoal.status}
                    onChange={(e) => setNewGoal({...newGoal, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Davam edir">Davam edir</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="Gecikdi">Gecikdi</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
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
                {isCreating ? 'Əlavə edilir...' : 'Əlavə Et'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hədəf başlığı"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Hədəf təsviri"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hədəf *</label>
                  <input
                      type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.target ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Məsələn: 50"
                    />
                    {errors.target && <p className="text-red-500 text-xs mt-1">{errors.target[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
                    <input
                      type="number"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                  />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə Tarixi *</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məsul Əməkdaş *</label>
                  <select
                    value={newGoal.responsible_employee_id}
                    onChange={(e) => setNewGoal({...newGoal, responsible_employee_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.responsible_employee_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Əməkdaş seçin</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.responsible_employee_id && <p className="text-red-500 text-xs mt-1">{errors.responsible_employee_id[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Aşağı">Aşağı</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksək">Yüksək</option>
                      <option value="Təcili">Təcili</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya *</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Satış">Satış</option>
                      <option value="Müştəri Xidməti">Müştəri Xidməti</option>
                      <option value="Marketinq">Marketinq</option>
                      <option value="Maliyyə">Maliyyə</option>
                      <option value="İnsan Resursları">İnsan Resursları</option>
                      <option value="İT və Sistemlər">İT və Sistemlər</option>
                      <option value="Təlim və İnkişaf">Təlim və İnkişaf</option>
                      <option value="Strategiya">Strategiya</option>
                      <option value="İnkişaf">İnkişaf</option>
                      <option value="Əməliyyatlar">Əməliyyatlar</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={newGoal.status}
                    onChange={(e) => setNewGoal({...newGoal, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Davam edir">Davam edir</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="Gecikdi">Gecikdi</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
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
                {isUpdating ? 'Yenilənir...' : 'Yenilə'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Goal Modal */}
      {showDeleteGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Hədəfi Sil</h3>
                  <p className="text-sm text-gray-600">Bu əməliyyat geri alına bilməz</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                <strong>{selectedGoal?.title}</strong> adlı hədəfi silmək istədiyinizə əminsiniz?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteGoal}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {isDeleting ? 'Silinir...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : toastType === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : toastType === "error" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
