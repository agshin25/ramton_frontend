import React, { useState, useEffect } from "react";
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
  ShoppingBag,
  Download,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "../services/customersApi";
import { useGetZonesQuery } from "../services/zonesApi";

const Customers = () => {
  // API hooks
  const { data: customersData, isLoading, isError } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const { data: zonesData } = useGetZonesQuery();

  // Extract data from API responses
  const customers = customersData?.data || [];
  const zones = zonesData?.data || [];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vipFilter, setVipFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(8);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: null,
    notes: null,
    currency: "AZN",
    total_order_amount: 0,
    orders_number: 0,
    is_vip: false,
    status: "active",
    country_id: 1,
    city_id: 1,
    zone_id: 1,
  });

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

  const location = useLocation();

  // Handle URL parameters for VIP filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const vipParam = searchParams.get("vip");
    if (vipParam === "true") {
      setVipFilter("vip");
    }
  }, [location]);

  // VIP customer detection function
  const isVIPCustomer = (customer) => {
    // VIP criteria: is_vip flag OR 3+ orders OR 500+ total spent
    return (
      customer.is_vip ||
      customer.orders_number >= 3 ||
      parseFloat(customer.total_order_amount) >= 500
    );
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "🟢";
      case "waiting":
        return "🟡";
      case "inactive":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Aktiv";
      case "waiting":
        return "Gözləyir";
      case "inactive":
        return "Passiv";
      default:
        return status;
    }
  };

  // Zone helper functions
  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "Naməlum Zona";
  };

  const getZoneById = (zoneId) => {
    return zones.find((zone) => zone.id === zoneId);
  };

  // Get unique cities from zones
  const getUniqueCities = () => {
    const cities = [
      ...new Set(zones.map((zone) => zone.city?.name).filter(Boolean)),
    ];
    return cities;
  };

  // Get zones for a specific city
  const getZonesForCity = (cityId) => {
    return zones.filter((zone) => zone.city_id === cityId);
  };

  // Filtering logic
  const filteredCustomers = customers.filter((customer) => {
    const fullName =
      `${customer.first_name} ${customer.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    // VIP filtering logic
    let matchesVip = true;
    if (vipFilter === "vip") {
      matchesVip = isVIPCustomer(customer);
    } else if (vipFilter === "non-vip") {
      matchesVip = !isVIPCustomer(customer);
    }

    return matchesSearch && matchesStatus && matchesVip;
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
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
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // CRUD functions
  const handleAddCustomer = async () => {
    try {
      const customerData = {
        ...newCustomer,
        address:
          newCustomer.address && newCustomer.address.trim() !== ""
            ? newCustomer.address
            : null,
        notes:
          newCustomer.notes && newCustomer.notes.trim() !== ""
            ? newCustomer.notes
            : null,
      };
      await createCustomer(customerData).unwrap();
      showToastNotification("Müştəri uğurla əlavə edildi!", "success");
      setShowAddModal(false);
      // Reset form
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: null,
        notes: null,
        currency: "AZN",
        total_order_amount: 0,
        orders_number: 0,
        is_vip: false,
        status: "active",
        country_id: 1,
        city_id: 1,
        zone_id: 1,
      });
    } catch (error) {
      console.error("Müştəri əlavə edilərkən xəta:", error);
      const errorMessage =
        error?.data?.message || "Müştəri əlavə edilərkən xəta baş verdi!";
      showToastNotification(errorMessage, "error");
    }
  };

  const handleEditCustomer = async () => {
    try {
      // Only send changed fields
      const customerData = {};

      // Check if first_name has changed
      if (newCustomer.first_name !== selectedCustomer.first_name) {
        customerData.first_name = newCustomer.first_name;
      }

      // Check if last_name has changed
      if (newCustomer.last_name !== selectedCustomer.last_name) {
        customerData.last_name = newCustomer.last_name;
      }

      // Check if email has changed
      if (newCustomer.email !== selectedCustomer.email) {
        customerData.email = newCustomer.email;
      }

      // Check if phone has changed
      if (newCustomer.phone !== selectedCustomer.phone) {
        customerData.phone = newCustomer.phone;
      }

      // Check if address has changed
      const newAddress =
        newCustomer.address && newCustomer.address.trim() !== ""
          ? newCustomer.address
          : null;
      if (newAddress !== selectedCustomer.address) {
        customerData.address = newAddress;
      }

      // Check if notes has changed
      const newNotes =
        newCustomer.notes && newCustomer.notes.trim() !== ""
          ? newCustomer.notes
          : null;
      if (newNotes !== selectedCustomer.notes) {
        customerData.notes = newNotes;
      }

      // Check if currency has changed
      if (newCustomer.currency !== selectedCustomer.currency) {
        customerData.currency = newCustomer.currency;
      }

      // Check if total_order_amount has changed
      if (
        newCustomer.total_order_amount !== selectedCustomer.total_order_amount
      ) {
        customerData.total_order_amount = newCustomer.total_order_amount;
      }

      // Check if orders_number has changed
      if (newCustomer.orders_number !== selectedCustomer.orders_number) {
        customerData.orders_number = newCustomer.orders_number;
      }

      // Check if is_vip has changed
      if (newCustomer.is_vip !== selectedCustomer.is_vip) {
        customerData.is_vip = newCustomer.is_vip;
      }

      // Check if status has changed
      if (newCustomer.status !== selectedCustomer.status) {
        customerData.status = newCustomer.status;
      }

      // Check if country_id has changed
      if (newCustomer.country_id !== selectedCustomer.country_id) {
        customerData.country_id = newCustomer.country_id;
      }

      // Check if city_id has changed
      if (newCustomer.city_id !== selectedCustomer.city_id) {
        customerData.city_id = newCustomer.city_id;
      }

      // Check if zone_id has changed
      if (newCustomer.zone_id !== selectedCustomer.zone_id) {
        customerData.zone_id = newCustomer.zone_id;
      }

      // Only proceed if there are changes
      if (Object.keys(customerData).length === 0) {
        showToastNotification("Heç bir dəyişiklik edilməyib!", "error");
        return;
      }

      await updateCustomer({
        id: selectedCustomer.id,
        ...customerData,
      }).unwrap();
      showToastNotification("Müştəri uğurla yeniləndi!", "success");
      setShowEditModal(false);
    } catch (error) {
      console.error("Müştəri yenilənərkən xəta:", error);
      const errorMessage =
        error?.data?.message || "Müştəri yenilənərkən xəta baş verdi!";
      showToastNotification(errorMessage, "error");
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomer.id).unwrap();
      showToastNotification("Müştəri uğurla silindi!", "success");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Müştəri silinərkən xəta:", error);
      const errorMessage =
        error?.data?.message || "Müştəri silinərkən xəta baş verdi!";
      showToastNotification(errorMessage, "error");
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
      notes: customer.notes || "",
      currency: customer.currency,
      total_order_amount: customer.total_order_amount,
      is_vip: customer.is_vip,
      status: customer.status,
      country_id: customer.country_id,
      city_id: customer.city_id,
      zone_id: customer.zone_id,
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

  // Excel Export Function
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = customers.map((customer) => ({
      ID: customer.id,
      Ad: `${customer.first_name} ${customer.last_name}`,
      Email: customer.email,
      Telefon: customer.phone,
      Ünvan: customer.address || "",
      Şəhər: customer.city?.name || "",
      Status: getStatusText(customer.status),
      "Qoşulma Tarixi": customer.created_at
        ? new Date(customer.created_at).toLocaleDateString("az-AZ")
        : "",
      "Ümumi Sifariş": customer.orders_count,
      "Ümumi Xərc": `${parseFloat(customer.total_order_amount).toFixed(2)}₼`,
      VIP: customer.is_vip ? "Bəli" : "Xeyr",
      Zona: getZoneName(customer.zone_id),
      Qeydlər: customer.notes || "",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 5 }, // ID
      { wch: 20 }, // Ad
      { wch: 25 }, // Email
      { wch: 15 }, // Telefon
      { wch: 40 }, // Ünvan
      { wch: 12 }, // Şəhər
      { wch: 10 }, // Status
      { wch: 12 }, // Qoşulma Tarixi
      { wch: 12 }, // Ümumi Sifariş
      { wch: 15 }, // Ümumi Xərc
      { wch: 15 }, // Son Sifariş Tarixi
      { wch: 25 }, // Təyin Edilmiş Zonalar
      { wch: 30 }, // Qeydlər
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Müştərilər");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `Ramton_CRM_Müştərilər_${date}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalOrders = customers.reduce(
    (sum, c) => sum + (c.orders_number || 0),
    0
  );
  const totalRevenue = customers.reduce(
    (sum, c) => sum + parseFloat(c.total_order_amount || 0),
    0
  );
  const averageOrderValue =
    totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Müştərilər yüklənir...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Xəta baş verdi
              </h3>
              <p className="text-red-600">
                Müştərilər yüklənərkən xəta baş verdi. Zəhmət olmasa səhifəni
                yeniləyin.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Müştərilər
        </h1>
        <p className="text-gray-600 text-lg">
          Bütün müştərilərin siyahısı və idarəetməsi
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Müştəri</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalCustomers}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Aktiv Müştəri</p>
              <p className="text-2xl font-bold text-green-600">
                {activeCustomers}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Ümumi Sifariş</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalOrders}
              </p>
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
                <option value="active">Aktiv</option>
                <option value="waiting">Gözləyir</option>
                <option value="inactive">Passiv</option>
              </select>

              <select
                value={vipFilter}
                onChange={(e) => setVipFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Bütün Müştərilər</option>
                <option value="vip">Yalnız VIP</option>
                <option value="non-vip">Yalnız Adi</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </button>
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
      </div>

      {/* Customers Table */}
      {/* Filter Summary */}
      {(searchTerm || statusFilter !== "all" || vipFilter !== "all") && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-800">
                Aktiv Filtrlər:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Axtarış: {searchTerm}
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {statusFilter}
                </span>
              )}
              {vipFilter !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  VIP: {vipFilter === "vip" ? "Yalnız VIP" : "Yalnız Adi"}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setVipFilter("all");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Bütün filtrləri təmizlə
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Müştəri
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Əlaqə
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Şəhər
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Sifarişlər
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Gəlir
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </p>
                        {isVIPCustomer(customer) && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <span>👑</span>
                            <span>VIP</span>
                          </span>
                        )}
                      </div>
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
                        <span className="text-sm text-gray-600">
                          {customer.city?.name || "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Zona: {getZoneName(customer.zone_id)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {getStatusIcon(customer.status)}{" "}
                      {getStatusText(customer.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        {customer.orders_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">sifariş</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <p className="font-medium text-green-600">
                        {parseFloat(customer.total_order_amount || 0).toFixed(
                          2
                        )}{" "}
                        ₼
                      </p>
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
                Göstərilir:{" "}
                <span className="font-medium">{indexOfFirstCustomer + 1}</span>{" "}
                -{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                </span>{" "}
                /{" "}
                <span className="font-medium">{filteredCustomers.length}</span>{" "}
                müştəri
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
                      onClick={() =>
                        typeof pageNumber === "number" && goToPage(pageNumber)
                      }
                      disabled={pageNumber === "..."}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pageNumber === currentPage
                          ? "bg-blue-600 text-white"
                          : pageNumber === "..."
                          ? "text-gray-400 cursor-default"
                          : "text-gray-600 hover:bg-gray-100"
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
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni Müştəri Əlavə Et
              </h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.first_name}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.last_name}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Soyad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəhər *
                  </label>
                  <select
                    value={newCustomer.city_id}
                    onChange={(e) => {
                      const cityId = parseInt(e.target.value);
                      setNewCustomer({
                        ...newCustomer,
                        city_id: cityId,
                        zone_id: 1,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Şəhər seçin</option>
                    {getUniqueCities().map((city) => (
                      <option
                        key={city}
                        value={
                          zones.find((z) => z.city?.name === city)?.city_id
                        }
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <select
                    value={newCustomer.zone_id}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        zone_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Zona seçin</option>
                    {getZonesForCity(newCustomer.city_id).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktiv</option>
                    <option value="passiv">Passiv</option>
                    <option value="inactive">Qeyri-aktiv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valyuta
                  </label>
                  <select
                    value={newCustomer.currency}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ümumi Sifariş Sayı
                  </label>
                  <input
                    type="number"
                    value={newCustomer.orders_number}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        orders_number: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ümumi Sifariş Məbləği (₼)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCustomer.total_order_amount}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        total_order_amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIP Müştəri
                  </label>
                  <select
                    value={newCustomer.is_vip}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        is_vip: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={false}>Xeyr</option>
                    <option value={true}>Bəli</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ünvan
                  </label>
                  <textarea
                    value={newCustomer.address || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tam ünvan"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qeydlər
                  </label>
                  <textarea
                    value={newCustomer.notes || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, notes: e.target.value })
                    }
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
                disabled={
                  !newCustomer.first_name ||
                  !newCustomer.last_name ||
                  !newCustomer.email ||
                  isCreating
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Əlavə edilir..." : "Əlavə Et"}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Müştəri Redaktə Et
              </h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müştəri adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+994 50 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəhər
                  </label>
                  <select
                    value={newCustomer.city}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, city: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktiv</option>
                    <option value="passiv">Passiv</option>
                    <option value="inactive">Qeyri-aktiv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qoşulma Tarixi
                  </label>
                  <input
                    type="date"
                    value={newCustomer.joinDate}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        joinDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ümumi Sifariş
                  </label>
                  <input
                    type="number"
                    value={newCustomer.totalOrders}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        totalOrders: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ümumi Gəlir (₼)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCustomer.totalSpent}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        totalSpent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Son Sifariş Tarixi
                  </label>
                  <input
                    type="date"
                    value={newCustomer.lastOrderDate}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        lastOrderDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təyin Edilmiş Zonalar
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {newCustomer.city ? (
                      zones
                        .filter((zone) => zone.city === newCustomer.city)
                        .map((zone) => (
                          <label
                            key={zone.id}
                            className="flex items-center space-x-2 py-1"
                          >
                            <input
                              type="checkbox"
                              checked={newCustomer.assignedZones.includes(
                                zone.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones: [
                                      ...newCustomer.assignedZones,
                                      zone.id,
                                    ],
                                  });
                                } else {
                                  setNewCustomer({
                                    ...newCustomer,
                                    assignedZones:
                                      newCustomer.assignedZones.filter(
                                        (id) => id !== zone.id
                                      ),
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
                      <p className="text-sm text-gray-500">
                        Zona seçmək üçün əvvəlcə şəhər seçin
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ünvan
                  </label>
                  <textarea
                    value={newCustomer.address || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tam ünvan"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qeydlər
                  </label>
                  <textarea
                    value={newCustomer.notes || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, notes: e.target.value })
                    }
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
                disabled={
                  !newCustomer.name || !newCustomer.email || !newCustomer.phone
                }
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
                  <h3 className="text-lg font-semibold text-gray-800">
                    Müştərini Sil
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bu əməliyyat geri alına bilməz
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                <strong>{selectedCustomer?.name}</strong> adlı müştərini silmək
                istədiyinizə əminsiniz?
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
              <h3 className="text-xl font-semibold text-gray-800">
                Müştəri Məlumatları
              </h3>
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
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Müştəri ID</p>
                        <p className="font-medium text-gray-900">
                          #{selectedCustomer.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedCustomer.status
                          )}`}
                        >
                          {getStatusIcon(selectedCustomer.status)}{" "}
                          {selectedCustomer.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.joinDate}
                        </p>
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
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tam Ünvan</p>
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Təyin Edilmiş Zonalar
                        </p>
                        <div className="mt-2">
                          {selectedCustomer.assignedZones &&
                          selectedCustomer.assignedZones.length > 0 ? (
                            <div className="space-y-2">
                              {selectedCustomer.assignedZones.map((zoneId) => {
                                const zone = getZoneById(zoneId);
                                return zone ? (
                                  <div
                                    key={zoneId}
                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {zone.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Çatdırılma vaxtı: {zone.deliveryTime}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">
                                        Kuryer sayı
                                      </p>
                                      <p className="font-medium text-blue-600">
                                        {zone.courierCount}
                                      </p>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              Hazırda heç bir zona təyin edilməyib
                            </p>
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
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedCustomer.totalOrders}
                        </p>
                        <p className="text-sm text-gray-600">Ümumi Sifariş</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedCustomer.totalSpent.toFixed(2)} ₼
                        </p>
                        <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedCustomer.totalOrders > 0
                            ? (
                                selectedCustomer.totalSpent /
                                selectedCustomer.totalOrders
                              ).toFixed(2)
                            : 0}{" "}
                          ₼
                        </p>
                        <p className="text-sm text-gray-600">Orta Sifariş</p>
                      </div>
                    </div>
                    {selectedCustomer.lastOrderDate &&
                      selectedCustomer.lastOrderDate !== "-" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Son Sifariş Tarixi
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedCustomer.lastOrderDate}
                          </p>
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
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

export default Customers;
