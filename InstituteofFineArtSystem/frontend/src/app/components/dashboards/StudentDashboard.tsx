import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Upload, Trophy, TrendingUp, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { toast } from 'sonner';

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [awards, setAwards] = useState<StudentAwardDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      submissionsApi.getAll(),
      competitionsApi.getAll(),
      awardsApi.getStudentAwards({ studentId: currentUser.id }),
    ]).then(([subs, comps, aw]) => {
      setSubmissions(subs.filter((s) => s.studentId === currentUser.id));
      setCompetitions(comps);
      setAwards(aw);
    }).catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const ongoingCompetitions = competitions.filter((c) => c.status === 'Ongoing');
  const upcomingCompetitions = competitions.filter((c) => c.status === 'Upcoming');

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'Best':     return 'bg-green-100 text-green-800';
      case 'Better':   return 'bg-blue-100 text-blue-800';
      case 'Good':     return 'bg-purple-100 text-purple-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      default:         return 'bg-slate-100 text-slate-800';
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Welcome, {currentUser?.fullName}!</h1>
        <p className="text-sm sm:text-base text-slate-600">Track your submissions, awards, and competition participation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Upload className="size-3 sm:size-4" />Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{submissions.length}</div>
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
            <p className="text-xs text-slate-600 mt-1">Won</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Calendar className="size-3 sm:size-4" />Ongoing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{ongoingCompetitions.length}</div>
            <p className="text-xs text-slate-600 mt-1">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <TrendingUp className="size-3 sm:size-4" />Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {submissions.filter((s) => s.review?.ratingLevel === 'Best').length}
            </div>
            <p className="text-xs text-slate-600 mt-1">Top rated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">My Recent Submissions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your latest artwork submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {submissions.slice(0, 3).map((submission) => {
                  const competition = competitions.find((c) => c.id === submission.competitionId);
                  const review = submission.review;
                  return (
                    <div key={submission.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                      {submission.workUrl && (
                        <img src={submission.workUrl} alt={submission.title} className="size-16 sm:size-20 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 text-sm sm:text-base truncate">{submission.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mb-2 truncate">{competition?.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {review ? (
                            <Badge className={getRatingColor(review.ratingLevel)}>{review.ratingLevel}</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 text-center py-6 sm:py-8">
                You haven't submitted any artwork yet. Start by participating in ongoing competitions!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Available Competitions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Competitions you can participate in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {ongoingCompetitions.map((competition) => (
                <div key={competition.id} className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h4 className="font-semibold text-sm sm:text-base">{competition.title}</h4>
                    <Badge className="shrink-0 text-xs">Ongoing</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">{competition.description}</p>
                  <div className="text-xs text-slate-500">Ends: {new Date(competition.endDate).toLocaleDateString()}</div>
                </div>
              ))}
              {upcomingCompetitions.slice(0, 2).map((competition) => (
                <div key={competition.id} className="p-2 sm:p-3 border rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h4 className="font-semibold text-sm sm:text-base">{competition.title}</h4>
                    <Badge variant="secondary" className="shrink-0 text-xs">Upcoming</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2">{competition.description}</p>
                  <div className="text-xs text-slate-500">Starts: {new Date(competition.startDate).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {awards.length > 0 && (
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="size-4 sm:size-5 text-yellow-600" />My Awards & Achievements
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your competition wins and recognitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {awards.map((award) => (
                <div key={award.id} className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{award.awardName}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-1">{award.competitionTitle}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(award.awardedDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
