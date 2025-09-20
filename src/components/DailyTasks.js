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
  AlertTriangle,
  X,
  Search,
  Send,
  Target
} from 'lucide-react';
import {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../services/taskApi';
import { useGetAdminsQuery } from '../services/adminsApi';

const DailyTasks = () => {
  // API hooks
  const { data: tasksData, isLoading: tasksLoading, isError: tasksError, refetch } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: adminsData } = useGetAdminsQuery();

  // Extract data from API responses
  const tasks = tasksData?.data || [];
  const admins = adminsData?.data || [];
  
  // Filter employees (role_type = 'employee')
  const employees = admins.filter(admin => admin.role_type === 'employee');
  
  // Filter admins (role_type = 'admin') for assigner
  const adminUsers = admins.filter(admin => admin.role_type === 'admin');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Get single task for editing
  const { data: singleTaskData, isLoading: singleTaskLoading } = useGetTaskQuery(editingTaskId, {
    skip: !editingTaskId
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [errors, setErrors] = useState({});

  // Toast notification function
  const showToastNotification = (message, type = "success") => {
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

  // Categories based on backend TaskCategory enum
  const categories = [
    'Marketinq',
    'Satış',
    'Xidmət',
    'Video Çekiliş',
    'Anbar',
    'Maliyyə',
    'İnsan Resursları',
    'İT və Sistemlər',
    'Araşdırma və İnkişaf',
    'Təlim və İnkişaf',
    'Strategiya'
  ];

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    responsible_employee_id: '',
    assigner_id: '',
    category: '',
    priority: 'Orta',
    deadline_date: new Date().toISOString().split('T')[0],
    deadline_time: '18:00',
    duration: '',
    status: 'Gözləyir',
    notes: ''
  });

  // Reset form function
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      responsible_employee_id: '',
      assigner_id: '',
      category: '',
      priority: 'Orta',
      deadline_date: new Date().toISOString().split('T')[0],
      deadline_time: '18:00',
      duration: '',
      status: 'Gözləyir',
      notes: ''
    });
    setErrors({});
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Gözləyir': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Davam edir': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tamamlandı': return 'bg-green-100 text-green-800 border-green-200';
      case 'Gecikdi': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Gözləyir': return <Clock className="w-4 h-4" />;
      case 'Davam edir': return <Target className="w-4 h-4" />;
      case 'Tamamlandı': return <CheckCircle className="w-4 h-4" />;
      case 'Gecikdi': return <AlertCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    return status || 'Naməlum';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Aşağı': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Orta': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Yüksək': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Təcili': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Aşağı': return '🟢';
      case 'Orta': return '🟡';
      case 'Yüksək': return '🟠';
      case 'Təcili': return '🔴';
      default: return '⚪';
    }
  };

  const getPriorityText = (priority) => {
    return priority || 'Naməlum';
  };

  // CRUD Operations
  const handleCreateTask = async () => {
    try {
      setErrors({});
      const taskData = {
        title: newTask.title,
        description: newTask.description || null,
        responsible_employee_id: parseInt(newTask.responsible_employee_id),
        assigner_id: parseInt(newTask.assigner_id),
        category: newTask.category,
        priority: newTask.priority,
        deadline_date: newTask.deadline_date,
        deadline_time: newTask.deadline_time,
        duration: parseFloat(newTask.duration) || 0,
        status: newTask.status,
        notes: newTask.notes || null,
      };

      await createTask(taskData).unwrap();
      showToastNotification("Tapşırıq uğurla əlavə edildi!", "success");
      // Manually refetch to ensure UI updates
      refetch();
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        responsible_employee_id: '',
        assigner_id: '',
        category: '',
        priority: 'Orta',
        deadline_date: new Date().toISOString().split('T')[0],
        deadline_time: '18:00',
        duration: '',
        status: 'Gözləyir',
        notes: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Tapşırıq əlavə edilərkən xəta:", error);
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Show toaster notification for validation errors
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      }
    }
  };

  const handleEditTask = async () => {
    if (selectedTask) {
      try {
        setErrors({});
        // Only send changed fields
        const taskData = {};
        const originalTask = singleTaskData?.data || selectedTask;

        if (newTask.title !== originalTask.title) taskData.title = newTask.title;
        if (newTask.description !== (originalTask.description || '')) taskData.description = newTask.description || null;
        if (parseInt(newTask.responsible_employee_id) !== originalTask.responsible_employee_id) {
          taskData.responsible_employee_id = parseInt(newTask.responsible_employee_id);
        }
        if (parseInt(newTask.assigner_id) !== originalTask.assigner_id) {
          taskData.assigner_id = parseInt(newTask.assigner_id);
        }
        if (newTask.category !== originalTask.category) taskData.category = newTask.category;
        if (newTask.priority !== originalTask.priority) taskData.priority = newTask.priority;
        if (newTask.deadline_date !== originalTask.deadline_date) taskData.deadline_date = newTask.deadline_date;
        if (newTask.deadline_time !== originalTask.deadline_time) taskData.deadline_time = newTask.deadline_time;
        if (parseFloat(newTask.duration) !== parseFloat(originalTask.duration || 0)) {
          taskData.duration = parseFloat(newTask.duration) || 0;
        }
        if (newTask.status !== originalTask.status) taskData.status = newTask.status;
        if (newTask.notes !== (originalTask.notes || '')) taskData.notes = newTask.notes || null;

        // Only proceed if there are changes
        if (Object.keys(taskData).length === 0) {
          showToastNotification("Heç bir dəyişiklik edilməyib!", "error");
          return;
        }

        await updateTask({ id: selectedTask.id, ...taskData }).unwrap();
        showToastNotification("Tapşırıq uğurla yeniləndi!", "success");
        
        setShowEditModal(false);
        // Manually refetch to ensure UI updates
        refetch();
        setSelectedTask(null);
        setEditingTaskId(null);
      } catch (error) {
        console.error("Tapşırıq yenilənərkən xəta:", error);
        if (error.data?.errors) {
          setErrors(error.data.errors);
          // Show toaster notification for validation errors
          const errorMessage = getErrorMessage(error);
          showToastNotification(errorMessage, "error");
        } else {
          const errorMessage = getErrorMessage(error);
          showToastNotification(errorMessage, "error");
        }
      }
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask.id).unwrap();
        showToastNotification("Tapşırıq uğurla silindi!", "success");
        
        setShowDeleteModal(false);
        // Manually refetch to ensure UI updates
        refetch();
        setSelectedTask(null);
      } catch (error) {
        console.error("Tapşırıq silinərkən xəta:", error);
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      }
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditingTaskId(task.id);
    setErrors({});
    setShowEditModal(true);
  };

  // Update form when single task data is loaded
  useEffect(() => {
    if (singleTaskData?.data && showEditModal) {
      const task = singleTaskData.data;
      setNewTask({
        title: task.title || '',
        description: task.description || '',
        responsible_employee_id: task.responsible_employee_id?.toString() || '',
        assigner_id: task.assigner_id?.toString() || '',
        category: task.category || '',
        priority: task.priority || 'Orta',
        deadline_date: task.deadline_date || new Date().toISOString().split('T')[0],
        deadline_time: task.deadline_time || '18:00',
        duration: task.duration?.toString() || '',
        status: task.status || 'Gözləyir',
        notes: task.notes || ''
      });
    }
  }, [singleTaskData, showEditModal]);

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    const employeeName = task.responsible_employee ? 
      `${task.responsible_employee.first_name} ${task.responsible_employee.last_name}` : '';
    
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignedTo = assignedToFilter === 'all' || 
      (task.responsible_employee && 
       `${task.responsible_employee.first_name} ${task.responsible_employee.last_name}` === assignedToFilter);
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesCategory;
  });

  if (tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Tapşırıqlar yüklənir...</p>
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Tapşırıqlar yüklənərkən xəta baş verdi!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
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

      <div className="max-w-7xl mx-auto space-y-6">
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
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
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
                <option value="Gözləyir">Gözləyir</option>
                <option value="Davam edir">Davam Edir</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="Gecikdi">Gecikdi</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Prioritetlər</option>
                <option value="Aşağı">Aşağı</option>
                <option value="Orta">Orta</option>
                <option value="Yüksək">Yüksək</option>
                <option value="Təcili">Təcili</option>
              </select>
              
              <select
                value={assignedToFilter}
                onChange={(e) => setAssignedToFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Bütün Əməkdaşlar</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={`${employee.first_name} ${employee.last_name}`}>
                    {employee.first_name} {employee.last_name}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 break-words">{task.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 break-words">{task.description}</p>
                </div>
                <div className="flex flex-col space-y-2 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)} flex items-center space-x-1 whitespace-nowrap`}>
                    {getStatusIcon(task.status)}
                    <span>{getStatusText(task.status)}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} flex items-center space-x-1 whitespace-nowrap`}>
                    <span>{getPriorityIcon(task.priority)}</span>
                    <span>{getPriorityText(task.priority)}</span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>
                    {task.responsible_employee 
                      ? `${task.responsible_employee.first_name} ${task.responsible_employee.last_name}`
                      : 'Təyin edilməyib'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{task.deadline_date} {task.deadline_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{task.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Müddət: {task.duration} saat</span>
                </div>
              </div>

              {task.notes && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{task.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Təyin edən: {task.assigner 
                    ? `${task.assigner.first_name} ${task.assigner.last_name}`
                    : 'Naməlum'
                  }
                </span>
                <div className="flex space-x-2 mt-2">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Redaktə et"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(task)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Sil"
                  >
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Tapşırıq Əlavə Et</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tapşırıq Başlığı</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Məsələn: 3 ədəd video çəkməlisiz"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tapşırığın ətraflı təsviri..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilən</label>
                    <select
                      value={newTask.responsible_employee_id}
                      onChange={(e) => setNewTask({...newTask, responsible_employee_id: e.target.value})}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edən</label>
                    <select
                      value={newTask.assigner_id}
                      onChange={(e) => setNewTask({...newTask, assigner_id: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.assigner_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="">Admin seçin</option>
                      {adminUsers.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.first_name} {admin.last_name}
                        </option>
                      ))}
                    </select>
                    {errors.assigner_id && <p className="text-red-500 text-xs mt-1">{errors.assigner_id[0]}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="">Kateqoriya seçin</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.priority ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="Aşağı">Aşağı</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksək">Yüksək</option>
                      <option value="Təcili">Təcili</option>
                    </select>
                    {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority[0]}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Tarix</label>
                    <input
                      type="date"
                      value={newTask.deadline_date}
                      onChange={(e) => setNewTask({...newTask, deadline_date: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    />
                    {errors.deadline_date && <p className="text-red-500 text-xs mt-1">{errors.deadline_date[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Saat</label>
                    <input
                      type="time"
                      value={newTask.deadline_time}
                      onChange={(e) => setNewTask({...newTask, deadline_time: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    />
                    {errors.deadline_time && <p className="text-red-500 text-xs mt-1">{errors.deadline_time[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Müddət (saat)</label>
                    <input
                      type="number"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                      placeholder="4"
                      step="0.5"
                      min="0"
                    />
                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration[0]}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.notes ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Əlavə qeydlər..."
                  />
                  {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>}
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
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isCreating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                  Tapşırıq Göndər
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Tapşırığı Redaktə Et</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTaskId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {singleTaskLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Tapşırıq yüklənir...</span>
                </div>
              ) : (
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tapşırıq Başlığı</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Məsələn: 3 ədəd video çəkməlisiz"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tapşırığın ətraflı təsviri..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilən</label>
                    <select
                      value={newTask.responsible_employee_id}
                      onChange={(e) => setNewTask({...newTask, responsible_employee_id: e.target.value})}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edən</label>
                    <select
                      value={newTask.assigner_id}
                      onChange={(e) => setNewTask({...newTask, assigner_id: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.assigner_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="">Admin seçin</option>
                      {adminUsers.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.first_name} {admin.last_name}
                        </option>
                      ))}
                    </select>
                    {errors.assigner_id && <p className="text-red-500 text-xs mt-1">{errors.assigner_id[0]}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="">Kateqoriya seçin</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.priority ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                      <option value="Aşağı">Aşağı</option>
                      <option value="Orta">Orta</option>
                      <option value="Yüksək">Yüksək</option>
                      <option value="Təcili">Təcili</option>
                    </select>
                    {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority[0]}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Tarix</label>
                    <input
                      type="date"
                      value={newTask.deadline_date}
                      onChange={(e) => setNewTask({...newTask, deadline_date: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    />
                    {errors.deadline_date && <p className="text-red-500 text-xs mt-1">{errors.deadline_date[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Saat</label>
                    <input
                      type="time"
                      value={newTask.deadline_time}
                      onChange={(e) => setNewTask({...newTask, deadline_time: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    />
                    {errors.deadline_time && <p className="text-red-500 text-xs mt-1">{errors.deadline_time[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Müddət (saat)</label>
                    <input
                      type="number"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                      placeholder="4"
                      step="0.5"
                      min="0"
                    />
                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration[0]}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.notes ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Əlavə qeydlər..."
                  />
                  {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>}
                </div>
              </div>
              )}
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTaskId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Tapşırığı Sil</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Bu tapşırığı silmək istədiyinizə əminsiniz?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "{selectedTask?.title}" tapşırığı silinəcək və bu əməliyyat geri alına bilməz.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;
