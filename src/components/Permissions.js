import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Lock, Eye, X, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Shield, Users, Settings, BarChart3, Package, MapPin,
  UserCheck, Key, Database, FileText, Calendar, Bell
} from 'lucide-react';

const Permissions = () => {
  // Sample permissions data
  const initialPermissions = [
    {
      id: 1,
      name: 'Bütün İcazələr',
      code: 'all',
      description: 'Tam sistemə giriş və bütün funksiyalar',
      category: 'Sistem',
      type: 'system',
      status: 'Aktiv',
      rolesCount: 1,
      createdAt: '2023-01-01',
      updatedAt: '2024-01-25',
      icon: 'Shield',
      color: 'bg-red-100 text-red-800',
      priority: 1
    },
    {
      id: 2,
      name: 'Dashboard',
      code: 'dashboard',
      description: 'Ana səhifə və statistikalar',
      category: 'Əsas',
      type: 'basic',
      status: 'Aktiv',
      rolesCount: 8,
      createdAt: '2023-01-15',
      updatedAt: '2024-01-20',
      icon: 'BarChart3',
      color: 'bg-blue-100 text-blue-800',
      priority: 2
    },
    {
      id: 3,
      name: 'Sifarişlər',
      code: 'orders',
      description: 'Sifariş idarəetməsi və status dəyişiklikləri',
      category: 'Əməliyyat',
      type: 'operation',
      status: 'Aktiv',
      rolesCount: 6,
      createdAt: '2023-02-01',
      updatedAt: '2024-01-22',
      icon: 'Package',
      color: 'bg-green-100 text-green-800',
      priority: 3
    },
    {
      id: 4,
      name: 'Müştərilər',
      code: 'customers',
      description: 'Müştəri məlumatları və idarəetməsi',
      category: 'Əməliyyat',
      type: 'operation',
      status: 'Aktiv',
      rolesCount: 5,
      createdAt: '2023-02-15',
      updatedAt: '2024-01-18',
      icon: 'Users',
      color: 'bg-purple-100 text-purple-800',
      priority: 4
    },
    {
      id: 5,
      name: 'Məhsullar',
      code: 'products',
      description: 'Məhsul kataloqu və qiymət idarəetməsi',
      category: 'Məzmun',
      type: 'content',
      status: 'Aktiv',
      rolesCount: 4,
      createdAt: '2023-03-01',
      updatedAt: '2024-01-19',
      icon: 'Package',
      color: 'bg-yellow-100 text-yellow-800',
      priority: 5
    },
    {
      id: 6,
      name: 'Kateqoriyalar',
      code: 'categories',
      description: 'Məhsul kateqoriyaları idarəetməsi',
      category: 'Məzmun',
      type: 'content',
      status: 'Aktiv',
      rolesCount: 3,
      createdAt: '2023-03-15',
      updatedAt: '2024-01-21',
      icon: 'FileText',
      color: 'bg-indigo-100 text-indigo-800',
      priority: 6
    },
    {
      id: 7,
      name: 'Kuryerlər',
      code: 'couriers',
      description: 'Kuryer idarəetməsi və təyinatı',
      category: 'Əməliyyat',
      type: 'operation',
      status: 'Aktiv',
      rolesCount: 3,
      createdAt: '2023-04-01',
      updatedAt: '2024-01-23',
      icon: 'MapPin',
      color: 'bg-orange-100 text-orange-800',
      priority: 7
    },
    {
      id: 8,
      name: 'Zonalar',
      code: 'zones',
      description: 'Çatdırılma zonaları idarəetməsi',
      category: 'Əməliyyat',
      type: 'operation',
      status: 'Aktiv',
      rolesCount: 3,
      createdAt: '2023-04-15',
      updatedAt: '2024-01-20',
      icon: 'MapPin',
      color: 'bg-teal-100 text-teal-800',
      priority: 8
    },
    {
      id: 9,
      name: 'Əməkdaşlar',
      code: 'employees',
      description: 'Əməkdaş məlumatları və idarəetməsi',
      category: 'İnsan Resursları',
      type: 'hr',
      status: 'Aktiv',
      rolesCount: 2,
      createdAt: '2023-05-01',
      updatedAt: '2024-01-18',
      icon: 'Users',
      color: 'bg-pink-100 text-pink-800',
      priority: 9
    },
    {
      id: 10,
      name: 'Adminlər',
      code: 'admins',
      description: 'Admin istifadəçiləri idarəetməsi',
      category: 'İnsan Resursları',
      type: 'hr',
      status: 'Aktiv',
      rolesCount: 1,
      createdAt: '2023-05-15',
      updatedAt: '2024-01-19',
      icon: 'Shield',
      color: 'bg-red-100 text-red-800',
      priority: 10
    },
    {
      id: 11,
      name: 'Hesabatlar',
      code: 'reports',
      description: 'Hesabat və analitika məlumatları',
      category: 'Analitika',
      type: 'analytics',
      status: 'Aktiv',
      rolesCount: 4,
      createdAt: '2023-06-01',
      updatedAt: '2024-01-22',
      icon: 'BarChart3',
      color: 'bg-blue-100 text-blue-800',
      priority: 11
    },
    {
      id: 12,
      name: 'Analitika',
      code: 'analytics',
      description: 'Detallı məlumat analizi və statistikalar',
      category: 'Analitika',
      type: 'analytics',
      status: 'Aktiv',
      rolesCount: 2,
      createdAt: '2023-06-15',
      updatedAt: '2024-01-21',
      icon: 'BarChart3',
      color: 'bg-indigo-100 text-indigo-800',
      priority: 12
    },
    {
      id: 13,
      name: 'Tənzimləmələr',
      code: 'settings',
      description: 'Sistem parametrləri və konfiqurasiya',
      category: 'Sistem',
      type: 'system',
      status: 'Aktiv',
      rolesCount: 2,
      createdAt: '2023-07-01',
      updatedAt: '2024-01-20',
      icon: 'Settings',
      color: 'bg-gray-100 text-gray-800',
      priority: 13
    },
    {
      id: 14,
      name: 'İstifadəçilər',
      code: 'users',
      description: 'İstifadəçi hesabları idarəetməsi',
      category: 'İnsan Resursları',
      type: 'hr',
      status: 'Aktiv',
      rolesCount: 1,
      createdAt: '2023-07-15',
      updatedAt: '2024-01-18',
      icon: 'Users',
      color: 'bg-purple-100 text-purple-800',
      priority: 14
    },
    {
      id: 15,
      name: 'Loglar',
      code: 'logs',
      description: 'Sistem logları və audit trail',
      category: 'Sistem',
      type: 'system',
      status: 'Aktiv',
      rolesCount: 1,
      createdAt: '2023-08-01',
      updatedAt: '2024-01-19',
      icon: 'FileText',
      color: 'bg-gray-100 text-gray-800',
      priority: 15
    },
    {
      id: 16,
      name: 'Yedəkləmə',
      code: 'backup',
      description: 'Məlumat yedəkləmə və bərpa',
      category: 'Sistem',
      type: 'system',
      status: 'Aktiv',
      rolesCount: 1,
      createdAt: '2023-08-15',
      updatedAt: '2024-01-20',
      icon: 'Database',
      color: 'bg-green-100 text-green-800',
      priority: 16
    }
  ];

  // State management
  const [permissions, setPermissions] = useState(initialPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [permissionsPerPage] = useState(10);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  
  // Form state
  const [newPermission, setNewPermission] = useState({
    name: '',
    code: '',
    description: '',
    category: 'Əsas',
    type: 'basic',
    status: 'Aktiv',
    icon: 'Lock',
    color: 'bg-blue-100 text-blue-800',
    priority: 1
  });

  // Available categories and types
  const categories = [
    'Sistem', 'Əsas', 'Əməliyyat', 'Məzmun', 'İnsan Resursları', 'Analitika'
  ];

  const types = [
    { id: 'system', name: 'Sistem', color: 'bg-red-100 text-red-800' },
    { id: 'basic', name: 'Əsas', color: 'bg-blue-100 text-blue-800' },
    { id: 'operation', name: 'Əməliyyat', color: 'bg-green-100 text-green-800' },
    { id: 'content', name: 'Məzmun', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'hr', name: 'İnsan Resursları', color: 'bg-purple-100 text-purple-800' },
    { id: 'analytics', name: 'Analitika', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const permissionColors = [
    { id: 'bg-red-100 text-red-800', name: 'Qırmızı' },
    { id: 'bg-blue-100 text-blue-800', name: 'Mavi' },
    { id: 'bg-green-100 text-green-800', name: 'Yaşıl' },
    { id: 'bg-yellow-100 text-yellow-800', name: 'Sarı' },
    { id: 'bg-purple-100 text-purple-800', name: 'Bənövşəyi' },
    { id: 'bg-pink-100 text-pink-800', name: 'Çəhrayı' },
    { id: 'bg-indigo-100 text-indigo-800', name: 'İndiqo' },
    { id: 'bg-orange-100 text-orange-800', name: 'Narıncı' },
    { id: 'bg-teal-100 text-teal-800', name: 'Türküş' },
    { id: 'bg-gray-100 text-gray-800', name: 'Boz' }
  ];

  const permissionIcons = [
    { id: 'Lock', name: 'Kilid', icon: Lock },
    { id: 'Shield', name: 'Qalxan', icon: Shield },
    { id: 'Users', name: 'İstifadəçilər', icon: Users },
    { id: 'Settings', name: 'Tənzimləmələr', icon: Settings },
    { id: 'BarChart3', name: 'Hesabat', icon: BarChart3 },
    { id: 'Package', name: 'Paket', icon: Package },
    { id: 'MapPin', name: 'Xəritə', icon: MapPin },
    { id: 'UserCheck', name: 'Yoxlama', icon: UserCheck },
    { id: 'Key', name: 'Açar', icon: Key },
    { id: 'Database', name: 'Verilənlər Bazası', icon: Database },
    { id: 'FileText', name: 'Fayl', icon: FileText },
    { id: 'Calendar', name: 'Təqvim', icon: Calendar },
    { id: 'Bell', name: 'Zəng', icon: Bell }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'bg-green-100 text-green-800';
      case 'Passiv': return 'bg-red-100 text-red-800';
      case 'Gözləyir': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
  };

  const getIconComponent = (iconName) => {
    const iconObj = permissionIcons.find(i => i.id === iconName);
    return iconObj ? iconObj.icon : Lock;
  };

  // Filtering logic
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || permission.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter;
    const matchesType = typeFilter === 'all' || permission.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesType;
  });

  // Pagination logic
  const indexOfLastPermission = currentPage * permissionsPerPage;
  const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;
  const currentPermissions = filteredPermissions.slice(indexOfFirstPermission, indexOfLastPermission);
  const totalPages = Math.ceil(filteredPermissions.length / permissionsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Statistics
  const totalPermissions = permissions.length;
  const activePermissions = permissions.filter(permission => permission.status === 'Aktiv').length;
  const systemPermissions = permissions.filter(permission => permission.type === 'system').length;
  const operationPermissions = permissions.filter(permission => permission.type === 'operation').length;

  // CRUD operations
  const handleAddPermission = () => {
    const newId = Math.max(...permissions.map(p => p.id)) + 1;
    const permissionToAdd = {
      ...newPermission,
      id: newId,
      rolesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPermissions([...permissions, permissionToAdd]);
    setNewPermission({
      name: '',
      code: '',
      description: '',
      category: 'Əsas',
      type: 'basic',
      status: 'Aktiv',
      icon: 'Lock',
      color: 'bg-blue-100 text-blue-800',
      priority: 1
    });
    setShowAddModal(false);
  };

  const handleEditPermission = () => {
    const updatedPermissions = permissions.map(permission => 
      permission.id === selectedPermission.id 
        ? { ...permission, ...newPermission, updatedAt: new Date().toISOString().split('T')[0] }
        : permission
    );
    setPermissions(updatedPermissions);
    setShowEditModal(false);
  };

  const handleDeletePermission = () => {
    setPermissions(permissions.filter(permission => permission.id !== selectedPermission.id));
    setShowDeleteModal(false);
  };

  const openEditModal = (permission) => {
    setSelectedPermission(permission);
    setNewPermission({
      name: permission.name,
      code: permission.code,
      description: permission.description,
      category: permission.category,
      type: permission.type,
      status: permission.status,
      icon: permission.icon,
      color: permission.color,
      priority: permission.priority
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (permission) => {
    setSelectedPermission(permission);
    setShowDeleteModal(true);
  };

  const openViewModal = (permission) => {
    setSelectedPermission(permission);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İcazələr</h1>
        <p className="text-gray-600">Sistem icazələrini idarə edin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi İcazələr</p>
              <p className="text-2xl font-bold text-gray-900">{totalPermissions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktiv İcazələr</p>
              <p className="text-2xl font-bold text-gray-900">{activePermissions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sistem İcazələri</p>
              <p className="text-2xl font-bold text-gray-900">{systemPermissions}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Settings className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Əməliyyat İcazələri</p>
              <p className="text-2xl font-bold text-gray-900">{operationPermissions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="İcazə adı, kodu və ya təsvir axtarın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Aktiv">Aktiv</option>
              <option value="Passiv">Passiv</option>
              <option value="Gözləyir">Gözləyir</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Kateqoriyalar</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Tiplər</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni İcazə</span>
          </button>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İcazə
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kateqoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol Sayı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioritet
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPermissions.map((permission) => {
                const IconComponent = getIconComponent(permission.icon);
                return (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${permission.color} mr-3`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{permission.code}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(permission.type)}`}>
                        {permission.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(permission.status)}`}>
                        {permission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.rolesCount} rol
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{permission.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openViewModal(permission)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Bax"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(permission)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Redaktə Et"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(permission)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Göstərilir {indexOfFirstPermission + 1}-{Math.min(indexOfLastPermission, filteredPermissions.length)} / {filteredPermissions.length} nəticə
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                    disabled={pageNumber === '...'}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNumber === currentPage
                        ? 'bg-blue-600 text-white'
                        : pageNumber === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <>
        {/* Add Modal */}
        {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Yeni İcazə</h3>
            <div className="mb-4">
              <label htmlFor="newPermissionName" className="block text-sm font-medium text-gray-700 mb-1">
                İcazə Adı:
              </label>
              <input
                type="text"
                id="newPermissionName"
                value={newPermission.name}
                onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionCode" className="block text-sm font-medium text-gray-700 mb-1">
                Kod:
              </label>
              <input
                type="text"
                id="newPermissionCode"
                value={newPermission.code}
                onChange={(e) => setNewPermission(prev => ({ ...prev, code: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Təsvir:
              </label>
              <textarea
                id="newPermissionDescription"
                value={newPermission.description}
                onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Kateqoriya:
              </label>
              <select
                id="newPermissionCategory"
                value={newPermission.category}
                onChange={(e) => setNewPermission(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionType" className="block text-sm font-medium text-gray-700 mb-1">
                Tip:
              </label>
              <select
                id="newPermissionType"
                value={newPermission.type}
                onChange={(e) => setNewPermission(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status:
              </label>
              <select
                id="newPermissionStatus"
                value={newPermission.status}
                onChange={(e) => setNewPermission(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Deaktiv">Deaktiv</option>
                <option value="Gözləyir">Gözləyir</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionIcon" className="block text-sm font-medium text-gray-700 mb-1">
                İkon:
              </label>
              <select
                id="newPermissionIcon"
                value={newPermission.icon}
                onChange={(e) => setNewPermission(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {permissionIcons.map(icon => (
                  <option key={icon.id} value={icon.id}>{icon.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionColor" className="block text-sm font-medium text-gray-700 mb-1">
                Rəng:
              </label>
              <select
                id="newPermissionColor"
                value={newPermission.color}
                onChange={(e) => setNewPermission(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {permissionColors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newPermissionPriority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioritet:
              </label>
              <input
                type="number"
                id="newPermissionPriority"
                value={newPermission.priority}
                onChange={(e) => setNewPermission(prev => ({ ...prev, priority: parseInt(e.target.value, 10) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            </div>
            </div>
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleAddPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yadda saxla
                </button>
              </div>
            </div>
          </div>
        
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">İcazə Redaktəsi</h3>
            <div className="mb-4">
              <label htmlFor="editPermissionName" className="block text-sm font-medium text-gray-700 mb-1">
                İcazə Adı:
              </label>
              <input
                type="text"
                id="editPermissionName"
                value={newPermission.name}
                onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionCode" className="block text-sm font-medium text-gray-700 mb-1">
                Kod:
              </label>
              <input
                type="text"
                id="editPermissionCode"
                value={newPermission.code}
                onChange={(e) => setNewPermission(prev => ({ ...prev, code: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Təsvir:
              </label>
              <textarea
                id="editPermissionDescription"
                value={newPermission.description}
                onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Kateqoriya:
              </label>
              <select
                id="editPermissionCategory"
                value={newPermission.category}
                onChange={(e) => setNewPermission(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionType" className="block text-sm font-medium text-gray-700 mb-1">
                Tip:
              </label>
              <select
                id="editPermissionType"
                value={newPermission.type}
                onChange={(e) => setNewPermission(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status:
              </label>
              <select
                id="editPermissionStatus"
                value={newPermission.status}
                onChange={(e) => setNewPermission(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Deaktiv">Deaktiv</option>
                <option value="Gözləyir">Gözləyir</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionIcon" className="block text-sm font-medium text-gray-700 mb-1">
                İkon:
              </label>
              <select
                id="editPermissionIcon"
                value={newPermission.icon}
                onChange={(e) => setNewPermission(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {permissionIcons.map(icon => (
                  <option key={icon.id} value={icon.id}>{icon.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionColor" className="block text-sm font-medium text-gray-700 mb-1">
                Rəng:
              </label>
              <select
                id="editPermissionColor"
                value={newPermission.color}
                onChange={(e) => setNewPermission(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {permissionColors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editPermissionPriority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioritet:
              </label>
              <input
                type="number"
                id="editPermissionPriority"
                value={newPermission.priority}
                onChange={(e) => setNewPermission(prev => ({ ...prev, priority: parseInt(e.target.value, 10) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            </div>
            </div>
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleEditPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yadda saxla
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">İcazə Silinməsi</h3>
            <p className="text-gray-700 mb-4">
              "{selectedPermission.name}" adlı icazəni silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
            </p>
            </div>
            </div>
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleDeletePermission}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">İcazə Məlumatları</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">İcazə Adı:</p>
                <p className="text-gray-900">{selectedPermission.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Kod:</p>
                <p className="text-gray-900">{selectedPermission.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Təsvir:</p>
                <p className="text-gray-900">{selectedPermission.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Kateqoriya:</p>
                <p className="text-gray-900">{selectedPermission.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Tip:</p>
                <p className="text-gray-900">{selectedPermission.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status:</p>
                <p className="text-gray-900">{selectedPermission.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Rol Sayı:</p>
                <p className="text-gray-900">{selectedPermission.rolesCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Yaradılma Tarixi:</p>
                <p className="text-gray-900">{new Date(selectedPermission.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Yenilənmə Tarixi:</p>
                <p className="text-gray-900">{new Date(selectedPermission.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            </div>
            </div>
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
      )}
      </>
    </div>
  );
};

export default Permissions; 