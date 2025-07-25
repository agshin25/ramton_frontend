import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Shield, 
  Users, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Calendar,
  Lock,
  TrendingUp
} from 'lucide-react';

// Employee data that can be used across components
export const employees = [
  {
    id: 1,
    name: 'Əli Məmmədov',
    email: 'ali@example.com',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    phone: '+994 50 123 45 67',
    whatsapp: '@ali_mammadov'
  },
  {
    id: 2,
    name: 'Aysu Həsənli',
    email: 'aysu@example.com',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    phone: '+994 51 234 56 78',
    whatsapp: '@aysu_hasanli'
  },
  {
    id: 3,
    name: 'Fatma Əliyeva',
    email: 'fatma@example.com',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    phone: '+994 55 345 67 89',
    whatsapp: '@fatma_aliyeva'
  },
  {
    id: 4,
    name: 'Rəşad Əhmədov',
    email: 'rashad@example.com',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    phone: '+994 70 456 78 90',
    whatsapp: '@rashad_ahmadov'
  },
  {
    id: 5,
    name: 'Leyla Məmmədli',
    email: 'leyla@example.com',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    phone: '+994 77 567 89 01',
    whatsapp: '@leyla_mammadli'
  }
];

const Admin = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(6);
  const [employeesPerPage] = useState(6);
  const [activeTab, setActiveTab] = useState('admins'); // 'admins' or 'employees'

  // Admin modal states
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [showViewAdminModal, setShowViewAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    roleId: 'admin',
    status: 'Aktiv',
    permissions: [],
    joinDate: '',
    lastLogin: '',
    notes: ''
  });

  // Employee modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    role: 'Satış Məsləhətçisi',
    status: 'Aktiv',
    department: '',
    joinDate: '',
    salary: '',
    notes: ''
  });

  // Sample admins data
  const initialAdmins = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+994 50 111 11 11',
      role: 'Super Admin',
      roleId: 'super_admin',
      status: 'Aktiv',
      permissions: ['all'],
      joinDate: '2023-01-01',
      lastLogin: '2024-01-25 14:30',
      notes: 'Sistem administratoru'
    },
    {
      id: 2,
      name: 'Moderator',
      email: 'mod@example.com',
      phone: '+994 51 222 22 22',
      role: 'Moderator',
      roleId: 'moderator',
      status: 'Aktiv',
      permissions: ['dashboard', 'orders', 'customers', 'products', 'categories', 'couriers', 'zones', 'reports'],
      joinDate: '2023-03-15',
      lastLogin: '2024-01-24 16:45',
      notes: 'Sifariş və müştəri idarəetməsi'
    },
    {
      id: 3,
      name: 'Support',
      email: 'support@example.com',
      phone: '+994 55 333 33 33',
      role: 'Support',
      roleId: 'support',
      status: 'Aktiv',
      permissions: ['dashboard', 'orders', 'customers', 'reports'],
      joinDate: '2023-06-20',
      lastLogin: '2024-01-25 09:15',
      notes: 'Müştəri dəstəyi'
    },
    {
      id: 4,
      name: 'Manager',
      email: 'manager@example.com',
      phone: '+994 70 444 44 44',
      role: 'Manager',
      roleId: 'manager',
      status: 'Gözləyir',
      permissions: ['dashboard', 'orders', 'products', 'employees', 'reports', 'analytics'],
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20 11:20',
      notes: 'Yeni əlavə edilmiş'
    },
    {
      id: 5,
      name: 'Analitik',
      email: 'analyst@example.com',
      phone: '+994 77 555 55 55',
      role: 'Analitik',
      roleId: 'analyst',
      status: 'Aktiv',
      permissions: ['dashboard', 'reports', 'analytics', 'logs'],
      joinDate: '2023-09-01',
      lastLogin: '2024-01-25 10:30',
      notes: 'Məlumat analizi və hesabatlar'
    }
  ];

  const [admins, setAdmins] = useState(initialAdmins);
  const [employeesList, setEmployeesList] = useState(employees);

  // Available roles and permissions
  const adminRoles = [
    { id: 'super_admin', name: 'Super Admin', color: 'bg-red-100 text-red-800' },
    { id: 'admin', name: 'Admin', color: 'bg-blue-100 text-blue-800' },
    { id: 'moderator', name: 'Moderator', color: 'bg-purple-100 text-purple-800' },
    { id: 'support', name: 'Support', color: 'bg-green-100 text-green-800' },
    { id: 'manager', name: 'Manager', color: 'bg-orange-100 text-orange-800' },
    { id: 'analyst', name: 'Analitik', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const employeeRoles = [
    { id: 'sales_consultant', name: 'Satış Məsləhətçisi', color: 'bg-green-100 text-green-800' },
    { id: 'courier', name: 'Kuryer', color: 'bg-blue-100 text-blue-800' },
    { id: 'warehouse', name: 'Anbarçı', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'accountant', name: 'Mühasib', color: 'bg-purple-100 text-purple-800' },
    { id: 'marketing', name: 'Marketinq', color: 'bg-pink-100 text-pink-800' },
    { id: 'customer_service', name: 'Müştəri Xidməti', color: 'bg-teal-100 text-teal-800' },
    { id: 'supervisor', name: 'Nəzarətçi', color: 'bg-gray-100 text-gray-800' }
  ];

  const departments = [
    'Satış', 'Kuryerlik', 'Anbar', 'Mühasibat', 'Marketinq', 'Dəstək', 'İnsan Resursları', 'Texniki Dəstək'
  ];

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

  // Default permissions for each role
  const defaultRolePermissions = {
    super_admin: ['all'],
    admin: ['dashboard', 'orders', 'customers', 'products', 'categories', 'couriers', 'zones', 'employees', 'reports', 'analytics', 'settings'],
    moderator: ['dashboard', 'orders', 'customers', 'products', 'categories', 'couriers', 'zones', 'reports'],
    support: ['dashboard', 'orders', 'customers', 'reports'],
    manager: ['dashboard', 'orders', 'products', 'employees', 'reports', 'analytics'],
    analyst: ['dashboard', 'reports', 'analytics', 'logs']
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'bg-green-100 text-green-800';
      case 'Gözləyir': return 'bg-yellow-100 text-yellow-800';
      case 'Passiv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    const adminRole = adminRoles.find(r => r.name === role);
    const employeeRole = employeeRoles.find(r => r.name === role);
    
    if (adminRole) return adminRole.color;
    if (employeeRole) return employeeRole.color;
    return 'bg-gray-100 text-gray-800';
  };

  // Helper functions for role management (used in role selection)
  const getRoleById = (roleId) => {
    const adminRole = adminRoles.find(r => r.id === roleId);
    const employeeRole = employeeRoles.find(r => r.id === roleId);
    
    return adminRole || employeeRole;
  };

  const getDefaultPermissionsForRole = (roleId) => {
    return defaultRolePermissions[roleId] || [];
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  // Filtering logic
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const filteredEmployees = employeesList.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination logic
  const currentAdmins = filteredAdmins.slice(
    (currentPage - 1) * adminsPerPage,
    currentPage * adminsPerPage
  );

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === 'admins' ? filteredAdmins.length : filteredEmployees.length) / 
    (activeTab === 'admins' ? adminsPerPage : employeesPerPage)
  );

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // CRUD functions for Admins
  const handleAddAdmin = () => {
    const newId = Math.max(...admins.map(a => a.id)) + 1;
    const adminToAdd = {
      ...newAdmin,
      id: newId,
      joinDate: newAdmin.joinDate || new Date().toISOString().split('T')[0],
      lastLogin: '-'
    };
    setAdmins([...admins, adminToAdd]);
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      role: 'Admin',
      roleId: 'admin',
      status: 'Aktiv',
      permissions: [],
      joinDate: '',
      lastLogin: '',
      notes: ''
    });
    setShowAddAdminModal(false);
  };

  const handleEditAdmin = () => {
    setAdmins(admins.map(admin => 
      admin.id === selectedAdmin.id ? { ...selectedAdmin, ...newAdmin } : admin
    ));
    setShowEditAdminModal(false);
  };

  const handleDeleteAdmin = () => {
    setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
    setShowDeleteAdminModal(false);
  };

  const openEditAdminModal = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      permissions: admin.permissions || [],
      joinDate: admin.joinDate,
      lastLogin: admin.lastLogin,
      notes: admin.notes
    });
    setShowEditAdminModal(true);
  };

  const openDeleteAdminModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteAdminModal(true);
  };

  const openViewAdminModal = (admin) => {
    setSelectedAdmin(admin);
    setShowViewAdminModal(true);
  };

  // CRUD functions for Employees
  const handleAddEmployee = () => {
    const newId = Math.max(...employeesList.map(e => e.id)) + 1;
    const employeeToAdd = {
      ...newEmployee,
      id: newId,
      joinDate: newEmployee.joinDate || new Date().toISOString().split('T')[0]
    };
    setEmployeesList([...employeesList, employeeToAdd]);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      role: 'Satış Məsləhətçisi',
      status: 'Aktiv',
      department: '',
      joinDate: '',
      salary: '',
      notes: ''
    });
    setShowAddEmployeeModal(false);
  };

  const handleEditEmployee = () => {
    setEmployeesList(employeesList.map(employee => 
      employee.id === selectedEmployee.id ? { ...selectedEmployee, ...newEmployee } : employee
    ));
    setShowEditEmployeeModal(false);
  };

  const handleDeleteEmployee = () => {
    setEmployeesList(employeesList.filter(employee => employee.id !== selectedEmployee.id));
    setShowDeleteEmployeeModal(false);
  };

  const openEditEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      whatsapp: employee.whatsapp,
      role: employee.role,
      status: employee.status,
      department: employee.department || '',
      joinDate: employee.joinDate,
      salary: employee.salary || '',
      notes: employee.notes || ''
    });
    setShowEditEmployeeModal(true);
  };

  const openDeleteEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteEmployeeModal(true);
  };

  const openViewEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setShowViewEmployeeModal(true);
  };

  // Statistics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'Aktiv').length;
  const totalEmployees = employeesList.length;
  const activeEmployees = employeesList.filter(e => e.status === 'Aktiv').length;

  return (
      <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin və Əməkdaşlar
        </h1>
        <p className="text-gray-600 text-lg">Admin və əməkdaş istifadəçilərinin idarəetməsi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Admin</p>
              <p className="text-2xl font-bold text-blue-600">{totalAdmins}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Aktiv Admin</p>
              <p className="text-2xl font-bold text-green-600">{activeAdmins}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Əməkdaş</p>
              <p className="text-2xl font-bold text-purple-600">{totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Aktiv Əməkdaş</p>
              <p className="text-2xl font-bold text-orange-600">{activeEmployees}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('admins');
              setCurrentPage(1);
            }}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'admins'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Adminlər
          </button>
          <button
            onClick={() => {
              setActiveTab('employees');
              setCurrentPage(1);
            }}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'employees'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Əməkdaşlar
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ad, email və ya telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="Aktiv">Aktiv</option>
                <option value="Gözləyir">Gözləyir</option>
                <option value="Passiv">Passiv</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Bütün Rollar</option>
                {activeTab === 'admins' 
                  ? adminRoles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)
                  : employeeRoles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)
                }
              </select>
            </div>
            
            <button
              onClick={() => activeTab === 'admins' ? setShowAddAdminModal(true) : setShowAddEmployeeModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {activeTab === 'admins' ? 'Yeni Admin' : 'Yeni Əməkdaş'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6">
          {activeTab === 'admins' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAdmins.map((admin) => (
                <div key={admin.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">{getInitials(admin.name)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                          {admin.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                          {admin.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{admin.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Qoşulma: {admin.joinDate}</span>
                    </div>
                    {admin.lastLogin !== '-' && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🕒 Son giriş: {admin.lastLogin}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => openViewAdminModal(admin)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Bax
                    </button>
                    <button 
                      onClick={() => openEditAdminModal(admin)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Redaktə
                    </button>
                    <button 
                      onClick={() => openDeleteAdminModal(admin)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEmployees.map((employee) => (
                <div key={employee.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">{getInitials(employee.name)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                          {employee.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>💬 {employee.whatsapp}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Qoşulma: {employee.joinDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => openViewEmployeeModal(employee)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Bax
                    </button>
                    <button 
                      onClick={() => openEditEmployeeModal(employee)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Redaktə
                    </button>
                    <button 
                      onClick={() => openDeleteEmployeeModal(employee)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {activeTab === 'admins' 
                  ? `${(currentPage - 1) * adminsPerPage + 1}-${Math.min(currentPage * adminsPerPage, filteredAdmins.length)} / ${filteredAdmins.length} admin`
                  : `${(currentPage - 1) * employeesPerPage + 1}-${Math.min(currentPage * employeesPerPage, filteredEmployees.length)} / ${filteredEmployees.length} əməkdaş`
                }
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
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
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

      {/* Admin Modals */}
      <>
        {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Admin Əlavə Et</h3>
              <button 
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Admin adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {adminRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({...newAdmin, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qoşulma Tarixi</label>
                  <input
                    type="date"
                    value={newAdmin.joinDate}
                    onChange={(e) => setNewAdmin({...newAdmin, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İcazələr</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({
                                ...newAdmin,
                                permissions: [...newAdmin.permissions, permission.id]
                              });
                            } else {
                              setNewAdmin({
                                ...newAdmin,
                                permissions: newAdmin.permissions.filter(id => id !== permission.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newAdmin.notes}
                    onChange={(e) => setNewAdmin({...newAdmin, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Admin haqqında əlavə məlumat"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={!newAdmin.name || !newAdmin.email || !newAdmin.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Admin Redaktə Et</h3>
              <button 
                onClick={() => setShowEditAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Admin adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {adminRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({...newAdmin, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qoşulma Tarixi</label>
                  <input
                    type="date"
                    value={newAdmin.joinDate}
                    onChange={(e) => setNewAdmin({...newAdmin, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İcazələr</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({
                                ...newAdmin,
                                permissions: [...newAdmin.permissions, permission.id]
                              });
                            } else {
                              setNewAdmin({
                                ...newAdmin,
                                permissions: newAdmin.permissions.filter(id => id !== permission.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newAdmin.notes}
                    onChange={(e) => setNewAdmin({...newAdmin, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Admin haqqında əlavə məlumat"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditAdminModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditAdmin}
                disabled={!newAdmin.name || !newAdmin.email || !newAdmin.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {showDeleteAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Admini Sil</h3>
                  <p className="text-sm text-gray-600">Bu əməliyyat geri alına bilməz</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                <strong>{selectedAdmin?.name}</strong> adlı admini silmək istədiyinizə əminsiniz?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAdminModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Admin Modal */}
      {showViewAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Admin Məlumatları</h3>
              <button 
                onClick={() => setShowViewAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedAdmin && (
                <div className="space-y-6">
                  {/* Admin Info */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Ad Soyad</p>
                        <p className="font-medium text-gray-900">{selectedAdmin.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Admin ID</p>
                        <p className="font-medium text-gray-900">#{selectedAdmin.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedAdmin.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-medium text-gray-900">{selectedAdmin.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rol</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedAdmin.role)}`}>
                          {selectedAdmin.role}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAdmin.status)}`}>
                          {selectedAdmin.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-green-600" />
                      İcazələr
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedAdmin.permissions && selectedAdmin.permissions.length > 0 ? (
                        selectedAdmin.permissions.map((permissionId) => {
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

                  {/* Activity */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      Fəaliyyət Məlumatları
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                        <p className="font-medium text-gray-900">{selectedAdmin.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Son Giriş</p>
                        <p className="font-medium text-gray-900">{selectedAdmin.lastLogin}</p>
                      </div>
                      {selectedAdmin.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Qeydlər</p>
                          <p className="font-medium text-gray-900">{selectedAdmin.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Employee Modals */}
      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Əməkdaş Əlavə Et</h3>
              <button 
                onClick={() => setShowAddEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={newEmployee.whatsapp}
                    onChange={(e) => setNewEmployee({...newEmployee, whatsapp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {employeeRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departament</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Departament seçin</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maaş (₼)</label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qoşulma Tarixi</label>
                  <input
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newEmployee.notes}
                    onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş haqqında əlavə məlumat"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleAddEmployee}
                disabled={!newEmployee.name || !newEmployee.email || !newEmployee.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Əməkdaş Redaktə Et</h3>
              <button 
                onClick={() => setShowEditEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={newEmployee.whatsapp}
                    onChange={(e) => setNewEmployee({...newEmployee, whatsapp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {employeeRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Gözləyir">Gözləyir</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departament</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Departament seçin</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maaş (₼)</label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qoşulma Tarixi</label>
                  <input
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newEmployee.notes}
                    onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Əməkdaş haqqında əlavə məlumat"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditEmployeeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditEmployee}
                disabled={!newEmployee.name || !newEmployee.email || !newEmployee.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Employee Modal */}
      {showDeleteEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Əməkdaşı Sil</h3>
                  <p className="text-sm text-gray-600">Bu əməliyyat geri alına bilməz</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                <strong>{selectedEmployee?.name}</strong> adlı əməkdaşı silmək istədiyinizə əminsiniz?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteEmployeeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Əməkdaş Məlumatları</h3>
              <button 
                onClick={() => setShowViewEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedEmployee && (
                <div className="space-y-6">
                  {/* Employee Info */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Ad Soyad</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Əməkdaş ID</p>
                        <p className="font-medium text-gray-900">#{selectedEmployee.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.whatsapp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rol</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedEmployee.role)}`}>
                          {selectedEmployee.role}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departament</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.department || 'Təyin edilməyib'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      İş Məlumatları
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.joinDate}</p>
                      </div>
                      {selectedEmployee.salary && (
                        <div>
                          <p className="text-sm text-gray-600">Maaş</p>
                          <p className="font-medium text-gray-900">{selectedEmployee.salary} ₼</p>
                        </div>
                      )}
                      {selectedEmployee.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Qeydlər</p>
                          <p className="font-medium text-gray-900">{selectedEmployee.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
              )}
      </>
    </div>
  );
};

export default Admin; 