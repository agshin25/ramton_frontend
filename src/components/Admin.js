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
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  useGetAdminsQuery, 
  useGetAdminQuery,
  useCreateAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation 
} from '../services/adminsApi';
import { useGetRolesQuery } from '../services/rolesApi';
import { useGetCountriesQuery } from '../services/countriesApi';



const Admin = () => {
  // API hooks
  const { data: adminsData, isLoading: adminsLoading } = useGetAdminsQuery();
  const { data: rolesData } = useGetRolesQuery();
  const { data: countriesData } = useGetCountriesQuery();
  
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

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
  
  // Get single admin details for view modal
  const { data: adminDetails, isLoading: adminDetailsLoading } = useGetAdminQuery(selectedAdmin?.id, {
    skip: !selectedAdmin?.id
  });
  
  const [newAdmin, setNewAdmin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_type: 'admin',
    status: 'active',
    country_id: '',
    city_id: '',
    role_ids: [],
    password: ''
  });

  // Toast notification states
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});

  // Employee modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_type: 'employee',
    status: 'active',
    country_id: '',
    city_id: '',
    role_ids: [],
    password: ''
  });

  // Process API data
  const admins = adminsData?.data?.filter(admin => admin.role_type === 'admin') || [];
  const employees = adminsData?.data?.filter(admin => admin.role_type === 'employee') || [];

  // Toast notification component
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  // Available roles from API
  const adminRoles = rolesData?.data || [];





  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deactive': return 'bg-red-100 text-red-800';
      case 'passiv': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'deactive': return 'Deaktiv';
      case 'passiv': return 'Passiv';
      default: return status;
    }
  };

  const getRoleColor = (roleId) => {
    const role = adminRoles.find(r => r.id === roleId);
    return role ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };


  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  // Filtering logic
  const filteredAdmins = admins.filter(admin => {
    const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    const matchesRole = roleFilter === 'all' || (admin.roles && admin.roles.some(role => role.name === roleFilter));
    return matchesSearch && matchesStatus && matchesRole;
  });

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesRole = roleFilter === 'all' || (employee.roles && employee.roles.some(role => role.name === roleFilter));
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
  const handleAddAdmin = async () => {
    try {
      setErrors({});
      const adminData = {
      ...newAdmin,
        role_type: 'admin',
        profile_type: null
    };
      
      await createAdmin(adminData).unwrap();
      showToast('Admin uğurla əlavə edildi', 'success');
    setNewAdmin({
        first_name: '',
        last_name: '',
      email: '',
      phone: '',
        role_type: 'admin',
        status: 'active',
        country_id: '',
        city_id: '',
        role_ids: [],
        password: ''
    });
    setShowAddAdminModal(false);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        showToast('Zəhmət olmasa bütün xətaları düzəldin!', 'error');
      } else {
        showToast(error.data?.message || 'Xəta baş verdi', 'error');
      }
    }
  };

  const handleEditAdmin = async () => {
    try {
      setErrors({});
      const adminData = {
        first_name: newAdmin.first_name,
        last_name: newAdmin.last_name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        status: newAdmin.status,
        country_id: newAdmin.country_id,
        city_id: newAdmin.city_id,
        role_ids: newAdmin.role_ids,
        role_type: 'admin',
        profile_type: null
      };
      
      // Only include password if it's provided and not empty
      if (newAdmin.password && newAdmin.password.trim() !== '') {
        adminData.password = newAdmin.password;
      }
      
      await updateAdmin({ id: selectedAdmin.id, ...adminData }).unwrap();
      showToast('Admin uğurla yeniləndi', 'success');
    setShowEditAdminModal(false);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        showToast('Zəhmət olmasa bütün xətaları düzəldin!', 'error');
      } else {
        showToast(error.data?.message || 'Xəta baş verdi', 'error');
      }
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin(selectedAdmin.id).unwrap();
      showToast('Admin uğurla silindi', 'success');
    setShowDeleteAdminModal(false);
    } catch (error) {
      showToast(error.data?.message || 'Xəta baş verdi', 'error');
    }
  };

  const openEditAdminModal = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      phone: admin.phone,
      role_type: admin.role_type,
      status: admin.status,
      country_id: admin.country_id?.toString() || '',
      city_id: admin.city_id?.toString() || '',
      role_ids: admin.roles?.map(role => role.id) || [],
      password: ''
    });
    setErrors({}); // Clear errors when opening modal
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
  const handleAddEmployee = async () => {
    try {
      setErrors({});
      const employeeData = {
      ...newEmployee,
        role_type: 'employee',
        profile_type: null
    };
      
      await createAdmin(employeeData).unwrap();
      showToast('Əməkdaş uğurla əlavə edildi', 'success');
    setNewEmployee({
        first_name: '',
        last_name: '',
      email: '',
      phone: '',
        role_type: 'employee',
        status: 'active',
        country_id: '',
        city_id: '',
        role_ids: [],
        password: ''
    });
    setShowAddEmployeeModal(false);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        showToast('Zəhmət olmasa bütün xətaları düzəldin!', 'error');
      } else {
        showToast(error.data?.message || 'Xəta baş verdi', 'error');
      }
    }
  };

  const handleEditEmployee = async () => {
    try {
      setErrors({});
      const employeeData = {
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        status: newEmployee.status,
        country_id: newEmployee.country_id,
        city_id: newEmployee.city_id,
        role_ids: newEmployee.role_ids,
        role_type: 'employee',
        profile_type: null
      };
      
      // Only include password if it's provided and not empty
      if (newEmployee.password && newEmployee.password.trim() !== '') {
        employeeData.password = newEmployee.password;
      }
      
      await updateAdmin({ id: selectedEmployee.id, ...employeeData }).unwrap();
      showToast('Əməkdaş uğurla yeniləndi', 'success');
    setShowEditEmployeeModal(false);
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        showToast('Zəhmət olmasa bütün xətaları düzəldin!', 'error');
      } else {
        showToast(error.data?.message || 'Xəta baş verdi', 'error');
      }
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteAdmin(selectedEmployee.id).unwrap();
      showToast('Əməkdaş uğurla silindi', 'success');
    setShowDeleteEmployeeModal(false);
    } catch (error) {
      showToast(error.data?.message || 'Xəta baş verdi', 'error');
    }
  };

  const openEditEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      role_type: employee.role_type,
      status: employee.status,
      country_id: employee.country_id?.toString() || '',
      city_id: employee.city_id?.toString() || '',
      role_ids: employee.roles?.map(role => role.id) || [],
      password: ''
    });
    setErrors({}); // Clear errors when opening modal
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
  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;

  // Loading state
  if (adminsLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

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
                <option value="active">Aktiv</option>
                <option value="deactive">Deaktiv</option>
                <option value="passiv">Passiv</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Bütün Rollar</option>
                {adminRoles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
              </select>
            </div>
            
            <button
              onClick={() => {
                if (activeTab === 'admins') {
                  setNewAdmin({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    password: '',
                    status: 'active',
                    country_id: '',
                    city_id: '',
                    role_ids: []
                  });
                  setErrors({}); // Clear errors when opening modal
                  setShowAddAdminModal(true);
                } else {
                  setNewEmployee({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    password: '',
                    status: 'active',
                    country_id: '',
                    city_id: '',
                    role_ids: []
                  });
                  setErrors({}); // Clear errors when opening modal
                  setShowAddEmployeeModal(true);
                }
              }}
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
                      <span className="text-white font-semibold">{getInitials(`${admin.first_name} ${admin.last_name}`)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{admin.first_name} {admin.last_name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.roles?.[0]?.id)}`}>
                          {typeof admin.roles?.[0]?.name === 'string' ? admin.roles[0].name : 'Admin'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                          {getStatusText(admin.status)}
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
                      <span>Qoşulma: {new Date(admin.created_at).toLocaleDateString('az-AZ')}</span>
                    </div>
                    {admin.country && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🌍 {typeof admin.country.name === 'string' ? admin.country.name : 'N/A'}</span>
                      </div>
                    )}
                    {admin.city && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🏙️ {typeof admin.city.name === 'string' ? admin.city.name : 'N/A'}</span>
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
                      <span className="text-white font-semibold">{getInitials(`${employee.first_name} ${employee.last_name}`)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{employee.first_name} {employee.last_name}</h3>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.roles?.[0]?.id)}`}>
                          {typeof employee.roles?.[0]?.name === 'string' ? employee.roles[0].name : 'Əməkdaş'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {getStatusText(employee.status)}
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
                      <Calendar className="w-4 h-4" />
                      <span>Qoşulma: {new Date(employee.created_at).toLocaleDateString('az-AZ')}</span>
                    </div>
                    {employee.country && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🌍 {typeof employee.country.name === 'string' ? employee.country.name : 'N/A'}</span>
                    </div>
                    )}
                    {employee.city && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🏙️ {typeof employee.city.name === 'string' ? employee.city.name : 'N/A'}</span>
                      </div>
                    )}
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
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
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
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={goToLastPage}
                  className="p-2 text-gray-400 hover:text-gray-600"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={newAdmin.first_name}
                    onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={newAdmin.last_name}
                    onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifrə *</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Minimum 8 simvol"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({...newAdmin, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="passiv">Passiv</option>
                    <option value="deactive">Deaktiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ölkə *</label>
                  <select
                    value={newAdmin.country_id}
                    onChange={(e) => setNewAdmin({...newAdmin, country_id: e.target.value, city_id: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countriesData?.data?.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər *</label>
                  <select
                    value={newAdmin.city_id}
                    onChange={(e) => setNewAdmin({...newAdmin, city_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Şəhər seçin</option>
                    {countriesData?.data?.find(country => country.id.toString() === newAdmin.country_id)?.cities?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rollar *</label>
                  <div className={`max-h-32 overflow-y-auto border rounded-lg p-2 ${
                    errors.role_ids ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {adminRoles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={newAdmin.role_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({
                                ...newAdmin,
                                role_ids: [...newAdmin.role_ids, role.id]
                              });
                            } else {
                              setNewAdmin({
                                ...newAdmin,
                                role_ids: newAdmin.role_ids.filter(id => id !== role.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.role_ids && <p className="text-red-500 text-xs mt-1">{errors.role_ids[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isCreating ? 'Əlavə edilir...' : 'Əlavə Et'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={newAdmin.first_name}
                    onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={newAdmin.last_name}
                    onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifrə</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Yeni şifrə (boş buraxın dəyişməmək üçün)"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({...newAdmin, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="deactive">Deaktiv</option>
                    <option value="passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ölkə *</label>
                  <select
                    value={newAdmin.country_id}
                    onChange={(e) => setNewAdmin({...newAdmin, country_id: e.target.value, city_id: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countriesData?.data?.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər *</label>
                  <select
                    value={newAdmin.city_id}
                    onChange={(e) => setNewAdmin({...newAdmin, city_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Şəhər seçin</option>
                    {countriesData?.data?.find(country => country.id.toString() === newAdmin.country_id)?.cities?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rollar *</label>
                  <div className={`max-h-32 overflow-y-auto border rounded-lg p-2 ${
                    errors.role_ids ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {adminRoles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={newAdmin.role_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({
                                ...newAdmin,
                                role_ids: [...newAdmin.role_ids, role.id]
                              });
                            } else {
                              setNewAdmin({
                                ...newAdmin,
                                role_ids: newAdmin.role_ids.filter(id => id !== role.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.role_ids && <p className="text-red-500 text-xs mt-1">{errors.role_ids[0]}</p>}
                </div>
                
                
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newAdmin.notes}
                    onChange={(e) => setNewAdmin({...newAdmin, notes: e.target.value})}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isUpdating ? 'Yenilənir...' : 'Yenilə'}
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
                  {isDeleting ? 'Silinir...' : 'Sil'}
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
              {adminDetailsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : adminDetails?.data ? (
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
                        <p className="font-medium text-gray-900">{adminDetails.data.first_name} {adminDetails.data.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Admin ID</p>
                        <p className="font-medium text-gray-900">#{adminDetails.data.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{adminDetails.data.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-medium text-gray-900">{adminDetails.data.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rol Növü</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(adminDetails.data.role_type)}`}>
                          {typeof adminDetails.data.role_type === 'string' ? adminDetails.data.role_type : 'Admin'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(adminDetails.data.status)}`}>
                          {getStatusText(adminDetails.data.status)}
                        </span>
                      </div>
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
                        <p className="font-medium text-gray-900">{new Date(adminDetails.data.created_at).toLocaleDateString('az-AZ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Son Yenilənmə</p>
                        <p className="font-medium text-gray-900">{new Date(adminDetails.data.updated_at).toLocaleDateString('az-AZ')}</p>
                      </div>
                      {adminDetails.data.country && (
                        <div>
                          <p className="text-sm text-gray-600">Ölkə</p>
                          <p className="font-medium text-gray-900">{adminDetails.data.country.name}</p>
                        </div>
                      )}
                      {adminDetails.data.city && (
                        <div>
                          <p className="text-sm text-gray-600">Şəhər</p>
                          <p className="font-medium text-gray-900">{adminDetails.data.city.name}</p>
                    </div>
                      )}
                      {adminDetails.data.roles && adminDetails.data.roles.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Rollar</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {adminDetails.data.roles.map((role) => (
                              <span key={role.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {role.name}
                              </span>
                            ))}
                  </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Admin məlumatları yüklənə bilmədi</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifrə *</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Şifrə"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="deactive">Deaktiv</option>
                    <option value="passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ölkə *</label>
                  <select
                    value={newEmployee.country_id}
                    onChange={(e) => setNewEmployee({...newEmployee, country_id: e.target.value, city_id: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countriesData?.data?.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər *</label>
                  <select
                    value={newEmployee.city_id}
                    onChange={(e) => setNewEmployee({...newEmployee, city_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Şəhər seçin</option>
                    {countriesData?.data?.find(country => country.id.toString() === newEmployee.country_id)?.cities?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rollar *</label>
                  <div className={`max-h-32 overflow-y-auto border rounded-lg p-2 ${
                    errors.role_ids ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {adminRoles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-2 py-1">
                  <input
                          type="checkbox"
                          checked={newEmployee.role_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewEmployee({
                                ...newEmployee,
                                role_ids: [...newEmployee.role_ids, role.id]
                              });
                            } else {
                              setNewEmployee({
                                ...newEmployee,
                                role_ids: newEmployee.role_ids.filter(id => id !== role.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                </div>
                  {errors.role_ids && <p className="text-red-500 text-xs mt-1">{errors.role_ids[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isCreating ? 'Əlavə edilir...' : 'Əlavə Et'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifrə *</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Şifrə"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="deactive">Deaktiv</option>
                    <option value="passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ölkə *</label>
                  <select
                    value={newEmployee.country_id}
                    onChange={(e) => setNewEmployee({...newEmployee, country_id: e.target.value, city_id: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countriesData?.data?.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər *</label>
                  <select
                    value={newEmployee.city_id}
                    onChange={(e) => setNewEmployee({...newEmployee, city_id: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Şəhər seçin</option>
                    {countriesData?.data?.find(country => country.id.toString() === newEmployee.country_id)?.cities?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rollar *</label>
                  <div className={`max-h-32 overflow-y-auto border rounded-lg p-2 ${
                    errors.role_ids ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {adminRoles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-2 py-1">
                  <input
                          type="checkbox"
                          checked={newEmployee.role_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewEmployee({
                                ...newEmployee,
                                role_ids: [...newEmployee.role_ids, role.id]
                              });
                            } else {
                              setNewEmployee({
                                ...newEmployee,
                                role_ids: newEmployee.role_ids.filter(id => id !== role.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                </div>
                  {errors.role_ids && <p className="text-red-500 text-xs mt-1">{errors.role_ids[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      {showViewEmployeeModal && selectedEmployee && (
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
                <div className="space-y-6">
                  {/* Employee Info */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                      <p className="text-sm text-gray-600">Ad</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.first_name}</p>
                      </div>
                      <div>
                      <p className="text-sm text-gray-600">Soyad</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.last_name}</p>
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
                      <p className="text-sm text-gray-600">Rol Növü</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.role_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEmployee.status)}`}>
                        {getStatusText(selectedEmployee.status)}
                        </span>
                      </div>
                    {selectedEmployee.country && (
                      <div>
                        <p className="text-sm text-gray-600">Ölkə</p>
                        <p className="font-medium text-gray-900">{typeof selectedEmployee.country.name === 'string' ? selectedEmployee.country.name : 'N/A'}</p>
                      </div>
                    )}
                    {selectedEmployee.city && (
                      <div>
                        <p className="text-sm text-gray-600">Şəhər</p>
                        <p className="font-medium text-gray-900">{typeof selectedEmployee.city.name === 'string' ? selectedEmployee.city.name : 'N/A'}</p>
                      </div>
                    )}
                    </div>
                  </div>

                {/* Roles */}
                {selectedEmployee.roles && selectedEmployee.roles.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-purple-600" />
                      Rollar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.roles.map((role) => (
                        <span key={role.id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Tarix Məlumatları
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                      <p className="font-medium text-gray-900">{new Date(selectedEmployee.created_at).toLocaleDateString('az-AZ')}</p>
                      </div>
                        <div>
                      <p className="text-sm text-gray-600">Son Yenilənmə</p>
                      <p className="font-medium text-gray-900">{new Date(selectedEmployee.updated_at).toLocaleDateString('az-AZ')}</p>
                        </div>
                        </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>
              )}
      </>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
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

export default Admin; 