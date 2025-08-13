import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Square,
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  AlertCircle,
  X,
  Filter,
  Search,
  Send,
  Target,
  Star,
  TrendingUp
} from 'lucide-react';

const DailyTasks = () => {
  // State management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: '3 ədəd video çəkməlisiz',
      description: 'Bu gün 3 ədəd məhsul videosu çəkilməlidir. Keyfiyyətli və professional olmalıdır.',
      assignedTo: 'Nərmin Əliyeva',
      assignedBy: 'Əli Məmmədov',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-31',
      dueTime: '18:00',
      createdAt: '2024-01-31 09:00',
      completedAt: null,
      category: 'Video Çəkilişi',
      estimatedDuration: '4 saat',
      notes: 'Məhsullar: iPhone 15, MacBook Air, Apple Watch'
    },
    {
      id: 2,
      title: 'Müştəri ziyarətləri',
      description: '5 müştəri ilə görüş təyin edilməlidir. Hər biri üçün 30 dəqiqə ayrılmalıdır.',
      assignedTo: 'Rəşad Əhmədov',
      assignedBy: 'Aysu Hüseynova',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-31',
      dueTime: '17:00',
      createdAt: '2024-01-31 08:30',
      completedAt: null,
      category: 'Müştəri Xidməti',
      estimatedDuration: '2.5 saat',
      notes: 'Müştərilər: Əli Məmmədov, Aysu Hüseynova, Məhəmməd Əliyev'
    },
    {
      id: 3,
      title: 'Sosial media postları',
      description: 'Instagram və Facebook üçün 5 post hazırlanmalıdır. Məhsul təqdimatı üçün.',
      assignedTo: 'Elşən Məmmədov',
      assignedBy: 'Əli Məmmədov',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-31',
      dueTime: '16:00',
      createdAt: '2024-01-31 08:00',
      completedAt: '2024-01-31 15:30',
      category: 'Marketinq',
      estimatedDuration: '3 saat',
      notes: 'Postlar hazır və yüklənib'
    },
    {
      id: 4,
      title: 'Anbar inventarizasiyası',
      description: 'Bütün məhsulların sayı yoxlanılmalı və sistemə daxil edilməlidir.',
      assignedTo: 'Orxan Əliyev',
      assignedBy: 'Aysu Hüseynova',
      status: 'overdue',
      priority: 'high',
      dueDate: '2024-01-30',
      dueTime: '18:00',
      createdAt: '2024-01-30 09:00',
      completedAt: null,
      category: 'Anbar',
      estimatedDuration: '6 saat',
      notes: 'Təcili edilməlidir'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample employees for task assignment
  const employees = [
    'Nərmin Əliyeva',
    'Rəşad Əhmədov',
    'Elşən Məmmədov',
    'Orxan Əliyev',
    'Aysu Hüseynova',
    'Əli Məmmədov'
  ];

  const categories = [
    'Video Çəkilişi',
    'Müştəri Xidməti',
    'Marketinq',
    'Anbar',
    'Satış',
    'Texniki Dəstək'
  ];

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    category: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    estimatedDuration: '',
    notes: ''
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Target className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Gözləyir';
      case 'in-progress': return 'Davam edir';
      case 'completed': return 'Tamamlandı';
      case 'overdue': return 'Gecikdi';
      default: return 'Naməlum';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'low': return 'Aşağı';
      case 'medium': return 'Orta';
      case 'high': return 'Yüksək';
      case 'urgent': return 'Təcili';
      default: return 'Naməlum';
    }
  };

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignedTo = assignedToFilter === 'all' || task.assignedTo === assignedToFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gündəlik Tapşırıqlar</h1>
          <p className="text-gray-600">Əməkdaşlara gündəlik tapşırıqlar təyin edin və izləyin</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800">Tapşırıq İdarəetməsi</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Tapşırıq
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tapşırıq axtar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="pending">Gözləyir</option>
                <option value="in-progress">Davam Edir</option>
                <option value="completed">Tamamlandı</option>
                <option value="overdue">Gecikdi</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Prioritetlər</option>
                <option value="low">Aşağı</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksək</option>
                <option value="urgent">Təcili</option>
              </select>
              
              <select
                value={assignedToFilter}
                onChange={(e) => setAssignedToFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Əməkdaşlar</option>
                {employees.map((employee) => (
                  <option key={employee} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Kateqoriyalar</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || assignedToFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">Aktiv Filtrlər:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Axtarış: {searchTerm}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Status: {getStatusText(statusFilter)}
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Prioritet: {getPriorityText(priorityFilter)}
                  </span>
                )}
                {assignedToFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Əməkdaş: {assignedToFilter}
                  </span>
                )}
                {categoryFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Kateqoriya: {categoryFilter}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setAssignedToFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Bütün filtrləri təmizlə
              </button>
            </div>
          </div>
        )}

        {/* Tasks Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)} flex items-center space-x-1`}>
                    {getStatusIcon(task.status)}
                    <span>{getStatusText(task.status)}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} flex items-center space-x-1`}>
                    <span>{getPriorityIcon(task.priority)}</span>
                    <span>{getPriorityText(task.priority)}</span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{task.assignedTo}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{task.dueDate} {task.dueTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{task.category}</span>
                </div>
              </div>

              {task.notes && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{task.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Təyin edən: {task.assignedBy}</span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Tapşırıq Əlavə Et</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tapşırıq Başlığı</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məsələn: 3 ədəd video çəkməlisiz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tapşırığın ətraflı təsviri..."
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilən</label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Əməkdaş seçin</option>
                      {employees.map((employee) => (
                        <option key={employee} value={employee}>
                          {employee}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Kateqoriya seçin</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Aşağı</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksək</option>
                      <option value="urgent">Təcili</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Tarix</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Saat</label>
                    <input
                      type="time"
                      value={newTask.dueTime}
                      onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təxmini Müddət</label>
                    <input
                      type="text"
                      value={newTask.estimatedDuration}
                      onChange={(e) => setNewTask({...newTask, estimatedDuration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Məsələn: 4 saat"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əlavə qeydlər..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
                              <button
                  onClick={() => {
                    const newId = Math.max(...tasks.map(t => t.id)) + 1;
                    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    
                    const taskToAdd = {
                      id: newId,
                      ...newTask,
                      status: 'pending',
                      assignedBy: 'Əli Məmmədov', // Current user
                      createdAt: now,
                      completedAt: null,
                      estimatedDuration: '4 saat' // Default value
                    };
                    
                    setTasks([...tasks, taskToAdd]);
                    setNewTask({
                      title: '',
                      description: '',
                      assignedTo: '',
                      category: '',
                      priority: 'medium',
                      dueDate: new Date().toISOString().split('T')[0],
                      dueTime: '18:00',
                      estimatedDuration: '',
                      notes: ''
                    });
                    setShowAddModal(false);
                  }}
                  disabled={!newTask.title || !newTask.assignedTo || !newTask.category}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  Tapşırıq Göndər
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;
