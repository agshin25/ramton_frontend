import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  MapPin
} from 'lucide-react';

// Import components
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-medium">A</span>
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
              <Route path="/hesabatlar" element={<div className="p-6 text-center text-gray-600">Hesabatlar Səhifəsi</div>} />
              <Route path="/tenzimlemeler" element={<SettingsComponent />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 