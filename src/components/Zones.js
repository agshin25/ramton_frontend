import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

const Zones = () => {
  // Sample zones data with Baku districts and other cities
  const initialZones = [
    // Baku districts
    { id: 1, name: 'Bakı Mərkəz', city: 'Bakı', district: 'Mərkəz', deliveryTime: '1-2 saat', courierCount: 5, status: 'Aktiv', description: 'Bakının mərkəzi rayonu' },
    { id: 2, name: 'Binəqədi', city: 'Bakı', district: 'Binəqədi', deliveryTime: '1-2 saat', courierCount: 3, status: 'Aktiv', description: 'Binəqədi rayonu' },
    { id: 3, name: 'Nərimanov', city: 'Bakı', district: 'Nərimanov', deliveryTime: '1-2 saat', courierCount: 4, status: 'Aktiv', description: 'Nərimanov rayonu' },
    { id: 4, name: 'Nəsiyyə', city: 'Bakı', district: 'Nəsiyyə', deliveryTime: '1-2 saat', courierCount: 2, status: 'Aktiv', description: 'Nəsiyyə rayonu' },
    { id: 5, name: 'Yasamal', city: 'Bakı', district: 'Yasamal', deliveryTime: '1-2 saat', courierCount: 3, status: 'Aktiv', description: 'Yasamal rayonu' },
    { id: 6, name: 'Xətai', city: 'Bakı', district: 'Xətai', deliveryTime: '1-2 saat', courierCount: 4, status: 'Aktiv', description: 'Xətai rayonu' },
    { id: 7, name: 'Səbail', city: 'Bakı', district: 'Səbail', deliveryTime: '1-2 saat', courierCount: 2, status: 'Aktiv', description: 'Səbail rayonu' },
    { id: 8, name: 'Qaradağ', city: 'Bakı', district: 'Qaradağ', deliveryTime: '2-3 saat', courierCount: 1, status: 'Aktiv', description: 'Qaradağ rayonu' },
    { id: 9, name: 'Xəzər', city: 'Bakı', district: 'Xəzər', deliveryTime: '2-3 saat', courierCount: 2, status: 'Aktiv', description: 'Xəzər rayonu' },
    { id: 10, name: 'Suraxanı', city: 'Bakı', district: 'Suraxanı', deliveryTime: '2-3 saat', courierCount: 1, status: 'Aktiv', description: 'Suraxanı rayonu' },
    { id: 11, name: 'Əzizbəyov', city: 'Bakı', district: 'Əzizbəyov', deliveryTime: '2-3 saat', courierCount: 2, status: 'Aktiv', description: 'Əzizbəyov rayonu' },
    { id: 12, name: 'Sabunçu', city: 'Bakı', district: 'Sabunçu', deliveryTime: '2-3 saat', courierCount: 1, status: 'Aktiv', description: 'Sabunçu rayonu' },
    { id: 13, name: 'Pirallahı', city: 'Bakı', district: 'Pirallahı', deliveryTime: '3-4 saat', courierCount: 0, status: 'Passiv', description: 'Pirallahı rayonu' },
    { id: 14, name: 'Abşeron', city: 'Bakı', district: 'Abşeron', deliveryTime: '3-4 saat', courierCount: 1, status: 'Aktiv', description: 'Abşeron rayonu' },
    
    // Other cities
    { id: 15, name: 'Sumqayıt', city: 'Sumqayıt', district: 'Mərkəz', deliveryTime: '2-3 saat', courierCount: 3, status: 'Aktiv', description: 'Sumqayıt şəhəri' },
    { id: 16, name: 'Gəncə', city: 'Gəncə', district: 'Mərkəz', deliveryTime: '3-4 saat', courierCount: 2, status: 'Aktiv', description: 'Gəncə şəhəri' },
    { id: 17, name: 'Mingəçevir', city: 'Mingəçevir', district: 'Mərkəz', deliveryTime: '4-5 saat', courierCount: 1, status: 'Aktiv', description: 'Mingəçevir şəhəri' },
    { id: 18, name: 'Şirvan', city: 'Şirvan', district: 'Mərkəz', deliveryTime: '3-4 saat', courierCount: 1, status: 'Aktiv', description: 'Şirvan şəhəri' },
    { id: 19, name: 'Naxçıvan', city: 'Naxçıvan', district: 'Mərkəz', deliveryTime: '5-6 saat', courierCount: 0, status: 'Passiv', description: 'Naxçıvan şəhəri' },
    { id: 20, name: 'Şəki', city: 'Şəki', district: 'Mərkəz', deliveryTime: '4-5 saat', courierCount: 0, status: 'Passiv', description: 'Şəki şəhəri' }
  ];

  const [zones, setZones] = useState(initialZones);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Bütün');
  const [cityFilter, setCityFilter] = useState('Bütün');
  const [currentPage, setCurrentPage] = useState(1);
  const [zonesPerPage] = useState(10);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [newZone, setNewZone] = useState({
    name: '',
    city: 'Bakı',
    district: 'Mərkəz',
    deliveryTime: '1-2 saat',
    status: 'Aktiv',
    description: ''
  });

  // Available cities and districts
  const cities = ['Bakı', 'Sumqayıt', 'Gəncə', 'Mingəçevir', 'Şirvan', 'Naxçıvan', 'Şəki'];
  const bakuDistricts = ['Mərkəz', 'Binəqədi', 'Nərimanov', 'Nəsiyyə', 'Yasamal', 'Xətai', 'Səbail', 'Qaradağ', 'Xəzər', 'Suraxanı', 'Əzizbəyov', 'Sabunçu', 'Pirallahı', 'Abşeron'];
  const deliveryTimes = ['1-2 saat', '2-3 saat', '3-4 saat', '4-5 saat', '5-6 saat'];

  // Filter zones
  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Bütün' || zone.status === statusFilter;
    const matchesCity = cityFilter === 'Bütün' || zone.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Pagination
  const indexOfLastZone = currentPage * zonesPerPage;
  const indexOfFirstZone = indexOfLastZone - zonesPerPage;
  const currentZones = filteredZones.slice(indexOfFirstZone, indexOfLastZone);
  const totalPages = Math.ceil(filteredZones.length / zonesPerPage);

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

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'bg-green-100 text-green-800';
      case 'Passiv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryTimeColor = (deliveryTime) => {
    switch (deliveryTime) {
      case '1-2 saat': return 'bg-green-100 text-green-800';
      case '2-3 saat': return 'bg-blue-100 text-blue-800';
      case '3-4 saat': return 'bg-yellow-100 text-yellow-800';
      case '4-5 saat': return 'bg-orange-100 text-orange-800';
      case '5-6 saat': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // CRUD functions
  const handleAddZone = () => {
    const newId = Math.max(...zones.map(z => z.id)) + 1;
    const zoneToAdd = {
      ...newZone,
      id: newId,
      courierCount: 0
    };
    
    setZones([...zones, zoneToAdd]);
    
    // Reset form
    setNewZone({
      name: '',
      city: 'Bakı',
      district: 'Mərkəz',
      deliveryTime: '1-2 saat',
      status: 'Aktiv',
      description: ''
    });
    setShowAddModal(false);
  };

  const handleEditZone = () => {
    const updatedZones = zones.map(zone => 
      zone.id === selectedZone.id ? { ...zone, ...newZone } : zone
    );
    setZones(updatedZones);
    setShowEditModal(false);
  };

  const handleDeleteZone = () => {
    const updatedZones = zones.filter(zone => zone.id !== selectedZone.id);
    setZones(updatedZones);
    setShowDeleteModal(false);
  };

  const openEditModal = (zone) => {
    setSelectedZone(zone);
    setNewZone({
      name: zone.name,
      city: zone.city,
      district: zone.district,
      deliveryTime: zone.deliveryTime,
      status: zone.status,
      description: zone.description
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (zone) => {
    setSelectedZone(zone);
    setShowDeleteModal(true);
  };

  const openViewModal = (zone) => {
    setSelectedZone(zone);
    setShowViewModal(true);
  };

  // Statistics
  const totalZones = zones.length;
  const activeZones = zones.filter(zone => zone.status === 'Aktiv').length;
  const totalCouriers = zones.reduce((sum, zone) => sum + zone.courierCount, 0);
  const bakuZones = zones.filter(zone => zone.city === 'Bakı').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zonalar</h1>
          <p className="text-gray-600">Çatdırılma zonalarının idarə edilməsi</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ümumi Zona</p>
                <p className="text-2xl font-bold text-gray-900">{totalZones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktiv Zonalar</p>
                <p className="text-2xl font-bold text-gray-900">{activeZones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ümumi Kuryer</p>
                <p className="text-2xl font-bold text-gray-900">{totalCouriers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bakı Zonaları</p>
                <p className="text-2xl font-bold text-gray-900">{bakuZones}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Zona adı, şəhər və ya rayon axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Bütün">Bütün Statuslar</option>
                <option value="Aktiv">Aktiv</option>
                <option value="Passiv">Passiv</option>
              </select>
              
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Bütün">Bütün Şəhərlər</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Zona
              </button>
            </div>
          </div>
        </div>

        {/* Zones Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zona Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şəhər/Rayon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Çatdırılma Vaxtı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kuryer Sayı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                        <div className="text-sm text-gray-500">{zone.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{zone.city}</div>
                        <div className="text-sm text-gray-500">{zone.district}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDeliveryTimeColor(zone.deliveryTime)}`}>
                        {zone.deliveryTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {zone.courierCount} kuryer
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(zone.status)}`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(zone)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(zone)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(zone)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {indexOfFirstZone + 1}-{Math.min(indexOfLastZone, filteredZones.length)} / {filteredZones.length} zona
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
                      className={`px-3 py-1 text-sm rounded-lg ${
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
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Zona Əlavə Et</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zona Adı</label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zona adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newZone.city}
                    onChange={(e) => setNewZone({...newZone, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rayon</label>
                  <select
                    value={newZone.district}
                    onChange={(e) => setNewZone({...newZone, district: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {newZone.city === 'Bakı' ? (
                      bakuDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))
                    ) : (
                      <option value="Mərkəz">Mərkəz</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Çatdırılma Vaxtı</label>
                  <select
                    value={newZone.deliveryTime}
                    onChange={(e) => setNewZone({...newZone, deliveryTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {deliveryTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newZone.status}
                    onChange={(e) => setNewZone({...newZone, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newZone.description}
                    onChange={(e) => setNewZone({...newZone, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Zona haqqında qısa təsvir"
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
                onClick={handleAddZone}
                disabled={!newZone.name || !newZone.city}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Zonanı Redaktə Et</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zona Adı</label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zona adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər</label>
                  <select
                    value={newZone.city}
                    onChange={(e) => setNewZone({...newZone, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rayon</label>
                  <select
                    value={newZone.district}
                    onChange={(e) => setNewZone({...newZone, district: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {newZone.city === 'Bakı' ? (
                      bakuDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))
                    ) : (
                      <option value="Mərkəz">Mərkəz</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Çatdırılma Vaxtı</label>
                  <select
                    value={newZone.deliveryTime}
                    onChange={(e) => setNewZone({...newZone, deliveryTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {deliveryTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newZone.status}
                    onChange={(e) => setNewZone({...newZone, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
                  <textarea
                    value={newZone.description}
                    onChange={(e) => setNewZone({...newZone, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Zona haqqında qısa təsvir"
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
                onClick={handleEditZone}
                disabled={!newZone.name || !newZone.city}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Zone Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Zonanı Sil</h3>
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
              <h4 className="text-lg font-medium text-gray-800 mb-2">Zonanı silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">
                <strong>{selectedZone?.name}</strong>
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
                onClick={handleDeleteZone}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Zone Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Zona Detalları</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Əsas Məlumatlar
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Zona Adı</p>
                      <p className="font-medium text-gray-900">{selectedZone?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Şəhər</p>
                      <p className="font-medium text-gray-900">{selectedZone?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rayon</p>
                      <p className="font-medium text-gray-900">{selectedZone?.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedZone?.status)}`}>
                        {selectedZone?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Çatdırılma Məlumatları
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Çatdırılma Vaxtı</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDeliveryTimeColor(selectedZone?.deliveryTime)}`}>
                        {selectedZone?.deliveryTime}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kuryer Sayı</p>
                      <p className="font-medium text-gray-900">{selectedZone?.courierCount} kuryer</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedZone?.description && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-3">Təsvir</h5>
                    <p className="text-gray-700">{selectedZone.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Zones; 