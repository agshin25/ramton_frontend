import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  Truck,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CourierSettlement = () => {
  const [couriers, setCouriers] = useState([
    {
      id: 1,
      name: 'Rəşad Əhmədov',
      phone: '+994 60 321 54 67',
      zone: 'Bakı Mərkəz',
      status: 'Aktiv',
      balance: 0,
      dailyOrders: 0,
      dailyEarnings: 0,
      commission: 15, // 15% komissiya
      lastSettlement: '2024-01-14',
      totalEarnings: 1250.50
    },
    {
      id: 2,
      name: 'Elşən Məmmədov',
      phone: '+994 51 456 78 90',
      zone: 'Sumqayıt',
      status: 'Aktiv',
      balance: 0,
      dailyOrders: 0,
      dailyEarnings: 0,
      commission: 15,
      lastSettlement: '2024-01-14',
      totalEarnings: 980.25
    },
    {
      id: 3,
      name: 'Orxan Əliyev',
      phone: '+994 70 789 12 34',
      zone: 'Gəncə',
      status: 'Aktiv',
      balance: 0,
      dailyOrders: 0,
      dailyEarnings: 0,
      commission: 15,
      lastSettlement: '2024-01-14',
      totalEarnings: 750.80
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: '#12345',
      courierId: 1,
      courierName: 'Rəşad Əhmədov',
      customerName: 'Əli Məmmədov',
      product: 'iPhone 15 Pro',
      quantity: 2,
      price: 150.00,
      deliveryFee: 5.00,
      commission: 22.50, // 15% of (150 * 2)
      status: 'Tamamlandı',
      date: '2024-01-15',
      time: '10:30'
    },
    {
      id: '#12346',
      courierId: 1,
      courierName: 'Rəşad Əhmədov',
      customerName: 'Aysu Hüseynova',
      product: 'MacBook Air',
      quantity: 1,
      price: 75.50,
      deliveryFee: 5.00,
      commission: 11.33,
      status: 'Tamamlandı',
      date: '2024-01-15',
      time: '11:15'
    },
    {
      id: '#12347',
      courierId: 2,
      courierName: 'Elşən Məmmədov',
      customerName: 'Məhəmməd Əliyev',
      product: 'Apple Watch',
      quantity: 3,
      price: 200.00,
      deliveryFee: 5.00,
      commission: 30.00,
      status: 'Tamamlandı',
      date: '2024-01-15',
      time: '12:00'
    },
    {
      id: '#12348',
      courierId: 3,
      courierName: 'Orxan Əliyev',
      customerName: 'Səbinə Əliyeva',
      product: 'iPad Pro',
      quantity: 1,
      price: 120.00,
      deliveryFee: 5.00,
      commission: 18.00,
      status: 'Tamamlandı',
      date: '2024-01-15',
      time: '13:45'
    }
  ]);

  const [settlements, setSettlements] = useState([
    {
      id: 1,
      courierId: 1,
      courierName: 'Rəşad Əhmədov',
      date: '2024-01-14',
      totalOrders: 8,
      totalEarnings: 180.50,
      commission: 27.08,
      deliveryFees: 40.00,
      netAmount: 153.42,
      status: 'Tamamlandı',
      settledBy: 'Baş Kuryer',
      settledAt: '2024-01-14 18:00'
    }
  ]);

  const [showCreateSettlement, setShowCreateSettlement] = useState(false);
  const [showViewSettlement, setShowViewSettlement] = useState(false);
  const [showEditSettlement, setShowEditSettlement] = useState(false);
  const [showDeleteSettlement, setShowDeleteSettlement] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courierFilter, setCourierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [settlementsPerPage] = useState(5);

  const [newSettlement, setNewSettlement] = useState({
    courierId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Calculate daily earnings for each courier
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const updatedCouriers = couriers.map(courier => {
      const dailyOrders = orders.filter(order => 
        order.courierId === courier.id && 
        order.date === today && 
        order.status === 'Tamamlandı'
      );
      
      const dailyEarnings = dailyOrders.reduce((sum, order) => 
        sum + order.commission + order.deliveryFee, 0
      );
      
      return {
        ...courier,
        dailyOrders: dailyOrders.length,
        dailyEarnings: dailyEarnings
      };
    });
    
    setCouriers(updatedCouriers);
  }, [orders]);

  // Calculate total statistics
  const totalStats = {
    totalCouriers: couriers.length,
    activeCouriers: couriers.filter(c => c.status === 'Aktiv').length,
    totalDailyOrders: couriers.reduce((sum, c) => sum + c.dailyOrders, 0),
    totalDailyEarnings: couriers.reduce((sum, c) => sum + c.dailyEarnings, 0),
    totalBalance: couriers.reduce((sum, c) => sum + c.balance, 0)
  };

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = settlement.courierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourier = courierFilter === 'all' || settlement.courierId === parseInt(courierFilter);
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    const matchesDate = !dateFilter || settlement.date === dateFilter;
    
    return matchesSearch && matchesCourier && matchesStatus && matchesDate;
  });

  const indexOfLastSettlement = currentPage * settlementsPerPage;
  const indexOfFirstSettlement = indexOfLastSettlement - settlementsPerPage;
  const currentSettlements = filteredSettlements.slice(indexOfFirstSettlement, indexOfLastSettlement);
  const totalPages = Math.ceil(filteredSettlements.length / settlementsPerPage);

  const handleCreateSettlement = () => {
    const courier = couriers.find(c => c.id === parseInt(newSettlement.courierId));
    if (!courier) return;

    const dailyOrders = orders.filter(order => 
      order.courierId === courier.id && 
      order.date === newSettlement.date && 
      order.status === 'Tamamlandı'
    );

    const totalEarnings = dailyOrders.reduce((sum, order) => 
      sum + order.commission + order.deliveryFee, 0
    );

    const commission = dailyOrders.reduce((sum, order) => 
      sum + order.commission, 0
    );

    const deliveryFees = dailyOrders.reduce((sum, order) => 
      sum + order.deliveryFee, 0
    );

    const netAmount = totalEarnings - commission; // Kuryer yalnız çatdırılma haqqını alır

    const settlement = {
      id: Date.now(),
      courierId: courier.id,
      courierName: courier.name,
      date: newSettlement.date,
      totalOrders: dailyOrders.length,
      totalEarnings: totalEarnings,
      commission: commission,
      deliveryFees: deliveryFees,
      netAmount: netAmount,
      status: 'Tamamlandı',
      settledBy: 'Baş Kuryer',
      settledAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: newSettlement.notes
    };

    setSettlements([...settlements, settlement]);
    
    // Update courier balance
    setCouriers(prev => prev.map(c => 
      c.id === courier.id 
        ? { ...c, balance: 0, lastSettlement: newSettlement.date }
        : c
    ));

    setNewSettlement({
      courierId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowCreateSettlement(false);
  };

  const handleDeleteSettlement = () => {
    if (selectedSettlement) {
      setSettlements(settlements.filter(s => s.id !== selectedSettlement.id));
      setShowDeleteSettlement(false);
      setSelectedSettlement(null);
    }
  };

  const openViewModal = (settlement) => {
    setSelectedSettlement(settlement);
    setShowViewSettlement(true);
  };

  const openEditModal = (settlement) => {
    setSelectedSettlement(settlement);
    setNewSettlement({
      courierId: settlement.courierId.toString(),
      date: settlement.date,
      notes: settlement.notes || ''
    });
    setShowEditSettlement(true);
  };

  const openDeleteModal = (settlement) => {
    setSelectedSettlement(settlement);
    setShowDeleteSettlement(true);
  };

  const exportToExcel = () => {
    // Excel export functionality would go here
    console.log('Exporting settlements to Excel...');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kuryer Hesablaşması
        </h1>
        <p className="text-gray-600 text-lg">Günlük kuryer hesablaşması və balans idarəetməsi</p>
      </div>

      {/* Ümumi Statistikalar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Kuryerlər</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalCouriers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktiv Kuryerlər</p>
              <p className="text-3xl font-bold text-green-600">{totalStats.activeCouriers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Günlük Sifarişlər</p>
              <p className="text-3xl font-bold text-purple-600">{totalStats.totalDailyOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Günlük Qazanc</p>
              <p className="text-3xl font-bold text-orange-600">₼{totalStats.totalDailyEarnings.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Balans</p>
              <p className="text-3xl font-bold text-red-600">₼{totalStats.totalBalance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Kuryer Balansları */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Kuryer Balansları</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {couriers.map((courier) => (
              <div key={courier.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{courier.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{courier.name}</h3>
                      <p className="text-sm text-gray-500">{courier.zone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    courier.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {courier.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Günlük Sifariş:</span>
                    <span className="font-semibold text-gray-800">{courier.dailyOrders}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Günlük Qazanc:</span>
                    <span className="font-semibold text-green-600">₼{courier.dailyEarnings.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Komissiya:</span>
                    <span className="font-semibold text-blue-600">{courier.commission}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cari Balans:</span>
                    <span className={`font-semibold ${courier.balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      ₼{courier.balance.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Son Hesablaşma:</span>
                    <span className="text-sm text-gray-500">{courier.lastSettlement}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setNewSettlement({ ...newSettlement, courierId: courier.id.toString() });
                    setShowCreateSettlement(true);
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Hesablaşma Et
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hesablaşma Tarixçəsi */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Hesablaşma Tarixçəsi</h2>
            <div className="flex space-x-3">
              <button 
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtrlər */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Hesablaşma axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Kuryerlər</option>
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Gözləmədə">Gözləmədə</option>
              <option value="Ləğv">Ləğv</option>
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Hesablaşma Cədvəli */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kuryer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tarix</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sifariş Sayı</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ümumi Qazanc</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Komissiya</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Net Məbləğ</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {currentSettlements.map((settlement) => (
                  <tr key={settlement.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{settlement.courierName.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{settlement.courierName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{settlement.date}</td>
                    <td className="py-4 px-4 text-gray-600">{settlement.totalOrders}</td>
                    <td className="py-4 px-4 font-semibold text-green-600">₼{settlement.totalEarnings.toFixed(2)}</td>
                    <td className="py-4 px-4 text-blue-600">₼{settlement.commission.toFixed(2)}</td>
                    <td className="py-4 px-4 font-semibold text-purple-600">₼{settlement.netAmount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        settlement.status === 'Tamamlandı' 
                          ? 'bg-green-100 text-green-800' 
                          : settlement.status === 'Gözləmədə'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {settlement.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openViewModal(settlement)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Bax"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(settlement)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Redaktə"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(settlement)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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

          {/* Səhifələmə */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yeni Hesablaşma Modal */}
      {showCreateSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Hesablaşma</h3>
              <button onClick={() => setShowCreateSettlement(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kuryer</label>
                  <select
                    value={newSettlement.courierId}
                    onChange={(e) => setNewSettlement({...newSettlement, courierId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kuryer seçin</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name} - {courier.zone}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarix</label>
                  <input
                    type="date"
                    value={newSettlement.date}
                    onChange={(e) => setNewSettlement({...newSettlement, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                  <textarea
                    value={newSettlement.notes}
                    onChange={(e) => setNewSettlement({...newSettlement, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Hesablaşma haqqında qeydlər..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateSettlement(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleCreateSettlement}
                disabled={!newSettlement.courierId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hesablaşma Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewSettlement && selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Hesablaşma Detalları</h3>
              <button onClick={() => setShowViewSettlement(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Kuryer Məlumatları</h4>
                  <p className="text-blue-700">{selectedSettlement.courierName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Tarix:</span>
                    <p className="font-medium">{selectedSettlement.date}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Sifariş Sayı:</span>
                    <p className="font-medium">{selectedSettlement.totalOrders}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Ümumi Qazanc:</span>
                    <p className="font-semibold text-green-600">₼{selectedSettlement.totalEarnings.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Komissiya:</span>
                    <p className="font-semibold text-blue-600">₼{selectedSettlement.commission.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Çatdırılma Haqları:</span>
                    <p className="font-semibold text-purple-600">₼{selectedSettlement.deliveryFees.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Net Məbləğ:</span>
                    <p className="font-semibold text-orange-600">₼{selectedSettlement.netAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Hesablaşma Məlumatları</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedSettlement.status === 'Tamamlandı' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedSettlement.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hesablaşan:</span>
                      <span className="font-medium">{selectedSettlement.settledBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hesablaşma Vaxtı:</span>
                      <span className="font-medium">{selectedSettlement.settledAt}</span>
                    </div>
                  </div>
                </div>

                {selectedSettlement.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Qeydlər</h5>
                    <p className="text-gray-700">{selectedSettlement.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewSettlement(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bağla
              </button>
              <button
                onClick={() => {
                  setShowViewSettlement(false);
                  openEditModal(selectedSettlement);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteSettlement && selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Hesablaşmanı silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">{selectedSettlement.courierName} - {selectedSettlement.date}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteSettlement(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleDeleteSettlement}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierSettlement;
