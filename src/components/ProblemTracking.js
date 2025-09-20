import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Search,
  Calendar,
  X,
  Eye,
  Trash2,
  Send,
  Download,
  Target,
  Settings,
  Filter
} from 'lucide-react';
import { 
  useGetProblemsQuery, 
  useCreateProblemMutation, 
  useUpdateProblemMutation, 
  useDeleteProblemMutation,
  useGetDepartmentsQuery
} from '../services/problemsApi';
import { useGetAdminsQuery } from '../services/adminsApi';

const ProblemTracking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(8);

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

  // API hooks
  const { data: problemsData, isLoading: problemsLoading, error: problemsError, refetch } = useGetProblemsQuery();
  const { data: departmentsData } = useGetDepartmentsQuery();
  const { data: adminsData } = useGetAdminsQuery();
  const [createProblem, { isLoading: createLoading }] = useCreateProblemMutation();
  const [updateProblem, { isLoading: updateLoading }] = useUpdateProblemMutation();
  const [deleteProblem, { isLoading: deleteLoading }] = useDeleteProblemMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Orta',
    status: 'Açıq',
    category: 'Çatdırılma',
    deadline: '',
    responsible_employee_id: '',
    department_id: ''
  });

  // Enum values
  const priorityOptions = ['Aşağı', 'Orta', 'Yüksək', 'Təcili'];
  const statusOptions = ['Açıq', 'Davam edir', 'Araşdırılır', 'Həll edildi', 'Bağlandı', 'Gecikdi'];
  const categoryOptions = ['Çatdırılma', 'Keyfiyyət'];

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Yüksək': return 'bg-red-100 text-red-800 border-red-200';
      case 'Təcili': return 'bg-red-200 text-red-900 border-red-300';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aşağı': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Açıq': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Davam edir': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Araşdırılır': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Həll edildi': return 'bg-green-100 text-green-800 border-green-200';
      case 'Bağlandı': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Gecikdi': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Açıq': return <AlertTriangle className="w-4 h-4" />;
      case 'Davam edir': return <Target className="w-4 h-4" />;
      case 'Araşdırılır': return <Search className="w-4 h-4" />;
      case 'Həll edildi': return <CheckCircle className="w-4 h-4" />;
      case 'Bağlandı': return <CheckCircle className="w-4 h-4" />;
      case 'Gecikdi': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Get department icon
  const getDepartmentIcon = (departmentId) => {
    const dept = departmentsData?.data?.find(d => d.id === departmentId);
    if (dept) {
      return <Settings className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
  };

  // Get problems from API data
  const problems = problemsData?.data || [];
  
  // Filter employees from admins data (role_type === "employee")
  const employees = adminsData?.data?.filter(admin => admin.role_type === "employee") || [];

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.id.toString().includes(searchTerm);
    const matchesDepartment = selectedDepartment === 'all' || problem.department_id.toString() === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || problem.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || problem.priority === selectedPriority;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  // Handle add problem
  const handleAddProblem = async () => {
    try {
      setErrors({});
      const problemData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        category: formData.category,
        deadline: formData.deadline,
        responsible_employee_id: parseInt(formData.responsible_employee_id),
        department_id: parseInt(formData.department_id)
      };

      await createProblem(problemData).unwrap();
      showToastNotification('Problem uğurla əlavə edildi!', 'success');
      setShowAddModal(false);
      resetForm();
      // Manually refetch to ensure UI updates
      refetch();
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
        console.error('Error creating problem:', error);
      }
  };

  // Handle edit problem
  const handleEditProblem = async () => {
    try {
      if (!selectedProblem) return;
      setErrors({});

      // Only send changed fields for update
      const updateData = {};
      if (formData.title !== selectedProblem.title) updateData.title = formData.title;
      if (formData.description !== selectedProblem.description) updateData.description = formData.description;
      if (formData.priority !== selectedProblem.priority) updateData.priority = formData.priority;
      if (formData.status !== selectedProblem.status) updateData.status = formData.status;
      if (formData.category !== selectedProblem.category) updateData.category = formData.category;
      if (formData.deadline !== selectedProblem.deadline) updateData.deadline = formData.deadline;
      if (formData.responsible_employee_id !== selectedProblem.responsible_employee_id.toString()) {
        updateData.responsible_employee_id = parseInt(formData.responsible_employee_id);
      }
      if (formData.department_id !== selectedProblem.department_id.toString()) {
        updateData.department_id = parseInt(formData.department_id);
      }

      if (Object.keys(updateData).length > 0) {
        await updateProblem({ id: selectedProblem.id, ...updateData }).unwrap();
        showToastNotification('Problem uğurla yeniləndi!', 'success');
        setShowEditModal(false);
        setSelectedProblem(null);
        // Manually refetch to ensure UI updates
        refetch();
        resetForm();
      } else {
        showToastNotification('Heç bir dəyişiklik edilməyib!', 'error');
      }
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
      console.error('Error updating problem:', error);
    }
  };

  // Handle delete problem
  const handleDeleteProblem = async () => {
    if (selectedProblem) {
      try {
        await deleteProblem(selectedProblem.id).unwrap();
        showToastNotification('Problem uğurla silindi!', 'success');
        setShowDeleteModal(false);
        setSelectedProblem(null);
        // Manually refetch to ensure UI updates
        refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToastNotification(errorMessage, 'error');
      console.error('Error deleting problem:', error);
    }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Orta',
      status: 'Açıq',
      category: 'Çatdırılma',
      deadline: '',
      responsible_employee_id: '',
      department_id: ''
    });
    setErrors({});
  };

  // Open edit modal
  const openEditModal = (problem) => {
    setSelectedProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      priority: problem.priority,
      status: problem.status,
      category: problem.category,
      deadline: problem.deadline,
      responsible_employee_id: problem.responsible_employee_id.toString(),
      department_id: problem.department_id.toString()
    });
    setErrors({});
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (problem) => {
    setSelectedProblem(problem);
    setShowViewModal(true);
  };

  // Open delete modal
  const openDeleteModal = (problem) => {
    setSelectedProblem(problem);
    setShowDeleteModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  if (problemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Problemlər yüklənir...</p>
        </div>
      </div>
    );
  }

  if (problemsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Problemlər yüklənərkən xəta baş verdi!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Problem İzləmə və Task Sistemi
        </h1>
        <p className="text-gray-600 text-lg">Department-ə uyğun problemlərin araşdırılması və task idarəetməsi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Problemlər</p>
              <p className="text-3xl font-bold text-gray-900">{problems.length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Açıq Problemlər</p>
              <p className="text-3xl font-bold text-blue-600">{problems.filter(p => p.status === 'Açıq').length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Həll Edilmiş</p>
              <p className="text-3xl font-bold text-green-600">{problems.filter(p => p.status === 'Həll edildi').length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Davam Edir</p>
              <p className="text-3xl font-bold text-purple-600">{problems.filter(p => p.status === 'Davam edir').length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold text-gray-800">Filtrlər və İdarəetmə</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={openAddModal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Problem
            </button>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Hesabat
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Problem axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">Bütün Department-lər</option>
            {departmentsData?.data?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">Bütün Statuslar</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">Bütün Prioritetlər</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          
          <button className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtr
          </button>
        </div>
      </div>

      {/* Problems List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {currentProblems.map((problem) => (
          <div key={problem.id} className="bg-white rounded-2xl transition-all duration-300 transform hover:scale-105">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">#{problem.id}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(problem.priority)}`}>
                    {problem.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(problem.status)} flex items-center space-x-1`}>
                    {getStatusIcon(problem.status)}
                    <span>{problem.status}</span>
                  </span>
                </div>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{problem.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{problem.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  {getDepartmentIcon(problem.department_id)}
                  <span>{departmentsData?.data?.find(d => d.id === problem.department_id)?.name || 'Naməlum Department'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(problem.created_at).toLocaleDateString('az-AZ')}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Təyin edilib:</span>
                  <span className="font-medium text-gray-800">
                    {problem.responsible_employee?.first_name} {problem.responsible_employee?.last_name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bitmə tarixi:</span>
                  <span className="font-medium text-gray-800">{problem.deadline}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kateqoriya:</span>
                  <span className="font-medium text-gray-800">{problem.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => openViewModal(problem)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Bax</span>
                </button>
                <button 
                  onClick={() => openEditModal(problem)}
                  className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Redaktə</span>
                </button>
                <button 
                  onClick={() => openDeleteModal(problem)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Problem Əlavə Et</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Problem başlığı"
                    required
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Problem təsviri"
                    required
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Department seçin</option>
                    {departmentsData?.data?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin edilib *</label>
                  <select
                    value={formData.responsible_employee_id}
                    onChange={(e) => setFormData({...formData, responsible_employee_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.responsible_employee_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə tarixi *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline[0]}</p>}
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
                onClick={handleAddProblem}
                disabled={createLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {createLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Problem Modal */}
      {showEditModal && selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Problem Redaktə Et - #{selectedProblem.id}</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Problem başlığı"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Problem təsviri"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Department seçin</option>
                    {departmentsData?.data?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin edilib</label>
                  <select
                    value={formData.responsible_employee_id}
                    onChange={(e) => setFormData({...formData, responsible_employee_id: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə tarixi</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline[0]}</p>}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditProblem}
                disabled={updateLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {updateLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Problem Modal */}
      {showViewModal && selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Problem Detalları - #{selectedProblem.id}</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Problem Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Problem Məlumatları</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Başlıq:</span>
                        <span className="font-medium text-gray-800">{selectedProblem.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProblem.status)}`}>
                          {selectedProblem.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prioritet:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedProblem.priority)}`}>
                          {selectedProblem.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-800">
                          {departmentsData?.data?.find(d => d.id === selectedProblem.department_id)?.name || 'Naməlum Department'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Təyin edilib:</span>
                        <span className="font-medium text-gray-800">
                          {selectedProblem.responsible_employee?.first_name} {selectedProblem.responsible_employee?.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kateqoriya:</span>
                        <span className="font-medium text-gray-800">{selectedProblem.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bitmə tarixi:</span>
                        <span className="font-medium text-gray-800">{selectedProblem.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Təsvir</h4>
                    <p className="text-gray-700">{selectedProblem.description}</p>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Əlavə Məlumatlar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yaradılma tarixi:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(selectedProblem.created_at).toLocaleDateString('az-AZ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Son yenilənmə:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(selectedProblem.updated_at).toLocaleDateString('az-AZ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bağla
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedProblem);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Problem Modal */}
      {showDeleteModal && selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Problemi Sil</h3>
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
                  <h4 className="text-lg font-medium text-gray-800">Bu problemi silmək istədiyinizə əminsiniz?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    "{selectedProblem.title}" problemi silinəcək və bu əməliyyat geri alına bilməz.
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
                onClick={handleDeleteProblem}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {deleteLoading ? (
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
    </div>
  );
};

export default ProblemTracking;