import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Search,
  Filter,
  User,
  MessageSquare,
  FileText,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Eye,
  Trash2,
  Send,
  Download,
  BarChart3,
  Target,
  Users,
  Package,
  Truck,
  Settings
} from 'lucide-react';

const ProblemTracking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(8);

  // Sample departments
  const departments = [
    { id: 'sales', name: 'Satış Departamenti', icon: Package, color: 'blue' },
    { id: 'support', name: 'Müştəri Dəstəyi', icon: Users, color: 'green' },
    { id: 'technical', name: 'Texniki Dəstək', icon: Settings, color: 'purple' },
    { id: 'logistics', name: 'Logistika', icon: Truck, color: 'orange' },
    { id: 'admin', name: 'Administrasiya', icon: BarChart3, color: 'red' }
  ];

  // Sample problems data
  const [problems, setProblems] = useState([
    {
      id: 'PRB-001',
      title: 'Məhsul çatdırılmasında gecikmə',
      description: 'iPhone 15 Pro sifarişi 3 gün gecikmə ilə çatdırıldı',
      department: 'logistics',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Rəşad Əhmədov',
      reportedBy: 'Əli Məmmədov',
      reportedDate: '2024-02-01',
      deadline: '2024-02-05',
      category: 'delivery',
      tags: ['çatdırılma', 'gecikmə', 'müştəri şikayəti'],
      attachments: ['invoice.pdf', 'tracking.pdf'],
      comments: [
        {
          id: 1,
          user: 'Rəşad Əhmədov',
          message: 'Kuryer təyin edildi, sabah çatdırılacaq',
          time: '2024-02-01 14:30',
          type: 'update'
        }
      ]
    },
    {
      id: 'PRB-002',
      title: 'Məhsul keyfiyyət problemi',
      description: 'MacBook Air-də kiçik xarabatlıq aşkar edildi',
      department: 'technical',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Məhəmməd Əliyev',
      reportedBy: 'Aysu Hüseynova',
      reportedDate: '2024-02-02',
      deadline: '2024-02-08',
      category: 'quality',
      tags: ['keyfiyyət', 'xarabatlıq', 'təftiş'],
      attachments: ['photo1.jpg', 'photo2.jpg'],
      comments: []
    }
  ]);

  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    department: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    deadline: '',
    tags: []
  });

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
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'investigating': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'investigating': return <Search className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Get department icon
  const getDepartmentIcon = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    if (dept) {
      const Icon = dept.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
  };

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || problem.department === selectedDepartment;
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
  const handleAddProblem = () => {
    if (newProblem.title && newProblem.description && newProblem.department) {
      const problemToAdd = {
        id: `PRB-${String(problems.length + 1).padStart(3, '0')}`,
        ...newProblem,
        status: 'open',
        reportedBy: 'Cari İstifadəçi',
        reportedDate: new Date().toISOString().split('T')[0],
        attachments: [],
        comments: [],
        tags: newProblem.tags
      };
      
      setProblems([...problems, problemToAdd]);
      
      setNewProblem({
        title: '',
        description: '',
        department: '',
        priority: 'medium',
        category: '',
        assignedTo: '',
        deadline: '',
        tags: []
      });
      setShowAddModal(false);
    }
  };

  // Handle edit problem
  const handleEditProblem = () => {
    if (selectedProblem && newProblem.title && newProblem.description && newProblem.department) {
      const updatedProblems = problems.map(problem => 
        problem.id === selectedProblem.id 
          ? { ...problem, ...newProblem }
          : problem
      );
      
      setProblems(updatedProblems);
      setShowEditModal(false);
      setSelectedProblem(null);
    }
  };

  // Open edit modal
  const openEditModal = (problem) => {
    setSelectedProblem(problem);
    setNewProblem({
      title: problem.title,
      description: problem.description,
      department: problem.department,
      priority: problem.priority,
      category: problem.category,
      assignedTo: problem.assignedTo,
      deadline: problem.deadline,
      tags: problem.tags
    });
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (problem) => {
    setSelectedProblem(problem);
    setShowViewModal(true);
  };

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
              <p className="text-3xl font-bold text-blue-600">{problems.filter(p => p.status === 'open').length}</p>
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
              <p className="text-3xl font-bold text-green-600">{problems.filter(p => p.status === 'resolved').length}</p>
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
              <p className="text-3xl font-bold text-purple-600">{problems.filter(p => p.status === 'in-progress').length}</p>
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
              onClick={() => setShowAddModal(true)}
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
            {departments.map((dept) => (
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
            <option value="open">Açıq</option>
            <option value="in-progress">Davam edir</option>
            <option value="investigating">Araşdırılır</option>
            <option value="resolved">Həll edildi</option>
            <option value="closed">Bağlandı</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">Bütün Prioritetlər</option>
            <option value="high">Yüksək</option>
            <option value="medium">Orta</option>
            <option value="low">Aşağı</option>
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
                <h3 className="text-lg font-semibold text-gray-800">{problem.id}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(problem.priority)}`}>
                    {problem.priority === 'high' ? 'Yüksək' : problem.priority === 'medium' ? 'Orta' : 'Aşağı'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(problem.status)} flex items-center space-x-1`}>
                    {getStatusIcon(problem.status)}
                    <span>{problem.status === 'open' ? 'Açıq' : problem.status === 'in-progress' ? 'Davam edir' : problem.status === 'investigating' ? 'Araşdırılır' : problem.status === 'resolved' ? 'Həll edildi' : 'Bağlandı'}</span>
                  </span>
                </div>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{problem.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{problem.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  {getDepartmentIcon(problem.department)}
                  <span>{departments.find(d => d.id === problem.department)?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{problem.reportedDate}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Təyin edilib:</span>
                  <span className="font-medium text-gray-800">{problem.assignedTo}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bitmə tarixi:</span>
                  <span className="font-medium text-gray-800">{problem.deadline}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kateqoriya:</span>
                  <span className="font-medium text-gray-800">{problem.category}</span>
                </div>
                
                {problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={newProblem.title}
                    onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Problem başlığı"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newProblem.description}
                    onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Problem təsviri"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newProblem.department}
                    onChange={(e) => setNewProblem({...newProblem, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Department seçin</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                  <select
                    value={newProblem.priority}
                    onChange={(e) => setNewProblem({...newProblem, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Aşağı</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksək</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                  <input
                    type="text"
                    value={newProblem.category}
                    onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məsələn: çatdırılma"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin edilib</label>
                  <input
                    type="text"
                    value={newProblem.assignedTo}
                    onChange={(e) => setNewProblem({...newProblem, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə tarixi</label>
                  <input
                    type="date"
                    value={newProblem.deadline}
                    onChange={(e) => setNewProblem({...newProblem, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onClick={handleAddProblem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
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
              <h3 className="text-xl font-semibold text-gray-800">Problem Redaktə Et - {selectedProblem.id}</h3>
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
                    value={newProblem.title}
                    onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Problem başlığı"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newProblem.description}
                    onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Problem təsviri"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newProblem.department}
                    onChange={(e) => setNewProblem({...newProblem, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Department seçin</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                  <select
                    value={newProblem.priority}
                    onChange={(e) => setNewProblem({...newProblem, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Aşağı</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksək</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                  <input
                    type="text"
                    value={newProblem.category}
                    onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məsələn: çatdırılma"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin edilib</label>
                  <input
                    type="text"
                    value={newProblem.assignedTo}
                    onChange={(e) => setNewProblem({...newProblem, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitmə tarixi</label>
                  <input
                    type="date"
                    value={newProblem.deadline}
                    onChange={(e) => setNewProblem({...newProblem, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedProblem.status}
                    onChange={(e) => {
                      const updatedProblem = {...selectedProblem, status: e.target.value};
                      setSelectedProblem(updatedProblem);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="open">Açıq</option>
                    <option value="in-progress">Davam edir</option>
                    <option value="investigating">Araşdırılır</option>
                    <option value="resolved">Həll edildi</option>
                    <option value="closed">Bağlandı</option>
                  </select>
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
              <h3 className="text-xl font-semibold text-gray-800">Problem Detalları - {selectedProblem.id}</h3>
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
                          {selectedProblem.status === 'open' ? 'Açıq' : selectedProblem.status === 'in-progress' ? 'Davam edir' : selectedProblem.status === 'investigating' ? 'Araşdırılır' : selectedProblem.status === 'resolved' ? 'Həll edildi' : 'Bağlandı'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prioritet:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedProblem.priority)}`}>
                          {selectedProblem.priority === 'high' ? 'Yüksək' : selectedProblem.priority === 'medium' ? 'Orta' : 'Aşağı'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-800">{departments.find(d => d.id === selectedProblem.department)?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Təsvir</h4>
                    <p className="text-gray-700">{selectedProblem.description}</p>
                  </div>
                  
                  {selectedProblem.tags.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3">Teqlər</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProblem.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Comments */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Şərhlər</h4>
                    <div className="space-y-3">
                      {selectedProblem.comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.message}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            comment.type === 'update' ? 'bg-blue-100 text-blue-800' :
                            comment.type === 'resolution' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {comment.type === 'update' ? 'Yeniləmə' : comment.type === 'resolution' ? 'Həll' : 'Şərx'}
                          </span>
                        </div>
                      ))}
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
    </div>
  );
};

export default ProblemTracking;
