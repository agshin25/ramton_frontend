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
  ChevronUp,
  Star,
  BarChart3
} from 'lucide-react';
import { useGetAdminsQuery } from '../services/adminsApi';
import { useGetCourierPaymentsQuery, usePayCourierForOrderMutation, useDeletePaymentMutation, useCollectFromCourierMutation } from '../services/paymentsApi';

const CourierSettlement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [couriersPerPage] = useState(6);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Payment states
  const [paymentData, setPaymentData] = useState({
    amount: '',
    notes: '',
    currency: 'AZN'
  });
  const [paymentType, setPaymentType] = useState('payment'); // 'payment' or 'revert'

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Toast notification function
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Error handling function
  const getErrorMessage = (error) => {
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.data?.errors) {
      const firstError = Object.values(error.data.errors)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return firstError;
    }
    
    return error?.data?.message || 'Xəta baş verdi!';
  };

  // API hooks
  const { data: adminsData, isLoading: adminsLoading, error: adminsError, refetch: refetchAdmins } = useGetAdminsQuery();
  
  // Payment API calls
  const { data: paymentsData, isLoading: paymentsLoading, refetch: refetchPayments } = useGetCourierPaymentsQuery();
  const [payCourierForOrder] = usePayCourierForOrderMutation();
  const [collectFromCourier] = useCollectFromCourierMutation();
  const [deletePayment] = useDeletePaymentMutation();

  // Filter couriers from admins data (role_type === "courier")
  const couriers = adminsData?.data?.filter(admin => admin.role_type === "courier") || [];

  // Filter couriers based on search term and status
  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = searchTerm === '' || 
      courier.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || courier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCouriers.length / couriersPerPage);
  const startIndex = (currentPage - 1) * couriersPerPage;
  const endIndex = startIndex + couriersPerPage;
  const currentCouriers = filteredCouriers.slice(startIndex, endIndex);

  // Payment functions
  const openPaymentModal = (courier) => {
    setSelectedCourier(courier);
    // Reset payment data to ensure clean state
    setPaymentData({
      amount: '',
      notes: '',
      currency: 'AZN'
    });
    setPaymentType('payment'); // Default to paying courier
    setShowPaymentModal(true);
  };

  const openDetailModal = (courier) => {
    setSelectedCourier(courier);
    setShowDetailModal(true);
  };

  const handlePayCourier = async () => {
    try {
      console.log("Sending payment data:", paymentData, "Payment type:", paymentType);
      
      if (paymentType === 'payment') {
        // Pay money TO courier
        await payCourierForOrder({
          courierId: selectedCourier.id,
          paymentData: paymentData
        }).unwrap();
        showToastNotification("Kuryerə ödəniş uğurla edildi!", "success");
      } else {
        // Collect money FROM courier
        await collectFromCourier({
          courierId: selectedCourier.id,
          paymentData: paymentData
        }).unwrap();
        showToastNotification("Kuryerdən pul toplama uğurla edildi!", "success");
      }
      
      setShowPaymentModal(false);
      refetchPayments();
      refetchAdmins();
    } catch (error) {
      console.error("Ödəniş edilərkən xəta:", error);
      showToastNotification(getErrorMessage(error), "error");
    }
  };


  const handleDeletePayment = async (payment) => {
    try {
      await deletePayment({
        paymentId: payment.id
      }).unwrap();
      
      showToastNotification("Ödəniş silindi!", "success");
      setShowDeleteModal(false);
      refetchPayments();
      refetchAdmins();
    } catch (error) {
      console.error("Ödəniş silinərkən xəta:", error);
      showToastNotification(getErrorMessage(error), "error");
    }
  };


  if (adminsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (adminsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Xəta: {getErrorMessage(adminsError)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kuryer Hesabları</h1>
              <p className="text-gray-600">Kuryerlərlə hesablaşma və ödəniş idarəetməsi</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Hesabat Yüklə
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kuryer axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Qeyri-aktiv</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Couriers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCouriers.map((courier) => (
            <div key={courier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{courier.first_name} {courier.last_name}</h3>
                    <p className="text-sm text-gray-500">{courier.phone}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  courier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {courier.status === 'active' ? 'Aktiv' : 'Qeyri-aktiv'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Kuryer Balansı: ₼{courier.profile?.balance || 0}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Müştəri Nağd Pul Balansı: ₼{courier.profile?.cash_balance_for_orders || 0}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Çatdırılma Qiyməti: ₼{courier.profile?.price_per_delivery || 0}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Valyuta: {courier.profile?.currency || 'AZN'}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => openPaymentModal(courier)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ödəniş Et
                </button>
                <button 
                  onClick={() => openDetailModal(courier)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Detallı Bax
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Əvvəlki
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonrakı
            </button>
          </div>
        )}
      </div>

      {/* All Payments Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Bütün Ödənişlər</h2>
            <p className="text-gray-600">Bütün kuryerlərin ödəniş tarixçəsi</p>
          </div>
          
          <div className="overflow-x-auto">
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500">Yüklənir...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kuryer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Məbləğ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valyuta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Növ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qeydlər
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Əməliyyatlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentsData?.data?.length > 0 ? (
                    paymentsData.data.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.courier?.first_name} {payment.courier?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{payment.courier?.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-bold ${
                            payment.billing_type === 'payment' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {payment.billing_type === 'payment' ? '+' : '-'}{payment.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.billing_type === 'payment' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.billing_type === 'payment' ? 'Ödəniş' : 'Geri Qaytarma'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.created_at).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {payment.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Hələ ödəniş tarixçəsi yoxdur</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {paymentType === 'payment' ? 'Kuryerə Ödəniş' : 'Kuryerdən Pul Toplama'}
              </h3>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentData({
                    amount: '',
                    notes: '',
                    currency: 'AZN'
                  });
                  setPaymentType('payment');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Payment Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Əməliyyat Növü</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentType"
                      value="payment"
                      checked={paymentType === 'payment'}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Kuryerə Ödəniş</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentType"
                      value="revert"
                      checked={paymentType === 'revert'}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Kuryerdən Pul Toplama</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Məbləğ (₼)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valyuta</label>
                <select
                  value={paymentData.currency}
                  onChange={(e) => setPaymentData({...paymentData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AZN">AZN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Ödəniş haqqında qeydlər..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentData({
                    amount: '',
                    notes: '',
                    currency: 'AZN'
                  });
                  setPaymentType('payment');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handlePayCourier}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {paymentType === 'payment' ? 'Ödəniş Et' : 'Pul Topla'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Payment History Modal */}
      {showDetailModal && selectedCourier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Ödəniş Tarixçəsi - {selectedCourier?.first_name} {selectedCourier?.last_name}</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Kuryer Balansı</p>
                      <p className="text-2xl font-bold text-blue-800">₼{selectedCourier.profile?.balance || 0}</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Müştəri Nağd Pul</p>
                      <p className="text-2xl font-bold text-green-800">₼{selectedCourier.profile?.cash_balance_for_orders || 0}</p>
                    </div>
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Çatdırılma Qiyməti</p>
                      <p className="text-2xl font-bold text-yellow-800">₼{selectedCourier.profile?.price_per_delivery || 0}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Aylıq Maaş</p>
                      <p className="text-2xl font-bold text-purple-800">₼{selectedCourier.profile?.monthly_salary || 0}</p>
                    </div>
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Ödəniş Tarixçəsi
                </h5>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Yüklənir...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentsData?.data?.filter(payment => payment.courier_id === selectedCourier.id).length > 0 ? (
                      paymentsData.data
                        .filter(payment => payment.courier_id === selectedCourier.id)
                        .map((payment) => (
                          <div key={payment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${
                                  payment.billing_type === 'payment' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {payment.billing_type === 'payment' ? 'Ödəniş' : 'Geri Qaytarma'}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(payment.created_at).toLocaleDateString('az-AZ')}
                                  </p>
                                  {payment.courier && (
                                    <p className="text-xs text-gray-400">
                                      Kuryer: {payment.courier.first_name} {payment.courier.last_name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold ${
                                  payment.billing_type === 'payment' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {payment.billing_type === 'payment' ? '+' : '-'}{payment.amount} {payment.currency}
                                </p>
                                <p className="text-sm text-gray-500">ID: #{payment.id}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {payment.notes && (
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {payment.notes}
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Hələ ödəniş tarixçəsi yoxdur</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Payment Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Ödənişi Sil</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Bu ödənişi silmək istədiyinizə əminsinizmi? Bu əməliyyat geri qaytarıla bilməz.
              </p>
              {selectedPayment && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Məbləğ: {selectedPayment.amount} {selectedPayment.currency}</p>
                  <p className="text-sm text-gray-500">Tarix: {new Date(selectedPayment.created_at).toLocaleDateString('az-AZ')}</p>
                  <p className="text-sm text-gray-500">Növ: {selectedPayment.billing_type === 'payment' ? 'Ödəniş' : 'Geri Qaytarma'}</p>
                  {selectedPayment.notes && (
                    <p className="text-sm text-gray-500">Qeyd: {selectedPayment.notes}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={() => handleDeletePayment(selectedPayment)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierSettlement;
