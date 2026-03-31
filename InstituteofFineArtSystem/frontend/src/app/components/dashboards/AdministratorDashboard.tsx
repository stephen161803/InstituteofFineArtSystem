import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCog, Loader2, ArrowRight } from 'lucide-react';
import { usersApi } from '../../api/users';
import { toast } from 'sonner';

export function AdministratorDashboard() {
  const [staffCount, setStaffCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([usersApi.getStaff(), usersApi.getStudents()])
      .then(([staff, students]) => {
        setStaffCount(staff.length);
        setStudentCount(students.length);
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Administrator Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage staff and student records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UserCog className="size-4 sm:size-5" />Total Staff
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Registered staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">{staffCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="size-4 sm:size-5" />Total Students
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">{studentCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/staff')}
              className="text-left p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors group w-full"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm sm:text-base">Manage Staff</h3>
                <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Add, update, or remove staff members and their details</p>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/students')}
              className="text-left p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors group w-full"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm sm:text-base">Manage Students</h3>
                <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Add, update, or remove student records and admission details</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
