import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Users,
  Calendar,
  Trophy,
  Upload,
  FileText,
  LayoutDashboard,
  LogOut,
  Palette,
  Home,
  Menu,
  X,
  Bell,
  BarChart3,
  Camera,
  UserCog,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { notificationsApi, type NotificationDto } from '../api/notifications';
import { Badge } from './ui/badge';
import { api } from '../api/client';

export function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const { updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    notificationsApi.getMine()
      .then(setNotifications)
      .catch(() => {});
  }, [currentUser?.id]);

  const openEditProfile = () => navigate('/dashboard/profile');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await api.uploadFile(file);
      updateAvatar(url);
    } catch {
      // silently ignore
    }
  };

  const AvatarDisplay = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
    const cls = size === 'lg'
      ? 'size-12 rounded-full object-cover'
      : 'size-7 sm:size-8 rounded-full object-cover';
    const fallbackCls = size === 'lg'
      ? 'size-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg'
      : 'size-7 sm:size-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs';
    return currentUser?.avatarUrl
      ? <img src={currentUser.avatarUrl} alt="avatar" className={cls} />
      : <div className={fallbackCls}>{currentUser?.fullName?.charAt(0).toUpperCase()}</div>;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getNavigationItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Manage Staff', path: '/dashboard/staff', icon: Users },
          { label: 'Manage Students', path: '/dashboard/students', icon: Users },
        ];
      case 'staff':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'View Students', path: '/dashboard/view-students', icon: Users },
          { label: 'Competitions', path: '/dashboard/competitions', icon: Calendar },
          { label: 'Submissions', path: '/dashboard/submissions', icon: Upload },
          { label: 'Awards', path: '/dashboard/awards', icon: Trophy },
          { label: 'Exhibitions', path: '/dashboard/exhibitions', icon: FileText },
        ];
      case 'student':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Competitions', path: '/dashboard/view-competitions', icon: Calendar },
          { label: 'My Portfolio', path: '/dashboard/my-submissions', icon: Upload },
          { label: 'My Awards', path: '/dashboard/my-awards', icon: Trophy },
        ];
      case 'manager':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Statistics & Reports', path: '/dashboard/statistics', icon: BarChart3 },
          { label: 'Competitions', path: '/dashboard/view-competitions', icon: Calendar },
          { label: 'Awards', path: '/dashboard/awards', icon: Trophy },
          { label: 'Submissions', path: '/dashboard/submissions', icon: Upload },
          { label: 'Exhibitions', path: '/dashboard/exhibitions', icon: FileText },
        ];
      case 'customer':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Browse Exhibitions', path: '/exhibitions', icon: FileText },
          { label: 'Home Gallery', path: '/', icon: Home },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: NotificationDto) => {
    notificationsApi.markRead(notification.id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllAsRead = () => {
    notificationsApi.markAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'award':       return <Trophy className="size-4 text-yellow-600" />;
      case 'submission':  return <Upload className="size-4 text-blue-600" />;
      case 'competition': return <Calendar className="size-4 text-purple-600" />;
      case 'exhibition':  return <FileText className="size-4 text-green-600" />;
      case 'purchase':    return <span className="size-4 text-emerald-600">💰</span>;
      case 'announcement':return <Bell className="size-4 text-orange-600" />;
      default:            return <Bell className="size-4 text-slate-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Palette className="size-5 sm:size-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base sm:text-lg">Art Competition System</h1>
                <p className="text-xs text-slate-600 capitalize">{currentUser?.role} Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  <Home className="size-4 mr-2" />
                  Home
                </Button>
              </Link>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="size-4 sm:size-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] bg-red-600 text-white border-2 border-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-[500px] overflow-hidden flex flex-col">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs text-blue-600 hover:text-blue-700"
                        onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="overflow-y-auto max-h-[400px]">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center text-slate-500">
                        <Bell className="size-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="mt-0.5 shrink-0">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && <div className="size-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-1">{notification.message}</p>
                            <p className="text-xs text-slate-400">{formatTimestamp(notification.timestamp)}</p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm gap-2 pl-1 pr-3">
                    <AvatarDisplay size="sm" />
                    <span className="hidden sm:inline">{currentUser?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  {/* Profile info */}
                  <div className="px-3 py-3 flex items-center gap-3">
                    <div className="relative group cursor-pointer shrink-0" onClick={() => avatarInputRef.current?.click()}>
                      {currentUser?.avatarUrl
                        ? <img src={currentUser.avatarUrl} alt="avatar" className="size-12 rounded-full object-cover" />
                        : <div className="size-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {currentUser?.fullName?.charAt(0).toUpperCase()}
                          </div>
                      }
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="size-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{currentUser?.fullName}</p>
                      <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
                      <button className="text-xs text-blue-600 hover:underline mt-0.5" onClick={() => avatarInputRef.current?.click()}>
                        Change photo
                      </button>
                    </div>
                  </div>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <DropdownMenuSeparator />
                  {/* Role-based nav items */}
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} className="cursor-pointer gap-2" onClick={() => navigate(item.path)}>
                        <Icon className="size-4 text-slate-500" />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2" onClick={openEditProfile}>
                    <UserCog className="size-4 text-slate-500" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
        )}

        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:top-[73px] lg:h-[calc(100vh-73px)]
        `}>
          <div className="flex flex-col h-full">
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Palette className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">Art Competition</h2>
                  <p className="text-xs text-slate-600 capitalize">{currentUser?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeSidebar}>
                <X className="size-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path} onClick={closeSidebar}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-slate-100">
                        <Icon className="size-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-t space-y-1">
              <Link to="/dashboard/profile" onClick={closeSidebar}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-11 hover:bg-slate-100">
                  <UserCog className="size-5" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </Button>
              </Link>
              <Link to="/" onClick={closeSidebar}>
                <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                  <Home className="size-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <Outlet />
        </main>
      </div>

      {/* Edit Profile Dialog */}
    </div>
  );
}
