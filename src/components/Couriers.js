import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Truck,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MapPin,
  X,
  Eye,
  Package,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3
} from 'lucide-react';

const Couriers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [couriersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeliveryReportModal, setShowDeliveryReportModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [newCourier, setNewCourier] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'Aktiv',
    city: '',
    vehicleType: 'Motosiklet',
    licensePlate: '',
    experience: '1-3 il',
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

  // Sample orders data for couriers
  const courierOrders = {
    1: [
      { id: 1, orderNumber: 'ORD-001', customer: 'Əli Məmmədov', product: 'iPhone 15 Pro', status: 'Tamamlandı', date: '2024-01-20', deliveryTime: '2.3 saat', rating: 5 },
      { id: 2, orderNumber: 'ORD-002', customer: 'Fatma Əliyeva', product: 'MacBook Air', status: 'Yönləndirilib', date: '2024-01-21', deliveryTime: '1.8 saat', rating: 4 },
      { id: 3, orderNumber: 'ORD-003', customer: 'Rəşad Əhmədov', product: 'Apple Watch', status: 'Tamamlandı', date: '2024-01-19', deliveryTime: '2.7 saat', rating: 5 },
      { id: 4, orderNumber: 'ORD-004', customer: 'Leyla Məmmədli', product: 'iPad Pro', status: 'Gözləmədə', date: '2024-01-22', deliveryTime: null, rating: null },
      { id: 5, orderNumber: 'ORD-005', customer: 'Orxan Əliyev', product: 'AirPods Pro', status: 'Tamamlandı', date: '2024-01-18', deliveryTime: '2.1 saat', rating: 4 }
    ],
    2: [
      { id: 6, orderNumber: 'ORD-006', customer: 'Aysu Həsənli', product: 'Samsung Galaxy', status: 'Tamamlandı', date: '2024-01-20', deliveryTime: '3.5 saat', rating: 4 },
      { id: 7, orderNumber: 'ORD-007', customer: 'Elşən Məmmədov', product: 'Dell Laptop', status: 'Yönləndirilib', date: '2024-01-21', deliveryTime: '2.9 saat', rating: 5 },
      { id: 8, orderNumber: 'ORD-008', customer: 'Nigar Əliyeva', product: 'Sony Headphones', status: 'Tamamlandı', date: '2024-01-19', deliveryTime: '3.1 saat', rating: 4 }
    ],
    3: [
      { id: 9, orderNumber: 'ORD-009', customer: 'Tural Əhmədov', product: 'Google Pixel', status: 'Tamamlandı', date: '2024-01-20', deliveryTime: '1.9 saat', rating: 5 },
      { id: 10, orderNumber: 'ORD-010', customer: 'Günel Məmmədli', product: 'HP Laptop', status: 'Tamamlandı', date: '2024-01-21', deliveryTime: '2.2 saat', rating: 5 },
      { id: 11, orderNumber: 'ORD-011', customer: 'Vüsal Əliyev', product: 'Bose Speakers', status: 'Yönləndirilib', date: '2024-01-22', deliveryTime: null, rating: null }
    ],
    4: [
      { id: 12, orderNumber: 'ORD-012', customer: 'Samir Həsənli', product: 'OnePlus Phone', status: 'Tamamlandı', date: '2024-01-15', deliveryTime: '4.2 saat', rating: 3 },
      { id: 13, orderNumber: 'ORD-013', customer: 'Zəhra Əliyeva', product: 'Lenovo Laptop', status: 'Tamamlandı', date: '2024-01-16', deliveryTime: '3.9 saat', rating: 4 }
    ]
  };

  const couriers = [
    {
      id: 1,
      name: 'Əli Kuryer',
      phone: '+994 50 123 45 67',
      email: 'ali.kuryer@example.com',
      status: 'Aktiv',
      totalOrders: 45,
      completedOrders: 42,
      delayedOrders: 3,
      averageDeliveryTime: '2.5 saat',
      rating: 4.8,
      city: 'Bakı',
      vehicleType: 'Motosiklet',
      licensePlate: '10-AA-123',
      experience: '2-5 il',
      joinDate: '2023-03-15',
      lastActive: '2024-01-22',
      assignedZones: [1, 7, 8] // Bakı Mərkəz, Bakı - Binəqədi, Bakı - Nərimanov
    },
    {
      id: 2,
      name: 'Məhəmməd Express',
      phone: '+994 55 987 65 43',
      email: 'məhəmməd.express@example.com',
      status: 'Aktiv',
      totalOrders: 38,
      completedOrders: 35,
      delayedOrders: 3,
      averageDeliveryTime: '3.2 saat',
      rating: 4.5,
      city: 'Sumqayıt',
      vehicleType: 'Avtomobil',
      licensePlate: '10-BB-456',
      experience: '1-3 il',
      joinDate: '2023-06-20',
      lastActive: '2024-01-22',
      assignedZones: [2, 7] // Sumqayıt, Bakı - Binəqədi
    },
    {
      id: 3,
      name: 'Səbinə Fast',
      phone: '+994 70 456 78 90',
      email: 'səbinə.fast@example.com',
      status: 'Aktiv',
      totalOrders: 52,
      completedOrders: 50,
      delayedOrders: 2,
      averageDeliveryTime: '2.1 saat',
      rating: 4.9,
      city: 'Gəncə',
      vehicleType: 'Motosiklet',
      licensePlate: '10-CC-789',
      experience: '3-7 il',
      joinDate: '2022-11-10',
      lastActive: '2024-01-22',
      assignedZones: [3, 5] // Gəncə, Şirvan
    },
    {
      id: 4,
      name: 'Aysu Speed',
      phone: '+994 51 234 56 78',
      email: 'aysu.speed@example.com',
      status: 'Passiv',
      totalOrders: 28,
      completedOrders: 25,
      delayedOrders: 3,
      averageDeliveryTime: '3.8 saat',
      rating: 4.2,
      city: 'Mingəçevir',
      vehicleType: 'Velosiped',
      licensePlate: '10-DD-012',
      experience: '1-3 il',
      joinDate: '2023-09-05',
      lastActive: '2024-01-15',
      assignedZones: [4] // Mingəçevir
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDelayColor = (delayedOrders) => {
    if (delayedOrders === 0) return 'text-green-600';
    if (delayedOrders <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.phone.includes(searchTerm) ||
                         courier.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || courier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastCourier = currentPage * couriersPerPage;
  const indexOfFirstCourier = indexOfLastCourier - couriersPerPage;
  const currentCouriers = filteredCouriers.slice(indexOfFirstCourier, indexOfLastCourier);
  const totalPages = Math.ceil(filteredCouriers.length / couriersPerPage);

  // Pagination functions
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

  // CRUD Functions
  const handleAddCourier = () => {
    const newId = Math.max(...couriers.map(c => c.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    const courierToAdd = {
      ...newCourier,
      id: newId,
      totalOrders: 0,
      completedOrders: 0,
      delayedOrders: 0,
      averageDeliveryTime: '0 saat',
      rating: 0,
      joinDate: today,
      lastActive: today
    };
    
    // Add to couriers array (in real app, this would be state)
    couriers.push(courierToAdd);
    
    // Reset form
    setNewCourier({
      name: '',
      phone: '',
      email: '',
      status: 'Aktiv',
      city: '',
      vehicleType: 'Motosiklet',
      licensePlate: '',
      experience: '1-3 il',
      assignedZones: []
    });
    setShowAddModal(false);
  };

  const handleEditCourier = () => {
    if (selectedCourier) {
      const today = new Date().toISOString().split('T')[0];
      const courierIndex = couriers.findIndex(c => c.id === selectedCourier.id);
      if (courierIndex !== -1) {
        couriers[courierIndex] = {
          ...couriers[courierIndex],
          ...newCourier,
          lastActive: today
        };
      }
      setShowEditModal(false);
      setSelectedCourier(null);
    }
  };

  const handleDeleteCourier = () => {
    if (selectedCourier) {
      const courierIndex = couriers.findIndex(c => c.id === selectedCourier.id);
      if (courierIndex !== -1) {
        couriers.splice(courierIndex, 1);
      }
      setShowDeleteModal(false);
      setSelectedCourier(null);
    }
  };

  const openEditModal = (courier) => {
    setSelectedCourier(courier);
    setNewCourier({
      name: courier.name,
      phone: courier.phone,
      email: courier.email,
      status: courier.status,
      city: courier.city,
      vehicleType: courier.vehicleType,
      licensePlate: courier.licensePlate,
      experience: courier.experience,
      assignedZones: courier.assignedZones || []
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (courier) => {
    setSelectedCourier(courier);
    setShowDeleteModal(true);
  };

  const openViewModal = (courier) => {
    setSelectedCourier(courier);
    setShowViewModal(true);
  };

  const openDeliveryReportModal = (courier) => {
    setSelectedCourier(courier);
    setShowDeliveryReportModal(true);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı': return 'bg-green-100 text-green-800';
      case 'Yönləndirilib': return 'bg-blue-100 text-blue-800';
      case 'Gözləmədə': return 'bg-yellow-100 text-yellow-800';
      case 'Ləğv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Zone helper functions
  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Naməlum Zona';
  };

  const getZoneNames = (zoneIds) => {
    return zoneIds.map(id => getZoneName(id)).join(', ');
  };

  const getZoneById = (zoneId) => {
    return zones.find(z => z.id === zoneId);
  };

  const getAssignedZonesForCourier = (courier) => {
    return courier.assignedZones.map(zoneId => getZoneById(zoneId)).filter(Boolean);
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

  // Delivery report helper functions
  const getDeliveryReportData = (courier) => {
    const orders = courierOrders[courier.id] || [];
    
    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'Tamamlandı').length;
    const activeOrders = orders.filter(order => order.status === 'Yönləndirilib').length;
    const pendingOrders = orders.filter(order => order.status === 'Gözləmədə').length;
    const cancelledOrders = orders.filter(order => order.status === 'Ləğv').length;
    
    // Calculate average delivery time
    const completedWithTime = orders.filter(order => 
      order.status === 'Tamamlandı' && order.deliveryTime
    );
    const totalDeliveryTime = completedWithTime.reduce((sum, order) => {
      const time = order.deliveryTime;
      if (time.includes('saat')) {
        const hours = parseFloat(time.split(' ')[0]);
        return sum + hours;
      }
      return sum;
    }, 0);
    const averageDeliveryTime = completedWithTime.length > 0 
      ? (totalDeliveryTime / completedWithTime.length).toFixed(1) 
      : 0;
    
    // Calculate success rate
    const successRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;
    
    // Get recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    // Get zone statistics
    const zoneStats = {};
    orders.forEach(order => {
      if (order.zone) {
        zoneStats[order.zone] = (zoneStats[order.zone] || 0) + 1;
      }
    });
    
    return {
      totalOrders,
      completedOrders,
      activeOrders,
      pendingOrders,
      cancelledOrders,
      averageDeliveryTime,
      successRate,
      recentOrders,
      zoneStats
    };
  };

  const getDeliveryTimeColor = (time) => {
    const hours = parseFloat(time);
    if (hours <= 2) return 'text-green-600';
    if (hours <= 3) return 'text-blue-600';
    if (hours <= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kuryerlər
        </h1>
        <p className="text-gray-600 text-lg">Çatdırılma xidməti və kuryer idarəetməsi</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Kuryer Siyahısı</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kuryer
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <Truck className="w-4 h-4 mr-2" />
                Çatdırılma Hesabatı
              </button>
            </div>
          </div>
        </div>

        {/* Axtarış və Filtrlər */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kuryer axtar..."
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
            </select>
            
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtr
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCouriers.map((courier) => (
              <div key={courier.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{courier.name.charAt(0)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(courier.status)}`}>
                    {courier.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{courier.name}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{courier.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{courier.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{courier.city}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      Zonalar: {getZoneNames(courier.assignedZones)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{courier.totalOrders} sifariş</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">{courier.completedOrders} tamamlandı</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className={`text-sm font-medium ${getDelayColor(courier.delayedOrders)}`}>
                      {courier.delayedOrders} gecikmə
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Orta vaxt: {courier.averageDeliveryTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm font-medium ${getRatingColor(courier.rating)}`}>
                      Reyting: {courier.rating}/5
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openViewModal(courier)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Bax
                  </button>
                  <button 
                    onClick={() => openEditModal(courier)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Redaktə
                  </button>
                  <button 
                    onClick={() => openDeliveryReportModal(courier)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Hesabat
                  </button>
                  <button 
                    onClick={() => openDeleteModal(courier)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Kuryer Statistikası */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              Kuryer Performans Statistikası
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Aktiv Kuryerlər</p>
                <p className="text-lg font-semibold text-green-600">3</p>
                <p className="text-xs text-gray-500">Ümumi: 4</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Bu Ay Çatdırılma</p>
                <p className="text-lg font-semibold text-blue-600">163</p>
                <p className="text-xs text-gray-500">Sifariş</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Orta Çatdırılma Vaxtı</p>
                <p className="text-lg font-semibold text-purple-600">2.9 saat</p>
                <p className="text-xs text-gray-500">Bu ay</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Gecikmə Faizi</p>
                <p className="text-lg font-semibold text-red-600">6.7%</p>
                <p className="text-xs text-gray-500">11 sifariş</p>
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Göstərilir: <span className="font-medium">{indexOfFirstCourier + 1}</span> - <span className="font-medium">{Math.min(indexOfLastCourier, filteredCouriers.length)}</span> / <span className="font-medium">{filteredCouriers.length}</span> kuryer
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
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
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
      </div>

      {/* Add Courier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Kuryer Əlavə Et</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={newCourier.name}
                    onChange={(e) => setNewCourier({...newCourier, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kuryer adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={newCourier.phone}
                    onChange={(e) => setNewCourier({...newCourier, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newCourier.email}
                    onChange={(e) => setNewCourier({...newCourier, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kuryer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newCourier.city}
                    onChange={(e) => {
                      const cityChange = handleCityChange(e.target.value, newCourier.assignedZones);
                      setNewCourier({...newCourier, ...cityChange});
                    }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nəqliyyat Növü</label>
                  <select
                    value={newCourier.vehicleType}
                    onChange={(e) => setNewCourier({...newCourier, vehicleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Motosiklet">Motosiklet</option>
                    <option value="Avtomobil">Avtomobil</option>
                    <option value="Velosiped">Velosiped</option>
                    <option value="Skuter">Skuter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nəqliyyat Nömrəsi</label>
                  <input
                    type="text"
                    value={newCourier.licensePlate}
                    onChange={(e) => setNewCourier({...newCourier, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10-AA-123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təcrübə</label>
                  <select
                    value={newCourier.experience}
                    onChange={(e) => setNewCourier({...newCourier, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1-3 il">1-3 il</option>
                    <option value="2-5 il">2-5 il</option>
                    <option value="3-7 il">3-7 il</option>
                    <option value="5+ il">5+ il</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCourier.status}
                    onChange={(e) => setNewCourier({...newCourier, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilmiş Zonalar</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {newCourier.city ? (
                      zones.filter(zone => zone.city === newCourier.city).map((zone) => (
                        <label key={zone.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            checked={newCourier.assignedZones.includes(zone.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCourier({
                                  ...newCourier,
                                  assignedZones: [...newCourier.assignedZones, zone.id]
                                });
                              } else {
                                setNewCourier({
                                  ...newCourier,
                                  assignedZones: newCourier.assignedZones.filter(id => id !== zone.id)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {zone.name} ({zone.district}) - {zone.deliveryTime}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-2 text-center">
                        Zona seçmək üçün əvvəlcə şəhər seçin
                      </div>
                    )}
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
                onClick={handleAddCourier}
                disabled={!newCourier.name || !newCourier.phone || !newCourier.city}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Courier Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Kuryeri Redaktə Et</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={newCourier.name}
                    onChange={(e) => setNewCourier({...newCourier, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kuryer adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={newCourier.phone}
                    onChange={(e) => setNewCourier({...newCourier, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newCourier.email}
                    onChange={(e) => setNewCourier({...newCourier, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kuryer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newCourier.city}
                    onChange={(e) => {
                      const cityChange = handleCityChange(e.target.value, newCourier.assignedZones);
                      setNewCourier({...newCourier, ...cityChange});
                    }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nəqliyyat Növü</label>
                  <select
                    value={newCourier.vehicleType}
                    onChange={(e) => setNewCourier({...newCourier, vehicleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Motosiklet">Motosiklet</option>
                    <option value="Avtomobil">Avtomobil</option>
                    <option value="Velosiped">Velosiped</option>
                    <option value="Skuter">Skuter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nəqliyyat Nömrəsi</label>
                  <input
                    type="text"
                    value={newCourier.licensePlate}
                    onChange={(e) => setNewCourier({...newCourier, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10-AA-123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təcrübə</label>
                  <select
                    value={newCourier.experience}
                    onChange={(e) => setNewCourier({...newCourier, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1-3 il">1-3 il</option>
                    <option value="2-5 il">2-5 il</option>
                    <option value="3-7 il">3-7 il</option>
                    <option value="5+ il">5+ il</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCourier.status}
                    onChange={(e) => setNewCourier({...newCourier, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təyin Edilmiş Zonalar</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {newCourier.city ? (
                      zones.filter(zone => zone.city === newCourier.city).map((zone) => (
                        <label key={zone.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            checked={newCourier.assignedZones.includes(zone.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCourier({
                                  ...newCourier,
                                  assignedZones: [...newCourier.assignedZones, zone.id]
                                });
                              } else {
                                setNewCourier({
                                  ...newCourier,
                                  assignedZones: newCourier.assignedZones.filter(id => id !== zone.id)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {zone.name} ({zone.district}) - {zone.deliveryTime}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-2 text-center">
                        Zona seçmək üçün əvvəlcə şəhər seçin
                      </div>
                    )}
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
                onClick={handleEditCourier}
                disabled={!newCourier.name || !newCourier.phone || !newCourier.city}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Courier Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Kuryeri Sil</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Kuryeri silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">
                <strong>{selectedCourier?.name}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Bu əməliyyat geri alına bilməz.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleDeleteCourier}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Courier Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Kuryer Detalları</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCourier && (
                <div className="space-y-6">
                  {/* Courier Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {selectedCourier.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-semibold text-gray-800 mb-2">{selectedCourier.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCourier.status)}`}>
                              {selectedCourier.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-600">Bölgə</p>
                            <p className="font-medium text-gray-800">{selectedCourier.area}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Nəqliyyat</p>
                            <p className="font-medium text-gray-800">{selectedCourier.vehicleType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Təcrübə</p>
                            <p className="font-medium text-gray-800">{selectedCourier.experience}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Əlaqə Məlumatları
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedCourier.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedCourier.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedCourier.area}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Truck className="w-5 h-5 mr-2 text-green-600" />
                        Nəqliyyat Məlumatları
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{selectedCourier.vehicleType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700">Nömrə: {selectedCourier.licensePlate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700">Təcrübə: {selectedCourier.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Statistics */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                      Performans Statistikası
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedCourier.totalOrders}</p>
                        <p className="text-sm text-gray-600">Ümumi Sifariş</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedCourier.completedOrders}</p>
                        <p className="text-sm text-gray-600">Tamamlanmış</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{selectedCourier.delayedOrders}</p>
                        <p className="text-sm text-gray-600">Gecikmə</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedCourier.rating}</p>
                        <p className="text-sm text-gray-600">Reyting</p>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Zones */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Təyin Edilmiş Zonalar
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getAssignedZonesForCourier(selectedCourier).map((zone) => (
                        <div key={zone.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="font-medium text-gray-800">{zone.name}</h6>
                              <p className="text-sm text-gray-600">{zone.city}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">{zone.deliveryTime}</p>
                              <p className="text-xs text-gray-500">{zone.courierCount} kuryer</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getAssignedZonesForCourier(selectedCourier).length === 0 && (
                        <div className="col-span-full text-center py-4">
                          <p className="text-gray-500">Hazırda heç bir zona təyin edilməyib</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Orders Section */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-orange-600" />
                      Sifariş Tarixçəsi
                    </h5>
                    
                    {/* Order Status Tabs */}
                    <div className="flex space-x-2 mb-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                        Bütün Sifarişlər ({courierOrders[selectedCourier.id]?.length || 0})
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                        Tamamlanmış ({courierOrders[selectedCourier.id]?.filter(o => o.status === 'Tamamlandı').length || 0})
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                        Aktiv ({courierOrders[selectedCourier.id]?.filter(o => o.status === 'Yönləndirilib').length || 0})
                      </button>
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium">
                        Gözləmədə ({courierOrders[selectedCourier.id]?.filter(o => o.status === 'Gözləmədə').length || 0})
                      </button>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sifariş No</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Müştəri</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Məhsul</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarix</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Çatdırılma Vaxtı</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reyting</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {courierOrders[selectedCourier.id]?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{order.product}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{order.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{order.deliveryTime || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.rating ? (
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="ml-1">{order.rating}</span>
                                  </div>
                                ) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                  openEditModal(selectedCourier);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Report Modal */}
      {showDeliveryReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Çatdırılma Hesabatı - {selectedCourier?.name}</h3>
              <button 
                onClick={() => setShowDeliveryReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCourier && (() => {
                const reportData = getDeliveryReportData(selectedCourier);
                return (
                  <div className="space-y-6">
                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Ümumi Sifariş</p>
                            <p className="text-2xl font-bold text-blue-800">{reportData.totalOrders}</p>
                          </div>
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Tamamlanmış</p>
                            <p className="text-2xl font-bold text-green-800">{reportData.completedOrders}</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600 font-medium">Orta Vaxt</p>
                            <p className={`text-2xl font-bold ${getDeliveryTimeColor(reportData.averageDeliveryTime)}`}>
                              {reportData.averageDeliveryTime} saat
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Uğur Faizi</p>
                            <p className="text-2xl font-bold text-purple-800">{reportData.successRate}%</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Status Breakdown */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                          Sifariş Statusları
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Tamamlanmış</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{width: `${(reportData.completedOrders / reportData.totalOrders) * 100}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-800">{reportData.completedOrders}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Aktiv</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{width: `${(reportData.activeOrders / reportData.totalOrders) * 100}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-800">{reportData.activeOrders}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Gözləmədə</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-500 h-2 rounded-full" 
                                  style={{width: `${(reportData.pendingOrders / reportData.totalOrders) * 100}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-800">{reportData.pendingOrders}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Ləğv</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{width: `${(reportData.cancelledOrders / reportData.totalOrders) * 100}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-800">{reportData.cancelledOrders}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Zone Performance */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-green-600" />
                          Zona Performansı
                        </h5>
                        <div className="space-y-3">
                          {Object.entries(reportData.zoneStats).map(([zone, count]) => (
                            <div key={zone} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{zone}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{width: `${(count / reportData.totalOrders) * 100}%`}}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-800">{count}</span>
                              </div>
                            </div>
                          ))}
                          {Object.keys(reportData.zoneStats).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-2">Zona məlumatı yoxdur</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-orange-600" />
                        Son Sifarişlər
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sifariş No</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Müştəri</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarix</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Çatdırılma Vaxtı</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reyting</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.recentOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{order.date}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{order.deliveryTime || '-'}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {order.rating ? (
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="ml-1">{order.rating}</span>
                                    </div>
                                  ) : '-'}
                                </td>
                              </tr>
                            ))}
                            {reportData.recentOrders.length === 0 && (
                              <tr>
                                <td colSpan="6" className="px-4 py-3 text-sm text-gray-500 text-center">
                                  Sifariş məlumatı yoxdur
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeliveryReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bağla
              </button>
              <button
                onClick={() => {
                  setShowDeliveryReportModal(false);
                  openViewModal(selectedCourier);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Detallı Bax
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Couriers; 