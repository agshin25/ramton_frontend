import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  Filter,
  Search,
  Download,
  Upload,
  Clock,
  User,
  Settings
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Yeni Sifariş Bildirişi',
      message: 'iPhone 15 Pro sifarişi qəbul edildi',
      type: 'order',
      priority: 'high',
      status: 'sent',
      recipients: ['Əli Məmmədov', 'Rəşad Əhmədov'],
      channels: ['whatsapp', 'sms'],
      createdAt: '2024-01-15 10:30:00',
      sentAt: '2024-01-15 10:31:00',
      readBy: ['Əli Məmmədov']
    },
    {
      id: 2,
      title: 'Kuryer Təyin Edildi',
      message: 'Rəşad Əhmədov sifariş #12345 üçün təyin edildi',
      type: 'courier',
      priority: 'medium',
      status: 'sent',
      recipients: ['Rəşad Əhmədov'],
      channels: ['whatsapp'],
      createdAt: '2024-01-15 11:00:00',
      sentAt: '2024-01-15 11:01:00',
      readBy: ['Rəşad Əhmədov']
    },
    {
      id: 3,
      title: 'Sifariş Tamamlandı',
      message: 'Sifariş #12346 uğurla tamamlandı',
      type: 'completion',
      priority: 'low',
      status: 'sent',
      recipients: ['Aysu Hüseynova'],
      channels: ['whatsapp', 'email'],
      createdAt: '2024-01-15 12:00:00',
      sentAt: '2024-01-15 12:01:00',
      readBy: []
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'order',
    priority: 'medium',
    recipients: [],
    channels: ['whatsapp']
  });

  const [bulkNotification, setBulkNotification] = useState({
    title: '',
    message: '',
    type: 'order',
    priority: 'medium',
    recipientGroups: [],
    channels: ['whatsapp'],
    scheduleTime: ''
  });

  // Sample data
  const recipients = [
    { id: 1, name: 'Əli Məmmədov', phone: '+994 50 123 45 67', email: 'ali@example.com', group: 'employees' },
    { id: 2, name: 'Aysu Hüseynova', phone: '+994 55 987 65 43', email: 'aysu@example.com', group: 'employees' },
    { id: 3, name: 'Rəşad Əhmədov', phone: '+994 60 321 54 67', email: 'rashad@example.com', group: 'couriers' },
    { id: 4, name: 'Elşən Məmmədov', phone: '+994 51 456 78 90', email: 'elshen@example.com', group: 'couriers' },
    { id: 5, name: 'Orxan Əliyev', phone: '+994 70 789 12 34', email: 'orkhan@example.com', group: 'couriers' }
  ];

  const recipientGroups = [
    { id: 'all', name: 'Hamısı', count: recipients.length },
    { id: 'employees', name: 'Əməkdaşlar', count: recipients.filter(r => r.group === 'employees').length },
    { id: 'couriers', name: 'Kuryerlər', count: recipients.filter(r => r.group === 'couriers').length },
    { id: 'customers', name: 'Müştərilər', count: 150 },
    { id: 'admins', name: 'Administratorlar', count: 5 }
  ];

  const notificationTypes = [
    { id: 'order', name: 'Sifariş', icon: '📦' },
    { id: 'courier', name: 'Kuryer', icon: '🚚' },
    { id: 'completion', name: 'Tamamlanma', icon: '✅' },
    { id: 'cancellation', name: 'Ləğv', icon: '❌' },
    { id: 'reminder', name: 'Xatırlatma', icon: '⏰' },
    { id: 'announcement', name: 'Elan', icon: '📢' }
  ];

  const channels = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { id: 'sms', name: 'SMS', icon: '📱' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'push', name: 'Push Bildiriş', icon: '🔔' }
  ];

  const priorities = [
    { id: 'low', name: 'Aşağı', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Yüksək', color: 'bg-red-100 text-red-800' }
  ];

  const getTypeIcon = (type) => {
    const found = notificationTypes.find(t => t.id === type);
    return found ? found.icon : '📢';
  };

  const getPriorityColor = (priority) => {
    const found = priorities.find(p => p.id === priority);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  };

  const getChannelIcon = (channel) => {
    const found = channels.find(c => c.id === channel);
    return found ? found.icon : '📢';
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleCreateNotification = () => {
    const notification = {
      id: Date.now(),
      ...newNotification,
      status: 'sent',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      readBy: []
    };
    
    setNotifications([...notifications, notification]);
    setNewNotification({
      title: '',
      message: '',
      type: 'order',
      priority: 'medium',
      recipients: [],
      channels: ['whatsapp']
    });
    setShowCreateModal(false);
  };

  const handleBulkNotification = () => {
    const selectedRecipients = bulkNotification.recipientGroups.flatMap(groupId => {
      if (groupId === 'all') return recipients;
      if (groupId === 'customers') return Array.from({ length: 150 }, (_, i) => ({ id: `customer-${i}`, name: `Müştəri ${i + 1}` }));
      return recipients.filter(r => r.group === groupId);
    });

    const notification = {
      id: Date.now(),
      title: bulkNotification.title,
      message: bulkNotification.message,
      type: bulkNotification.type,
      priority: bulkNotification.priority,
      status: 'sent',
      recipients: selectedRecipients.map(r => r.name),
      channels: bulkNotification.channels,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      readBy: [],
      isBulk: true,
      recipientCount: selectedRecipients.length
    };
    
    setNotifications([...notifications, notification]);
    setBulkNotification({
      title: '',
      message: '',
      type: 'order',
      priority: 'medium',
      recipientGroups: [],
      channels: ['whatsapp'],
      scheduleTime: ''
    });
    setShowBulkModal(false);
  };

  const handleDeleteNotification = () => {
    if (selectedNotification) {
      setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
      setShowDeleteModal(false);
      setSelectedNotification(null);
    }
  };

  const openViewModal = (notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  const openEditModal = (notification) => {
    setSelectedNotification(notification);
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      recipients: notification.recipients,
      channels: notification.channels
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bildiriş İdarəetməsi
        </h1>
        <p className="text-gray-600 text-lg">Fərdi və toplu bildirişlər göndərmək üçün sistem</p>
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-white rounded-2xl mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">Bildiriş Əməliyyatları</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Fərdi Bildiriş
              </button>
              <button 
                onClick={() => setShowBulkModal(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Toplu Bildiriş
              </button>
            </div>
          </div>
        </div>

        {/* Axtarış və Filtrlər */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Bildiriş axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Növlər</option>
              {notificationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="sent">Göndərildi</option>
              <option value="pending">Gözləmədə</option>
              <option value="failed">Uğursuz</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">Bütün Prioritetlər</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bildiriş Siyahısı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-2xl transition-all duration-300 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-500">{notification.createdAt}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notification.priority)}`}>
                  {priorities.find(p => p.id === notification.priority)?.name}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{notification.message}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {notification.recipients.length} alıcı
                    {notification.isBulk && ` (${notification.recipientCount} ümumi)`}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <div className="flex space-x-1">
                    {notification.channels.map((channel) => (
                      <span key={channel} className="text-sm">
                        {getChannelIcon(channel)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {notification.readBy.length} oxundu
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => openViewModal(notification)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Bax</span>
                </button>
                <button 
                  onClick={() => openEditModal(notification)}
                  className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Redaktə</span>
                </button>
                <button 
                  onClick={() => openDeleteModal(notification)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fərdi Bildiriş Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Yeni Bildiriş</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bildiriş başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Bildiriş mesajı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Növ</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {notificationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritet</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alıcılar</label>
                  <select
                    multiple
                    value={newNotification.recipients}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setNewNotification({...newNotification, recipients: selected});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.name}>
                        {recipient.name} - {recipient.group}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kanallar</label>
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <label key={channel.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newNotification.channels.includes(channel.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewNotification({
                                ...newNotification,
                                channels: [...newNotification.channels, channel.id]
                              });
                            } else {
                              setNewNotification({
                                ...newNotification,
                                channels: newNotification.channels.filter(c => c !== channel.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {channel.icon} {channel.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message || newNotification.recipients.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Göndər
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toplu Bildiriş Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Toplu Bildiriş</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq</label>
                  <input
                    type="text"
                    value={bulkNotification.title}
                    onChange={(e) => setBulkNotification({...bulkNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bildiriş başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                  <textarea
                    value={bulkNotification.message}
                    onChange={(e) => setBulkNotification({...bulkNotification, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Bildiriş mesajı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alıcı Qrupları</label>
                  <div className="space-y-2">
                    {recipientGroups.map((group) => (
                      <label key={group.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bulkNotification.recipientGroups.includes(group.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkNotification({
                                ...bulkNotification,
                                recipientGroups: [...bulkNotification.recipientGroups, group.id]
                              });
                            } else {
                              setBulkNotification({
                                ...bulkNotification,
                                recipientGroups: bulkNotification.recipientGroups.filter(g => g !== group.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {group.name} ({group.count} nəfər)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kanallar</label>
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <label key={channel.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bulkNotification.channels.includes(channel.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkNotification({
                                ...bulkNotification,
                                channels: [...bulkNotification.channels, channel.id]
                              });
                            } else {
                              setBulkNotification({
                                ...bulkNotification,
                                channels: bulkNotification.channels.filter(c => c !== channel.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {channel.icon} {channel.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Göndərilmə Vaxtı (İstəyə görə)</label>
                  <input
                    type="datetime-local"
                    value={bulkNotification.scheduleTime}
                    onChange={(e) => setBulkNotification({...bulkNotification, scheduleTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleBulkNotification}
                disabled={!bulkNotification.title || !bulkNotification.message || bulkNotification.recipientGroups.length === 0}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Toplu Göndər
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Bildiriş Detalları</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">{selectedNotification.title}</h4>
                  <p className="text-blue-700">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Növ:</span>
                    <p className="font-medium">{getTypeIcon(selectedNotification.type)} {notificationTypes.find(t => t.id === selectedNotification.type)?.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Prioritet:</span>
                    <p className="font-medium">{priorities.find(p => p.id === selectedNotification.priority)?.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-medium capitalize">{selectedNotification.status}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Göndərilmə:</span>
                    <p className="font-medium">{selectedNotification.sentAt}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Alıcılar ({selectedNotification.recipients.length})</h5>
                  <div className="space-y-1">
                    {selectedNotification.recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{recipient}</span>
                        {selectedNotification.readBy.includes(recipient) && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Kanallar</h5>
                  <div className="flex space-x-2">
                    {selectedNotification.channels.map((channel) => (
                      <span key={channel} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {getChannelIcon(channel)} {channels.find(c => c.id === channel)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                  openEditModal(selectedNotification);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Redaktə Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Bildirişi silmək istədiyinizə əminsiniz?</h4>
              <p className="text-gray-600">{selectedNotification.title}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleDeleteNotification}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 