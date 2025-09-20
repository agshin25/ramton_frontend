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
import { useGetCitiesQuery } from "../services/citiesApi";
import { useGetCountriesQuery } from "../services/countriesApi";

const Customers = () => {
  // API hooks
  const { data: customersData, isLoading, isError, refetch } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const { data: zonesData } = useGetZonesQuery();
  const { data: citiesData } = useGetCitiesQuery();
  const { data: countriesData } = useGetCountriesQuery();

  // Extract data from API responses
  const customers = customersData?.data || [];
  const zones = zonesData?.data || [];
  const cities = citiesData?.data || [];
  const countries = countriesData?.data || [];

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
    phone: null,
    address: null,
    notes: null,
    currency: "",
    is_vip: false,
    status: "",
    country_id: null,
    city_id: null,
    zone_id: null,
  });

  // Reset form function
  const resetForm = () => {
    setNewCustomer({
      first_name: "",
      last_name: "",
      email: "",
      phone: null,
      address: null,
      notes: null,
      currency: "",
      is_vip: false,
      status: "",
      country_id: null,
      city_id: null,
      zone_id: null,
    });
    setErrors({});
  };

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [errors, setErrors] = useState({});

  // Toast notification function
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Error message handler
  const getErrorMessage = (error) => {
    if (error?.data?.errors) {
      // Handle validation errors - show unified message
      return 'Zəhmət olmasa bütün xətaları düzəldin!';
    }
    
    return error?.data?.message || 'Xəta baş verdi!';
  };

  const location = useLocation();

  // Function to set VIP filter programmatically (can be called from other components)
  const setVIPFilter = (filterValue) => {
    setVipFilter(filterValue);
    // Scroll to the filter section to make it visible
    setTimeout(() => {
      const filterSection = document.querySelector('[data-filter-section]');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Expose the function globally for other components to use
  React.useEffect(() => {
    window.setCustomersVIPFilter = setVIPFilter;
    return () => {
      delete window.setCustomersVIPFilter;
    };
  }, []);

  // VIP customer detection function
  const isVIPCustomer = (customer) => {
    // VIP criteria: only use is_vip flag from backend
    return customer.is_vip === 1 || customer.is_vip === true;
  };

  // Calculate total spending from orders
  const calculateTotalSpending = (customer) => {
    if (!customer.orders || !Array.isArray(customer.orders)) {
      return 0;
    }
    return customer.orders.reduce((total, order) => {
      return total + parseFloat(order.discounted_price_for_total_order || 0);
    }, 0);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "deactive":
        return "bg-red-100 text-red-800";
      case "passiv":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "deactive":
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case "passiv":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
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

  // Get cities for a specific country
  const getCitiesForCountry = (countryId) => {
    if (!countryId) return [];
    const country = countries.find(c => c.id === countryId);
    return country ? country.cities || [] : [];
  };

  // Get zones for a specific city
  const getZonesForCity = (cityId) => {
    if (!cityId) return [];
    // Filter zones by city_id
    return zones.filter(zone => zone.city_id === cityId);
  };

  // Filtering logic
  const filteredCustomers = customers.filter((customer) => {
    const fullName =
      `${customer.first_name} ${customer.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
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
      setErrors({});
      
      // Basic validation - collect all errors
      const validationErrors = {};
      
      if (!newCustomer.first_name.trim()) {
        validationErrors.first_name = ["Ad tələb olunur"];
      }
      if (!newCustomer.last_name.trim()) {
        validationErrors.last_name = ["Soyad tələb olunur"];
      }
      if (!newCustomer.email.trim()) {
        validationErrors.email = ["Email tələb olunur"];
      }
      if (!newCustomer.country_id) {
        validationErrors.country_id = ["Ölkə tələb olunur"];
      }
      if (!newCustomer.city_id) {
        validationErrors.city_id = ["Şəhər tələb olunur"];
      }
      if (!newCustomer.zone_id) {
        validationErrors.zone_id = ["Zona tələb olunur"];
      }
      if (!newCustomer.status) {
        validationErrors.status = ["Status tələb olunur"];
      }
      
      // If there are validation errors, show them and prevent submission
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
        return;
      }

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
      // Manually refetch to ensure UI updates
      refetch();
      // Reset form
      resetForm();
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Show toaster notification for validation errors
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      }
      console.error("Müştəri əlavə edilərkən xəta:", error);
    }
  };

  const handleEditCustomer = async () => {
    try {
      setErrors({});
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
      // Manually refetch to ensure UI updates
      refetch();
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Show toaster notification for validation errors
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, 'error');
      }
      console.error("Müştəri yenilənərkən xəta:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomer.id).unwrap();
      showToastNotification("Müştəri uğurla silindi!", "success");
      setShowDeleteModal(false);
      // Manually refetch to ensure UI updates
      refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToastNotification(errorMessage, "error");
      console.error("Müştəri silinərkən xəta:", error);
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || null,
      address: customer.address || "",
      notes: customer.notes || "",
      currency: customer.currency || "AZN",
      is_vip: customer.is_vip || false,
      status: customer.status || "active",
      country_id: customer.country_id || 1,
      city_id: customer.city_id || 1,
      zone_id: customer.zone_id || 1,
    });
    setErrors({});
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
      "Ümumi Xərc": `${calculateTotalSpending(customer).toFixed(2)}₼`,
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
    (sum, c) => sum + (c.orders_count || 0),
    0
  );
  const totalRevenue = customers.reduce(
    (sum, c) => sum + calculateTotalSpending(c),
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
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Ümumi Müştəri</p>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {totalCustomers}
              </p>
              <p className="text-xs text-gray-500">Bütün müştərilər</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Aktiv Müştəri</p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {activeCustomers}
              </p>
              <p className="text-xs text-gray-500">Aktiv statusda</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Ümumi Sifariş</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {totalOrders}
              </p>
              <p className="text-xs text-gray-500">Bütün sifarişlər</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
            <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden" data-filter-section>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Müştəri adı, email və ya telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="active">Aktiv</option>
                <option value="deactive">Deaktiv</option>
                <option value="passiv">Passiv</option>
              </select>

              <select
                value={vipFilter}
                onChange={(e) => setVipFilter(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm ${
                  vipFilter === "vip" 
                    ? "border-purple-300 bg-purple-50 ring-2 ring-purple-200" 
                    : "border-gray-300"
                }`}
              >
                <option value="all">Bütün Müştərilər</option>
                <option value="vip">Yalnız VIP</option>
                <option value="non-vip">Yalnız Adi</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center font-medium"
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

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Müştəri
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Əlaqə
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Şəhər
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Sifarişlər
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Gəlir
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`hover:bg-blue-50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </p>
                        {isVIPCustomer(customer) && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 shadow-sm">
                            <span className="text-yellow-500">👑</span>
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
                        {customer.phone || "N/A"}
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
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {getStatusIcon(customer.status)}
                      <span>{getStatusText(customer.status)}</span>
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
                        {calculateTotalSpending(customer).toFixed(2)}{" "}
                        ₼
                      </p>
                      <p className="text-xs text-gray-500">ümumi</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(customer)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                        title="Bax"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(customer)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                        title="Redaktə Et"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(customer)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ölkə *
                  </label>
                  <select
                    value={newCustomer.country_id || ""}
                    onChange={(e) => {
                      const countryId = e.target.value ? parseInt(e.target.value) : null;
                      setNewCustomer({
                        ...newCustomer,
                        country_id: countryId,
                        city_id: null,
                        zone_id: null,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countries.map((country) => (
                      <option
                        key={country.id}
                        value={country.id}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəhər *
                  </label>
                  <select
                    value={newCustomer.city_id || ""}
                    onChange={(e) => {
                      const cityId = e.target.value ? parseInt(e.target.value) : null;
                      setNewCustomer({
                        ...newCustomer,
                        city_id: cityId,
                        zone_id: null,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={!newCustomer.country_id}
                  >
                    <option value="">Şəhər seçin</option>
                    {getCitiesForCountry(newCustomer.country_id).map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <select
                    value={newCustomer.zone_id || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        zone_id: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.zone_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Zona seçin</option>
                    {getZonesForCity(newCustomer.city_id).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {errors.zone_id && <p className="text-red-500 text-xs mt-1">{errors.zone_id[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="all">Bütün Statuslar</option>
                    <option value="active">Aktiv</option>
                    <option value="deactive">Deaktiv</option>
                    <option value="passiv">Passiv</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.currency ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ölkə *
                  </label>
                  <select
                    value={newCustomer.country_id || ""}
                    onChange={(e) => {
                      const countryId = e.target.value ? parseInt(e.target.value) : null;
                      setNewCustomer({
                        ...newCustomer,
                        country_id: countryId,
                        city_id: null,
                        zone_id: null,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countries.map((country) => (
                      <option
                        key={country.id}
                        value={country.id}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəhər *
                  </label>
                  <select
                    value={newCustomer.city_id || ""}
                    onChange={(e) => {
                      const cityId = e.target.value ? parseInt(e.target.value) : null;
                      setNewCustomer({
                        ...newCustomer,
                        city_id: cityId,
                        zone_id: null,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={!newCustomer.country_id}
                  >
                    <option value="">Şəhər seçin</option>
                    {getCitiesForCountry(newCustomer.country_id).map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ))}
                    </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <select
                    value={newCustomer.zone_id || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        zone_id: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.zone_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Zona seçin</option>
                    {getZonesForCity(newCustomer.city_id).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {errors.zone_id && <p className="text-red-500 text-xs mt-1">{errors.zone_id[0]}</p>}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="active">Aktiv</option>
                      <option value="deactive">Deaktiv</option>
                      <option value="passiv">Passiv</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.currency ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency[0]}</p>}
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
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleEditCustomer}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                <strong>{selectedCustomer?.first_name} {selectedCustomer?.last_name}</strong> adlı müştərini silmək
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
                          {selectedCustomer.first_name} {selectedCustomer.last_name}
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
                          {selectedCustomer.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(
                            selectedCustomer.status
                          )}`}
                        >
                          {getStatusIcon(selectedCustomer.status)}
                          <span>{getStatusText(selectedCustomer.status)}</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qoşulma Tarixi</p>
                        <p className="font-medium text-gray-900">
                          {selectedCustomer.created_at
                            ? new Date(selectedCustomer.created_at).toLocaleDateString("az-AZ")
                            : "N/A"}
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
                          {selectedCustomer.city?.name || "N/A"}
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
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                    <div>
                                      <p className="font-medium text-gray-900">
                                {getZoneName(selectedCustomer.zone_id)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                Zona ID: {selectedCustomer.zone_id}
                                      </p>
                                    </div>
                                    </div>
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
                          {selectedCustomer.orders_count || 0}
                        </p>
                        <p className="text-sm text-gray-600">Ümumi Sifariş</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {calculateTotalSpending(selectedCustomer).toFixed(2)} ₼
                        </p>
                        <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedCustomer.orders_count > 0
                            ? (
                                calculateTotalSpending(selectedCustomer) /
                                selectedCustomer.orders_count
                              ).toFixed(2)
                            : 0}{" "}
                          ₼
                        </p>
                        <p className="text-sm text-gray-600">Orta Sifariş</p>
                      </div>
                    </div>
                    {selectedCustomer.last_order_date && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Son Sifariş Tarixi
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedCustomer.last_order_date).toLocaleDateString("az-AZ")}
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
            <button
              onClick={() => setShowToast(false)}
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

export default Customers;
