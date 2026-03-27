import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import svgPaths from '../../imports/svg-dh8fahrk4q';
import { Trophy, Users, Upload, FileText, Calendar, ArrowRight, LayoutDashboard, LogOut, BarChart3, UserCog, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState, useEffect, useMemo } from 'react';
import { competitionsApi, CompetitionDto } from '../api/competitions';
import { submissionsApi, SubmissionDto } from '../api/submissions';
import { awardsApi, StudentAwardDto } from '../api/awards';
import { notificationsApi, NotificationDto } from '../api/notifications';

export function HomePage() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [studentAwards, setStudentAwards] = useState<StudentAwardDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);

  useEffect(() => {
    competitionsApi.getAll().then((r) => setCompetitions(r ?? [])).catch(() => {});
    submissionsApi.getAll().then((r) => setSubmissions(r ?? [])).catch(() => {});
    awardsApi.getStudentAwards().then((r) => setStudentAwards(r ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi.getMine().then((r) => setNotifications(r ?? [])).catch(() => {});
    }
  }, [isAuthenticated]);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return [...notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications, currentUser]);

  const unreadCount = useMemo(() => userNotifications.filter((n) => !n.isRead).length, [userNotifications]);

  const handleNotificationClick = async (notification: NotificationDto) => {
    await notificationsApi.markRead(notification.id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'award':       return <Trophy className="size-4 text-yellow-600" />;
      case 'submission':  return <Upload className="size-4 text-blue-600" />;
      case 'competition': return <Calendar className="size-4 text-purple-600" />;
      case 'exhibition':  return <FileText className="size-4 text-green-600" />;
      case 'purchase':    return <span className="text-emerald-600 text-sm">💰</span>;
      default:            return <Bell className="size-4 text-slate-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const totalContests = competitions.length;
  const totalSubmissions = submissions.length;
  const totalAwards = studentAwards.length;
  // totalStudents: unique studentIds from submissions
  const totalStudents = new Set(submissions.map((s) => s.studentId)).size;

  const ongoingCompetitions = competitions.filter((c) => c.status === 'Ongoing');
  const upcomingCompetitions = competitions.filter((c) => c.status === 'Upcoming');

  // Recent winners: last 6 student awards
  const recentWinners = studentAwards.slice(0, 6).map((award) => {
    const submission = submissions.find((s) => s.id === award.submissionId);
    const competition = competitions.find((c) => c.title === award.competitionTitle);
    return { award, submission, competition };
  }).filter(({ submission }) => submission);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ongoing':   return 'bg-[#030213] text-white';
      case 'Upcoming':  return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAuthAction = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const getRoleMenuItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Manage Staff', path: '/dashboard/staff', icon: Users },
          { label: 'Manage Students', path: '/dashboard/students', icon: Users },
          { label: 'Manage Customers', path: '/dashboard/customers', icon: Users },
          { label: 'Admins & Managers', path: '/dashboard/admin-users', icon: Users },
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
          { label: 'My Submissions', path: '/dashboard/my-submissions', icon: Upload },
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
        ];
      default:
        return [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }];
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[rgba(0,0,0,0.1)] bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px] py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 sm:size-10 rounded-[10px] bg-gradient-to-br from-[#9810fa] to-[#155dfc] p-2">
                <div className="size-4 sm:size-6 relative">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.992 22">
                    <path d={svgPaths.p333cc080} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-[#0a0a0a]">Institute of Fine Arts</h1>
                <p className="text-xs text-[#4a5565]">Fine Arts Institute</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <Link to="/" className="hidden md:block text-sm text-[#0a0a0a] hover:text-[#9810fa]">Home</Link>
              <Link to="/exhibitions" className="hidden md:block text-sm text-[#0a0a0a] hover:text-[#9810fa]">Exhibitions</Link>
              {isAuthenticated && currentUser ? (
                <>
                  {/* Notification Bell */}
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
                          <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-blue-600"
                            onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}>
                            Mark all as read
                          </Button>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="overflow-y-auto max-h-[400px]">
                        {userNotifications.length === 0 ? (
                          <div className="py-8 px-4 text-center text-slate-500">
                            <Bell className="size-12 mx-auto mb-2 text-slate-300" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          userNotifications.map((n) => (
                            <DropdownMenuItem
                              key={n.id}
                              className={`flex items-start gap-3 p-3 cursor-pointer ${!n.isRead ? 'bg-blue-50' : ''}`}
                              onClick={() => handleNotificationClick(n)}
                            >
                              <div className="mt-0.5 shrink-0">{getNotificationIcon(n.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className={`text-sm font-medium ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                                  {!n.isRead && <div className="size-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 mb-1">{n.message}</p>
                                <p className="text-xs text-slate-400">{formatTimestamp(n.timestamp)}</p>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.12)] px-2 sm:px-3 h-8 sm:h-9 hover:bg-gray-50 transition-colors">
                        {currentUser.avatarUrl ? (
                          <img src={currentUser.avatarUrl} alt="avatar" className="size-6 rounded-full object-cover" />
                        ) : (
                          <div className="size-6 rounded-full bg-gradient-to-br from-[#9810fa] to-[#155dfc] flex items-center justify-center text-white font-bold text-[10px]">
                            {currentUser.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="hidden sm:inline text-xs sm:text-sm font-medium text-[#0a0a0a]">
                          {currentUser.fullName}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{currentUser.fullName}</span>
                          <span className="text-xs text-slate-500 capitalize font-normal">{currentUser.role}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {getRoleMenuItems().map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem key={item.path} className="cursor-pointer gap-2" onClick={() => navigate(item.path)}>
                            <Icon className="size-4 text-slate-500" />
                            {item.label}
                          </DropdownMenuItem>
                        );
                      })}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => navigate('/dashboard/profile')}>
                        <UserCog className="size-4 text-slate-500" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600" onClick={() => logout()}>
                        <LogOut className="size-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button onClick={handleAuthAction} className="bg-[#030213] text-white rounded-lg px-3 sm:px-4 h-7 sm:h-8 text-xs sm:text-sm hover:bg-[#030213]/90">
                    Login
                  </Button>
                  <Link to="/register">
                    <Button variant="outline" className="border-[#030213] text-[#030213] rounded-lg px-3 sm:px-4 h-7 sm:h-8 text-xs sm:text-sm hover:bg-[#030213]/10">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] py-10 sm:py-16 md:py-20">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-4 sm:mb-6 md:mb-7 leading-tight">
              Welcome to the Institute of Fine Arts
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#f3e8ff] mb-8 sm:mb-10 md:mb-12 leading-relaxed">
              Specialized training in painting, design, and animation. Discover your talent and develop your art with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={handleAuthAction} className="bg-[#eceef2] text-[#030213] rounded-lg px-6 h-10 sm:h-10 hover:bg-[#eceef2]/90 font-medium w-full sm:w-auto">
                Join Now
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/exhibitions')} className="bg-[rgba(255,255,255,0.1)] text-white rounded-lg px-6 h-10 sm:h-10 border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.15)] w-full sm:w-auto">
                View Exhibition
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 sm:p-6">
              <div className="bg-[#f3e8ff] rounded-[10px] p-2 w-fit mb-3 sm:mb-4">
                <FileText className="size-5 sm:size-6 text-[#9810fa]" />
              </div>
              <p className="text-[#717182] text-sm sm:text-base mb-1">Contests</p>
              <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">{totalContests}</p>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 sm:p-6">
              <div className="bg-[#dbeafe] rounded-[10px] p-2 w-fit mb-3 sm:mb-4">
                <Users className="size-5 sm:size-6 text-[#155dfc]" />
              </div>
              <p className="text-[#717182] text-sm sm:text-base mb-1">Students</p>
              <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">{totalStudents}</p>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 sm:p-6">
              <div className="bg-[#dcfce7] rounded-[10px] p-2 w-fit mb-3 sm:mb-4">
                <Upload className="size-5 sm:size-6 text-[#00a63e]" />
              </div>
              <p className="text-[#717182] text-sm sm:text-base mb-1">Submissions</p>
              <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">{totalSubmissions}</p>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 sm:p-6">
              <div className="bg-[#ffedd4] rounded-[10px] p-2 w-fit mb-3 sm:mb-4">
                <Trophy className="size-5 sm:size-6 text-[#f54900]" />
              </div>
              <p className="text-[#717182] text-sm sm:text-base mb-1">Awards</p>
              <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">{totalAwards}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Competitions */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] mb-2">Ongoing Competitions</h3>
            <p className="text-sm sm:text-base text-[#4a5565]">Join now and submit your best artwork</p>
          </div>
          {ongoingCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {ongoingCompetitions.map((competition) => {
                const submissionCount = submissions.filter((s) => s.competitionId === competition.id).length;
                const daysLeft = Math.ceil((new Date(competition.endDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={competition.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-36 sm:h-44 bg-gradient-to-br from-purple-200 to-blue-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500')] bg-cover bg-center opacity-60" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-600 text-white rounded-lg px-3 py-1 text-xs font-medium">🔴 Live Now</Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <h4 className="text-base sm:text-lg font-medium text-[#0a0a0a] flex-1 pr-2">{competition.title}</h4>
                        <Badge className={`${getStatusBadgeClass(competition.status)} rounded-lg px-2 sm:px-3 py-1 text-xs font-medium shrink-0`}>Ongoing</Badge>
                      </div>
                      <p className="text-sm sm:text-base text-[#717182] mb-4 sm:mb-6 line-clamp-2">{competition.description}</p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-green-900">Total Submissions</span>
                          <span className="text-lg font-bold text-green-700">{submissionCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <Upload className="size-3" />
                          <span>Accepting submissions now</span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 sm:mb-6">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-[#4a5565]">Start Date:</span>
                          <span className="text-[#0a0a0a] font-medium">{new Date(competition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-[#4a5565]">Deadline:</span>
                          <span className="text-red-600 font-bold">{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                        </div>
                      </div>
                      <Button onClick={() => navigate(isAuthenticated ? `/competitions/${competition.id}` : '/login')} className="w-full bg-[#030213] text-white rounded-lg h-8 sm:h-9 text-sm hover:bg-[#030213]/90">
                        Submit Artwork
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No ongoing competitions at the moment. Check upcoming competitions below!</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Competitions */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] mb-2">Upcoming Competitions</h3>
            <p className="text-sm sm:text-base text-[#4a5565]">Get ready for these exciting competitions</p>
          </div>
          {upcomingCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {upcomingCompetitions.map((competition) => {
                const daysUntilStart = Math.ceil((new Date(competition.startDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={competition.id} className="bg-white border-2 border-blue-200 rounded-[14px] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-5 text-white" />
                          <span className="text-white font-medium text-sm">Coming Soon</span>
                        </div>
                        <Badge className="bg-white text-blue-700 rounded-lg px-3 py-1 text-xs font-bold">
                          Starts in {daysUntilStart} days
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h4 className="text-lg sm:text-xl font-medium text-[#0a0a0a] mb-2">{competition.title}</h4>
                      <p className="text-sm text-[#717182] mb-4 line-clamp-3">{competition.description}</p>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-blue-600 font-medium block mb-1">Start Date</span>
                            <span className="text-blue-900 font-semibold">{new Date(competition.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium block mb-1">End Date</span>
                            <span className="text-blue-900 font-semibold">{new Date(competition.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => navigate('/login')} variant="outline" className="w-full border-blue-600 text-blue-700 rounded-lg h-9 text-sm hover:bg-blue-50">
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No upcoming competitions scheduled yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* Award-Winning Students */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Trophy className="size-6 sm:size-8 text-yellow-600" />
            <div>
              <h3 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a]">Award-Winning Students</h3>
              <p className="text-sm sm:text-base text-[#4a5565]">Celebrating talents of our students</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentWinners.map(({ award, submission, competition }) => {
              if (!submission) return null;
              return (
                <div
                  key={award.id}
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/artworks/${submission.id}`)}
                >
                  <div className="h-36 sm:h-44 bg-gray-200 relative overflow-hidden">
                    {submission.workUrl && (
                      <img src={submission.workUrl} alt={submission.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base sm:text-lg font-medium text-[#0a0a0a]">{award.studentName ?? submission.studentName}</h4>
                      <Badge className="bg-yellow-100 text-yellow-700 rounded-lg px-2 sm:px-3 py-1 text-xs font-medium">
                        {award.awardName?.includes('1st') ? '1st Prize' : award.awardName?.includes('2nd') ? '2nd Prize' : '3rd Prize'}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-[#717182] mb-1">{submission.title}</p>
                    <p className="text-xs text-[#4a5565] mb-3 sm:mb-4">{competition?.title ?? award.competitionTitle}</p>
                    <div className="pt-3 sm:pt-4 border-t border-[rgba(0,0,0,0.1)]">
                      <p className="text-xs text-[#4a5565]">
                        {new Date(award.awardedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#9810fa] to-[#155dfc]">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px] text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-3 sm:mb-4">Ready to Join Us?</h3>
          <p className="text-base sm:text-lg md:text-xl text-[#f3e8ff] mb-6 sm:mb-8">
            Sign up to join contests, view results, and manage your artworks.
          </p>
          <Button onClick={handleAuthAction} className="bg-white text-[#9810fa] rounded-lg px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-medium hover:bg-white/90 w-full sm:w-auto">
            {isAuthenticated ? 'Go to Dashboard' : 'Sign Up Now'}
            <ArrowRight className="ml-2 size-4 sm:size-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-8 sm:py-12">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Institute of Fine Arts</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Specialized training institution for fine arts and digital media.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/exhibitions" className="text-gray-400 hover:text-white">Exhibitions</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Contact</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>Email: contact@ifa.edu</li>
                <li>Phone: +1 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
            © 2026 Institute of Fine Arts. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
