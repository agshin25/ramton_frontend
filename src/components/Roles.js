import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Shield, Users, Eye, X, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Lock, UserCheck, Settings, BarChart3, Package, MapPin
} from 'lucide-react';

const Roles = () => {
  // Sample roles data
  const initialRoles = [
    {
      id: 1,
      name: 'Super Admin',
      type: 'admin',
      description: 'Tam sistemə giriş və bütün funksiyalar',
      permissions: ['all'],
      userCount: 1,
      status: 'Aktiv',
      createdAt: '2023-01-01',
      updatedAt: '2024-01-25',
      color: 'bg-red-100 text-red-800',
      icon: 'Shield'
    },
    {
      id: 2,
      name: 'Admin',
      type: 'admin',
      description: 'Sistem idarəetməsi və hesabatlar',
      permissions: ['dashboard', 'orders', 'customers', 'products', 'categories', 'couriers', 'zones', 'employees', 'reports', 'analytics', 'settings'],
      userCount: 3,
      status: 'Aktiv',
      createdAt: '2023-02-15',
      updatedAt: '2024-01-20',
      color: 'bg-blue-100 text-blue-800',
      icon: 'Settings'
    },
    {
      id: 3,
      name: 'Moderator',
      type: 'admin',
      description: 'Sifariş və məzmun idarəetməsi',
      permissions: ['dashboard', 'orders', 'customers', 'products', 'categories', 'couriers', 'zones', 'reports'],
      userCount: 2,
      status: 'Aktiv',
      createdAt: '2023-03-10',
      updatedAt: '2024-01-18',
      color: 'bg-purple-100 text-purple-800',
      icon: 'UserCheck'
    },
    {
      id: 4,
      name: 'Support',
      type: 'admin',
      description: 'Müştəri dəstəyi və sifariş idarəetməsi',
      permissions: ['dashboard', 'orders', 'customers', 'reports'],
      userCount: 4,
      status: 'Aktiv',
      createdAt: '2023-04-05',
      updatedAt: '2024-01-22',
      color: 'bg-green-100 text-green-800',
      icon: 'Users'
    },
    {
      id: 5,
      name: 'Manager',
      type: 'admin',
      description: 'Biznes əməliyyatları və analitika',
      permissions: ['dashboard', 'orders', 'products', 'employees', 'reports', 'analytics'],
      userCount: 2,
      status: 'Aktiv',
      createdAt: '2023-05-20',
      updatedAt: '2024-01-19',
      color: 'bg-orange-100 text-orange-800',
      icon: 'BarChart3'
    },
    {
      id: 6,
      name: 'Analitik',
      type: 'admin',
      description: 'Məlumat analizi və hesabatlar',
      permissions: ['dashboard', 'reports', 'analytics', 'logs'],
      userCount: 1,
      status: 'Aktiv',
      createdAt: '2023-06-15',
      updatedAt: '2024-01-21',
      color: 'bg-indigo-100 text-indigo-800',
      icon: 'BarChart3'
    },
    {
      id: 7,
      name: 'Satış Məsləhətçisi',
      type: 'employee',
      description: 'Məhsul satışı və müştəri xidməti',
      permissions: ['dashboard', 'products', 'customers', 'orders'],
      userCount: 8,
      status: 'Aktiv',
      createdAt: '2023-07-01',
      updatedAt: '2024-01-23',
      color: 'bg-green-100 text-green-800',
      icon: 'Users'
    },
    {
      id: 8,
      name: 'Kuryer',
      type: 'employee',
      description: 'Çatdırılma və sifariş idarəetməsi',
      permissions: ['dashboard', 'orders', 'zones'],
      userCount: 12,
      status: 'Aktiv',
      createdAt: '2023-08-10',
      updatedAt: '2024-01-24',
      color: 'bg-blue-100 text-blue-800',
      icon: 'Package'
    },
    {
      id: 9,
      name: 'Anbarçı',
      type: 'employee',
      description: 'Məhsul və anbar idarəetməsi',
      permissions: ['dashboard', 'products', 'categories'],
      userCount: 3,
      status: 'Aktiv',
      createdAt: '2023-09-05',
      updatedAt: '2024-01-20',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'Package'
    },
    {
      id: 10,
      name: 'Mühasib',
      type: 'employee',
      description: 'Maliyyə və hesabat idarəetməsi',
      permissions: ['dashboard', 'reports', 'analytics'],
      userCount: 2,
      status: 'Aktiv',
      createdAt: '2023-10-15',
      updatedAt: '2024-01-18',
      color: 'bg-purple-100 text-purple-800',
      icon: 'BarChart3'
    }
  ];

  // State management
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(8);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form state
  const [newRole, setNewRole] = useState({
    name: '',
    type: 'admin',
    description: '',
    permissions: [],
    status: 'Aktiv',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Shield'
  });

  // Available permissions
  const permissions = [
    { id: 'all', name: 'Bütün İcazələr', description: 'Tam sistemə giriş' },
    { id: 'dashboard', name: 'Dashboard', description: 'Ana səhifə və statistikalar' },
    { id: 'orders', name: 'Sifarişlər', description: 'Sifariş idarəetməsi' },
    { id: 'customers', name: 'Müştərilər', description: 'Müştəri idarəetməsi' },
    { id: 'products', name: 'Məhsullar', description: 'Məhsul idarəetməsi' },
    { id: 'categories', name: 'Kateqoriyalar', description: 'Kateqoriya idarəetməsi' },
    { id: 'couriers', name: 'Kuryerlər', description: 'Kuryer idarəetməsi' },
    { id: 'zones', name: 'Zonalar', description: 'Zona idarəetməsi' },
    { id: 'employees', name: 'Əməkdaşlar', description: 'Əməkdaş idarəetməsi' },
    { id: 'admins', name: 'Adminlər', description: 'Admin idarəetməsi' },
    { id: 'reports', name: 'Hesabatlar', description: 'Hesabat və analitika' },
    { id: 'analytics', name: 'Analitika', description: 'Detallı analitika' },
    { id: 'settings', name: 'Tənzimləmələr', description: 'Sistem tənzimləmələri' },
    { id: 'users', name: 'İstifadəçilər', description: 'İstifadəçi idarəetməsi' },
    { id: 'logs', name: 'Loglar', description: 'Sistem logları' },
    { id: 'backup', name: 'Yedəkləmə', description: 'Məlumat yedəkləmə' }
  ];

  // Role types and colors
  const roleTypes = [
    { id: 'admin', name: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { id: 'employee', name: 'Əməkdaş', color: 'bg-blue-100 text-blue-800' }
  ];

  const roleColors = [
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

  const roleIcons = [
    { id: 'Shield', name: 'Qalxan', icon: Shield },
    { id: 'Users', name: 'İstifadəçilər', icon: Users },
    { id: 'Settings', name: 'Tənzimləmələr', icon: Settings },
    { id: 'BarChart3', name: 'Hesabat', icon: BarChart3 },
    { id: 'Package', name: 'Paket', icon: Package },
    { id: 'MapPin', name: 'Xəritə', icon: MapPin },
    { id: 'UserCheck', name: 'Yoxlama', icon: UserCheck },
    { id: 'Lock', name: 'Kilid', icon: Lock }
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
    const typeObj = roleTypes.find(t => t.id === type);
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
  };

  const getIconComponent = (iconName) => {
    const iconObj = roleIcons.find(i => i.id === iconName);
    return iconObj ? iconObj.icon : Shield;
  };

  const getPermissionName = (permissionId) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionDescription = (permissionId) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.description : '';
  };

  // Filtering logic
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    const matchesType = typeFilter === 'all' || role.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

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
  const totalRoles = roles.length;
  const activeRoles = roles.filter(role => role.status === 'Aktiv').length;
  const adminRoles = roles.filter(role => role.type === 'admin').length;
  const employeeRoles = roles.filter(role => role.type === 'employee').length;

  // CRUD operations
  const handleAddRole = () => {
    const newId = Math.max(...roles.map(r => r.id)) + 1;
    const roleToAdd = {
      ...newRole,
      id: newId,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, roleToAdd]);
    setNewRole({
      name: '',
      type: 'admin',
      description: '',
      permissions: [],
      status: 'Aktiv',
      color: 'bg-blue-100 text-blue-800',
      icon: 'Shield'
    });
    setShowAddModal(false);
  };

  const handleEditRole = () => {
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, ...newRole, updatedAt: new Date().toISOString().split('T')[0] }
        : role
    );
    setRoles(updatedRoles);
    setShowEditModal(false);
  };

  const handleDeleteRole = () => {
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setShowDeleteModal(false);
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      type: role.type,
      description: role.description,
      permissions: role.permissions,
      status: role.status,
      color: role.color,
      icon: role.icon
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const openViewModal = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rollar və İcazələr</h1>
        <p className="text-gray-600">Sistem rollarını və icazələrini idarə edin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Rollar</p>
              <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktiv Rollar</p>
              <p className="text-2xl font-bold text-gray-900">{activeRoles}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Rolları</p>
              <p className="text-2xl font-bold text-gray-900">{adminRoles}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Əməkdaş Rolları</p>
              <p className="text-2xl font-bold text-gray-900">{employeeRoles}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
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
                placeholder="Rol adı və ya təsviri axtarın..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Tiplər</option>
              <option value="admin">Admin</option>
              <option value="employee">Əməkdaş</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Rol</span>
          </button>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İstifadəçi Sayı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İcazə Sayı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Yenilənmə
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRoles.map((role) => {
                const IconComponent = getIconComponent(role.icon);
                return (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${role.color} mr-3`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(role.type)}`}>
                        {role.type === 'admin' ? 'Admin' : 'Əməkdaş'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.userCount} istifadəçi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.permissions.length} icazə
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.status)}`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openViewModal(role)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Bax"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(role)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Redaktə Et"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(role)}
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
                Göstərilir {indexOfFirstRole + 1}-{Math.min(indexOfLastRole, filteredRoles.length)} / {filteredRoles.length} nəticə
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

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Rol Əlavə Et</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Adı</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rol adını daxil edin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Tipi</label>
                  <select
                    value={newRole.type}
                    onChange={(e) => setNewRole({...newRole, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newRole.status}
                    onChange={(e) => setNewRole({...newRole, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rəng</label>
                  <select
                    value={newRole.color}
                    onChange={(e) => setNewRole({...newRole, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleColors.map(color => (
                      <option key={color.id} value={color.id}>{color.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                  <select
                    value={newRole.icon}
                    onChange={(e) => setNewRole({...newRole, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleIcons.map(icon => (
                      <option key={icon.id} value={icon.id}>{icon.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rol haqqında təsvir"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İcazələr</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRole({
                                ...newRole,
                                permissions: [...newRole.permissions, permission.id]
                              });
                            } else {
                              setNewRole({
                                ...newRole,
                                permissions: newRole.permissions.filter(id => id !== permission.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
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
                onClick={handleAddRole}
                disabled={!newRole.name || !newRole.description}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rolu Redaktə Et</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Adı</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Tipi</label>
                  <select
                    value={newRole.type}
                    onChange={(e) => setNewRole({...newRole, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newRole.status}
                    onChange={(e) => setNewRole({...newRole, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rəng</label>
                  <select
                    value={newRole.color}
                    onChange={(e) => setNewRole({...newRole, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleColors.map(color => (
                      <option key={color.id} value={color.id}>{color.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                  <select
                    value={newRole.icon}
                    onChange={(e) => setNewRole({...newRole, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roleIcons.map(icon => (
                      <option key={icon.id} value={icon.id}>{icon.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İcazələr</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRole({
                                ...newRole,
                                permissions: [...newRole.permissions, permission.id]
                              });
                            } else {
                              setNewRole({
                                ...newRole,
                                permissions: newRole.permissions.filter(id => id !== permission.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
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
                onClick={handleEditRole}
                disabled={!newRole.name || !newRole.description}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-lg mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rolu Sil</h3>
                  <p className="text-sm text-gray-600">Bu əməliyyat geri alına bilməz</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                <strong>{selectedRole.name}</strong> rolunu silmək istədiyinizə əminsiniz? 
                Bu rol {selectedRole.userCount} istifadəçi tərəfindən istifadə olunur.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteRole}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Role Modal */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rol Məlumatları</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Rol Adı</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedRole.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Təsvir</label>
                        <p className="text-gray-700">{selectedRole.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Tip</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedRole.type)}`}>
                            {selectedRole.type === 'admin' ? 'Admin' : 'Əməkdaş'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRole.status)}`}>
                            {selectedRole.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      İstifadəçi Statistikaları
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedRole.userCount}</p>
                        <p className="text-sm text-gray-600">İstifadəçi</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedRole.permissions.length}</p>
                        <p className="text-sm text-gray-600">İcazə</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-green-600" />
                    İcazələr
                  </h4>
                  <div className="space-y-3">
                    {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                      selectedRole.permissions.map((permissionId) => {
                        const permission = permissions.find(p => p.id === permissionId);
                        return permission ? (
                          <div key={permissionId} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Lock className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                            </div>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p className="text-gray-500 italic">Hazırda heç bir icazə təyin edilməyib</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Əlavə Məlumatlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Yaradılma Tarixi</label>
                    <p className="text-gray-900">{selectedRole.createdAt}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Son Yenilənmə</label>
                    <p className="text-gray-900">{selectedRole.updatedAt}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Rol ID</label>
                    <p className="text-gray-900">#{selectedRole.id}</p>
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
                  openEditModal(selectedRole);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default Roles; 