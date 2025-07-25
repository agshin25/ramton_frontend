import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ShoppingBag
} from 'lucide-react';

const Customers = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(8);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    status: 'Aktiv',
    joinDate: '',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: '',
    notes: '',
    assignedZones: []
  });

  // Sample zones data
  const zones = [
    { id: 1, name: 'Bakı Mərkəz', city: 'Bakı', deliveryTime: '1-2 saat', courierCount: 3 },
    { id: 2, name: 'Sumqayıt', city: 'Sumqayıt', deliveryTime: '2-3 saat', courierCount: 2 },
    { id: 3, name: 'Gəncə', city: 'Gəncə', deliveryTime: '3-4 saat', courierCount: 1 },
    { id: 4, name: 'Mingəçevir', city: 'Mingəçevir', deliveryTime: '4-5 saat', courierCount: 1 },
    { id: 5, name: 'Şirvan', city: 'Şirvan', deliveryTime: '3-4 saat', courierCount: 0 },
    { id: 6, name: 'Naxçıvan', city: 'Naxçıvan', deliveryTime: '5-6 saat', courierCount: 0 },
    { id: 7, name: 'Bakı - Binəqədi', city: 'Bakı', deliveryTime: '1-2 saat', courierCount: 2 },
    { id: 8, name: 'Bakı - Nərimanov', city: 'Bakı', deliveryTime: '1-2 saat', courierCount: 1 }
  ];

  // Sample customers data
  const initialCustomers = [
    {
      id: 1,
      name: 'Əli Məmmədov',
      email: 'ali@example.com',
      phone: '+994 50 123 45 67',
      address: 'Bakı şəhəri, Nərimanov rayonu, Atatürk prospekti 123',
      city: 'Bakı',
      status: 'Aktiv',
      joinDate: '2023-01-15',
      totalOrders: 25,
      totalSpent: 3450.50,
      lastOrderDate: '2024-01-20',
      notes: 'Daimi müştəri, tez-tez sifariş verir',
      assignedZones: [1, 7] // Bakı Mərkəz, Bakı - Binəqədi
    },
    {
      id: 2,
      name: 'Aysu Hüseynova',
      email: 'aysu@example.com',
      phone: '+994 55 987 65 43',
      address: 'Sumqayıt şəhəri, Mərkəz rayonu, Azərbaycan küçəsi 45',
      city: 'Sumqayıt',
      status: 'Aktiv',
      joinDate: '2023-03-22',
      totalOrders: 18,
      totalSpent: 2100.75,
      lastOrderDate: '2024-01-18',
      notes: 'Elektronika məhsullarına marağı var',
      assignedZones: [2] // Sumqayıt
    },
    {
      id: 3,
      name: 'Məhəmməd Əliyev',
      email: 'məhəmməd@example.com',
      phone: '+994 70 456 78 90',
      address: 'Gəncə şəhəri, Kəpəz rayonu, Heydər Əliyev prospekti 78',
      city: 'Gəncə',
      status: 'Aktiv',
      joinDate: '2023-02-10',
      totalOrders: 32,
      totalSpent: 4200.25,
      lastOrderDate: '2024-01-22',
      notes: 'Yüksək dəyərli sifarişlər verir',
      assignedZones: [3] // Gəncə
    },
    {
      id: 4,
      name: 'Leyla Məmmədli',
      email: 'leyla@example.com',
      phone: '+994 51 234 56 78',
      address: 'Bakı şəhəri, Binəqədi rayonu, Əhməd Rəcəbli küçəsi 12',
      city: 'Bakı',
      status: 'Gözləyir',
      joinDate: '2024-01-05',
      totalOrders: 3,
      totalSpent: 450.00,
      lastOrderDate: '2024-01-15',
      notes: 'Yeni müştəri, dəstəklənməlidir',
      assignedZones: [7] // Bakı - Binəqədi
    },
    {
      id: 5,
      name: 'Orxan Əliyev',
      email: 'orxan@example.com',
      phone: '+994 60 345 67 89',
      address: 'Mingəçevir şəhəri, Mərkəz rayonu, İstiqlal küçəsi 34',
      city: 'Mingəçevir',
      status: 'Aktiv',
      joinDate: '2023-05-18',
      totalOrders: 15,
      totalSpent: 1800.50,
      lastOrderDate: '2024-01-19',
      notes: 'Tez-tez endirimlər soruşur',
      assignedZones: [4] // Mingəçevir
    },
    {
      id: 6,
      name: 'Nigar Əliyeva',
      email: 'nigar@example.com',
      phone: '+994 55 678 90 12',
      address: 'Bakı şəhəri, Yasamal rayonu, Rəşid Behbudov küçəsi 56',
      city: 'Bakı',
      status: 'Passiv',
      joinDate: '2022-11-30',
      totalOrders: 8,
      totalSpent: 950.25,
      lastOrderDate: '2023-12-10',
      notes: 'Uzun müddətdir sifariş vermir',
      assignedZones: [1] // Bakı Mərkəz
    },
    {
      id: 7,
      name: 'Tural Əhmədov',
      email: 'tural@example.com',
      phone: '+994 70 789 01 23',
      address: 'Şirvan şəhəri, Mərkəz rayonu, Azərbaycan prospekti 89',
      city: 'Şirvan',
      status: 'Aktiv',
      joinDate: '2023-07-12',
      totalOrders: 22,
      totalSpent: 2800.75,
      lastOrderDate: '2024-01-21',
      notes: 'Mobil telefon məhsullarına marağı var',
      assignedZones: [5] // Şirvan
    },
    {
      id: 8,
      name: 'Günel Məmmədli',
      email: 'gunel@example.com',
      phone: '+994 51 890 12 34',
      address: 'Naxçıvan şəhəri, Mərkəz rayonu, Heydər Əliyev küçəsi 23',
      city: 'Naxçıvan',
      status: 'Aktiv',
      joinDate: '2023-04-25',
      totalOrders: 12,
      totalSpent: 1600.00,
      lastOrderDate: '2024-01-17',
      notes: 'Laptop və aksesuarlar alır',
      assignedZones: [6] // Naxçıvan
    }
  ];

  const [customers, setCustomers] = useState(initialCustomers);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'bg-green-100 text-green-800';
      case 'Gözləyir': return 'bg-yellow-100 text-yellow-800';
      case 'Passiv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aktiv': return '🟢';
      case 'Gözləyir': return '🟡';
      case 'Passiv': return '🔴';
      default: return '⚪';
    }
  };

  // Zone helper functions
  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Naməlum Zona';
  };

  const getZoneNames = (zoneIds) => {
    if (!zoneIds || zoneIds.length === 0) return 'Zona təyin edilməyib';
    return zoneIds.map(id => getZoneName(id)).join(', ');
  };

  const getZoneById = (zoneId) => {
    return zones.find(zone => zone.id === zoneId);
  };

  const getAssignedZonesForCustomer = (customer) => {
    return customer.assignedZones.map(zoneId => getZoneById(zoneId)).filter(Boolean);
  };

  // Helper function to handle city change and filter zones
  const handleCityChange = (selectedCity, currentAssignedZones) => {
    const zonesForNewCity = zones.filter(zone => zone.city === selectedCity);
    const validZoneIds = zonesForNewCity.map(zone => zone.id);
    const filteredAssignedZones = currentAssignedZones.filter(zoneId => 
      validZoneIds.includes(zoneId)
    );
    
    return {
      city: selectedCity,
      assignedZones: filteredAssignedZones
    };
  };

  // Filtering logic
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

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

  // CRUD functions
  const handleAddCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    const customerToAdd = {
      ...newCustomer,
      id: newId,
      joinDate: newCustomer.joinDate || new Date().toISOString().split('T')[0],
      lastOrderDate: newCustomer.lastOrderDate || '-',
      assignedZones: newCustomer.assignedZones || []
    };
    setCustomers([...customers, customerToAdd]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      status: 'Aktiv',
      joinDate: '',
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: '',
      notes: '',
      assignedZones: []
    });
    setShowAddModal(false);
  };

  const handleEditCustomer = () => {
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id ? { ...selectedCustomer, ...newCustomer } : customer
    ));
    setShowEditModal(false);
  };

  const handleDeleteCustomer = () => {
    setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id));
    setShowDeleteModal(false);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      status: customer.status,
      joinDate: customer.joinDate,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      lastOrderDate: customer.lastOrderDate,
      notes: customer.notes,
      assignedZones: customer.assignedZones || []
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const openViewModal = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Aktiv').length;
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const averageOrderValue = totalOrders > 0 
    ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalOrders).toFixed(2)
    : 0;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Müştərilər
        </h1>
        <p className="text-gray-600 text-lg">Bütün müştərilərin siyahısı və idarəetməsi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Müştəri</p>
              <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Aktiv Müştəri</p>
              <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Sifariş</p>
              <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-purple-600" />
          </div>
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
                  placeholder="Müştəri adı, email və ya telefon..."
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
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Müştəri
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Müştəri</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Əlaqə</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Şəhər</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sifarişlər</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Gəlir</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">ID: {customer.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.city}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Zonalar: {getZoneNames(customer.assignedZones)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusIcon(customer.status)} {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-500">sifariş</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <p className="font-medium text-green-600">{customer.totalSpent.toFixed(2)} ₼</p>
                      <p className="text-xs text-gray-500">ümumi</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(customer)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Bax"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(customer)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Redaktə Et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(customer)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Göstərilir: <span className="font-medium">{indexOfFirstCustomer + 1}</span> - <span className="font-medium">{Math.min(indexOfLastCustomer, filteredCustomers.length)}</span> / <span className="font-medium">{filteredCustomers.length}</span> müştəri
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="İlk səhifə"
                >
                  <ChevronsLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Əvvəlki səhifə"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                      disabled={pageNumber === '...'}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Növbəti səhifə"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
                
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Son səhifə"
                >
                  <ChevronsRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
                )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Müştəri Əlavə Et</h3>
              <button 
                onClick={() => setShowAddModal(false)}
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
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müştəri adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Şəhər seçin</option>
                    <option value="Bakı">Bakı</option>
                    <option value="Sumqayıt">Sumqayıt</option>
                    <option value="Gəncə">Gəncə</option>
                    <option value="Mingəçevir">Mingəçevir</option>
                    <option value="Şirvan">Şirvan</option>
                    <option value="Naxçıvan">Naxçıvan</option>
                    <option value="Şəki">Şəki</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
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
                    value={newCustomer.joinDate}
                    onChange={(e) => setNewCustomer({...newCustomer, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilmiş Zonalar</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {newCustomer.city ? (
                      zones
                        .filter(zone => zone.city === newCustomer.city)
                        .map((zone) => (
                          <label key={zone.id} className="flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              checked={newCustomer.assignedZones.includes(zone.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones: [...newCustomer.assignedZones, zone.id]
                                  });
                                } else {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones: newCustomer.assignedZones.filter(id => id !== zone.id)
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {zone.name} ({zone.city})
                            </span>
                          </label>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">Zona seçmək üçün əvvəlcə şəhər seçin</p>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ünvan</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tam ünvan"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müştəri haqqında əlavə məlumat"
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
                onClick={handleAddCustomer}
                disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Müştəri Redaktə Et</h3>
              <button 
                onClick={() => setShowEditModal(false)}
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
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müştəri adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Şəhər seçin</option>
                    <option value="Bakı">Bakı</option>
                    <option value="Sumqayıt">Sumqayıt</option>
                    <option value="Gəncə">Gəncə</option>
                    <option value="Mingəçevir">Mingəçevir</option>
                    <option value="Şirvan">Şirvan</option>
                    <option value="Naxçıvan">Naxçıvan</option>
                    <option value="Şəki">Şəki</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
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
                    value={newCustomer.joinDate}
                    onChange={(e) => setNewCustomer({...newCustomer, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ümumi Sifariş</label>
                  <input
                    type="number"
                    value={newCustomer.totalOrders}
                    onChange={(e) => setNewCustomer({...newCustomer, totalOrders: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ümumi Gəlir (₼)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCustomer.totalSpent}
                    onChange={(e) => setNewCustomer({...newCustomer, totalSpent: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Son Sifariş Tarixi</label>
                  <input
                    type="date"
                    value={newCustomer.lastOrderDate}
                    onChange={(e) => setNewCustomer({...newCustomer, lastOrderDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilmiş Zonalar</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {newCustomer.city ? (
                      zones
                        .filter(zone => zone.city === newCustomer.city)
                        .map((zone) => (
                          <label key={zone.id} className="flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              checked={newCustomer.assignedZones.includes(zone.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones: [...newCustomer.assignedZones, zone.id]
                                  });
                                } else {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones: newCustomer.assignedZones.filter(id => id !== zone.id)
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {zone.name} ({zone.city})
                            </span>
                          </label>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">Zona seçmək üçün əvvəlcə şəhər seçin</p>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ünvan</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tam ünvan"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müştəri haqqında əlavə məlumat"
                  />
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
                onClick={handleEditCustomer}
                disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Yadda Saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Customer Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Müştərini Sil</h3>
                  <p className="text-sm text-gray-600">Bu əməliyyat geri alına bilməz</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                <strong>{selectedCustomer?.name}</strong> adlı müştərini silmək istədiyinizə əminsiniz?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteCustomer}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Müştəri Məlumatları</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCustomer && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Ad Soyad</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Müştəri ID</p>
                        <p className="font-medium text-gray-900">#{selectedCustomer.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                          {getStatusIcon(selectedCustomer.status)} {selectedCustomer.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      Ünvan Məlumatları
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Şəhər</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tam Ünvan</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Təyin Edilmiş Zonalar</p>
                        <div className="mt-2">
                          {selectedCustomer.assignedZones && selectedCustomer.assignedZones.length > 0 ? (
                            <div className="space-y-2">
                              {selectedCustomer.assignedZones.map((zoneId) => {
                                const zone = getZoneById(zoneId);
                                return zone ? (
                                  <div key={zoneId} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                    <div>
                                      <p className="font-medium text-gray-900">{zone.name}</p>
                                      <p className="text-sm text-gray-600">Çatdırılma vaxtı: {zone.deliveryTime}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">Kuryer sayı</p>
                                      <p className="font-medium text-blue-600">{zone.courierCount}</p>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Hazırda heç bir zona təyin edilməyib</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                      Sifariş Statistikası
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                        <p className="text-sm text-gray-600">Ümumi Sifariş</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedCustomer.totalSpent.toFixed(2)} ₼</p>
                        <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2) : 0} ₼
                        </p>
                        <p className="text-sm text-gray-600">Orta Sifariş</p>
                      </div>
                    </div>
                    {selectedCustomer.lastOrderDate && selectedCustomer.lastOrderDate !== '-' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Son Sifariş Tarixi</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.lastOrderDate}</p>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {selectedCustomer.notes && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-yellow-600" />
                        Qeydlər
                      </h4>
                      <p className="text-gray-700">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </div>
              )}
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
                  openEditModal(selectedCustomer);
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

export default Customers; 