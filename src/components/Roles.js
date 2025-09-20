import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  AlertTriangle,
  Check,
  Clock,
} from "lucide-react";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../services/rolesApi";

// Permission types enum based on backend PermissionType
const PERMISSION_TYPES = {
  DASHBOARD: "dashboard",
  ALL: "all",
  ADMINS: "admins",
  ORDERS: "orders",
  EMPLOYEES: "employees",
  PRODUCTS: "products",
  COURIERS: "couriers",
};

// Status enum based on backend Status
const ROLE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "deactive",
  PASSIV: "passiv",
};

const Roles = () => {
  // API hooks
  const { data: rolesData, isLoading, isError, refetch } = useGetRolesQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  // Extract roles from API response
  const roles = rolesData?.data || [];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
    status: "active",
  });

  // Reset form function
  const resetForm = () => {
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      status: "active",
    });
    setErrors({}); // Clear errors when resetting form
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
    setTimeout(() => setShowToast(false), 5000);
  };

  // Error message handler
  const getErrorMessage = (error) => {
    if (error?.data?.errors) {
      return Object.values(error.data.errors).flat().join(", ");
    }
    return error?.data?.message || "Xəta baş verdi!";
  };

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || role.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

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

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Aktiv";
      case "deactive":
        return "Qeyri-aktiv";
      case "passiv":
        return "Passiv";
      default:
        return status;
    }
  };


  const getPermissionText = (permission) => {
    switch (permission) {
      case "dashboard":
        return "Dashboard";
      case "all":
        return "Bütün İcazələr";
      case "admins":
        return "Adminlər";
      case "orders":
        return "Sifarişlər";
      case "employees":
        return "Əməkdaşlar";
      case "products":
        return "Məhsullar";
      case "couriers":
        return "Kuryerlər";
      default:
        return permission;
    }
  };

  // CRUD functions
  const handleAddRole = async () => {
    try {
      setErrors({});
      const roleData = {
        ...newRole,
        description:
          newRole.description && newRole.description.trim() !== ""
            ? newRole.description
            : null,
      };
      await createRole(roleData).unwrap();
      showToastNotification("Rol uğurla əlavə edildi!", "success");
      setShowAddModal(false);
      // Manually refetch to ensure UI updates
      refetch();
      // Reset form
      setNewRole({
        name: "",
        description: "",
        permissions: [],
        status: "active",
      });
    } catch (error) {
      console.error("Rol əlavə edilərkən xəta:", error);
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Also show toaster for validation errors
        showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
      } else {
        showToastNotification(getErrorMessage(error), "error");
      }
    }
  };

  const handleEditRole = async () => {
    try {
      setErrors({});
      // Only send changed fields
      const roleData = {};

      // Check if name has changed
      if (newRole.name !== selectedRole.name) {
        roleData.name = newRole.name;
      }

      // Check if description has changed
      const newDescription =
        newRole.description && newRole.description.trim() !== ""
          ? newRole.description
          : null;
      if (newDescription !== selectedRole.description) {
        roleData.description = newDescription;
      }

      // Check if permissions have changed
      const currentPermissions = selectedRole.permissions || [];
      const newPermissions = newRole.permissions || [];
      const permissionsChanged =
        currentPermissions.length !== newPermissions.length ||
        !currentPermissions.every((permission) =>
          newPermissions.includes(permission)
        );

      if (permissionsChanged) {
        roleData.permissions = newPermissions;
      }

      // Check if status has changed
      if (newRole.status !== selectedRole.status) {
        roleData.status = newRole.status;
      }

      // Only proceed if there are changes
      if (Object.keys(roleData).length === 0) {
        showToastNotification("Heç bir dəyişiklik edilməyib!", "error");
        return;
      }

      await updateRole({ id: selectedRole.id, ...roleData }).unwrap();
      showToastNotification("Rol uğurla yeniləndi!", "success");
      setShowEditModal(false);
      // Manually refetch to ensure UI updates
      refetch();
    } catch (error) {
      console.error("Rol yenilənərkən xəta:", error);
      if (error.data?.errors) {
        setErrors(error.data.errors);
        // Also show toaster for validation errors
        showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
      } else {
        showToastNotification(getErrorMessage(error), "error");
      }
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(selectedRole.id).unwrap();
      showToastNotification("Rol uğurla silindi!", "success");
      setShowDeleteModal(false);
      // Manually refetch to ensure UI updates
      refetch();
    } catch (error) {
      console.error("Rol silinərkən xəta:", error);
      showToastNotification(getErrorMessage(error), "error");
    }
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
      status: role.status,
    });
    setErrors({}); // Clear errors when opening modal
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const openViewModal = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  // Permission handling
  const handlePermissionChange = (permission, isChecked) => {
    if (isChecked) {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permission],
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((p) => p !== permission),
      });
    }
  };

  const handleSelectAllPermissions = () => {
    setNewRole({
      ...newRole,
      permissions: Object.values(PERMISSION_TYPES),
    });
  };

  const handleClearAllPermissions = () => {
    setNewRole({
      ...newRole,
      permissions: [],
    });
  };

  // Statistics
  const totalRoles = roles.length;
  const activeRoles = roles.filter((role) => role.status === "active").length;
  const inactiveRoles = roles.filter((role) => role.status === "deactive").length;
  const passiveRoles = roles.filter((role) => role.status === "passiv").length;

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Rollar yüklənir...</p>
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
                Rollar yüklənərkən xəta baş verdi. Zəhmət olmasa səhifəni
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rollar</h1>
          <p className="text-gray-600">
            İstifadəçi rollarının və icazələrin idarə edilməsi
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ümumi Rollar
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Aktiv Rollar
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeRoles}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Qeyri-aktiv Rollar
                </p>
                <p className="text-2xl font-bold text-gray-900">{inactiveRoles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Passiv Rollar
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {passiveRoles}
                </p>
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
                  placeholder="Rol adı və ya təsvir axtar..."
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
                <option value="all">Bütün Statuslar</option>
                <option value="active">Aktiv</option>
                <option value="passiv">Passiv</option>
                <option value="deactive">Qeyri-aktiv</option>
              </select>

              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Rol
              </button>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Təsvir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İcazələr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstifadəçi Sayı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {role.description || "Təsvir yoxdur"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {getPermissionText(permission)}
                          </span>
                        ))}
                        {role.permissions?.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{role.permissions.length - 3} daha
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          role.status
                        )}`}
                      >
                        {getStatusText(role.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.user_number || 0} istifadəçi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(role)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(role)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(role)}
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
                  {indexOfFirstRole + 1}-
                  {Math.min(indexOfLastRole, filteredRoles.length)} /{" "}
                  {filteredRoles.length} rol
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

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni Rol Əlavə Et
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
                    Rol Adı *
                  </label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rol adını daxil edin"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir
                  </label>
                  <textarea
                    value={newRole.description || ""}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Rol haqqında təsvir"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newRole.status}
                    onChange={(e) =>
                      setNewRole({ ...newRole, status: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="passiv">Passiv</option>
                    <option value="deactive">Qeyri-aktiv</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İcazələr *
                  </label>
                  <div className={`border rounded-lg p-4 ${
                    errors.permissions ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        Hamısını Seç
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllPermissions}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                      >
                        Hamısını Təmizlə
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PERMISSION_TYPES).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(value)}
                            onChange={(e) =>
                              handlePermissionChange(value, e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {getPermissionText(value)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions[0]}</p>}
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
                onClick={handleAddRole}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isCreating ? "Əlavə edilir..." : "Əlavə Et"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Rol Redaktə Et
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
                    Rol Adı *
                  </label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rol adını daxil edin"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir
                  </label>
                  <textarea
                    value={newRole.description || ""}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Rol haqqında təsvir"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newRole.status}
                    onChange={(e) =>
                      setNewRole({ ...newRole, status: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="active">Aktiv</option>
                    <option value="passiv">Passiv</option>
                    <option value="deactive">Qeyri-aktiv</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İcazələr *
                  </label>
                  <div className={`border rounded-lg p-4 ${
                    errors.permissions ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        Hamısını Seç
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllPermissions}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                      >
                        Hamısını Təmizlə
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PERMISSION_TYPES).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(value)}
                            onChange={(e) =>
                              handlePermissionChange(value, e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {getPermissionText(value)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions[0]}</p>}
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
                onClick={handleEditRole}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isUpdating ? "Yenilənir..." : "Yenilə"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Rol Sil</h3>
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
                Rol silmək istədiyinizə əminsiniz?
              </h4>
              <p className="text-gray-600">
                <strong>{selectedRole?.name}</strong>
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
                onClick={handleDeleteRole}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Silinir..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Role Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Rol Detalları
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedRole && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-600" />
                      Əsas Məlumatlar
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Rol Adı</p>
                        <p className="font-medium text-gray-900">
                          {selectedRole.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedRole.status
                          )}`}
                        >
                          {getStatusText(selectedRole.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">İstifadəçi Sayı</p>
                        <p className="font-medium text-gray-900">
                          {selectedRole.user_number || 0} istifadəçi
                        </p>
                      </div>
                    </div>
                    {selectedRole.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Təsvir</p>
                        <p className="text-gray-700">
                          {selectedRole.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Permissions */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Check className="w-5 h-5 mr-2 text-green-600" />
                      İcazələr
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.permissions?.map((permission) => (
                        <span
                          key={permission}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                        >
                          {getPermissionText(permission)}
                        </span>
                      ))}
                    </div>
                  </div>
                  {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions[0]}</p>}
                </div>
              )}
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

export default Roles;
