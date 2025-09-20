import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
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
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useGetOrderQuery,
} from "../services/ordersApi";
import { useGetCustomersQuery, useCreateCustomerMutation } from "../services/customersApi";
import { useGetProductsQuery } from "../services/productsApi";
import { useGetZonesQuery } from "../services/zonesApi";
import { useGetAdminsQuery } from "../services/adminsApi";
import { useGetCitiesQuery } from "../services/citiesApi";
import { useGetCountriesQuery } from "../services/countriesApi";
import { orderStatus } from "../enums/orderStaus";

const statusMap = orderStatus;


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
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
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
  const [customerErrors, setCustomerErrors] = useState({});
  
  // Search states for dropdowns
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCustomerDropdown(false);
        setShowEmployeeDropdown(false);
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Optimize data fetching with selective loading
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery();
  const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery();
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();
  const { data: zonesData, isLoading: zonesLoading } = useGetZonesQuery();
  const { data: adminsData, isLoading: adminsLoading } = useGetAdminsQuery();
  const { data: citiesData, isLoading: citiesLoading } = useGetCitiesQuery();
  const { data: countriesData, isLoading: countriesLoading } = useGetCountriesQuery();
  
  // Get single order for editing
  const { data: singleOrderData, isLoading: singleOrderLoading } = useGetOrderQuery(editingOrderId, {
    skip: !editingOrderId
  });
  
  // Mutations
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] = useCompleteOrderMutation();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();

  // Extract data from API responses
  const orders = ordersData?.data || [];
  const customers = customersData?.data || [];
  const products = useMemo(() => productsData?.data || [], [productsData?.data]);
  const zones = zonesData?.data || [];
  const cities = citiesData?.data || [];
  const countries = countriesData?.data || [];

  // Filter admins to get only employees (non-admin roles, excluding couriers)
  const employees =
    adminsData?.data?.filter(
      (admin) =>
        admin.role_type === "employee" &&
        admin.profile_type !== "courier"
    ) || [];

  // Filter admins to get only couriers (role_type === "courier" and profile_type === "courier")
  const couriers =
    adminsData?.data?.filter(
      (admin) =>
        admin.role_type === "courier" &&
        admin.profile_type === "courier"
    ) || [];

  // Filtered data for searchable dropdowns
  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return customers;
    return customers.filter(customer => 
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone?.includes(customerSearchTerm) ||
      customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
    );
  }, [customers, customerSearchTerm]);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearchTerm) return employees;
    return employees.filter(employee => 
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(employeeSearchTerm.toLowerCase())
    );
  }, [employees, employeeSearchTerm]);

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return products;
    return products.filter(product => 
      product.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [products, productSearchTerm]);

  // Məhsul seçildikdə qiyməti hesablayan funksiya
  const calculatePrices = useCallback((
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
  }, [products]);

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
    products: [], // Array of {id, quantity, discount, discount_type, discounted_price}
    discount_type_for_total_order: null,
    discount_to_total_order: null,
    status: orderStatus.NEW,
    delivery_type: null,
    payment_type: null,
    courier_id: "",
    city_id: "",
    zone_id: "",
  });

  const [selectedProducts, setSelectedProducts] = useState([]); // Array of {id, quantity, discount, discount_type, discounted_price}

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
    calculatePrices,
  ]);

  // Update form when single order data is loaded
  useEffect(() => {
    if (singleOrderData?.data && showEditModal) {
      const order = singleOrderData.data;
      
      // Convert order products to selectedProducts format with discount info
      const orderProducts = order.products || [];
      const productsForEdit = orderProducts.map(product => ({
        id: product.id,
        quantity: product.pivot?.quantity || 1,
        discount: product.pivot?.discount || 0,
        discount_type: product.pivot?.discount_type || null,
        discounted_price: product.pivot?.discounted_price || 0
      }));

      setSelectedProducts(productsForEdit);
      setNewOrder({
        customer_id: order.customer_id || "",
        responsible_employee_id: order.responsible_employee_id || "",
        products: productsForEdit,
        discount_type_for_total_order: order.discount_type_for_total_order || null,
        discount_to_total_order: order.discount_to_total_order || null,
        status: order.status || "pending",
        delivery_type: order.delivery_type || "courier",
        payment_type: order.payment_type || null,
        courier_id: order.courier_id || "",
        city_id: order.zone?.city_id || "",
        zone_id: order.zone_id || "",
      });
    }
  }, [singleOrderData, showEditModal]);

  // Helper functions for customer creation
  const getCitiesForCountry = (countryId) => {
    if (!countryId) return [];
    const country = countries.find(c => c.id === countryId);
    return country ? country.cities || [] : [];
  };

  // Helper function to get zones for a specific city
  const getZonesForCity = (cityId) => {
    if (!cityId) return zones;
    return zones.filter(zone => zone.city_id === parseInt(cityId));
  };


  const resetCustomerForm = () => {
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
    setCustomerErrors({});
  };

  const handleAddCustomer = async () => {
    try {
      setCustomerErrors({});
      
      // Basic validation
      if (!newCustomer.first_name.trim()) {
        setCustomerErrors({ first_name: ["Ad tələb olunur"] });
        return;
      }
      if (!newCustomer.last_name.trim()) {
        setCustomerErrors({ last_name: ["Soyad tələb olunur"] });
        return;
      }
      if (!newCustomer.email.trim()) {
        setCustomerErrors({ email: ["Email tələb olunur"] });
        return;
      }
      if (!newCustomer.country_id) {
        setCustomerErrors({ country_id: ["Ölkə tələb olunur"] });
        return;
      }
      if (!newCustomer.city_id) {
        setCustomerErrors({ city_id: ["Şəhər tələb olunur"] });
        return;
      }
      if (!newCustomer.zone_id) {
        setCustomerErrors({ zone_id: ["Zona tələb olunur"] });
        return;
      }
      if (!newCustomer.status) {
        setCustomerErrors({ status: ["Status tələb olunur"] });
        return;
      }

      const customerData = {
        first_name: newCustomer.first_name.trim(),
        last_name: newCustomer.last_name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone || null,
        address: newCustomer.address || null,
        notes: newCustomer.notes || null,
        currency: newCustomer.currency || "AZN",
        is_vip: newCustomer.is_vip,
        status: newCustomer.status,
        country_id: newCustomer.country_id,
        city_id: newCustomer.city_id,
        zone_id: newCustomer.zone_id,
      };

      const result = await createCustomer(customerData).unwrap();
      
      // Auto-select the newly created customer
      setNewOrder({ ...newOrder, customer_id: result.data.id });
      
      // Close the customer modal
      setShowAddCustomerModal(false);
      resetCustomerForm();
      
      showToastNotification("Müştəri uğurla əlavə edildi və seçildi!", "success");
    } catch (error) {
      console.error("Customer creation error:", error);
      if (error?.data?.errors) {
        setCustomerErrors(error.data.errors);
      } else {
        showToastNotification(getErrorMessage(error), "error");
      }
    }
  };

  // Helper functions to transform API data
  const transformOrder = (order) => {
    // Find related data from the arrays
    const customer = customers.find((c) => c.id === order.customer_id);
    const employee = employees.find(
      (e) => e.id === order.responsible_employee_id
    );
    const courier = couriers.find((c) => c.id === order.courier_id);
    const zone = zones.find((z) => z.id === order.zone_id);

    // Handle products array from backend
    const orderProducts = order.products || [];
    const totalQuantity = orderProducts.reduce((sum, product) => sum + (product.pivot?.quantity || 0), 0);
    
    // Calculate total price from products
    const totalPrice = parseFloat(order.total_order_price)

    const discountAmount = parseFloat(order.discount || 0);
    const discountedPrice = parseFloat(order.discounted_price_for_total_order || order.discounted_price || totalPrice);

    // Create products display string
    const productsDisplay = orderProducts.map(product => 
      `${product.name} x${product.pivot?.quantity || 0}`
    ).join(', ');

    return {
      id: `#${order.id}`,
      customer: customer
        ? `${customer.first_name} ${customer.last_name}`
        : null,
      employee: employee
        ? `${employee.first_name} ${employee.last_name}`
        : null,
      products: orderProducts,
      productsDisplay: productsDisplay,
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
      status: statusMap[order.status] || order.status,
      date: order.created_at
        ? new Date(order.created_at).toISOString().split("T")[0]
        : null,
      courier: courier
        ? `${courier.first_name} ${courier.last_name}`
        : "Təyin edilməyib",
      zone: zone ? zone.name : null,
      deliveryMethod: order.delivery_type || "Təyin edilməyib",
      paymentType: order.payment_type || "Təyin edilməyib",
      whatsappMessage: productsDisplay + ` - ${discountedPrice.toFixed(2)}₼`,
      discount: discountAmount,
      discount_type: order.discount_type,
      discountedPrice: discountedPrice,
      // API specific fields
      customer_id: order.customer_id,
      courier_id: order.courier_id,
      responsible_employee_id: order.responsible_employee_id,
      zone_id: order.zone_id,
      discounted_price: order.discounted_price,
      price: discountedPrice, // Use discounted price for detail view
      isVip: customer?.is_vip || false, // Add VIP status from customer data
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

  // Optimized loading state - only show loading for critical data
  const isLoading = ordersLoading || customersLoading || productsLoading;
  
  // Secondary data loading (can be loaded in background)
  const isSecondaryLoading = zonesLoading || adminsLoading;

  // Transform orders for display
  const transformedOrders = orders.map(transformOrder);

  const filteredOrders = transformedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.productsDisplay &&
        order.productsDisplay.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.employee &&
        order.employee.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesEmployee =
      employeeFilter === "all" || order.employee === employeeFilter;
    const matchesProduct =
      productFilter === "all" || 
      (order.products && order.products.some(product => 
        product.name === productFilter
      ));
    const matchesZone = zoneFilter === "all" || order.zone_id === parseInt(zoneFilter);
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
      // First, validate all fields before submission
      const validationErrors = {};
      
      // Validate total order discount
      if (newOrder.discount_type_for_total_order === "fixed" && newOrder.discount_to_total_order) {
        const totalPrice = selectedProducts.reduce((sum, product) => {
          const productData = products.find(p => p.id === product.id);
          return sum + (parseFloat(productData?.price || 0) * product.quantity);
        }, 0);
        
        if (newOrder.discount_to_total_order > totalPrice) {
          validationErrors.discount_to_total_order = [`Discount amount should be less than total order amount (₼${totalPrice.toFixed(2)})`];
        }
      }
      
      // Validate product stock
      selectedProducts.forEach(product => {
        const productData = products.find(p => p.id === product.id);
        const stock = productData?.stock || 0;
        
        if (product.quantity > stock) {
          validationErrors[`product_quantity_${product.id}`] = `Məhsul stokda yalnız ${stock} ədəd mövcuddur`;
        }
      });
      
      // Validate product discounts
      selectedProducts.forEach(product => {
        if (product.discount_type === "fixed" && product.discount > 0) {
          const productData = products.find(p => p.id === product.id);
          const productTotal = parseFloat(productData?.price || 0) * product.quantity;
          
          if (product.discount > productTotal) {
            validationErrors[`product_discount_${product.id}`] = `Discount amount should be less than product total (₼${productTotal.toFixed(2)})`;
          }
        }
      });
      
      // If there are validation errors, show them and prevent submission
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
        return;
      }
      
      setErrors({});
      
      // Calculate total order price
      const totalOrderPrice = selectedProducts.reduce((sum, product) => {
        const productData = products.find(p => p.id === product.id);
        return sum + (parseFloat(productData?.price || 0) * product.quantity);
      }, 0);

      let finalDiscountedPrice = totalOrderPrice;
      
      // Check if total order discount is applied
      if (newOrder.discount_type_for_total_order && newOrder.discount_to_total_order) {
        const discountAmount = parseFloat(newOrder.discount_to_total_order || 0);
        finalDiscountedPrice = newOrder.discount_type_for_total_order === "percent"
          ? totalOrderPrice * (1 - discountAmount / 100)
          : totalOrderPrice - discountAmount;
        finalDiscountedPrice = Math.max(0, finalDiscountedPrice);
      } else {
        // Use individual product discounts
        finalDiscountedPrice = selectedProducts.reduce((sum, product) => {
          const productData = products.find(p => p.id === product.id);
          const productPrice = parseFloat(productData?.price || 0);
          const productTotal = productPrice * product.quantity;
          
          // If product has discount, use discounted price, otherwise use total price
          if (product.discount_type && product.discount > 0) {
            return sum + (product.discounted_price || productTotal);
          } else {
            return sum + productTotal;
          }
        }, 0);
      }

      const orderData = {
        customer_id: newOrder.customer_id,
        responsible_employee_id: newOrder.responsible_employee_id,
        products: selectedProducts.map(product => ({
          id: product.id,
          quantity: product.quantity,
          discount: product.discount || 0,
          discount_type: product.discount_type
        })),
        discount_type_for_total_order: newOrder.discount_type_for_total_order,
        discount_to_total_order: newOrder.discount_to_total_order || 0.0,
        status: newOrder.status,
        delivery_type: newOrder.delivery_type,
        payment_type: newOrder.payment_type,
        courier_id: newOrder.courier_id || null,
        zone_id: newOrder.zone_id,
      };

      await createOrder(orderData).unwrap();
      showToastNotification("Sifariş uğurla əlavə edildi!", "success");

      // Formu təmizlə
      setNewOrder({
        customer_id: "",
        responsible_employee_id: "",
        products: [],
        discount_type_for_total_order: null,
        discount_to_total_order: null,
        status: orderStatus.NEW,
        delivery_type: "",
        payment_type: null,
        courier_id: "",
        city_id: "",
        zone_id: "",
      });
      setSelectedProducts([]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Sifariş əlavə edilərkən xəta:", error);
      
      if (error.data?.errors) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.log("Backend error response:", error.data.errors);
          console.log("Selected products:", selectedProducts);
        }
        
        // Map backend errors to frontend error format
        const mappedErrors = {};
        Object.keys(error.data.errors).forEach(field => {
          if (Array.isArray(error.data.errors[field])) {
            // Handle products.0.quantity format
            if (field.startsWith('products.') && field.includes('.quantity')) {
              const productIndex = field.match(/products\.(\d+)\.quantity/)?.[1];
              if (productIndex !== undefined && selectedProducts[productIndex]) {
                const productId = selectedProducts[productIndex].id;
                mappedErrors[`product_quantity_${productId}`] = error.data.errors[field];
              }
            } else {
              mappedErrors[field] = error.data.errors[field];
            }
          } else {
            // Handle products.0.quantity format for single error
            if (field.startsWith('products.') && field.includes('.quantity')) {
              const productIndex = field.match(/products\.(\d+)\.quantity/)?.[1];
              if (productIndex !== undefined && selectedProducts[productIndex]) {
                const productId = selectedProducts[productIndex].id;
                mappedErrors[`product_quantity_${productId}`] = [error.data.errors[field]];
              }
            } else {
              mappedErrors[field] = [error.data.errors[field]];
            }
          }
        });
        if (process.env.NODE_ENV === 'development') {
          console.log("Mapped errors:", mappedErrors);
        }
        setErrors(mappedErrors);
        
        // Show specific error message
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      } else {
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      }
    }
  };

  const handleEditOrder = async () => {
    if (selectedOrder) {
      try {
        // First, validate all fields before submission
        const validationErrors = {};
        
        // Validate total order discount
        if (newOrder.discount_type_for_total_order === "fixed" && newOrder.discount_to_total_order) {
          const totalPrice = selectedProducts.reduce((sum, product) => {
            const productData = products.find(p => p.id === product.id);
            return sum + (parseFloat(productData?.price || 0) * product.quantity);
          }, 0);
          
          if (newOrder.discount_to_total_order > totalPrice) {
            validationErrors.discount_to_total_order = [`Discount amount should be less than total order amount (₼${totalPrice.toFixed(2)})`];
          }
        }
        
        // Validate product stock
        selectedProducts.forEach(product => {
          const productData = products.find(p => p.id === product.id);
          const stock = productData?.stock || 0;
          
          if (product.quantity > stock) {
            validationErrors[`product_quantity_${product.id}`] = `Məhsul stokda yalnız ${stock} ədəd mövcuddur`;
          }
        });
        
        // Validate product discounts
        selectedProducts.forEach(product => {
          if (product.discount_type === "fixed" && product.discount > 0) {
            const productData = products.find(p => p.id === product.id);
            const productTotal = parseFloat(productData?.price || 0) * product.quantity;
            
            if (product.discount > productTotal) {
              validationErrors[`product_discount_${product.id}`] = `Discount amount should be less than product total (₼${productTotal.toFixed(2)})`;
            }
          }
        });
        
        // If there are validation errors, show them and prevent submission
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          showToastNotification("Zəhmət olmasa bütün xətaları düzəldin!", "error");
          return;
        }
        
        setErrors({});
        
        const orderId = selectedOrder.id.replace("#", "");
        
        // Only send changed fields
        const orderData = {};
        const originalOrder = singleOrderData?.data || selectedOrder;

        // Check each field for changes
        if (newOrder.customer_id !== originalOrder.customer_id) {
          orderData.customer_id = newOrder.customer_id;
        }
        if (newOrder.responsible_employee_id !== originalOrder.responsible_employee_id) {
          orderData.responsible_employee_id = newOrder.responsible_employee_id;
        }
        if (newOrder.delivery_type !== originalOrder.delivery_type) {
          orderData.delivery_type = newOrder.delivery_type;
        }
        if (newOrder.payment_type !== originalOrder.payment_type) {
          orderData.payment_type = newOrder.payment_type;
        }
        if (newOrder.courier_id !== originalOrder.courier_id) {
          orderData.courier_id = newOrder.courier_id;
        }
        if (newOrder.zone_id !== originalOrder.zone_id) {
          orderData.zone_id = newOrder.zone_id;
        }
        if (newOrder.status !== originalOrder.status) {
          orderData.status = newOrder.status;
        }
        if (newOrder.discount_type_for_total_order !== originalOrder.discount_type_for_total_order) {
          orderData.discount_type_for_total_order = newOrder.discount_type_for_total_order;
        }
        if (parseFloat(newOrder.discount_to_total_order || 0) !== parseFloat(originalOrder.discount_to_total_order || 0)) {
          orderData.discount_to_total_order = parseFloat(newOrder.discount_to_total_order || 0.0);
        }

        // Check if products changed (including discounts)
        const currentProducts = selectedProducts.map(p => ({ 
          id: p.id, 
          quantity: p.quantity,
          discount: p.discount || 0,
          discount_type: p.discount_type
        }));
        const originalProducts = originalOrder.products?.map(p => ({ 
          id: p.id, 
          quantity: p.pivot?.quantity || 1,
          discount: p.pivot?.discount || 0,
          discount_type: p.pivot?.discount_type,
          discounted_price: p.pivot?.discounted_price || 0
        })) || [];
        
        const productsChanged = JSON.stringify(currentProducts.sort((a, b) => a.id - b.id)) !== 
                               JSON.stringify(originalProducts.sort((a, b) => a.id - b.id));
        
        if (productsChanged) {
          orderData.products = currentProducts;
        }

        // Note: Backend will calculate discounted prices

        // Only proceed if there are changes
        if (Object.keys(orderData).length === 0) {
          showToastNotification("Heç bir dəyişiklik edilməyib!", "info");
          setShowEditModal(false);
          return;
        }

        await updateOrder({ id: orderId, ...orderData }).unwrap();
        showToastNotification("Sifariş uğurla yeniləndi!", "success");

        setShowEditModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Sifariş yenilənərkən xəta:", error);
        
        if (error.data?.errors) {
          console.log("Backend error response (edit):", error.data.errors);
          console.log("Selected products (edit):", selectedProducts);
          
          // Map backend errors to frontend error format
          const mappedErrors = {};
          Object.keys(error.data.errors).forEach(field => {
            if (Array.isArray(error.data.errors[field])) {
              // Handle products.0.quantity format
              if (field.startsWith('products.') && field.includes('.quantity')) {
                const productIndex = field.match(/products\.(\d+)\.quantity/)?.[1];
                if (productIndex !== undefined && selectedProducts[productIndex]) {
                  const productId = selectedProducts[productIndex].id;
                  mappedErrors[`product_quantity_${productId}`] = error.data.errors[field];
                }
              } else {
                mappedErrors[field] = error.data.errors[field];
              }
            } else {
              // Handle products.0.quantity format for single error
              if (field.startsWith('products.') && field.includes('.quantity')) {
                const productIndex = field.match(/products\.(\d+)\.quantity/)?.[1];
                if (productIndex !== undefined && selectedProducts[productIndex]) {
                  const productId = selectedProducts[productIndex].id;
                  mappedErrors[`product_quantity_${productId}`] = [error.data.errors[field]];
                }
              } else {
                mappedErrors[field] = [error.data.errors[field]];
              }
            }
          });
          console.log("Mapped errors (edit):", mappedErrors);
          setErrors(mappedErrors);
          
          // Show specific error message
          const errorMessage = getErrorMessage(error);
          showToastNotification(errorMessage, "error");
        } else {
          const errorMessage = getErrorMessage(error);
          showToastNotification(errorMessage, "error");
        }
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        setErrors({});
        const orderId = selectedOrder.id.replace("#", "");
        await deleteOrder(orderId).unwrap();
        showToastNotification("Sifariş uğurla silindi!", "success");

        setShowDeleteModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Sifariş silinərkən xəta:", error);
        const errorMessage = getErrorMessage(error);
        showToastNotification(errorMessage, "error");
      }
    }
  };

  // Product selection functions
  const addProduct = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      const existingProduct = selectedProducts.find(p => p.id === product.id);
      if (existingProduct) {
        setSelectedProducts(prev => 
          prev.map(p => 
            p.id === product.id 
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        );
      } else {
        setSelectedProducts(prev => [...prev, { 
          id: product.id, 
          quantity: 1, 
          discount: 0, 
          discount_type: null, 
          discounted_price: parseFloat(product.price) 
        }]);
      }
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateProductQuantity = (productId, quantity) => {
    // Allow empty string for intermediate typing (e.g., when typing "50", allow "5" temporarily)
    if (quantity === '' || quantity === null || quantity === undefined) {
      setSelectedProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, quantity: '' }
            : p
        )
      );
      return;
    }
    
    const productData = products.find(p => p.id === productId);
    const stock = productData?.stock || 0;
    const requestedQuantity = parseInt(quantity);
    
    // Only validate if we have a valid number
    if (isNaN(requestedQuantity) || requestedQuantity < 1) {
      // Don't update if it's not a valid number, but allow the user to continue typing
      return;
    }
    
    // Clear previous quantity error for this product
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`product_quantity_${productId}`];
      return newErrors;
    });
    
    // Check if quantity exceeds stock
    if (requestedQuantity > stock) {
      setErrors(prev => ({
        ...prev,
        [`product_quantity_${productId}`]: `Məhsul stokda yalnız ${stock} ədəd mövcuddur`
      }));
    }
    
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, quantity: requestedQuantity }
          : p
      )
    );
  };

  const updateProductDiscount = useCallback((productId, discount, discountType) => {
    setSelectedProducts(prev => 
      prev.map(p => {
        if (p.id === productId) {
          const productData = products.find(prod => prod.id === productId);
          const productPrice = parseFloat(productData?.price || 0);
          const productTotal = productPrice * p.quantity;
          
          // Calculate discounted price first
          let discountedPrice = productTotal;
          if (discount > 0) {
            const discountAmount = discountType === "percent" 
              ? productTotal * (parseFloat(discount) / 100)
              : parseFloat(discount);
            discountedPrice = Math.max(0, productTotal - discountAmount);
          }
          
          return { 
            ...p, 
            discount: parseFloat(discount) || 0, 
            discount_type: discountType,
            discounted_price: discountedPrice
          };
        }
        return p;
      })
    );
  }, [products]);

  // Separate validation function for product discounts
  const validateProductDiscount = useCallback((productId, discount, discountType) => {
    const productData = products.find(prod => prod.id === productId);
    const productPrice = parseFloat(productData?.price || 0);
    const product = selectedProducts.find(p => p.id === productId);
    const productTotal = productPrice * (product?.quantity || 1);
    
    if (discountType === "fixed" && !isNaN(parseFloat(discount)) && parseFloat(discount) > productTotal) {
      setErrors(prev => ({
        ...prev,
        [`product_discount_${productId}`]: `Discount amount should be less than product total (₼${productTotal.toFixed(2)})`
      }));
      return false;
    } else if (discountType === "fixed" && !isNaN(parseFloat(discount)) && parseFloat(discount) <= productTotal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`product_discount_${productId}`];
        return newErrors;
      });
    }
    return true;
  }, [products, selectedProducts]);

  // Debounced validation for total order discount
  const validateTotalOrderDiscount = useCallback((discountValue, discountType) => {
    if (discountType === "fixed" && discountValue && !isNaN(discountValue)) {
      const totalPrice = selectedProducts.reduce((sum, product) => {
        const productData = products.find(p => p.id === product.id);
        return sum + (parseFloat(productData?.price || 0) * product.quantity);
      }, 0);
      
      if (discountValue > totalPrice) {
        setErrors(prev => ({
          ...prev,
          discount_to_total_order: [`Discount amount should be less than total order amount (₼${totalPrice.toFixed(2)})`]
        }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.discount_to_total_order;
          return newErrors;
        });
      }
    }
    return true;
  }, [products, selectedProducts]);

  // Simple debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Debounced function for total order discount validation
  const debouncedValidateTotalOrder = useCallback(
    debounce((discountValue, discountType) => {
      validateTotalOrderDiscount(discountValue, discountType);
    }, 300),
    [validateTotalOrderDiscount]
  );

  const openAddModal = () => {
    setErrors({});
    // Reset form first
    setNewOrder({
      customer_id: "",
      responsible_employee_id: "",
      products: [],
      discount_type_for_total_order: null,
      discount_to_total_order: null,
      status: orderStatus.NEW,
      delivery_type: null,
      payment_type: null,
      courier_id: "",
      city_id: "",
      zone_id: "",
    });
    setSelectedProducts([]);
    setErrors({}); // Clear errors when opening modal
    
    // Clear search terms
    setCustomerSearchTerm("");
    setEmployeeSearchTerm("");
    setProductSearchTerm("");
    
    setShowAddModal(true);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditingOrderId(order.id.replace("#", ""));
    setErrors({});
    
    // Set search terms to show current selections
    const customer = customers.find(c => c.id === order.customer_id);
    if (customer) {
      setCustomerSearchTerm(`${customer.first_name} ${customer.last_name} - ${customer.phone}${customer.is_vip ? " [VIP]" : ""}`);
    }
    
    const employee = employees.find(e => e.id === order.responsible_employee_id);
    if (employee) {
      setEmployeeSearchTerm(`${employee.first_name} ${employee.last_name} - ${employee.roles?.[0]?.name || "Employee"}`);
    }
    
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

  // Cancel and Complete order functions
  const handleCancelOrder = async (order) => {
    try {
      const orderId = order.id.replace("#", "");
      await cancelOrder(orderId).unwrap();
      showToastNotification("Sifariş uğurla ləğv edildi!", "success");
    } catch (error) {
      console.error("Sifariş ləğv edilərkən xəta:", error);
      const errorMessage = error?.data?.message || "Sifariş ləğv edilərkən xəta baş verdi!";
      showToastNotification(errorMessage, "error");
    }
  };

  const handleCompleteOrder = async (order) => {
    try {
      const orderId = order.id.replace("#", "");
      await completeOrder(orderId).unwrap();
      showToastNotification("Sifariş uğurla tamamlandı!", "success");
    } catch (error) {
      console.error("Sifariş tamamlanarkən xəta:", error);
      const errorMessage = error?.data?.message || "Sifariş tamamlanarkən xəta baş verdi!";
      showToastNotification(errorMessage, "error");
    }
  };

  // Courier Assignment Function
  const assignCourier = async () => {
    if (selectedOrder && assignedCourier) {
      try {
        // Update the order with new courier and set delivery_type to courier
        const orderData = {
          courier_id: assignedCourier,
          delivery_type: "courier",
        };

        await updateOrder({ id: selectedOrder.id.replace("#", ""), ...orderData }).unwrap();
        showToastNotification("Kuryer uğurla təyin edildi və çatdırılma növü 'Kuryer' olaraq təyin edildi!", "success");

      // Close modals
      setShowCourierAssignment(false);
      setShowViewModal(false);
      setSelectedOrder(null);
      setAssignedCourier("");
      } catch (error) {
        console.error("Kuryer təyin edilərkən xəta:", error);
        showToastNotification("Kuryer təyin edilərkən xəta baş verdi!", "error");
      }
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
      Məhsullar: order.productsDisplay,
      "Ümumi Miqdar": order.totalQuantity,
      "Ümumi Qiymət (₼)": order.totalPrice.toFixed(2),
      "Endirimli Qiymət (₼)": order.discountedPrice
        ? parseFloat(order.discountedPrice).toFixed(2)
        : order.totalPrice.toFixed(2),
      "Endirim (₼)": order.discount ? order.discount.toFixed(2) : "0.00",
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
    // Get VIP customers from API data instead of calculating
    return customers
      .filter(customer => customer.is_vip)
      .map(customer => `${customer.first_name} ${customer.last_name}`);
  };

  // Function to get VIP level and styling
  const getVIPInfo = (customerName) => {
    if (!customerName) return null;

    // Find customer by name in the customers data
    const customer = customers.find(c => 
      `${c.first_name} ${c.last_name}` === customerName
    );

    // Check if customer is VIP from API data
    if (!customer || !customer.is_vip) return null;

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
        customerStats[order.customer].totalQuantity += order.totalQuantity;
        customerStats[order.customer].totalSpent += order.totalPrice;
      }
    });

    const stats = customerStats[customerName];

    // If no stats found, return default VIP info
    if (!stats) {
      return {
        level: "Bronze",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: <Star className="w-4 h-4" />,
        orderCount: 0,
        totalQuantity: 0,
        totalSpent: 0
      };
    }

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
      orderCount: stats.orderCount,
      totalQuantity: stats.totalQuantity,
      totalSpent: stats.totalSpent
    };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
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
                        .reduce((sum, order) => sum + order.totalPrice, 0)
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
                onClick={() => {
                  navigate("/musteriler");
                  // Set VIP filter after navigation
                  setTimeout(() => {
                    if (window.setCustomersVIPFilter) {
                      window.setCustomersVIPFilter("vip");
                    }
                  }, 100);
                }}
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
              onClick={() => {
                navigate("/musteriler");
                // Set VIP filter after navigation
                setTimeout(() => {
                  if (window.setCustomersVIPFilter) {
                    window.setCustomersVIPFilter("vip");
                  }
                }, 100);
              }}
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
                          {vipInfo?.orderCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi miqdar:</span>
                        <span className="font-medium text-gray-800">
                          {vipInfo?.totalQuantity || 0} ədəd
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi xərclər:</span>
                        <span className="font-medium text-gray-800">
                          ₼{(vipInfo?.totalSpent || 0).toFixed(2)}
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
                onClick={openAddModal}
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
                  {/* Məhsullar - Improved Layout */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Məhsullar:</span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm leading-relaxed">
                      {order.productsDisplay}
                    </p>
                  </div>

                  {order.customer && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 font-medium">Müştəri:</span>
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

                  {/* Price Information */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Endirimli Qiymət:</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ₼{order.discountedPrice
                        ? parseFloat(order.discountedPrice || 0).toFixed(2)
                        : parseFloat(order.totalPrice || 0).toFixed(2)}
                    </div>
                    {order.discount && (
                      <div className="text-sm text-red-600 mt-1">
                        Endirim: -₼{parseFloat((order.totalPrice - order.discountedPrice) || 0).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm font-medium">Miqdar:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {order.totalQuantity} ədəd
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm font-medium">Zona:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {order.zone}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm font-medium">Kuryer:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {order.courier}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <Truck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600 text-sm font-medium flex-shrink-0">Çatdırılma:</span>
                        <span
                          className={`font-semibold px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${
                            order.deliveryMethod === "Kuryer"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.deliveryMethod}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600 text-sm font-medium flex-shrink-0">Ödəniş:</span>
                        <span
                          className={`font-semibold px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${
                            order.paymentType === "card"
                              ? "bg-purple-100 text-purple-800"
                              : order.paymentType === "cash"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.paymentType === "card" ? "Kart" : order.paymentType === "cash" ? "Nağd" : order.paymentType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Mesaj */}
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Ramton Mesajı
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium bg-white p-3 rounded-lg border">
                    {order.whatsappMessage}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Bu mesaj Ramton qrupuna göndəriləcək
                  </p>
                </div>

                {/* Əməliyyatlar - Improved Layout */}
                <div className="mt-6 space-y-3">
                  {/* Primary Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openViewModal(order)}
                      className="flex-1 bg-blue-50 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                      title="Bax"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">Bax</span>
                    </button>
                    <button
                      onClick={() => openEditModal(order)}
                      className="flex-1 bg-green-50 text-green-600 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
                      title="Redaktə"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="font-medium">Redaktə</span>
                    </button>
                  </div>
                  
                  {/* Status Actions */}
                  {order.status !== orderStatus.CANCELLED && order.status !== orderStatus.COMPLETED && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCompleteOrder(order)}
                        className="flex-1 bg-emerald-50 text-emerald-600 py-3 px-4 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-2"
                        title="Tamamla"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Tamamla</span>
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="flex-1 bg-orange-50 text-orange-600 py-3 px-4 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center space-x-2"
                        title="Ləğv Et"
                      >
                        <X className="w-4 h-4" />
                        <span className="font-medium">Ləğv Et</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Delete Action */}
                  <button
                    onClick={() => openDeleteModal(order)}
                    className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Sil</span>
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
                      <Package className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-gray-800">Məhsullar</h5>
                    </div>
                    <p className="text-gray-600">
                      {selectedOrder.productsDisplay}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ümumi miqdar: {selectedOrder.totalQuantity} ədəd
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
                        ₼{parseFloat(selectedOrder.price || 0).toFixed(2)}
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

                  {/* Ödəniş Növü */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-gray-800">
                        Ödəniş Növü
                      </h5>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.paymentType === "card"
                          ? "bg-purple-100 text-purple-800"
                          : selectedOrder.paymentType === "cash"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedOrder.paymentType === "card" ? "Kart" : selectedOrder.paymentType === "cash" ? "Nağd" : selectedOrder.paymentType}
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
                          ₼{parseFloat(selectedOrder.totalPrice || 0).toFixed(2)}
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
            {/* Loading Overlay */}
            {isCreating && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Sifariş əlavə edilir...</p>
                </div>
              </div>
            )}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Müştəri
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerModal(true)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Yeni Müştəri</span>
                    </button>
                  </div>
                  <div className="relative dropdown-container">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Müştəri axtar..."
                        value={customerSearchTerm}
                        onChange={(e) => {
                          setCustomerSearchTerm(e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.customer_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                      />
                    </div>
                    {showCustomerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => {
                                setNewOrder({ ...newOrder, customer_id: customer.id });
                                setCustomerSearchTerm(`${customer.first_name} ${customer.last_name} - ${customer.phone}${customer.is_vip ? " [VIP]" : ""}`);
                                setShowCustomerDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {customer.first_name} {customer.last_name} - {customer.phone}
                        {customer.is_vip ? " [VIP]" : ""}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">Müştəri tapılmadı</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Əməkdaş
                  </label>
                  <div className="relative dropdown-container">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Əməkdaş axtar..."
                        value={employeeSearchTerm}
                        onChange={(e) => {
                          setEmployeeSearchTerm(e.target.value);
                          setShowEmployeeDropdown(true);
                        }}
                        onFocus={() => setShowEmployeeDropdown(true)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.responsible_employee_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                      />
                    </div>
                    {showEmployeeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <div
                              key={employee.id}
                              onClick={() => {
                                setNewOrder({ ...newOrder, responsible_employee_id: employee.id });
                                setEmployeeSearchTerm(`${employee.first_name} ${employee.last_name} - ${employee.roles?.[0]?.name || "Employee"}`);
                                setShowEmployeeDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {employee.first_name} {employee.last_name} - {employee.roles?.[0]?.name || "Employee"}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">Əməkdaş tapılmadı</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.responsible_employee_id && <p className="text-red-500 text-xs mt-1">{errors.responsible_employee_id[0]}</p>}
                </div>

                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Məhsul Əlavə Et
                  </label>
                  <div className="relative dropdown-container">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Məhsul axtar..."
                        value={productSearchTerm}
                    onChange={(e) => {
                          setProductSearchTerm(e.target.value);
                          setShowProductDropdown(true);
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.products ? 'border-red-500' : 'border-gray-300'
                    }`}
                      />
                    </div>
                    {showProductDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                addProduct(product.id);
                                setProductSearchTerm("");
                                setShowProductDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                        {product.name} - ₼{product.price}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">Məhsul tapılmadı</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.products && <p className="text-red-500 text-xs mt-1">{errors.products[0]}</p>}
                </div>

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Seçilmiş Məhsullar
                    </label>
                    {selectedProducts.map((product) => {
                      const productData = products.find(p => p.id === product.id);
                      const isTotalDiscountEnabled = newOrder.discount_type_for_total_order && newOrder.discount_to_total_order;
                      return (
                        <div key={product.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <span className="font-medium">{productData?.name}</span>
                            <span className="text-gray-500 ml-2">₼{productData?.price}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col items-center">
                              <label className="text-xs text-gray-500 mb-1">Miqdar</label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                className={`w-20 px-3 py-2 border rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`product_quantity_${product.id}`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              min="1"
                                step="1"
                                placeholder="1"
                            />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Məhsulu sil"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            </div>
                          </div>
                          
                          {/* Individual Product Discount */}
                          <div className={`grid grid-cols-3 gap-2 ${isTotalDiscountEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Endirim Növü
                              </label>
                              <select
                                value={product.discount_type || ""}
                                onChange={(e) => updateProductDiscount(product.id, product.discount, e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                disabled={isTotalDiscountEnabled}
                              >
                                <option value="">Yox</option>
                                <option value="fixed">Sabit</option>
                                <option value="percent">Faiz</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Endirim Məbləği
                              </label>
                              <input
                                type="number"
                                value={product.discount || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  updateProductDiscount(product.id, value, product.discount_type);
                                  // Debounced validation for product discounts
                                  if (product.discount_type === "fixed" && value) {
                                    setTimeout(() => {
                                      validateProductDiscount(product.id, value, product.discount_type);
                                    }, 300);
                                  }
                                }}
                                className={`w-full px-2 py-1 text-xs border rounded ${
                                  errors[`product_discount_${product.id}`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                disabled={isTotalDiscountEnabled || !product.discount_type}
                              />
                              {errors[`product_discount_${product.id}`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`product_discount_${product.id}`]}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Endirimli Qiymət
                              </label>
                              <div className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-center">
                                ₼{parseFloat(product.discounted_price || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          {errors[`product_quantity_${product.id}`] && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-red-600 text-sm font-medium">{errors[`product_quantity_${product.id}`]}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total Order Discount */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Ümumi Sifariş Endirimi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endirim Növü
                      </label>
                      <select
                          value={newOrder.discount_type_for_total_order || ""}
                        onChange={(e) =>
                            setNewOrder({ ...newOrder, discount_type_for_total_order: e.target.value || null })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                          <option value="">Endirim seçin</option>
                        <option value="fixed">Sabit Məbləğ</option>
                        <option value="percent">Faiz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endirim Məbləği
                      </label>
                      <input
                        type="number"
                          value={newOrder.discount_to_total_order || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
                              const discountValue = value === "" ? null : parseFloat(value);
                              
                              // Update the order immediately
                              setNewOrder({ ...newOrder, discount_to_total_order: discountValue });
                              
                              // Debounced validation
                              if (newOrder.discount_type_for_total_order === "fixed" && discountValue) {
                                debouncedValidateTotalOrder(discountValue, newOrder.discount_type_for_total_order);
                              }
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.discount_to_total_order ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                          disabled={!newOrder.discount_type_for_total_order}
                      />
                      {errors.discount_to_total_order && <p className="text-red-500 text-xs mt-1">{errors.discount_to_total_order[0]}</p>}
                    </div>
                  </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ümumi sifariş endirimi seçilərsə, məhsul endirimləri avtomatik olaraq deaktiv olacaq
                    </p>
                  </div>
                </div>

                {/* Price Calculation */}
                {selectedProducts.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cəmi Qiymət:</span>
                      <span className="font-semibold text-gray-800">
                        ₼{(() => {
                          const totalPrice = selectedProducts.reduce((sum, product) => {
                            const productData = products.find(p => p.id === product.id);
                            return sum + (parseFloat(productData?.price || 0) * product.quantity);
                          }, 0);
                          return parseFloat(totalPrice || 0).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Endirim:</span>
                      <span className="font-semibold text-red-600">
                        -₼{(() => {
                          const totalPrice = selectedProducts.reduce((sum, product) => {
                            const productData = products.find(p => p.id === product.id);
                            return sum + (parseFloat(productData?.price || 0) * product.quantity);
                          }, 0);
                          
                          if (newOrder.discount_type_for_total_order && newOrder.discount_to_total_order) {
                            // Total order discount
                            const discountAmount = parseFloat(newOrder.discount_to_total_order || 0);
                            const discountValue = newOrder.discount_type_for_total_order === "percent"
                              ? totalPrice * (discountAmount / 100)
                              : discountAmount;
                            return parseFloat(discountValue || 0).toFixed(2);
                          } else {
                            // Individual product discounts
                            const totalDiscount = selectedProducts.reduce((sum, product) => {
                              const productData = products.find(p => p.id === product.id);
                              const productPrice = parseFloat(productData?.price || 0);
                              const productTotal = productPrice * product.quantity;
                              
                              if (product.discount_type && product.discount > 0) {
                                const productDiscount = product.discount_type === "percent"
                                  ? productTotal * (product.discount / 100)
                                  : product.discount;
                              return sum + productDiscount;
                              }
                              return sum;
                            }, 0);
                            return parseFloat(totalDiscount || 0).toFixed(2);
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-gray-700">
                        Endirimli Qiymət:
                      </span>
                      <span className="font-semibold text-green-600">
                        ₼{(() => {
                          const totalPrice = selectedProducts.reduce((sum, product) => {
                            const productData = products.find(p => p.id === product.id);
                            return sum + (parseFloat(productData?.price || 0) * product.quantity);
                          }, 0);
                          
                          let discountedPrice;
                          if (newOrder.discount_type_for_total_order && newOrder.discount_to_total_order) {
                            // Apply discount to total order
                            const discountAmount = parseFloat(newOrder.discount_to_total_order || 0);
                            discountedPrice = newOrder.discount_type_for_total_order === "percent"
                              ? totalPrice * (1 - discountAmount / 100)
                              : totalPrice - discountAmount;
                          } else {
                            // Use individual product discounts
                            discountedPrice = selectedProducts.reduce((sum, product) => {
                              const productData = products.find(p => p.id === product.id);
                              const productPrice = parseFloat(productData?.price || 0);
                              const productTotal = productPrice * product.quantity;
                              
                              // If product has discount, use discounted price, otherwise use total price
                              if (product.discount_type && product.discount > 0) {
                                return sum + (product.discounted_price || productTotal);
                              } else {
                                return sum + productTotal;
                              }
                            }, 0);
                          }
                          
                          return Math.max(0, parseFloat(discountedPrice || 0)).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                )}

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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.courier_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Kuryer seçin</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.first_name} {courier.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.courier_id && <p className="text-red-500 text-xs mt-1">{errors.courier_id[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çatdırılma Üsulu
                  </label>
                  <select
                    value={newOrder.delivery_type}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        delivery_type: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.delivery_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Təyin edilməyib</option>
                    <option value="courier">Kuryer Çatdırılması</option>
                    <option value="postal">
                      Azerpoct Filialından Çatdırılma
                    </option>
                  </select>
                  {errors.delivery_type && <p className="text-red-500 text-xs mt-1">{errors.delivery_type[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödəniş Növü
                  </label>
                  <select
                    value={newOrder.payment_type || ""}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        payment_type: e.target.value || null,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.payment_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Ödəniş növü seçin</option>
                    <option value="card">Kart</option>
                    <option value="cash">Nağd</option>
                  </select>
                  {errors.payment_type && <p className="text-red-500 text-xs mt-1">{errors.payment_type[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəhər
                  </label>
                  <select
                    value={newOrder.city_id}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, city_id: e.target.value, zone_id: "" })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Şəhər seçin</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.zone_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={!newOrder.city_id}
                  >
                    <option value="">Zona seçin</option>
                    {getZonesForCity(newOrder.city_id).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {errors.zone_id && <p className="text-red-500 text-xs mt-1">{errors.zone_id[0]}</p>}
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

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni Müştəri Əlavə Et
              </h3>
              <button
                onClick={() => {
                  setShowAddCustomerModal(false);
                  resetCustomerForm();
                }}
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
                      customerErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {customerErrors.first_name && <p className="text-red-500 text-xs mt-1">{customerErrors.first_name[0]}</p>}
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
                      customerErrors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {customerErrors.last_name && <p className="text-red-500 text-xs mt-1">{customerErrors.last_name[0]}</p>}
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
                      customerErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {customerErrors.email && <p className="text-red-500 text-xs mt-1">{customerErrors.email[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      customerErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+994 50 123 45 67"
                  />
                  {customerErrors.phone && <p className="text-red-500 text-xs mt-1">{customerErrors.phone[0]}</p>}
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
                      customerErrors.country_id ? 'border-red-500' : 'border-gray-300'
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
                  {customerErrors.country_id && <p className="text-red-500 text-xs mt-1">{customerErrors.country_id[0]}</p>}
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
                      customerErrors.city_id ? 'border-red-500' : 'border-gray-300'
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
                  {customerErrors.city_id && <p className="text-red-500 text-xs mt-1">{customerErrors.city_id[0]}</p>}
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
                      customerErrors.zone_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Zona seçin</option>
                    {getZonesForCity(newCustomer.city_id).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {customerErrors.zone_id && <p className="text-red-500 text-xs mt-1">{customerErrors.zone_id[0]}</p>}
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
                      customerErrors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Status seçin</option>
                    <option value="active">Aktiv</option>
                    <option value="deactive">Deaktiv</option>
                    <option value="passiv">Passiv</option>
                  </select>
                  {customerErrors.status && <p className="text-red-500 text-xs mt-1">{customerErrors.status[0]}</p>}
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
                onClick={() => {
                  setShowAddCustomerModal(false);
                  resetCustomerForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={isCreatingCustomer}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingCustomer ? "Əlavə edilir..." : "Əlavə Et"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sifariş Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
            {/* Loading Overlay */}
            {isUpdating && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Sifariş yenilənir...</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Sifarişi Redaktə Et
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingOrderId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {singleOrderLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Sifariş yüklənir...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müştəri
                    </label>
                    <div className="relative dropdown-container">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Müştəri axtar..."
                          value={customerSearchTerm}
                          onChange={(e) => {
                            setCustomerSearchTerm(e.target.value);
                            setShowCustomerDropdown(true);
                          }}
                          onFocus={() => setShowCustomerDropdown(true)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.customer_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                        />
                      </div>
                      {showCustomerDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                onClick={() => {
                                  setNewOrder({ ...newOrder, customer_id: customer.id });
                                  setCustomerSearchTerm(`${customer.first_name} ${customer.last_name} - ${customer.phone}${customer.is_vip ? " [VIP]" : ""}`);
                                  setShowCustomerDropdown(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {customer.first_name} {customer.last_name} - {customer.phone}
                          {customer.is_vip ? " [VIP]" : ""}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">Müştəri tapılmadı</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Əməkdaş
                    </label>
                    <div className="relative dropdown-container">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Əməkdaş axtar..."
                          value={employeeSearchTerm}
                          onChange={(e) => {
                            setEmployeeSearchTerm(e.target.value);
                            setShowEmployeeDropdown(true);
                          }}
                          onFocus={() => setShowEmployeeDropdown(true)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.responsible_employee_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                        />
                      </div>
                      {showEmployeeDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                              <div
                                key={employee.id}
                                onClick={() => {
                                  setNewOrder({ ...newOrder, responsible_employee_id: employee.id });
                                  setEmployeeSearchTerm(`${employee.first_name} ${employee.last_name} - ${employee.roles?.[0]?.name || "Employee"}`);
                                  setShowEmployeeDropdown(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {employee.first_name} {employee.last_name} - {employee.roles?.[0]?.name || "Employee"}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">Əməkdaş tapılmadı</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.responsible_employee_id && <p className="text-red-500 text-xs mt-1">{errors.responsible_employee_id[0]}</p>}
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Məhsul Əlavə Et
                    </label>
                    <div className="relative dropdown-container">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Məhsul axtar..."
                          value={productSearchTerm}
                      onChange={(e) => {
                            setProductSearchTerm(e.target.value);
                            setShowProductDropdown(true);
                          }}
                          onFocus={() => setShowProductDropdown(true)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.products ? 'border-red-500' : 'border-gray-300'
                      }`}
                        />
                      </div>
                      {showProductDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => {
                                  addProduct(product.id);
                                  setProductSearchTerm("");
                                  setShowProductDropdown(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                          {product.name} - ₼{product.price}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">Məhsul tapılmadı</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.products && <p className="text-red-500 text-xs mt-1">{errors.products[0]}</p>}
                  </div>

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Seçilmiş Məhsullar
                      </label>
                      {selectedProducts.map((product) => {
                        const productData = products.find(p => p.id === product.id);
                        const isTotalDiscountEnabled = newOrder.discount_type_for_total_order && newOrder.discount_to_total_order;
                        return (
                          <div key={product.id} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <span className="font-medium">{productData?.name}</span>
                              <span className="text-gray-500 ml-2">₼{productData?.price}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex flex-col items-center">
                                <label className="text-xs text-gray-500 mb-1">Miqdar</label>
                              <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                  className={`w-20 px-3 py-2 border rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  errors[`product_quantity_${product.id}`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="1"
                                  step="1"
                                  placeholder="1"
                              />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeProduct(product.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Məhsulu sil"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              </div>
                            </div>
                            
                            {/* Individual Product Discount */}
                            <div className={`grid grid-cols-3 gap-2 ${isTotalDiscountEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Endirim Növü
                                </label>
                                <select
                                  value={product.discount_type || ""}
                                  onChange={(e) => updateProductDiscount(product.id, product.discount, e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  disabled={isTotalDiscountEnabled}
                                >
                                  <option value="">Yox</option>
                                  <option value="fixed">Sabit</option>
                                  <option value="percent">Faiz</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Endirim Məbləği
                                </label>
                                <input
                                  type="number"
                                  value={product.discount || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    updateProductDiscount(product.id, value, product.discount_type);
                                    // Debounced validation for product discounts
                                    if (product.discount_type === "fixed" && value) {
                                      setTimeout(() => {
                                        validateProductDiscount(product.id, value, product.discount_type);
                                      }, 300);
                                    }
                                  }}
                                  className={`w-full px-2 py-1 text-xs border rounded ${
                                    errors[`product_discount_${product.id}`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  disabled={isTotalDiscountEnabled || !product.discount_type}
                                />
                                {errors[`product_discount_${product.id}`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`product_discount_${product.id}`]}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Endirimli Qiymət
                                </label>
                                <div className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-center">
                                  ₼{parseFloat(product.discounted_price || 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            {errors[`product_quantity_${product.id}`] && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-sm font-medium">{errors[`product_quantity_${product.id}`]}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Total Order Discount */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Ümumi Sifariş Endirimi</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Endirim Növü
                        </label>
                        <select
                            value={newOrder.discount_type_for_total_order || ""}
                          onChange={(e) =>
                              setNewOrder({ ...newOrder, discount_type_for_total_order: e.target.value || null })
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.discount_type_for_total_order ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                            <option value="">Endirim seçin</option>
                          <option value="fixed">Sabit Məbləğ</option>
                          <option value="percent">Faiz</option>
                        </select>
                          {errors.discount_type_for_total_order && <p className="text-red-500 text-xs mt-1">{errors.discount_type_for_total_order[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Endirim Məbləği
                        </label>
                        <input
                          type="number"
                            value={newOrder.discount_to_total_order || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
                                const discountValue = value === "" ? null : parseFloat(value);
                                
                                // Update the order immediately
                                setNewOrder({ ...newOrder, discount_to_total_order: discountValue });
                                
                                // Debounced validation
                                if (newOrder.discount_type_for_total_order === "fixed" && discountValue) {
                                  debouncedValidateTotalOrder(discountValue, newOrder.discount_type_for_total_order);
                                }
                            }
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.discount_to_total_order ? 'border-red-500' : 'border-gray-300'
                          }`}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                            disabled={!newOrder.discount_type_for_total_order}
                        />
                          {errors.discount_to_total_order && <p className="text-red-500 text-xs mt-1">{errors.discount_to_total_order[0]}</p>}
                      </div>
                    </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Ümumi sifariş endirimi seçilərsə, məhsul endirimləri avtomatik olaraq deaktiv olacaq
                      </p>
                    </div>
                  </div>

                  {/* Price Calculation */}
                  {selectedProducts.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cəmi Qiymət:</span>
                        <span className="font-semibold text-gray-800">
                          ₼{(() => {
                            const totalPrice = selectedProducts.reduce((sum, product) => {
                              const productData = products.find(p => p.id === product.id);
                              return sum + (parseFloat(productData?.price || 0) * product.quantity);
                            }, 0);
                            return parseFloat(totalPrice || 0).toFixed(2);
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Endirim:</span>
                        <span className="font-semibold text-red-600">
                          -₼{(() => {
                            const totalPrice = selectedProducts.reduce((sum, product) => {
                              const productData = products.find(p => p.id === product.id);
                              return sum + (parseFloat(productData?.price || 0) * product.quantity);
                            }, 0);
                            if (newOrder.discount_type_for_total_order && newOrder.discount_to_total_order) {
                              // Total order discount
                              const discountAmount = parseFloat(newOrder.discount_to_total_order || 0);
                              const discountValue = newOrder.discount_type_for_total_order === "percent"
                                ? totalPrice * (discountAmount / 100)
                                : discountAmount;
                              return parseFloat(discountValue || 0).toFixed(2);
                            } else {
                              // Individual product discounts
                              const totalDiscount = selectedProducts.reduce((sum, product) => {
                                const productData = products.find(p => p.id === product.id);
                                const productPrice = parseFloat(productData?.price || 0);
                                const productTotal = productPrice * product.quantity;
                                
                                if (product.discount_type && product.discount > 0) {
                                  const productDiscount = product.discount_type === "percent"
                                    ? productTotal * (product.discount / 100)
                                    : product.discount;
                                return sum + productDiscount;
                                }
                                return sum;
                              }, 0);
                              return parseFloat(totalDiscount || 0).toFixed(2);
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Endirimli Qiymət:
                        </span>
                        <span className="font-semibold text-green-600">
                          ₼{(() => {
                            const totalPrice = selectedProducts.reduce((sum, product) => {
                              const productData = products.find(p => p.id === product.id);
                              return sum + (parseFloat(productData?.price || 0) * product.quantity);
                            }, 0);
                            let discountedPrice;
                            if (newOrder.discount_type_for_total_order && newOrder.discount_to_total_order) {
                              // Apply discount to total order
                              const discountAmount = parseFloat(newOrder.discount_to_total_order || 0);
                              discountedPrice = newOrder.discount_type_for_total_order === "percent"
                                ? totalPrice * (1 - discountAmount / 100)
                                : totalPrice - discountAmount;
                            } else {
                              // Use individual product discounts
                              discountedPrice = selectedProducts.reduce((sum, product) => {
                                const productData = products.find(p => p.id === product.id);
                                const productPrice = parseFloat(productData?.price || 0);
                                const productTotal = productPrice * product.quantity;
                                
                                // If product has discount, use discounted price, otherwise use total price
                                if (product.discount_type && product.discount > 0) {
                                  return sum + (product.discounted_price || productTotal);
                                } else {
                                  return sum + productTotal;
                                }
                              }, 0);
                            }
                            
                            return Math.max(0, parseFloat(discountedPrice || 0)).toFixed(2);
                          })()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newOrder.status}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, status: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value={orderStatus.NEW}>Yeni</option>
                      <option value={orderStatus.WAITING}>Gözləmədə</option>
                      <option value={orderStatus.REDIRECTED}>
                        Yönləndirilib
                      </option>
                      <option value={orderStatus.COMPLETED}>Tamamlandı</option>
                      <option value={orderStatus.CANCELLED}>Ləğv</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.courier_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Kuryer seçin</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.first_name} {courier.last_name}
                        </option>
                      ))}
                    </select>
                    {errors.courier_id && <p className="text-red-500 text-xs mt-1">{errors.courier_id[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çatdırılma Üsulu
                    </label>
                    <select
                      value={newOrder.delivery_type}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          delivery_type: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.delivery_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Təyin edilməyib</option>
                      <option value="courier">Kuryer Çatdırılması</option>
                      <option value="postal">
                        Azerpoct Filialından Çatdırılma
                      </option>
                    </select>
                    {errors.delivery_type && <p className="text-red-500 text-xs mt-1">{errors.delivery_type[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ödəniş Növü
                    </label>
                    <select
                      value={newOrder.payment_type || ""}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          payment_type: e.target.value || null,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.payment_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Ödəniş növü seçin</option>
                      <option value="card">Kart</option>
                      <option value="cash">Nağd</option>
                    </select>
                    {errors.payment_type && <p className="text-red-500 text-xs mt-1">{errors.payment_type[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şəhər
                    </label>
                    <select
                      value={newOrder.city_id}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, city_id: e.target.value, zone_id: "" })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Şəhər seçin</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.zone_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!newOrder.city_id}
                    >
                      <option value="">Zona seçin</option>
                      {getZonesForCity(newOrder.city_id).map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                    {errors.zone_id && <p className="text-red-500 text-xs mt-1">{errors.zone_id[0]}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingOrderId(null);
                }}
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            {/* Loading Overlay */}
            {isDeleting && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Sifariş silinir...</p>
                </div>
              </div>
            )}
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Təyin Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Success Notification */}
      {showExportNotification && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div className="flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg bg-green-500 text-white">
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
            <button
              onClick={() => setShowExportNotification(false)}
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

export default Orders;
