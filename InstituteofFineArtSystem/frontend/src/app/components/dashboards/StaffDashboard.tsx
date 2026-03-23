import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Upload, Trophy, Star, Eye, ChevronRight, Palette, Image, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { exhibitionsApi, ExhibitionDto } from '../../api/exhibitions';
import { usersApi, StaffDto } from '../../api/users';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function StaffDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      competitionsApi.getAll(),
      submissionsApi.getAll(),
      exhibitionsApi.getAll(),
      usersApi.getStaff(),
    ]).then(([comps, subs, exhs, staff]) => {
      setCompetitions(comps);
      setSubmissions(subs);
      setExhibitions(exhs);
      setCurrentStaff(staff.find((s) => s.userId === currentUser?.id) ?? null);
    }).catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const activeCompetitions = competitions.filter((c) => c.status === 'Ongoing');
  const pendingSubmissions = submissions.filter((s) => !s.review);
  const gradedSubmissions = submissions.filter((s) => !!s.review);
  const allExhibitionSubs = exhibitions.flatMap((e) => e.submissions);
  const artworksInExhibition = allExhibitionSubs.filter((es) => es.status === 'Available').length;

  const gradingQueue = pendingSubmissions.slice(0, 5);
  const topRatedSubmissions = submissions.filter((s) => s.review?.ratingLevel === 'Best' || s.review?.ratingLevel === 'Better').slice(0, 5);
  const exhibitedIds = new Set(allExhibitionSubs.map((es) => es.submissionId));
  const topWithoutExhibition = topRatedSubmissions.filter((s) => !exhibitedIds.has(s.id)).slice(0, 4);
  const recentSales = allExhibitionSubs.filter((es) => es.status === 'Sold').slice(0, 3).map((es) => ({
    ...es,
    exhibition: exhibitions.find((e) => e.id === es.exhibitionId),
  }));

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Staff Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">
          {currentStaff ? `Welcome, ${currentStaff.fullName}` : 'Evaluate submissions, manage competitions, and track exhibitions'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-slate-600">
              <Calendar className="size-3 sm:size-4" />Active Competitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{activeCompetitions.length}</div>
            <p className="text-xs text-slate-500 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card className={pendingSubmissions.length >= 5 ? 'border-orange-300 bg-orange-50' : ''}>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-slate-600">
              <Upload className="size-3 sm:size-4" />Pending Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl sm:text-3xl font-bold ${pendingSubmissions.length >= 5 ? 'text-orange-700' : ''}`}>
              {pendingSubmissions.length}
            </div>
            <p className={`text-xs mt-1 ${pendingSubmissions.length >= 5 ? 'text-orange-600' : 'text-slate-500'}`}>
              {pendingSubmissions.length >= 5 ? '⚠️ High backlog' : 'Waiting for grading'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-slate-600">
              <Star className="size-3 sm:size-4" />Graded Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{gradedSubmissions.length}</div>
            <p className="text-xs text-slate-500 mt-1">Evaluation completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-slate-600">
              <Image className="size-3 sm:size-4" />Artworks in Exhibition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{artworksInExhibition}</div>
            <p className="text-xs text-slate-500 mt-1">On display/sale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3 sm:pb-4 border-b bg-blue-50">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Palette className="size-5 text-blue-600" />Evaluator's Workspace
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">Submissions assigned to you for grading</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Eye className="size-4" />Grading Queue ({gradingQueue.length})
            </h3>
            {gradingQueue.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {gradingQueue.map((item) => {
                  const comp = competitions.find((c) => c.id === item.competitionId);
                  return (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white border border-blue-100 rounded-lg hover:shadow-md transition-shadow">
                      {item.workUrl && <img src={item.workUrl} alt={item.title} className="size-12 sm:size-14 object-cover rounded" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-slate-600">By {item.studentName}</p>
                        <p className="text-xs text-slate-500 truncate">{comp?.title}</p>
                        <p className="text-xs text-slate-400">{new Date(item.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs whitespace-nowrap" onClick={() => navigate('/dashboard/submissions')}>
                        Grade Now <ChevronRight className="size-3 ml-1" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <Eye className="size-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">All caught up! No submissions waiting for grading.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-3 sm:pb-4 border-b bg-purple-50">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Trophy className="size-5 text-purple-600" />Manager's Workspace
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">Awards, exhibitions, and sales tracking</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Trophy className="size-4 text-yellow-600" />Exhibition Nominations ({topWithoutExhibition.length})
              </h3>
              {topWithoutExhibition.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {topWithoutExhibition.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-24 bg-white border border-green-100 rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/exhibitions')}>
                      {item.workUrl && <img src={item.workUrl} alt={item.title} className="w-full h-20 object-cover rounded mb-1" />}
                      <p className="text-xs font-semibold truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.studentName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2">All top artworks forwarded</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <ShoppingBag className="size-4 text-orange-600" />Recent Sales ({recentSales.length})
              </h3>
              {recentSales.length > 0 ? (
                <div className="space-y-2">
                  {recentSales.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/dashboard/exhibitions/${item.exhibitionId}`)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{item.submissionTitle}</p>
                        <p className="text-xs text-slate-600 truncate">{item.exhibition?.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2">No recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Quick Access</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Shortcuts for frequent actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button onClick={() => navigate('/dashboard/submissions')} className="group p-4 sm:p-6 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <Palette className="size-6 sm:size-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">Enter Evaluation Workspace</h3>
                  <p className="text-xs text-slate-600">Review and grade submissions</p>
                </div>
              </div>
            </button>
            <button onClick={() => navigate('/dashboard/competitions')} className="group p-4 sm:p-6 border-2 border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all hover:shadow-lg">
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-purple-600 rounded-full group-hover:scale-110 transition-transform">
                  <Trophy className="size-6 sm:size-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">Create New Competition</h3>
                  <p className="text-xs text-slate-600">Set up a new art contest</p>
                </div>
              </div>
            </button>
            <button onClick={() => navigate('/dashboard/exhibitions')} className="group p-4 sm:p-6 border-2 border-green-200 bg-green-50 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all hover:shadow-lg">
              <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-green-600 rounded-full group-hover:scale-110 transition-transform">
                  <Image className="size-6 sm:size-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">Select Artworks for Exhibition</h3>
                  <p className="text-xs text-slate-600">Forward best paintings to events</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
