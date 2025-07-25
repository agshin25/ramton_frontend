import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Tag,
  DollarSign,
  TrendingUp,
  Eye,
  X
} from 'lucide-react';
import { employees } from './Admin';

// Products data that can be used across components
export const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'Telefon',
    price: 3250,
    status: 'Aktiv',
    totalSales: 25,
    stock: 15,
    image: '📱',
    employee: 'Əli Məmmədov'
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    category: 'Kompyuter',
    price: 2890,
    status: 'Aktiv',
    totalSales: 18,
    stock: 8,
    image: '💻',
    employee: 'Aysu Həsənli'
  },
  {
    id: 3,
    name: 'Apple Watch Series 9',
    category: 'Aksesuar',
    price: 1450,
    status: 'Aktiv',
    totalSales: 15,
    stock: 12,
    image: '⌚',
    employee: 'Fatma Əliyeva'
  },
  {
    id: 4,
    name: 'iPad Pro 12.9"',
    category: 'Planşet',
    price: 2200,
    status: 'Aktiv',
    totalSales: 12,
    stock: 5,
    image: '📱',
    employee: 'Rəşad Əhmədov'
  },
  {
    id: 5,
    name: 'AirPods Pro 2',
    category: 'Aksesuar',
    price: 850,
    status: 'Passiv',
    totalSales: 30,
    stock: 0,
    image: '🎧',
    employee: 'Leyla Məmmədli'
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24',
    category: 'Telefon',
    price: 2800,
    status: 'Aktiv',
    totalSales: 8,
    stock: 20,
    image: '📱',
    employee: 'Əli Məmmədov'
  }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsList, setProductsList] = useState(products);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    status: 'Aktiv',
    totalSales: 0,
    stock: 0,
    image: '📱',
    employee: ''
  });



  const getStatusColor = (status) => {
    return status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesEmployee = employeeFilter === 'all' || product.employee === employeeFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesEmployee;
  });

  const categories = [...new Set(productsList.map(p => p.category))];

  // CRUD Functions
  const handleAddProduct = () => {
    const newId = Math.max(...productsList.map(p => p.id)) + 1;
    const productToAdd = {
      ...newProduct,
      id: newId
    };
    
    setProductsList([...productsList, productToAdd]);
    
    // Reset form
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      status: 'Aktiv',
      totalSales: 0,
      stock: 0,
      image: '📱',
      employee: ''
    });
    setShowAddModal(false);
  };

  const handleEditProduct = () => {
    if (selectedProduct) {
      const updatedProducts = productsList.map(product =>
        product.id === selectedProduct.id ? { ...selectedProduct, ...newProduct } : product
      );
      setProductsList(updatedProducts);
      setShowEditModal(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      const updatedProducts = productsList.filter(product => product.id !== selectedProduct.id);
      setProductsList(updatedProducts);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      status: product.status,
      totalSales: product.totalSales,
      stock: product.stock,
      image: product.image,
      employee: product.employee
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Məhsullar
        </h1>
        <p className="text-gray-600 text-lg">Məhsul kataloqu və satış statistikaları</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Məhsul Siyahısı</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Məhsul
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Satış Hesabatı
              </button>
            </div>
          </div>
        </div>

        {/* Axtarış və Filtrlər */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Məhsul axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Kateqoriyalar</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Aktiv">Aktiv</option>
              <option value="Passiv">Passiv</option>
            </select>
            
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Bütün Əməkdaşlar</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name} - {employee.role}
                </option>
              ))}
            </select>
            
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtr
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                    {product.image}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{product.name}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold text-green-600">₼{product.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{product.totalSales} ədəd satılıb</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                      {product.stock} ədəd stokda
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">👤 {product.employee}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openViewModal(product)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Bax
                  </button>
                  <button 
                    onClick={() => openEditModal(product)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Redaktə
                  </button>
                  <button 
                    onClick={() => openDeleteModal(product)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Satış Statistikası */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Məhsul Satış Statistikası
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Ən Çox Satan</p>
                <p className="text-lg font-semibold text-gray-800">iPhone 15 Pro</p>
                <p className="text-sm text-green-600">25 ədəd</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Ümumi Satış</p>
                <p className="text-lg font-semibold text-gray-800">108 ədəd</p>
                <p className="text-sm text-blue-600">Bu ay</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                <p className="text-lg font-semibold text-gray-800">₼12,450</p>
                <p className="text-sm text-green-600">Bu ay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Məhsul Əlavə Et</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul Adı</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məhsul adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kateqoriya seçin</option>
                    <option value="Telefon">Telefon</option>
                    <option value="Kompyuter">Kompyuter</option>
                    <option value="Planşet">Planşet</option>
                    <option value="Aksesuar">Aksesuar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qiymət (₼)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Miqdarı</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                  <select
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="📱">📱 Telefon</option>
                    <option value="💻">💻 Kompyuter</option>
                    <option value="📱">📱 Planşet</option>
                    <option value="⌚">⌚ Saat</option>
                    <option value="🎧">🎧 Qulaqlıq</option>
                    <option value="📷">📷 Kamera</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məsul Əməkdaş</label>
                  <select
                    value={newProduct.employee}
                    onChange={(e) => setNewProduct({...newProduct, employee: e.target.value})}
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
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.employee}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Əlavə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Məhsulu Redaktə Et</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul Adı</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məhsul adını daxil edin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kateqoriya seçin</option>
                    <option value="Telefon">Telefon</option>
                    <option value="Kompyuter">Kompyuter</option>
                    <option value="Planşet">Planşet</option>
                    <option value="Aksesuar">Aksesuar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qiymət (₼)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Miqdarı</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                  <select
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="📱">📱 Telefon</option>
                    <option value="💻">💻 Kompyuter</option>
                    <option value="📱">📱 Planşet</option>
                    <option value="⌚">⌚ Saat</option>
                    <option value="🎧">🎧 Qulaqlıq</option>
                    <option value="📷">📷 Kamera</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Məsul Əməkdaş</label>
                  <select
                    value={newProduct.employee}
                    onChange={(e) => setNewProduct({...newProduct, employee: e.target.value})}
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
                onClick={handleEditProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.employee}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yenilə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Məhsulu Sil</h3>
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
              <h4 className="text-lg font-medium text-gray-800 mb-2">Məhsulu silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">
                <strong>{selectedProduct?.name}</strong> - {selectedProduct?.category}
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
                onClick={handleDeleteProduct}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Məhsul Detalları</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedProduct && (
                <div className="space-y-6">
                  {/* Product Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                        {selectedProduct.image}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800">{selectedProduct.name}</h4>
                        <p className="text-gray-600">{selectedProduct.category}</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProduct.status)}`}>
                          {selectedProduct.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h5 className="font-medium text-gray-800">Qiymət</h5>
                      </div>
                      <p className="text-2xl font-bold text-green-600">₼{selectedProduct.price}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h5 className="font-medium text-gray-800">Stok</h5>
                      </div>
                      <p className={`text-2xl font-bold ${getStockColor(selectedProduct.stock)}`}>
                        {selectedProduct.stock} ədəd
                      </p>
                    </div>
                  </div>

                  {/* Sales Information */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-gray-800">Satış Məlumatları</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Ümumi Satış</p>
                        <p className="text-lg font-semibold text-gray-800">{selectedProduct.totalSales} ədəd</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ümumi Gəlir</p>
                        <p className="text-lg font-semibold text-green-600">₼{(selectedProduct.price * selectedProduct.totalSales).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employee Information */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">👤</span>
                      <h5 className="font-medium text-gray-800">Məsul Əməkdaş</h5>
                    </div>
                    <p className="text-gray-700">{selectedProduct.employee}</p>
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
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedProduct);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 