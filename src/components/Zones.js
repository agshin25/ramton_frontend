import React, { useState } from "react";
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
  ChevronsRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  useGetZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} from "../services/zonesApi";
import { useGetCountriesQuery } from "../services/countriesApi";
import { useGetCitiesQuery } from "../services/citiesApi";

const Zones = () => {
  // API hooks
  const { data: zonesData, isLoading, isError, refetch } = useGetZonesQuery();
  const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
  const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();
  const [deleteZone, { isLoading: isDeleting }] = useDeleteZoneMutation();
  const { data: countriesData } = useGetCountriesQuery();
  const { data: citiesData } = useGetCitiesQuery();

  // Extract data from API responses
  const zones = zonesData?.data || [];
  const countries = countriesData?.data || [];
  const cities = citiesData?.data || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Bütün");
  const [cityFilter, setCityFilter] = useState("Bütün");
  const [currentPage, setCurrentPage] = useState(1);
  const [zonesPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [newZone, setNewZone] = useState({
    name: "",
    avg_delivery_time: "",
    status: "active",
    description: null,
    country_id: null,
    city_id: null,
  });

  // Reset form function
  const resetForm = () => {
    setNewZone({
      name: "",
      avg_delivery_time: "",
      status: "active",
      description: null,
      country_id: null,
      city_id: null,
    });
    setErrors({});
  };

  // Filter cities by selected country
  const getCitiesByCountry = (countryId) => {
    if (!countryId) return [];
    return cities.filter(city => city.country_id === countryId);
  };

  // Handle country change
  const handleCountryChange = (countryId) => {
    setNewZone({
      ...newZone,
      country_id: countryId,
      city_id: null, // Reset city when country changes
    });
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

  // Filter zones
  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.city?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Bütün" || zone.status === statusFilter;
    const matchesCity =
      cityFilter === "Bütün" || zone.city?.name === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Pagination
  const indexOfLastZone = currentPage * zonesPerPage;
  const indexOfFirstZone = indexOfLastZone - zonesPerPage;
  const currentZones = filteredZones.slice(indexOfFirstZone, indexOfLastZone);
  const totalPages = Math.ceil(filteredZones.length / zonesPerPage);

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

  const getDeliveryTimeColor = (avgDeliveryTime) => {
    const time = parseFloat(avgDeliveryTime);
    if (time <= 1.5) return "bg-green-100 text-green-800";
    if (time <= 2.5) return "bg-blue-100 text-blue-800";
    if (time <= 3.5) return "bg-yellow-100 text-yellow-800";
    if (time <= 4.5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const formatDeliveryTime = (avgDeliveryTime) => {
    const time = parseFloat(avgDeliveryTime);
    if (time <= 1.5) return "1-2 saat";
    if (time <= 2.5) return "2-3 saat";
    if (time <= 3.5) return "3-4 saat";
    if (time <= 4.5) return "4-5 saat";
    return "5-6 saat";
  };

  // CRUD functions
  const handleAddZone = async () => {
    try {
      setErrors({});
      
      // Basic validation
      const validationErrors = {};
      
      if (!newZone.name.trim()) {
        validationErrors.name = ["Zona adı tələb olunur"];
      }
      if (!newZone.avg_delivery_time) {
        validationErrors.avg_delivery_time = ["Çatdırılma müddəti tələb olunur"];
      }
      if (!newZone.country_id) {
        validationErrors.country_id = ["Ölkə tələb olunur"];
      }
      if (!newZone.city_id) {
        validationErrors.city_id = ["Şəhər tələb olunur"];
      }
      
      // If there are validation errors, show them and prevent submission
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
        return;
      }
      
      const zoneData = {
        name: newZone.name,
        avg_delivery_time: newZone.avg_delivery_time,
        status: newZone.status,
        description: newZone.description && newZone.description.trim() !== "" ? newZone.description : null,
        city_id: newZone.city_id, // Only send city_id, not country_id
      };
      await createZone(zoneData).unwrap();
      showToastNotification("Zona uğurla əlavə edildi!", "success");
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
      console.error("Zona əlavə edilərkən xəta:", error);
    }
  };

  const handleEditZone = async () => {
    try {
      setErrors({});
      // Only send changed fields
      const zoneData = {};

      // Check if name has changed
      if (newZone.name !== selectedZone.name) {
        zoneData.name = newZone.name;
      }

      // Check if avg_delivery_time has changed
      if (newZone.avg_delivery_time !== selectedZone.avg_delivery_time) {
        zoneData.avg_delivery_time = newZone.avg_delivery_time;
      }


      // Check if status has changed
      if (newZone.status !== selectedZone.status) {
        zoneData.status = newZone.status;
      }

      // Check if description has changed
      const newDescription =
        newZone.description && newZone.description.trim() !== ""
          ? newZone.description
          : null;
      if (newDescription !== selectedZone.description) {
        zoneData.description = newDescription;
      }

      // Check if city_id has changed (only send city_id, not country_id)
      if (newZone.city_id !== selectedZone.city_id) {
        zoneData.city_id = newZone.city_id;
      }

      // Only proceed if there are changes
      if (Object.keys(zoneData).length === 0) {
        showToastNotification("Heç bir dəyişiklik edilməyib!", "error");
        return;
      }

      await updateZone({ id: selectedZone.id, ...zoneData }).unwrap();
      showToastNotification("Zona uğurla yeniləndi!", "success");
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
      console.error("Zona yenilənərkən xəta:", error);
    }
  };

  const handleDeleteZone = async () => {
    try {
      await deleteZone(selectedZone.id).unwrap();
      showToastNotification("Zona uğurla silindi!", "success");
      setShowDeleteModal(false);
      // Manually refetch to ensure UI updates
      refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToastNotification(errorMessage, "error");
      console.error("Zona silinərkən xəta:", error);
    }
  };

  const openEditModal = (zone) => {
    setSelectedZone(zone);
    
    // Find the country_id from the city_id
    const city = cities.find(c => c.id === zone.city_id);
    const countryId = city ? city.country_id : null;
    
    setNewZone({
      name: zone.name,
      avg_delivery_time: zone.avg_delivery_time,
      status: zone.status,
      description: zone.description || "",
      country_id: countryId,
      city_id: zone.city_id,
    });
    setErrors({});
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
  const activeZones = zones.filter((zone) => zone.status === "active").length;
  const totalCouriers = zones.reduce(
    (sum, zone) => sum + (zone.couriers_count || 0),
    0
  );
  const bakuZones = zones.filter((zone) => zone.city?.name === "Baku").length;

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Zonalar yüklənir...</p>
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
                Zonalar yüklənərkən xəta baş verdi. Zəhmət olmasa səhifəni
                yeniləyin.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-gray-600">
                  Aktiv Zonalar
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeZones}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ümumi Kuryer
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCouriers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Bakı Zonaları
                </p>
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
                <option value="active">Aktiv</option>
                <option value="deactive">Deaktiv</option>
                <option value="passiv">Passiv</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Bütün">Bütün Şəhərlər</option>
                {[
                  ...new Set(
                    zones.map((zone) => zone.city?.name).filter(Boolean)
                  ),
                ].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
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
                        <div className="text-sm font-medium text-gray-900">
                          {zone.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {zone.description || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {zone.city?.name || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDeliveryTimeColor(
                          zone.avg_delivery_time
                        )}`}
                      >
                        {formatDeliveryTime(zone.avg_delivery_time)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {zone.couriers_count || 0} kuryer
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          zone.status
                        )}`}
                      >
                        {zone.status === "active" ? "Aktiv" : "Passiv"}
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
                  {indexOfFirstZone + 1}-
                  {Math.min(indexOfLastZone, filteredZones.length)} /{" "}
                  {filteredZones.length} zona
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
                      onClick={() =>
                        typeof pageNumber === "number" && goToPage(pageNumber)
                      }
                      disabled={pageNumber === "..."}
                      className={`px-3 py-1 text-sm rounded-lg ${
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
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni Zona Əlavə Et
              </h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Adı
                  </label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) =>
                      setNewZone({ ...newZone, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Zona adını daxil edin"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çatdırılma Vaxtı (saat)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newZone.avg_delivery_time}
                    onChange={(e) =>
                      setNewZone({
                        ...newZone,
                        avg_delivery_time: parseFloat(e.target.value) || "",
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.avg_delivery_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1.5"
                  />
                  {errors.avg_delivery_time && <p className="text-red-500 text-xs mt-1">{errors.avg_delivery_time[0]}</p>}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newZone.status}
                    onChange={(e) =>
                      setNewZone({ ...newZone, status: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ölkə *
                  </label>
                  <select
                    value={newZone.country_id || ""}
                    onChange={(e) => handleCountryChange(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
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
                    value={newZone.city_id || ""}
                    onChange={(e) =>
                      setNewZone({ ...newZone, city_id: parseInt(e.target.value) })
                    }
                    disabled={!newZone.country_id}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    } ${!newZone.country_id ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Şəhər seçin</option>
                    {getCitiesByCountry(newZone.country_id).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir
                  </label>
                  <textarea
                    value={newZone.description || ""}
                    onChange={(e) =>
                      setNewZone({ ...newZone, description: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Zona haqqında qısa təsvir"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isCreating ? "Əlavə edilir..." : "Əlavə Et"}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Zonanı Redaktə Et
              </h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Adı
                  </label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) =>
                      setNewZone({ ...newZone, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Zona adını daxil edin"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çatdırılma Vaxtı (saat)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newZone.avg_delivery_time}
                    onChange={(e) =>
                      setNewZone({
                        ...newZone,
                        avg_delivery_time: parseFloat(e.target.value) || "",
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.avg_delivery_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1.5"
                  />
                  {errors.avg_delivery_time && <p className="text-red-500 text-xs mt-1">{errors.avg_delivery_time[0]}</p>}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newZone.status}
                    onChange={(e) =>
                      setNewZone({ ...newZone, status: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ölkə *
                  </label>
                  <select
                    value={newZone.country_id || ""}
                    onChange={(e) => handleCountryChange(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ölkə seçin</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
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
                    value={newZone.city_id || ""}
                    onChange={(e) =>
                      setNewZone({ ...newZone, city_id: parseInt(e.target.value) })
                    }
                    disabled={!newZone.country_id}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city_id ? 'border-red-500' : 'border-gray-300'
                    } ${!newZone.country_id ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Şəhər seçin</option>
                    {getCitiesByCountry(newZone.country_id).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir
                  </label>
                  <textarea
                    value={newZone.description}
                    onChange={(e) =>
                      setNewZone({
                        ...newZone,
                        description:
                          e.target.value.length > 0 ? e.target.value : null,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Zona haqqında qısa təsvir"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isUpdating ? "Yenilənir..." : "Yenilə"}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Zonanı Sil
              </h3>
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
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Zonanı silmək istədiyinizə əminsiniz?
              </h4>
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
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Silinir..." : "Sil"}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Zona Detalları
              </h3>
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
                      <p className="font-medium text-gray-900">
                        {selectedZone?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Şəhər</p>
                      <p className="font-medium text-gray-900">
                        {selectedZone?.city?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedZone?.status
                        )}`}
                      >
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
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDeliveryTimeColor(
                          selectedZone?.avg_delivery_time
                        )}`}
                      >
                        {formatDeliveryTime(selectedZone?.avg_delivery_time)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kuryer Sayı</p>
                      <p className="font-medium text-gray-900">
                        {selectedZone?.couriers_count || 0} kuryer
                      </p>
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

export default Zones;
