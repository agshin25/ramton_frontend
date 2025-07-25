import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  User,
  Package,
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { employees } from './Admin';
import { products } from './Products';

// Sample customers data for order creation
const customers = [
  {
    id: 1,
    name: 'Əli Məmmədov',
    email: 'ali@example.com',
    phone: '+994 50 123 45 67',
    address: 'Bakı şəhəri, Nərimanov rayonu, Atatürk prospekti 123',
    city: 'Bakı',
    status: 'Aktiv'
  },
  {
    id: 2,
    name: 'Aysu Hüseynova',
    email: 'aysu@example.com',
    phone: '+994 55 987 65 43',
    address: 'Sumqayıt şəhəri, Mərkəz rayonu, Azərbaycan küçəsi 45',
    city: 'Sumqayıt',
    status: 'Aktiv'
  },
  {
    id: 3,
    name: 'Məhəmməd Əliyev',
    email: 'məhəmməd@example.com',
    phone: '+994 70 456 78 90',
    address: 'Gəncə şəhəri, Kəpəz rayonu, Heydər Əliyev prospekti 78',
    city: 'Gəncə',
    status: 'Aktiv'
  },
  {
    id: 4,
    name: 'Səbinə Əliyeva',
    email: 'səbinə@example.com',
    phone: '+994 51 789 12 34',
    address: 'Mingəçevir şəhəri, Mərkəz rayonu, Azərbaycan küçəsi 12',
    city: 'Mingəçevir',
    status: 'Aktiv'
  },
  {
    id: 5,
    name: 'Rəşad Əhmədov',
    email: 'rəşad@example.com',
    phone: '+994 60 321 54 67',
    address: 'Şirvan şəhəri, Mərkəz rayonu, Heydər Əliyev küçəsi 89',
    city: 'Şirvan',
    status: 'Aktiv'
  }
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportNotification, setShowExportNotification] = useState(false);
  const [showCourierAssignment, setShowCourierAssignment] = useState(false);
  const [assignedCourier, setAssignedCourier] = useState('');
  const [newOrder, setNewOrder] = useState({
    customer: '',
    employee: '',
    product: '',
    quantity: 1,
    price: 0,
    totalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: 'Yeni',
    courier: 'Rəşad Əhmədov',
    zone: 'Bakı Mərkəz'
  });

  const orders = [
    {
      id: '#12345',
      customer: 'Əli Məmmədov',
      employee: 'Əli Məmmədov',
      product: 'iPhone 15 Pro',
      quantity: 2,
      price: 150.00,
      status: 'Yeni',
      date: '2024-01-15',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'iPhone 15 Pro x2 ədəd - 150₼'
    },
    {
      id: '#12346',
      customer: 'Aysu Hüseynova',
      employee: 'Aysu Hüseynova',
      product: 'MacBook Air',
      quantity: 1,
      price: 75.50,
      status: 'Gözləmədə',
      date: '2024-01-16',
      courier: 'Elşən Məmmədov',
      zone: 'Sumqayıt',
      whatsappMessage: 'MacBook Air x1 ədəd - 75.50₼'
    },
    {
      id: '#12347',
      customer: 'Məhəmməd Əliyev',
      employee: 'Məhəmməd Əliyev',
      product: 'Apple Watch',
      quantity: 3,
      price: 200.00,
      status: 'Yönləndirilib',
      date: '2024-01-17',
      courier: 'Orxan Əliyev',
      zone: 'Gəncə',
      whatsappMessage: 'Apple Watch x3 ədəd - 200₼'
    },
    {
      id: '#12348',
      customer: 'Səbinə Əliyeva',
      employee: 'Səbinə Əliyeva',
      product: 'iPad Pro',
      quantity: 1,
      price: 120.00,
      status: 'Tamamlandı',
      date: '2024-01-18',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'iPad Pro x1 ədəd - 120₼'
    },
    {
      id: '#12349',
      customer: 'Rəşad Əhmədov',
      employee: 'Əli Məmmədov',
      product: 'AirPods Pro',
      quantity: 5,
      price: 85.00,
      status: 'Ləğv',
      date: '2024-01-19',
      courier: 'Təyin edilməyib',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'AirPods Pro x5 ədəd - 85₼ (LƏĞV)'
    },
    {
      id: '#12350',
      customer: 'Əli Məmmədov',
      employee: 'Nigar Əhmədova',
      product: 'Samsung Galaxy S24',
      quantity: 2,
      price: 180.00,
      status: 'Yeni',
      date: '2024-01-20',
      courier: 'Elşən Məmmədov',
      zone: 'Sumqayıt',
      whatsappMessage: 'Samsung Galaxy S24 x2 ədəd - 180₼'
    },
    {
      id: '#12351',
      customer: 'Aysu Hüseynova',
      employee: 'Rəşad Hüseynov',
      product: 'Dell XPS 13',
      quantity: 1,
      price: 95.00,
      status: 'Gözləmədə',
      date: '2024-01-21',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'Dell XPS 13 x1 ədəd - 95₼'
    },
    {
      id: '#12352',
      customer: 'Məhəmməd Əliyev',
      employee: 'Leyla Məmmədova',
      product: 'Sony WH-1000XM5',
      quantity: 3,
      price: 110.00,
      status: 'Yönləndirilib',
      date: '2024-01-22',
      courier: 'Orxan Əliyev',
      zone: 'Gəncə',
      whatsappMessage: 'Sony WH-1000XM5 x3 ədəd - 110₼'
    },
    {
      id: '#12353',
      employee: 'Orxan Əliyev',
      product: 'Microsoft Surface Pro',
      quantity: 1,
      price: 160.00,
      status: 'Tamamlandı',
      date: '2024-01-23',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'Microsoft Surface Pro x1 ədəd - 160₼'
    },
    {
      id: '#12354',
      employee: 'Aynur Hüseynova',
      product: 'Google Pixel 8',
      quantity: 2,
      price: 140.00,
      status: 'Yeni',
      date: '2024-01-24',
      courier: 'Elşən Məmmədov',
      zone: 'Sumqayıt',
      whatsappMessage: 'Google Pixel 8 x2 ədəd - 140₼'
    },
    {
      id: '#12355',
      employee: 'Elşən Məmmədov',
      product: 'Lenovo ThinkPad X1',
      quantity: 1,
      price: 125.00,
      status: 'Gözləmədə',
      date: '2024-01-25',
      courier: 'Orxan Əliyev',
      zone: 'Gəncə',
      whatsappMessage: 'Lenovo ThinkPad X1 x1 ədəd - 125₼'
    },
    {
      id: '#12356',
      employee: 'Günel Əliyeva',
      product: 'Bose QuietComfort 45',
      quantity: 4,
      price: 90.00,
      status: 'Yönləndirilib',
      date: '2024-01-26',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz',
      whatsappMessage: 'Bose QuietComfort 45 x4 ədəd - 90₼'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yeni': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Gözləmədə': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Yönləndirilib': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Tamamlandı': return 'bg-green-100 text-green-800 border-green-200';
      case 'Ləğv': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Yeni': return <Clock className="w-4 h-4" />;
      case 'Gözləmədə': return <Clock className="w-4 h-4" />;
      case 'Yönləndirilib': return <Target className="w-4 h-4" />;
      case 'Tamamlandı': return <CheckCircle className="w-4 h-4" />;
      case 'Ləğv': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesEmployee = employeeFilter === 'all' || order.employee === employeeFilter;
    const matchesProduct = productFilter === 'all' || order.product === productFilter;
    const matchesZone = zoneFilter === 'all' || order.zone === zoneFilter;
    
    return matchesSearch && matchesStatus && matchesEmployee && matchesProduct && matchesZone;
  });

  // Səhifələmə hesablamaları
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Səhifə dəyişdirmə funksiyaları
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Səhifə nömrələrini göstərmək üçün
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

  // Modal funksiyaları
  const handleAddOrder = () => {
    const newId = `#${Math.floor(Math.random() * 100000)}`;
    const today = new Date().toISOString().split('T')[0];
    const whatsappMessage = `${newOrder.product} x${newOrder.quantity} ədəd - ${newOrder.discountedPrice.toFixed(2)}₼ (Endirimli)`;
    
    const orderToAdd = {
      id: newId,
      customer: newOrder.customer,
      employee: newOrder.employee,
      product: newOrder.product,
      quantity: newOrder.quantity,
      price: parseFloat(newOrder.price),
      totalPrice: newOrder.totalPrice,
      discountedPrice: newOrder.discountedPrice,
      discount: newOrder.discount,
      status: newOrder.status,
      date: today,
      courier: newOrder.courier,
      zone: newOrder.zone,
      whatsappMessage: whatsappMessage
    };
    
    // orders array-inə əlavə etmək üçün state update etmək lazımdır
    // Bu real app-də backend ilə əlaqə olacaq
    console.log('Yeni sifariş əlavə edildi:', orderToAdd);
    
    // Formu təmizlə
    setNewOrder({
      customer: '',
      employee: '',
      product: '',
      quantity: 1,
      price: 0,
      totalPrice: 0,
      discountedPrice: 0,
      discount: 0,
      status: 'Yeni',
      courier: 'Rəşad Əhmədov',
      zone: 'Bakı Mərkəz'
    });
    setShowAddModal(false);
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        customer: newOrder.customer,
        employee: newOrder.employee,
        product: newOrder.product,
        quantity: newOrder.quantity,
        price: parseFloat(newOrder.price),
        status: newOrder.status,
        courier: newOrder.courier,
        zone: newOrder.zone,
        whatsappMessage: `${newOrder.product} x${newOrder.quantity} ədəd - ${newOrder.price}₼`
      };
      
      // orders array-ini update etmək üçün state update etmək lazımdır
      console.log('Sifariş yeniləndi:', updatedOrder);
      
      setShowEditModal(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      // orders array-indən silmək üçün state update etmək lazımdır
      console.log('Sifariş silindi:', selectedOrder);
      
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  // Məhsul seçildikdə qiyməti hesablayan funksiya
  const calculatePrices = (productName, quantity, discountAmount = 0) => {
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
      const unitPrice = selectedProduct.price;
      const totalPrice = unitPrice * quantity;
      const discount = parseFloat(discountAmount) || 0;
      const discountedPrice = totalPrice - discount;
      
      return {
        price: unitPrice,
        totalPrice: totalPrice,
        discount: discount,
        discountedPrice: discountedPrice
      };
    }
    return { price: 0, totalPrice: 0, discount: 0, discountedPrice: 0 };
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewOrder({
      customer: order.customer || '',
      employee: order.employee,
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      totalPrice: order.totalPrice || order.price * order.quantity,
      discountedPrice: order.discountedPrice || (order.price * order.quantity * 0.9),
      discount: order.discount || (order.price * order.quantity * 0.1),
      status: order.status,
      courier: order.courier,
      zone: order.zone || 'Bakı Mərkəz'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Courier Assignment Function
  const assignCourier = () => {
    if (selectedOrder && assignedCourier) {
      // Update the order with new courier
      const updatedOrder = {
        ...selectedOrder,
        courier: assignedCourier,
        status: 'Yönləndirilib'
      };
      
      // In a real app, this would update the backend
      console.log('Kuryer təyin edildi:', updatedOrder);
      
      // Close modals
      setShowCourierAssignment(false);
      setShowViewModal(false);
      setSelectedOrder(null);
      setAssignedCourier('');
    }
  };

  // Excel Export Function
  const exportToExcel = () => {
    // Check if we're exporting filtered data or all data
    const isFiltered = searchTerm || statusFilter !== 'all' || employeeFilter !== 'all' || productFilter !== 'all';
    
    // Prepare data for export
    const exportData = filteredOrders.map(order => ({
      'Sifariş ID': order.id,
      'Əməkdaş': order.employee,
      'Məhsul': order.product,
      'Miqdar': order.quantity,
      'Vahid Qiymət (₼)': order.price,
      'Ümumi Qiymət (₼)': (order.price * order.quantity).toFixed(2),
      'Endirimli Qiymət (₼)': order.discountedPrice ? order.discountedPrice.toFixed(2) : (order.price * order.quantity).toFixed(2),
      'Endirim (₼)': order.discount ? order.discount.toFixed(2) : '0.00',
      'Status': order.status,
      'Tarix': order.date,
      'Zona': order.zone,
      'Kuryer': order.courier,
      'WhatsApp Mesajı': order.whatsappMessage
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add main data worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // Sifariş ID
      { wch: 20 }, // Əməkdaş
      { wch: 25 }, // Məhsul
      { wch: 8 },  // Miqdar
      { wch: 15 }, // Vahid Qiymət
      { wch: 15 }, // Ümumi Qiymət
      { wch: 15 }, // Endirimli Qiymət
      { wch: 12 }, // Endirim
      { wch: 12 }, // Status
      { wch: 12 }, // Tarix
      { wch: 12 }, // Zona
      { wch: 15 }, // Kuryer
      { wch: 50 }  // WhatsApp Mesajı
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sifarişlər');

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const fileName = `Sifarişlər_${today}${isFiltered ? '_Filtrli' : ''}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);
    
    // Show success notification
    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 3000);
  };



  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ramton Sifarişlər
        </h1>
        <p className="text-gray-600 text-lg">Ramton bot tərəfindən avtomatik tanınan və manual əlavə edilən sifarişlər</p>
      </div>
      
      {/* Statistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Sifariş</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yeni Sifarişlər</p>
              <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'Yeni').length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanmış</p>
              <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'Tamamlandı').length}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ümumi Dəyər</p>
              <p className="text-3xl font-bold text-gray-900">₼{orders.reduce((sum, order) => sum + order.price, 0).toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Sifariş İdarəetməsi</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manual Sifariş
              </button>
              <button 
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </button>
            </div>
          </div>
        </div>

        {/* Axtarış və Filtrlər */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Sifariş axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Yeni">Yeni</option>
              <option value="Gözləmədə">Gözləmədə</option>
              <option value="Yönləndirilib">Yönləndirilib</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Ləğv">Ləğv</option>
            </select>
            
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Əməkdaşlar</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name} - {employee.role}
                </option>
              ))}
            </select>
            
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Məhsullar</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name} - {product.category}
                </option>
              ))}
            </select>
            
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Zonalar</option>
              <option value="Bakı Mərkəz">Bakı Mərkəz</option>
              <option value="Sumqayıt">Sumqayıt</option>
              <option value="Gəncə">Gəncə</option>
            </select>
            
            <button className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtr
            </button>
          </div>
        </div>
      </div>

      {/* Sifariş Kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {currentOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl transition-all duration-300 transform hover:scale-105">
            {/* Başlıq */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)} flex items-center space-x-1`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{order.customer || order.employee}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
            </div>

            {/* Məzmun */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Məhsul:</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.product}</span>
                </div>
                
                {order.customer && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Müştəri:</span>
                    </div>
                    <span className="font-medium text-gray-800">{order.customer}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Endirimli Qiymət:</span>
                  </div>
                  <span className="font-semibold text-green-600">₼{order.discountedPrice ? order.discountedPrice.toFixed(2) : order.price}</span>
                </div>
                
                {order.discount && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Endirim:</span>
                    </div>
                    <span className="text-xs text-red-600">-₼{order.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Miqdar:</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.quantity} ədəd</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Kuryer:</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.courier}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Zona:</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.zone}</span>
                </div>
              </div>

              {/* WhatsApp Mesaj */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Ramton Mesajı</span>
                </div>
                <p className="text-sm text-gray-600">{order.whatsappMessage}</p>
              </div>

              {/* Əməliyyatlar */}
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => openViewModal(order)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                  title="Bax"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Bax</span>
                </button>
                <button 
                  onClick={() => openEditModal(order)}
                  className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
                  title="Redaktə"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Redaktə</span>
                </button>
                <button 
                  onClick={() => openDeleteModal(order)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Səhifələmə */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Göstərilir: <span className="font-medium">{indexOfFirstOrder + 1}</span> - <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> / <span className="font-medium">{filteredOrders.length}</span> sifariş
            </div>
            
            <div className="flex items-center space-x-2">
              {/* İlk səhifə */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="İlk səhifə"
              >
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Əvvəlki səhifə */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Əvvəlki səhifə"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Səhifə nömrələri */}
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
              
              {/* Növbəti səhifə */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Növbəti səhifə"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Son səhifə */}
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



      {/* View Sifariş Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Sifariş Detalları</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
                        <div className="flex-1 overflow-y-auto p-6">
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Başlıq */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{selectedOrder.id}</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)} flex items-center space-x-1`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span>{selectedOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Əməkdaş Məlumatları */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Əməkdaş</h5>
                      <p className="text-gray-600">{selectedOrder.employee}</p>
                    </div>
                  </div>
                </div>

                {/* Müştəri Məlumatları */}
                {selectedOrder.customer && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">Müştəri</h5>
                        <p className="text-gray-600">{selectedOrder.customer}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Məhsul Məlumatları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-gray-800">Məhsul</h5>
                    </div>
                    <p className="text-gray-600">{selectedOrder.product}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-gray-800">Miqdar</h5>
                    </div>
                    <p className="text-gray-600">{selectedOrder.quantity} ədəd</p>
                  </div>
                </div>

                {/* Qiymət, Kuryer və Zona */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-gray-800">Qiymət</h5>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₼{selectedOrder.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-orange-600" />
                      <h5 className="font-medium text-gray-800">Kuryer</h5>
                    </div>
                    <p className="text-gray-600">{selectedOrder.courier}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-gray-800">Zona</h5>
                    </div>
                    <p className="text-gray-600">{selectedOrder.zone}</p>
                  </div>
                </div>

                {/* WhatsApp Mesajı */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h5 className="font-medium text-green-800">Ramton Mesajı</h5>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedOrder.whatsappMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Bu mesaj Ramton qrupuna göndəriləcək
                  </p>
                </div>

                {/* Əlavə Məlumatlar */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-3">Əlavə Məlumatlar</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sifariş ID:</span>
                      <p className="font-medium text-gray-800">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tarix:</span>
                      <p className="font-medium text-gray-800">{selectedOrder.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium text-gray-800">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ümumi Dəyər:</span>
                      <p className="font-medium text-gray-800">₼{(selectedOrder.price * selectedOrder.quantity).toFixed(2)}</p>
                    </div>
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
                onClick={() => setShowCourierAssignment(true)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kuryer Təyin Et
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedOrder);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Sifariş Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Sifariş Əlavə Et</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Müştəri</label>
                <select
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Müştəri seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name} - {customer.city} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Əməkdaş</label>
                <select
                  value={newOrder.employee}
                  onChange={(e) => setNewOrder({...newOrder, employee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Əməkdaş seçin</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name} - {employee.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul</label>
                <select
                  value={newOrder.product}
                  onChange={(e) => {
                    const productName = e.target.value;
                    const prices = calculatePrices(productName, newOrder.quantity, 0);
                    setNewOrder({
                      ...newOrder, 
                      product: productName,
                      discount: 0,
                      ...prices
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Məhsul seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} - {product.category} (₼{product.price})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miqdar</label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 1;
                      const prices = calculatePrices(newOrder.product, quantity, newOrder.discount);
                      setNewOrder({
                        ...newOrder, 
                        quantity: quantity,
                        ...prices
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vahid Qiymət (₼)</label>
                  <input
                    type="number"
                    value={newOrder.price}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              
              
              {/* Endirim Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endirim Məbləği (₼)</label>
                <input
                  type="number"
                  value={newOrder.discount}
                  onChange={(e) => {
                    const discountAmount = parseFloat(e.target.value) || 0;
                    const prices = calculatePrices(newOrder.product, newOrder.quantity, discountAmount);
                    setNewOrder({
                      ...newOrder,
                      discount: discountAmount,
                      discountedPrice: prices.discountedPrice
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              
              {/* Qiymət Hesablamaları */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cəmi Qiymət:</span>
                  <span className="font-semibold text-gray-800">₼{newOrder.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Endirim:</span>
                  <span className="font-semibold text-red-600">-₼{newOrder.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Endirimli Qiymət:</span>
                  <span className="font-semibold text-green-600">₼{newOrder.discountedPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Yeni">Yeni</option>
                  <option value="Gözləmədə">Gözləmədə</option>
                  <option value="Yönləndirilib">Yönləndirilib</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                  <option value="Ləğv">Ləğv</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kuryer</label>
                <select
                  value={newOrder.courier}
                  onChange={(e) => setNewOrder({...newOrder, courier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Rəşad Əhmədov">Rəşad Əhmədov</option>
                  <option value="Elşən Məmmədov">Elşən Məmmədov</option>
                  <option value="Orxan Əliyev">Orxan Əliyev</option>
                  <option value="Təyin edilməyib">Təyin edilməyib</option>
                </select>
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
                onClick={handleAddOrder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sifariş Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Sifarişi Redaktə Et</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Müştəri</label>
                <select
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Müştəri seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name} - {customer.city} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Əməkdaş</label>
                <select
                  value={newOrder.employee}
                  onChange={(e) => setNewOrder({...newOrder, employee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Əməkdaş seçin</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name} - {employee.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul</label>
                <select
                  value={newOrder.product}
                  onChange={(e) => {
                    const productName = e.target.value;
                    const prices = calculatePrices(productName, newOrder.quantity, 0);
                    setNewOrder({
                      ...newOrder, 
                      product: productName,
                      discount: 0,
                      ...prices
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Məhsul seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} - {product.category} (₼{product.price})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miqdar</label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 1;
                      const prices = calculatePrices(newOrder.product, quantity, newOrder.discount);
                      setNewOrder({
                        ...newOrder, 
                        quantity: quantity,
                        ...prices
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vahid Qiymət (₼)</label>
                  <input
                    type="number"
                    value={newOrder.price}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              
              {/* Endirim Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endirim Məbləği (₼)</label>
                <input
                  type="number"
                  value={newOrder.discount}
                  onChange={(e) => {
                    const discountAmount = parseFloat(e.target.value) || 0;
                    const prices = calculatePrices(newOrder.product, newOrder.quantity, discountAmount);
                    setNewOrder({
                      ...newOrder,
                      discount: discountAmount,
                      discountedPrice: prices.discountedPrice
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              
              {/* Qiymət Hesablamaları */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cəmi Qiymət:</span>
                  <span className="font-semibold text-gray-800">₼{newOrder.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Endirim:</span>
                  <span className="font-semibold text-red-600">-₼{newOrder.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Endirimli Qiymət:</span>
                  <span className="font-semibold text-green-600">₼{newOrder.discountedPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Yeni">Yeni</option>
                  <option value="Gözləmədə">Gözləmədə</option>
                  <option value="Yönləndirilib">Yönləndirilib</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                  <option value="Ləğv">Ləğv</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kuryer</label>
                <select
                  value={newOrder.courier}
                  onChange={(e) => setNewOrder({...newOrder, courier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Rəşad Əhmədov">Rəşad Əhmədov</option>
                  <option value="Elşən Məmmədov">Elşən Məmmədov</option>
                  <option value="Orxan Əliyev">Orxan Əliyev</option>
                  <option value="Təyin edilməyib">Təyin edilməyib</option>
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
                onClick={handleEditOrder}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Sifariş Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Sifarişi Sil</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Sifarişi silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">
                <strong>{selectedOrder?.id}</strong> - {selectedOrder?.product}
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
                onClick={handleDeleteOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Assignment Modal */}
      {showCourierAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Kuryer Təyin Et</h3>
              <button 
                onClick={() => setShowCourierAssignment(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Sifariş Məlumatları</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedOrder.id}</p>
                      <p><span className="font-medium">Məhsul:</span> {selectedOrder.product}</p>
                      <p><span className="font-medium">Zona:</span> {selectedOrder.zone}</p>
                      <p><span className="font-medium">Cari Kuryer:</span> {selectedOrder.courier}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kuryer Seçin</label>
                    <select
                      value={assignedCourier}
                      onChange={(e) => setAssignedCourier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Kuryer seçin</option>
                      <option value="Rəşad Əhmədov">Rəşad Əhmədov</option>
                      <option value="Elşən Məmmədov">Elşən Məmmədov</option>
                      <option value="Orxan Əliyev">Orxan Əliyev</option>
                    </select>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Qeyd:</strong> Kuryer təyin edildikdə sifariş statusu avtomatik olaraq "Yönləndirilib" olacaq.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCourierAssignment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={assignCourier}
                disabled={!assignedCourier}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Təyin Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Success Notification */}
      {showExportNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{filteredOrders.length} sifariş {(searchTerm || statusFilter !== 'all' || employeeFilter !== 'all' || productFilter !== 'all') ? '(filtrli)' : ''} uğurla yükləndi!</span>
        </div>
      )}
    </div>
  );
};

export default Orders; 