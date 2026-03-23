import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, Trophy, Upload, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { usersApi, StaffDto, StudentDto } from '../../api/users';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, AwardDto } from '../../api/awards';
import { exhibitionsApi, ExhibitionDto } from '../../api/exhibitions';
import { toast } from 'sonner';

export function ManagerDashboard() {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [awards, setAwards] = useState<AwardDto[]>([]);
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getStaff(),
      usersApi.getStudents(),
      competitionsApi.getAll(),
      submissionsApi.getAll(),
      awardsApi.getAwards(),
      exhibitionsApi.getAll(),
    ]).then(([s, st, c, sub, aw, ex]) => {
      setStaff(s); setStudents(st); setCompetitions(c);
      setSubmissions(sub); setAwards(aw); setExhibitions(ex);
    }).catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const ratedSubmissions = submissions.filter((s) => s.review).length;
  const allExhibitionSubs = exhibitions.flatMap((e) => e.submissions);
  const soldPaintings = allExhibitionSubs.filter((es) => es.status === 'Sold').length;

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Manager Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">Overview of all system activities and statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Users className="size-3 sm:size-4" />Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{staff.length}</div>
            <p className="text-xs text-slate-600 mt-1">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Users className="size-3 sm:size-4" />Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{students.length}</div>
            <p className="text-xs text-slate-600 mt-1">Enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Calendar className="size-3 sm:size-4" />Competitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{competitions.length}</div>
            <p className="text-xs text-slate-600 mt-1">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Trophy className="size-3 sm:size-4" />Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{awards.length}</div>
            <p className="text-xs text-slate-600 mt-1">Issued</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Upload className="size-4 sm:size-5" />Submission Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Total Submissions</span>
              <span className="font-bold text-base sm:text-lg">{submissions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Reviewed</span>
              <span className="font-bold text-base sm:text-lg text-green-600">{ratedSubmissions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Pending</span>
              <span className="font-bold text-base sm:text-lg text-orange-600">{submissions.length - ratedSubmissions}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="size-4 sm:size-5" />Exhibition Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Total Exhibitions</span>
              <span className="font-bold text-base sm:text-lg">{exhibitions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Artworks Exhibited</span>
              <span className="font-bold text-base sm:text-lg text-blue-600">{allExhibitionSubs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Sold Paintings</span>
              <span className="font-bold text-base sm:text-lg text-green-600">{soldPaintings}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="size-4 sm:size-5" />Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(['Best', 'Better', 'Good', 'Moderate', 'Normal'] as const).map((rating) => {
              const count = submissions.filter((s) => s.review?.ratingLevel === rating).length;
              return (
                <div key={rating} className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-600">{rating}</span>
                  <span className="font-semibold text-sm sm:text-base">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Recent Competitions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest competition activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {competitions.slice(0, 4).map((competition) => {
                const submissionCount = submissions.filter((s) => s.competitionId === competition.id).length;
                return (
                  <div key={competition.id} className="flex justify-between items-start p-2 sm:p-3 border rounded-lg gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm mb-1 truncate">{competition.title}</h4>
                      <p className="text-xs text-slate-600 mb-1 line-clamp-2">{competition.description}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(competition.startDate).toLocaleDateString()} – {new Date(competition.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-bold text-blue-600">{submissionCount}</div>
                      <div className="text-xs text-slate-600">entries</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Top Performing Students</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Students with most awards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {students.map((student) => {
                const studentSubs = submissions.filter((s) => s.studentId === student.userId);
                const bestCount = studentSubs.filter((s) => s.review?.ratingLevel === 'Best').length;
                if (bestCount === 0) return null;
                return (
                  <div key={student.userId} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{student.fullName}</h4>
                      <p className="text-xs text-slate-600 truncate">{student.admissionNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Trophy className="size-3 sm:size-4 text-yellow-600" />
                        <span className="font-bold text-sm sm:text-base">{bestCount}</span>
                      </div>
                      <p className="text-xs text-slate-600">best rated</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
