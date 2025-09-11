import React, { useState, useEffect } from "react";
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
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  Star,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../services/ordersApi";
import { useGetCustomersQuery } from "../services/customersApi";
import { useGetProductsQuery } from "../services/productsApi";
import { useGetZonesQuery } from "../services/zonesApi";
import { useGetAdminsQuery } from "../services/adminsApi";
import { orderStatus } from "../enums/orderStaus";

const statusMap = orderStatus;

const discountTypeMap = {
  fixed: "Sabit",
  percentage: "Faiz",
};

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("all");
  const [vipFilter, setVipFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportNotification, setShowExportNotification] = useState(false);
  const [showCourierAssignment, setShowCourierAssignment] = useState(false);
  const [assignedCourier, setAssignedCourier] = useState("");
  const [showStatistics, setShowStatistics] = useState(
    window.innerWidth >= 768
  );
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError, } = useGetOrdersQuery();
  const { data: customersData, isLoading: customersLoading } =
    useGetCustomersQuery();
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery();
  const { data: zonesData, isLoading: zonesLoading } = useGetZonesQuery();
  const { data: adminsData, isLoading: adminsLoading } = useGetAdminsQuery();

  // Mutations
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Extract data from API responses
  const orders = ordersData?.data || [];
  const customers = customersData?.data || [];
  const products = productsData?.data || [];
  const zones = zonesData?.data || [];

  // Filter admins to get only employees (non-admin roles, excluding couriers)
  const employees =
    adminsData?.data?.filter(
      (admin) =>
        admin.roles?.some((role) => role.role_type !== "admin") &&
        admin.profile_type !== "courier"
    ) || [];

  // Filter admins to get only couriers (role_type === "employee" and profile_type === "courier")
  const couriers =
    adminsData?.data?.filter(
      (admin) =>
        admin.roles?.some((role) => role.role_type === "employee") &&
        admin.profile_type === "courier"
    ) || [];

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setShowStatistics(isDesktop);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [newOrder, setNewOrder] = useState({
    customer_id: "",
    responsible_employee_id: "",
    product_id: "",
    quantity: 1,
    discount_type: "fixed",
    discount: 0,
    status: orderStatus.NEW,
    delivery_type: "courier",
    courier_id: "",
    zone_id: "",
    price: 0, // Backend expects 'price'
    discounted_price: 0, // Backend expects 'discounted_price'
  });

  useEffect(() => {
    if (products.length > 0 && newOrder.product_id) {
      const prices = calculatePrices(
        newOrder.product_id,
        newOrder.quantity,
        newOrder.discount,
        newOrder.discount_type
      );
      setNewOrder((prev) => ({ ...prev, ...prices }));
    }
  }, [
    products,
    newOrder.product_id,
    newOrder.quantity,
    newOrder.discount,
    newOrder.discount_type,
  ]);

  // Helper functions to transform API data
  const transformOrder = (order) => {
    // Find related data from the arrays
    const customer = customers.find((c) => c.id === order.customer_id);
    const employee = employees.find(
      (e) => e.id === order.responsible_employee_id
    );
    const product = products.find((p) => p.id === order.product_id);
    const courier = couriers.find((c) => c.id === order.courier_id);
    const zone = zones.find((z) => z.id === order.zone_id);

    // Calculate prices
    const unitPrice = parseFloat(product?.price || 0);
    const totalPrice = unitPrice * order.quantity;
    const discountAmount = parseFloat(order.discount || 0);
    const discountedPrice =
      order.discount_type === "percent"
        ? totalPrice * (1 - discountAmount / 100)
        : totalPrice - discountAmount;

    return {
      id: `#${order.id}`,
      customer: customer
        ? `${customer.first_name} ${customer.last_name}`
        : null,
      employee: employee
        ? `${employee.first_name} ${employee.last_name}`
        : null,
      product: product ? product.name : null,
      quantity: order.quantity,
      price: unitPrice,
      totalPrice: totalPrice,
      status: statusMap[order.status] || order.status,
      date: order.created_at
        ? new Date(order.created_at).toISOString().split("T")[0]
        : null,
      courier: courier
        ? `${courier.first_name} ${courier.last_name}`
        : "Təyin edilməyib",
      zone: zone ? zone.name : null,
      deliveryMethod: order.delivery_type, // Default delivery method
      whatsappMessage: product
        ? `${product.name} x${order.quantity} ədəd - ${discountedPrice.toFixed(
            2
          )}₼`
        : "",
      discount: discountAmount,
      discount_type: order.discount_type,
      discountedPrice: discountedPrice,
      // API specific fields
      customer_id: order.customer_id,
      courier_id: order.courier_id,
      responsible_employee_id: order.responsible_employee_id,
      zone_id: order.zone_id,
      product_id: order.product_id,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatus.NEW:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case orderStatus.WAITING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case orderStatus.REDIRECTED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case orderStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case orderStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case orderStatus.NEW:
        return <Clock className="w-4 h-4" />;
      case orderStatus.WAITING:
        return <Clock className="w-4 h-4" />;
      case orderStatus.REDIRECTED:
        return <Target className="w-4 h-4" />;
      case orderStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case orderStatus.CANCELLED:
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Loading state
  const isLoading =
    ordersLoading ||
    customersLoading ||
    productsLoading ||
    zonesLoading ||
    adminsLoading;

  // Transform orders for display
  const transformedOrders = orders.map(transformOrder);

  const filteredOrders = transformedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.product &&
        order.product.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.employee &&
        order.employee.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesEmployee =
      employeeFilter === "all" || order.employee === employeeFilter;
    const matchesProduct =
      productFilter === "all" || order.product === productFilter;
    const matchesZone = zoneFilter === "all" || order.zone === zoneFilter;
    const matchesDeliveryMethod =
      deliveryMethodFilter === "all" ||
      order.deliveryMethod === deliveryMethodFilter;

    // VIP filtering logic
    let matchesVip = true;
    if (vipFilter === "vip") {
      matchesVip = order.customer && getVIPInfo(order.customer);
    } else if (vipFilter === "non-vip") {
      matchesVip = !order.customer || !getVIPInfo(order.customer);
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesEmployee &&
      matchesProduct &&
      matchesZone &&
      matchesDeliveryMethod &&
      matchesVip
    );
  });

  // Səhifələmə hesablamaları
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
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

  // Modal funksiyaları
  const handleAddOrder = async () => {
    try {
      await createOrder(newOrder).unwrap();

      // Formu təmizlə
      setNewOrder({
        customer_id: "",
        responsible_employee_id: "",
        product_id: "",
        quantity: 1,
        discount_type: "fixed",
        discount: 0,
        status: orderStatus.NEW,
        delivery_type: "courier",
        courier_id: "",
        zone_id: "",
        price: 0,
        discounted_price: 0,
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Sifariş əlavə edilərkən xəta:", error);
    }
  };

  const handleEditOrder = async () => {
    if (selectedOrder) {
      try {
        const orderId = selectedOrder.id.replace("#", "");
        await updateOrder({
          id: orderId, // 👈 must be inside the object
          ...newOrder, // 👈 spread all the fields here
        }).unwrap();


        setShowEditModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Sifariş yenilənərkən xəta:", error);
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        const orderId = selectedOrder.id.replace("#", "");
        await deleteOrder(orderId).unwrap();

        setShowDeleteModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Sifariş silinərkən xəta:", error);
      }
    }
  };

  // Məhsul seçildikdə qiyməti hesablayan funksiya
  const calculatePrices = (
    productId,
    quantity,
    discountAmount = 0,
    discountType = "fixed"
  ) => {
    const selectedProduct = products.find((p) => p.id === parseInt(productId));
    if (selectedProduct) {
      const unitPrice = parseFloat(selectedProduct.price);
      const totalPrice = unitPrice * quantity;
      const discount = parseFloat(discountAmount) || 0;
      const discountedPrice =
        discountType === "percent"
          ? totalPrice * (1 - discount / 100)
          : totalPrice - discount;

      return {
        price: unitPrice, // Backend expects 'price'
        discount: discount,
        discounted_price: discountedPrice, // Backend expects 'discounted_price'
      };
    }
    return { price: 0, discount: 0, discounted_price: 0 };
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewOrder({
      customer_id: order.customer_id || "",
      responsible_employee_id: order.responsible_employee_id || "",
      product_id: order.product_id || "",
      quantity: order.quantity,
      discount_type: order.discount_type || "fixed",
      discount: order.discount || 0,
      status: order.status,
      delivery_type: order.delivery_type || "courier",
      courier_id: order.courier_id || "",
      zone_id: order.zone_id || "",
      price: order.price || 0,
      discounted_price: order.discounted_price || 0,
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
        status: "Yönləndirilib",
      };

      // In a real app, this would update the backend
      console.log("Kuryer təyin edildi:", updatedOrder);

      // Close modals
      setShowCourierAssignment(false);
      setShowViewModal(false);
      setSelectedOrder(null);
      setAssignedCourier("");
    }
  };

  // Excel Export Function
  const exportToExcel = () => {
    // Check if we're exporting filtered data or all data
    const isFiltered =
      searchTerm ||
      statusFilter !== "all" ||
      employeeFilter !== "all" ||
      productFilter !== "all" ||
      deliveryMethodFilter !== "all";

    // Prepare data for export
    const exportData = filteredOrders.map((order) => ({
      "Sifariş ID": order.id,
      Əməkdaş: order.employee,
      Məhsul: order.product,
      Miqdar: order.quantity,
      "Vahid Qiymət (₼)": order.price,
      "Ümumi Qiymət (₼)": (order.price * order.quantity).toFixed(2),
      "Endirimli Qiymət (₼)": order.discountedPrice
        ? order.discountedPrice.toFixed(2)
        : (order.price * order.quantity).toFixed(2),
      "Endirim (₼)": order.discount ? (order.discount * order.quantity).toFixed(2) : "0.00",
      Status: order.status,
      Tarix: order.date,
      Zona: order.zone,
      Kuryer: order.courier,
      "Çatdırılma Üsulu": order.deliveryMethod,
      "WhatsApp Mesajı": order.whatsappMessage,
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
      { wch: 8 }, // Miqdar
      { wch: 15 }, // Vahid Qiymət
      { wch: 15 }, // Ümumi Qiymət
      { wch: 15 }, // Endirimli Qiymət
      { wch: 12 }, // Endirim
      { wch: 12 }, // Status
      { wch: 12 }, // Tarix
      { wch: 12 }, // Zona
      { wch: 15 }, // Kuryer
      { wch: 18 }, // Çatdırılma Üsulu
      { wch: 50 }, // WhatsApp Mesajı
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sifarişlər");

    // Generate filename with current date
    const today = new Date().toISOString().split("T")[0];
    const fileName = `Sifarişlər_${today}${isFiltered ? "_Filtrli" : ""}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);

    // Show success notification
    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 3000);
  };

  // Function to identify VIP customers
  const getVIPCustomers = () => {
    const customerStats = {};

    transformedOrders.forEach((order) => {
      if (order.customer) {
        if (!customerStats[order.customer]) {
          customerStats[order.customer] = {
            orderCount: 0,
            totalQuantity: 0,
            totalSpent: 0,
          };
        }
        customerStats[order.customer].orderCount++;
        customerStats[order.customer].totalQuantity += order.quantity;
        customerStats[order.customer].totalSpent += order.price;
      }
    });

    // Define VIP criteria: 3+ orders OR 10+ total quantity OR 500+ total spent
    const vipCustomers = Object.keys(customerStats).filter((customer) => {
      const stats = customerStats[customer];
      return (
        stats.orderCount >= 3 ||
        stats.totalQuantity >= 10 ||
        stats.totalSpent >= 500
      );
    });

    return vipCustomers;
  };

  // Function to get VIP level and styling
  const getVIPInfo = (customerName) => {
    if (!customerName) return null;

    const vipCustomers = getVIPCustomers();
    if (!vipCustomers.includes(customerName)) return null;

    const customerStats = {};
    transformedOrders.forEach((order) => {
      if (order.customer === customerName) {
        if (!customerStats[order.customer]) {
          customerStats[order.customer] = {
            orderCount: 0,
            totalQuantity: 0,
            totalSpent: 0,
          };
        }
        customerStats[order.customer].orderCount++;
        customerStats[order.customer].totalQuantity += order.quantity;
        customerStats[order.customer].totalSpent += order.price;
      }
    });

    const stats = customerStats[customerName];

    // Determine VIP level
    let level = "Bronze";
    let color = "text-amber-600";
    let bgColor = "bg-amber-50";
    let borderColor = "border-amber-200";
    let icon = <Star className="w-4 h-4" />;

    if (
      stats.orderCount >= 5 ||
      stats.totalQuantity >= 20 ||
      stats.totalSpent >= 1000
    ) {
      level = "Silver";
      color = "text-gray-600";
      bgColor = "bg-gray-50";
      borderColor = "border-gray-200";
      icon = <Star className="w-4 h-4" />;
    }

    if (
      stats.orderCount >= 10 ||
      stats.totalQuantity >= 50 ||
      stats.totalSpent >= 2000
    ) {
      level = "Gold";
      color = "text-yellow-600";
      bgColor = "bg-yellow-50";
      borderColor = "border-yellow-200";
      icon = <Crown className="w-4 h-4" />;
    }

    if (
      stats.orderCount >= 20 ||
      stats.totalQuantity >= 100 ||
      stats.totalSpent >= 5000
    ) {
      level = "Platinum";
      color = "text-purple-600";
      bgColor = "bg-purple-50";
      borderColor = "border-purple-200";
      icon = <Crown className="w-4 h-4" />;
    }

    return {
      level,
      color,
      bgColor,
      borderColor,
      icon,
      stats,
    };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ramton Sifarişlər
        </h1>
        <p className="text-gray-600 text-lg">
          Ramton bot tərəfindən avtomatik tanınan və manual əlavə edilən
          sifarişlər
        </p>
      </div>

      {/* Statistik Kartları - Collapsible */}
      <div className="bg-white rounded-2xl mb-8 overflow-hidden">
        <div
          className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowStatistics(!showStatistics)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Sifariş Statistikaları
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {showStatistics ? "Gizlət" : "Göstər"}
              </span>
              {showStatistics ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        </div>

        {showStatistics && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Ümumi Sifariş
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {transformedOrders.length}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      Yeni Sifarişlər
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      {
                        transformedOrders.filter(
                          (o) => o.status === orderStatus.NEW
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">
                      Tamamlanmış
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {
                        transformedOrders.filter(
                          (o) => o.status === orderStatus.COMPLETED
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">
                      Ümumi Dəyər
                    </p>
                    <p className="text-3xl font-bold text-orange-900">
                      ₼
                      {transformedOrders
                        .reduce((sum, order) => sum + order.price, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-purple-200 cursor-pointer hover:shadow-lg group"
                onClick={() => navigate("/musteriler?vip=true")}
                title="VIP müştəriləri görmək üçün klikləyin"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">
                      VIP Müştərilər
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {getVIPCustomers().length}
                    </p>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-purple-600">
                        Xüsusi müştərilər
                      </p>
                      <span className="text-xs text-purple-500 group-hover:text-purple-700 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIP Müştərilər Siyahısı */}
        {showStatistics && (
          <div className="p-6 border-t border-gray-100">
            <h3
              className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer hover:text-purple-600 transition-colors group"
              onClick={() => navigate("/musteriler?vip=true")}
              title="VIP müştəriləri görmək üçün klikləyin"
            >
              <Crown className="w-5 h-5 text-purple-600" />
              <span>VIP Müştərilər</span>
              <span className="text-sm text-gray-400 group-hover:text-purple-600 transition-colors">
                →
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getVIPCustomers().map((customerName) => {
                const vipInfo = getVIPInfo(customerName);
                return (
                  <div
                    key={customerName}
                    className={`p-4 rounded-xl border ${vipInfo?.bgColor} ${vipInfo?.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">
                        {customerName}
                      </h4>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${vipInfo?.color} ${vipInfo?.bgColor} ${vipInfo?.borderColor} border`}
                      >
                        {vipInfo?.icon}
                        <span>{vipInfo?.level}</span>
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sifariş sayı:</span>
                        <span className="font-medium text-gray-800">
                          {vipInfo?.stats?.orderCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi miqdar:</span>
                        <span className="font-medium text-gray-800">
                          {vipInfo?.stats?.totalQuantity} ədəd
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi xərclər:</span>
                        <span className="font-medium text-gray-800">
                          ₼{vipInfo?.stats?.totalSpent?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Sifariş İdarəetməsi
            </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <option value={orderStatus.NEW}>Yeni</option>
              <option value={orderStatus.WAITING}>Gözləmədə</option>
              <option value={orderStatus.REDIRECTED}>Yönləndirilib</option>
              <option value={orderStatus.COMPLETED}>Tamamlandı</option>
              <option value={orderStatus.CANCELLED}>Ləğv</option>
            </select>

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Əməkdaşlar</option>
              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={`${employee.first_name} ${employee.last_name}`}
                >
                  {employee.first_name} {employee.last_name} -{" "}
                  {employee.roles?.[0]?.name || "Employee"}
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
                  {product.name} -{" "}
                  {product.category?.name || product.category || "No Category"}
                </option>
              ))}
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Zonalar</option>
              <option value="">Zona seçin</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>

            <select
              value={deliveryMethodFilter}
              onChange={(e) => setDeliveryMethodFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Çatdırılma</option>
              <option value="courier">Kuryer</option>
              <option value="postal">Azerpoct Filialı</option>
            </select>

            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Müştərilər</option>
              <option value="vip">Yalnız VIP</option>
              <option value="non-vip">Yalnız Adi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Məlumatlar yüklənir...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {ordersError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Xəta baş verdi
              </h3>
              <p className="text-red-600">
                Sifarişlər yüklənərkən xəta baş verdi. Zəhmət olmasa səhifəni
                yeniləyin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sifariş Kartları */}
      {!isLoading && !ordersError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Başlıq */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      order.status
                    )} flex items-center space-x-1`}
                  >
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800">
                        {order.customer || order.employee}
                      </p>
                      {order.customer && getVIPInfo(order.customer) && (
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            getVIPInfo(order.customer)?.bgColor
                          } ${getVIPInfo(order.customer)?.color} ${
                            getVIPInfo(order.customer)?.borderColor
                          } border`}
                        >
                          {getVIPInfo(order.customer)?.icon}
                          <span>{getVIPInfo(order.customer)?.level}</span>
                        </span>
                      )}
                    </div>
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
                    <span className="font-medium text-gray-800">
                      {order.product}
                    </span>
                  </div>

                  {order.customer && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Müştəri:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">
                          {order.customer}
                        </span>
                        {getVIPInfo(order.customer) && (
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              getVIPInfo(order.customer)?.bgColor
                            } ${getVIPInfo(order.customer)?.color} ${
                              getVIPInfo(order.customer)?.borderColor
                            } border`}
                          >
                            {getVIPInfo(order.customer)?.icon}
                            <span>{getVIPInfo(order.customer)?.level}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Endirimli Qiymət:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ₼
                      {order.discountedPrice
                        ? order.discountedPrice.toFixed(2)
                        : order.price}
                    </span>
                  </div>

                  {order.discount && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Endirim:</span>
                      </div>
                      <span className="text-xs text-red-600">
                        -₼{(order.discount * order.quantity).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Miqdar:</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {order.quantity} ədəd
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Kuryer:</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {order.courier}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Zona:</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {order.zone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Çatdırılma:</span>
                    </div>
                    <span
                      className={`font-medium px-2 py-1 rounded-full text-xs ${
                        order.deliveryMethod === "Kuryer"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.deliveryMethod}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Mesaj */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Ramton Mesajı
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.whatsappMessage}
                  </p>
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
      )}

      {/* Səhifələmə */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Göstərilir:{" "}
              <span className="font-medium">{indexOfFirstOrder + 1}</span> -{" "}
              <span className="font-medium">
                {Math.min(indexOfLastOrder, filteredOrders.length)}
              </span>{" "}
              / <span className="font-medium">{filteredOrders.length}</span>{" "}
              sifariş
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
                    onClick={() =>
                      typeof pageNumber === "number" && goToPage(pageNumber)
                    }
                    disabled={pageNumber === "..."}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pageNumber === currentPage
                        ? "bg-blue-600 text-white"
                        : pageNumber === "..."
                        ? "text-gray-400 cursor-default"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-300"
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
              <h3 className="text-xl font-semibold text-gray-800">
                Sifariş Detalları
              </h3>
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
                        <h4 className="text-lg font-semibold text-gray-800">
                          {selectedOrder.id}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          selectedOrder.status
                        )} flex items-center space-x-1`}
                      >
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
                        <p className="text-gray-600">
                          {selectedOrder.employee}
                        </p>
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
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">Müştəri</h5>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-600">
                              {selectedOrder.customer}
                            </p>
                            {getVIPInfo(selectedOrder.customer) && (
                              <span
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  getVIPInfo(selectedOrder.customer)?.bgColor
                                } ${
                                  getVIPInfo(selectedOrder.customer)?.color
                                } ${
                                  getVIPInfo(selectedOrder.customer)
                                    ?.borderColor
                                } border`}
                              >
                                {getVIPInfo(selectedOrder.customer)?.icon}
                                <span>
                                  {getVIPInfo(selectedOrder.customer)?.level}
                                </span>
                              </span>
                            )}
                          </div>
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
                      <p className="text-gray-600">
                        {selectedOrder.quantity} ədəd
                      </p>
                    </div>
                  </div>

                  {/* Qiymət, Kuryer və Zona */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h5 className="font-medium text-gray-800">Qiymət</h5>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ₼{selectedOrder.price.toFixed(2)}
                      </p>
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

                  {/* Çatdırılma Üsulu */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h5 className="font-medium text-gray-800">
                        Çatdırılma Üsulu
                      </h5>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.deliveryMethod === "Kuryer"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedOrder.deliveryMethod}
                    </span>
                  </div>

                  {/* WhatsApp Mesajı */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-green-800">
                        Ramton Mesajı
                      </h5>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {selectedOrder.whatsappMessage}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Bu mesaj Ramton qrupuna göndəriləcək
                    </p>
                  </div>

                  {/* Əlavə Məlumatlar */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-3">
                      Əlavə Məlumatlar
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sifariş ID:</span>
                        <p className="font-medium text-gray-800">
                          {selectedOrder.id}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tarix:</span>
                        <p className="font-medium text-gray-800">
                          {selectedOrder.date}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium text-gray-800">
                          {selectedOrder.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ümumi Dəyər:</span>
                        <p className="font-medium text-gray-800">
                          ₼
                          {(
                            selectedOrder.price * selectedOrder.quantity
                          ).toFixed(2)}
                        </p>
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
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni Sifariş Əlavə Et
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
                    Müştəri
                  </label>
                  <select
                    value={newOrder.customer_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customer_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Müştəri seçin</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} -{" "}
                        {customer.phone}
                        {customer.is_vip ? " [VIP]" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Əməkdaş
                  </label>
                  <select
                    value={newOrder.responsible_employee_id}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        responsible_employee_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Əməkdaş seçin</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} -{" "}
                        {employee.roles?.[0]?.name || "Employee"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Məhsul
                  </label>
                  <select
                    value={newOrder.product_id_id}
                    onChange={(e) => {
                      const productId = e.target.value;
                      const prices = calculatePrices(
                        productId,
                        newOrder.quantity,
                        newOrder.discount,
                        newOrder.discount_type
                      );
                      setNewOrder({
                        ...newOrder,
                        product_id: productId,
                        ...prices,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Məhsul seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} -{" "}
                        {product.category?.name ||
                          product.category ||
                          "No Category"}{" "}
                        (₼{product.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miqdar
                    </label>
                    <input
                      type="number"
                      value={newOrder.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 1;
                        const prices = calculatePrices(
                          newOrder.product_id,
                          quantity,
                          newOrder.discount,
                          newOrder.discount_type
                        );
                        setNewOrder({
                          ...newOrder,
                          quantity: quantity,
                          ...prices,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vahid Qiymət (₼)
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endirim Məbləği (₼)
                  </label>
                  <input
                    type="number"
                    value={newOrder.discount}
                    onChange={(e) => {
                      const discountAmount = parseFloat(e.target.value) || 0;
                      const prices = calculatePrices(
                        newOrder.product_id,
                        newOrder.quantity,
                        discountAmount,
                        newOrder.discount_type
                      );
                      setNewOrder({
                        ...newOrder,
                        discount: discountAmount,
                        discounted_price: prices.discounted_price,
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
                    <span className="font-semibold text-gray-800">
                      ₼
                      {(
                        (newOrder.price || 0) * (newOrder.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Endirim:</span>
                    <span className="font-semibold text-red-600">
                      -₼{(newOrder.discount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Endirimli Qiymət:
                    </span>
                    <span className="font-semibold text-green-600">
                      ₼{(newOrder.discounted_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={orderStatus.NEW}>Yeni</option>
                    <option value={orderStatus.WAITING}>Gözləmədə</option>
                    <option value={orderStatus.REDIRECTED}>
                      Yönləndirilib
                    </option>
                    <option value={orderStatus.COMPLETED}>Tamamlandı</option>
                    <option value={orderStatus.CANCELLED}>Ləğv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kuryer
                  </label>
                  <select
                    value={newOrder.courier_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, courier_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kuryer seçin</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.first_name} {courier.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çatdırılma Üsulu
                  </label>
                  <select
                    value={newOrder.deliveryMethod}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        delivery_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="courier">Kuryer Çatdırılması</option>
                    <option value="postal">
                      Azerpoct Filialından Çatdırılma
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona
                  </label>
                  <select
                    value={newOrder.zone_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, zone_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Zona seçin</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Sifarişi Redaktə Et
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
                    Müştəri
                  </label>
                  <select
                    value={newOrder.customer_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customer_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Müştəri seçin</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} -{" "}
                        {customer.phone}
                        {customer.is_vip ? " [VIP]" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Əməkdaş
                  </label>
                  <select
                    value={newOrder.responsible_employee_id}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        responsible_employee_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Əməkdaş seçin</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} -{" "}
                        {employee.roles?.[0]?.name || "Employee"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Məhsul
                  </label>
                  <select
                    value={newOrder.product_id_id}
                    onChange={(e) => {
                      const productId = e.target.value;
                      const prices = calculatePrices(
                        productId,
                        newOrder.quantity,
                        newOrder.discount,
                        newOrder.discount_type
                      );
                      setNewOrder({
                        ...newOrder,
                        product_id: productId,
                        ...prices,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Məhsul seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} -{" "}
                        {product.category?.name ||
                          product.category ||
                          "No Category"}{" "}
                        (₼{product.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miqdar
                    </label>
                    <input
                      type="number"
                      value={newOrder.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 1;
                        const prices = calculatePrices(
                          newOrder.product_id,
                          quantity,
                          newOrder.discount,
                          newOrder.discount_type
                        );
                        setNewOrder({
                          ...newOrder,
                          quantity: quantity,
                          ...prices,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vahid Qiymət (₼)
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endirim Məbləği (₼)
                  </label>
                  <input
                    type="number"
                    value={newOrder.discount}
                    onChange={(e) => {
                      const discountAmount = parseFloat(e.target.value) || 0;
                      const prices = calculatePrices(
                        newOrder.product_id,
                        newOrder.quantity,
                        discountAmount,
                        newOrder.discount_type
                      );
                      setNewOrder({
                        ...newOrder,
                        discount: discountAmount,
                        discounted_price: prices.discounted_price,
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
                    <span className="font-semibold text-gray-800">
                      ₼
                      {(
                        (newOrder.price || 0) * (newOrder.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Endirim:</span>
                    <span className="font-semibold text-red-600">
                      -₼{(newOrder.discount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Endirimli Qiymət:
                    </span>
                    <span className="font-semibold text-green-600">
                      ₼{(newOrder.discounted_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={orderStatus.NEW}>Yeni</option>
                    <option value={orderStatus.WAITING}>Gözləmədə</option>
                    <option value={orderStatus.REDIRECTED}>
                      Yönləndirilib
                    </option>
                    <option value={orderStatus.COMPLETED}>Tamamlandı</option>
                    <option value={orderStatus.CANCELLED}>Ləğv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kuryer
                  </label>
                  <select
                    value={newOrder.courier_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, courier_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kuryer seçin</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.first_name} {courier.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çatdırılma Üsulu
                  </label>
                  <select
                    value={newOrder.deliveryMethod}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        deliveryMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Kuryer">Kuryer Çatdırılması</option>
                    <option value="Azerpoct Filialı">
                      Azerpoct Filialından Çatdırılma
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona
                  </label>
                  <select
                    value={newOrder.zone_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, zone_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Zona seçin</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
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
              <h3 className="text-xl font-semibold text-gray-800">
                Sifarişi Sil
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
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Sifarişi silmək istədiyinizə əminsiniz?
              </h4>
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
              <h3 className="text-xl font-semibold text-gray-800">
                Kuryer Təyin Et
              </h3>
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
                    <h4 className="font-medium text-blue-800 mb-2">
                      Sifariş Məlumatları
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">ID:</span>{" "}
                        {selectedOrder.id}
                      </p>
                      <p>
                        <span className="font-medium">Məhsul:</span>{" "}
                        {selectedOrder.product}
                      </p>
                      <p>
                        <span className="font-medium">Zona:</span>{" "}
                        {selectedOrder.zone}
                      </p>
                      <p>
                        <span className="font-medium">Cari Kuryer:</span>{" "}
                        {selectedOrder.courier}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kuryer Seçin
                    </label>
                    <select
                      value={assignedCourier}
                      onChange={(e) => setAssignedCourier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Kuryer seçin</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.first_name} {courier.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Qeyd:</strong> Kuryer təyin edildikdə sifariş
                      statusu avtomatik olaraq "Yönləndirilib" olacaq.
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
          <span>
            {filteredOrders.length} sifariş{" "}
            {searchTerm ||
            statusFilter !== "all" ||
            employeeFilter !== "all" ||
            productFilter !== "all" ||
            deliveryMethodFilter !== "all" ||
            vipFilter !== "all"
              ? "(filtrli)"
              : ""}{" "}
            uğurla yükləndi!
          </span>
        </div>
      )}
    </div>
  );
};

export default Orders;
