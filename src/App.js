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
  CheckCircle,
  AlertTriangle,
  Receipt
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
import SettingsComponent from './components/Settings';
import BotMonitoring from './components/BotMonitoring';
import OrderStatistics from './components/OrderStatistics';
import Notifications from './components/Notifications';
import Reports from './components/Reports';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import ProblemTracking from './components/ProblemTracking';
import CourierSettlement from './components/CourierSettlement';
import DailyTasks from './components/DailyTasks';

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
    { name: 'Əməkdaş Dashboard', icon: Users, path: '/emekdas-dashboard' },
    { name: 'Problem İzləmə', icon: AlertTriangle, path: '/problem-izleme' },
    { name: 'Gündəlik Tapşırıqlar', icon: CheckCircle, path: '/gunluk-tapshiriqlar' },
    { name: 'Sifarişlər', icon: ShoppingCart, path: '/sifarisler' },
    { name: 'Sifariş Statistikası', icon: BarChart3, path: '/sifaris-statistikasi' },
    { name: 'Məhsullar', icon: Package, path: '/mehsullar' },
    { name: 'Kateqoriyalar', icon: Tag, path: '/kateqoriyalar' },
    { name: 'Kuryerlər', icon: Truck, path: '/kuryerler' },
    { name: 'Kuryer Hesablaşması', icon: Receipt, path: '/kuryer-hesablasma' },
    { name: 'Zonalar', icon: MapPin, path: '/zonalar' },
    { name: 'Müştərilər', icon: Users, path: '/musteriler' },
    { name: 'Bildirişlər', icon: Bell, path: '/bildirisler' },
    { name: 'Admin', icon: Shield, path: '/admin' },
    { name: 'Rollar', icon: UserCheck, path: '/rollar' },
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
        w-52 border-r border-slate-700 flex flex-col
      `}>
        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-lg">
              <span className="text-sm">🚀</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Ramton CRM</h1>
              <p className="text-blue-100 text-xs">İdarəetmə Paneli</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
          {/* Main Sections */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">Əsas Bölmələr</h3>
            <ul className="space-y-0">
              {menuItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                        }
                      `}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-slate-700'
                      }`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-xs">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Employee Operations */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">Əməkdaş Əməliyyatları</h3>
            <ul className="space-y-0">
              {menuItems.slice(4, 8).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                        }
                      `}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-slate-700'
                      }`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-xs">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* System */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">Sistem</h3>
            <ul className="space-y-0">
              {menuItems.slice(8).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                        }
                      `}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-slate-700'
                      }`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-xs">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        
        {/* Bottom spacing */}
        <div className="p-1.5 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-center space-x-1.5 mb-0.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Sistem Aktiv</span>
          </div>
          <div className="text-xs text-slate-400 text-center">
            Ramton CRM v2.0
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
  const { user, logout, isLoggingOut } = useAuth();

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
    <header className="bg-white shadow-lg border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center lg:hidden">
              <span className="text-white text-sm lg:text-base font-bold">R</span>
            </div>
            <h2 className="text-base lg:text-lg font-semibold text-gray-800">Ramton CRM Sistemi</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-[9999]">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {user?.first_name?.[0]}{user?.last_name?.[0] || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user?.email || 'admin@ramton.az'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <button
                    onClick={async () => {
                      await logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        <span>Çıxış edilir...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Çıxış Et</span>
                      </>
                    )}
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



// Mobile Footer Menu Component
const MobileFooterMenu = () => {
  const location = useLocation();
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around py-3">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === '/' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>
        
        <Link
          to="/sifarisler"
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === '/sifarisler' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs font-medium">Sifarişlər</span>
        </Link>
        
        <Link
          to="/musteriler"
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === '/musteriler' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs font-medium">Müştərilər</span>
        </Link>
        
        <Link
          to="/gunluk-tapshiriqlar"
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === '/gunluk-tapshiriqlar' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-medium">Tapşırıqlar</span>
        </Link>
      </div>
    </div>
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
                    
                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/emekdas-dashboard" element={<EmployeeDashboard />} />
                        <Route path="/problem-izleme" element={<ProblemTracking />} />
                        <Route path="/gunluk-tapshiriqlar" element={<DailyTasks />} />
                        <Route path="/sifarisler" element={<Orders />} />
                        <Route path="/sifaris-statistikasi" element={<OrderStatistics />} />
                        <Route path="/mehsullar" element={<Products />} />
                        <Route path="/kateqoriyalar" element={<Categories />} />
                        <Route path="/kuryerler" element={<Couriers />} />
                        <Route path="/kuryer-hesablasma" element={<CourierSettlement />} />
                        <Route path="/zonalar" element={<Zones />} />
                        <Route path="/musteriler" element={<Customers />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/rollar" element={<Roles />} />
                        <Route path="/bot-monitoring" element={<BotMonitoring />} />
                        <Route path="/hesabatlar" element={<Reports />} />
                        <Route path="/tenzimlemeler" element={<SettingsComponent />} />
                        <Route path="/bildirisler" element={<Notifications />} />
                      </Routes>
                    </main>

                    {/* Mobile Footer Menu */}
                    <MobileFooterMenu />
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