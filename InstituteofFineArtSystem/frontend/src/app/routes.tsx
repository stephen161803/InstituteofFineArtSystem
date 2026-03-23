import { createBrowserRouter, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ExhibitionPage } from './components/ExhibitionPage';
import { ExhibitionArtworksPage } from './components/pages/ExhibitionArtworksPage';
import { PurchaseForm } from './components/pages/PurchaseForm';
import { DashboardLayout } from './components/DashboardLayout';
import { AdministratorDashboard } from './components/dashboards/AdministratorDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ManagerDashboard } from './components/dashboards/ManagerDashboard';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { ManageStaff } from './components/pages/ManageStaff';
import { ManageStudents } from './components/pages/ManageStudents';
import { ManageCompetitions } from './components/pages/ManageCompetitions';
import { ManageSubmissions } from './components/pages/ManageSubmissions';
import { ManageAwards } from './components/pages/ManageAwards';
import { ManageExhibitions } from './components/pages/ManageExhibitions';
import { ExhibitionDetail } from './components/pages/ExhibitionDetail';
import { StudentSubmissions } from './components/pages/StudentSubmissions';
import { ViewCompetitions } from './components/pages/ViewCompetitions';
import { StudentCompetitionDetail } from './components/pages/StudentCompetitionDetail';
import { StatisticsReport } from './components/pages/StatisticsReport';
import { ViewStudents } from './components/pages/ViewStudents';
import { ArtworkDetail } from './components/pages/ArtworkDetail';
import { EditProfilePage } from './components/pages/EditProfilePage';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { awardsApi, StudentAwardDto } from './api/awards';
import { toast } from 'sonner';

// Simple protected route wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const storedUser = localStorage.getItem('currentUser');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and user's role is not in the list, show access denied
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <svg className="size-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700 mb-4">
            You do not have permission to access this page.
          </p>
          <p className="text-sm text-red-600 mb-6">
            This page is restricted to <strong>{allowedRoles.join(', ')}</strong> only.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/exhibitions',
    element: <ExhibitionPage />,
  },
  {
    path: '/exhibitions/:id',
    element: <ExhibitionArtworksPage />,
  },
  {
    path: '/purchase/:artworkId',
    element: <PurchaseForm />,
  },
  {
    path: '/artworks/:id',
    element: <ArtworkDetail />,
  },
  {
    path: '/competitions/:id',
    element: <StudentCompetitionDetail />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardRouter />,
      },
      // Administrator routes
      {
        path: 'staff',
        element: <ProtectedRoute allowedRoles={['admin']}><ManageStaff /></ProtectedRoute>,
      },
      {
        path: 'students',
        element: <ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>,
      },
      // Staff routes
      {
        path: 'competitions',
        element: <ManageCompetitions />,
      },
      {
        path: 'submissions',
        element: <ManageSubmissions />,
      },
      {
        path: 'awards',
        element: <ManageAwards />,
      },
      {
        path: 'exhibitions',
        element: <ManageExhibitions />,
      },
      {
        path: 'exhibitions/:id',
        element: <ExhibitionDetail />,
      },
      {
        path: 'view-students',
        element: <ProtectedRoute allowedRoles={['staff']}><ViewStudents /></ProtectedRoute>,
      },
      // Student routes
      {
        path: 'my-submissions',
        element: <StudentSubmissions />,
      },
      {
        path: 'my-awards',
        element: <StudentAwardsView />,
      },
      {
        path: 'view-competitions',
        element: <ViewCompetitions />,
      },
      {
        path: 'competitions/:id',
        element: <StudentCompetitionDetail />,
      },
      // Manager routes
      {
        path: 'statistics',
        element: <ProtectedRoute allowedRoles={['manager']}><StatisticsReport /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <EditProfilePage />,
      },
      {
        path: 'users',
        element: <ProtectedRoute allowedRoles={['administrator']}><ManagerUsersView /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// Dashboard router component to show the correct dashboard based on role
function DashboardRouter() {
  // Get user from localStorage
  const storedUser = localStorage.getItem('currentUser');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdministratorDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// Student Awards View
function StudentAwardsView() {
  const storedUser = localStorage.getItem('currentUser');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const [myAwards, setMyAwards] = useState<StudentAwardDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    awardsApi.getStudentAwards({ studentId: currentUser.id })
      .then(setMyAwards)
      .catch(() => toast.error('Failed to load awards'))
      .finally(() => setLoading(false));
  }, []);

  const awardIcons: Record<string, string> = {
    'First Prize':       '🥇',
    'Second Prize':      '🥈',
    'Third Prize':       '🥉',
    'Honorable Mention': '🏅',
  };

  const awardColors: Record<string, string> = {
    'First Prize':       'border-yellow-500 bg-yellow-50',
    'Second Prize':      'border-slate-400 bg-slate-50',
    'Third Prize':       'border-orange-400 bg-orange-50',
    'Honorable Mention': 'border-purple-400 bg-purple-50',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Awards</h1>
        <p className="text-slate-600">Your competition wins and recognitions</p>
      </div>

      {myAwards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="size-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="font-semibold mb-2">No Awards Yet</h3>
            <p className="text-slate-600">Keep participating in competitions to earn awards!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['First Prize', 'Second Prize', 'Third Prize', 'Honorable Mention'].map((name) => {
              const count = myAwards.filter((a) => a.awardName === name).length;
              return (
                <Card key={name}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-1">{awardIcons[name] ?? '🏆'}</div>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-slate-600 mt-1">{name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-600" />
                All Awards ({myAwards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAwards.map((award) => (
                  <div
                    key={award.id}
                    className={`border-l-4 pl-4 py-3 rounded-r-lg ${awardColors[award.awardName ?? ''] ?? 'border-slate-300 bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{awardIcons[award.awardName ?? ''] ?? '🏆'}</span>
                      <h4 className="font-semibold">{award.awardName}</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{award.competitionTitle}</p>
                    {award.awardedDate && (
                      <p className="text-xs text-slate-500">
                        Awarded: {new Date(award.awardedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Manager Users View
function ManagerUsersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff & Students</h1>
        <p className="text-slate-600">View all users in the system</p>
      </div>
      <div className="space-y-6">
        <ManageStaff />
        <ManageStudents />
      </div>
    </div>
  );
}