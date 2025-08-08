import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Shield, 
  UserCheck, 
  Key,
  Menu,
  X,
  Package,
  Truck,
  MessageSquare,
  BarChart3,
  Settings,
  Tag,
  MapPin,
  Bell,
  CheckCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Products from './components/Products';
import Categories from './components/Categories';
import Couriers from './components/Couriers';
import Zones from './components/Zones';
import Admin from './components/Admin';
import Roles from './components/Roles';
import Permissions from './components/Permissions';
import SettingsComponent from './components/Settings';
import BotMonitoring from './components/BotMonitoring';
import OrderStatistics from './components/OrderStatistics';
import Notifications from './components/Notifications';
import Reports from './components/Reports';
import Login from './components/Login';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Yeni Sifariş',
      message: 'iPhone 15 Pro x2 ədəd sifarişi gəldi',
      time: '2 dəqiqə əvvəl',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'system',
      title: 'Sistem Yeniləməsi',
      message: 'Ramton CRM sistemi yeniləndi',
      time: '15 dəqiqə əvvəl',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'delivery',
      title: 'Çatdırılma Tamamlandı',
      message: 'MacBook Air sifarişi çatdırıldı',
      time: '1 saat əvvəl',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'order',
      title: 'Sifariş Ləğv Edildi',
      message: 'AirPods Pro sifarişi ləğv edildi',
      time: '2 saat əvvəl',
      read: true,
      priority: 'medium'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      time: 'İndi',
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};



// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Sifarişlər', icon: ShoppingCart, path: '/sifarisler' },
    { name: 'Sifariş Statistikası', icon: BarChart3, path: '/sifaris-statistikasi' },
    { name: 'Məhsullar', icon: Package, path: '/mehsullar' },
    { name: 'Kateqoriyalar', icon: Tag, path: '/kateqoriyalar' },
    { name: 'Kuryerlər', icon: Truck, path: '/kuryerler' },
    { name: 'Zonalar', icon: MapPin, path: '/zonalar' },
    { name: 'Müştərilər', icon: Users, path: '/musteriler' },
    { name: 'Admin', icon: Shield, path: '/admin' },
    { name: 'Rollar', icon: UserCheck, path: '/rollar' },
    { name: 'İcazələr', icon: Key, path: '/icazeler' },
    { name: 'Bot Monitorinq', icon: MessageSquare, path: '/bot-monitoring' },
    { name: 'Hesabatlar', icon: BarChart3, path: '/hesabatlar' },
    { name: 'Tənzimləmələr', icon: Settings, path: '/tenzimlemeler' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
        w-64 border-r border-slate-700 flex flex-col
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ramton CRM
          </h1>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                      }
                    `}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Bottom spacing */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            Sistem vəziyyəti: Aktiv
          </div>
        </div>
      </div>
    </>
  );
};

// Header Component
const Header = ({ toggleSidebar }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close notifications when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'delivery':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Ramton CRM Sistemi</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Bildirişlər</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Hamısını oxundu kimi qeyd et
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      Bildiriş yoxdur
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        navigate('/bildirisler');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Bütün bildirişləri gör
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="text-white text-sm font-medium">{user?.avatar || 'A'}</span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user?.avatar || 'A'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'admin@ramton.az'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıxış Et
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



// Main App Component
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Header toggleSidebar={toggleSidebar} />
                    
                    <main className="flex-1 overflow-y-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/sifarisler" element={<Orders />} />
                        <Route path="/sifaris-statistikasi" element={<OrderStatistics />} />
                        <Route path="/mehsullar" element={<Products />} />
                        <Route path="/kateqoriyalar" element={<Categories />} />
                        <Route path="/kuryerler" element={<Couriers />} />
                        <Route path="/zonalar" element={<Zones />} />
                        <Route path="/musteriler" element={<Customers />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/rollar" element={<Roles />} />
                        <Route path="/icazeler" element={<Permissions />} />
                        <Route path="/bot-monitoring" element={<BotMonitoring />} />
                        <Route path="/hesabatlar" element={<Reports />} />
                        <Route path="/tenzimlemeler" element={<SettingsComponent />} />
                        <Route path="/bildirisler" element={<Notifications />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 