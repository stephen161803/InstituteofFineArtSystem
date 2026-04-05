import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Upload, Trophy, TrendingUp, Loader2, Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { toast } from 'sonner';

const RATING_COLOR: Record<string, string> = {
  Best: 'bg-green-100 text-green-800', Better: 'bg-blue-100 text-blue-800',
  Good: 'bg-purple-100 text-purple-800', Moderate: 'bg-yellow-100 text-yellow-800',
  Normal: 'bg-slate-100 text-slate-800',
};
const AWARD_ICON: Record<string, string> = {
  'First Prize': '🥇', 'Second Prize': '🥈', 'Third Prize': '🥉',
  'Honorable Mention': '🏅', 'Best Use of Color': '🎨',
};

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [awards, setAwards] = useState<StudentAwardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailSubmission, setDetailSubmission] = useState<SubmissionDto | null>(null);

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

  const getRatingColor = (rating?: string) => RATING_COLOR[rating ?? ''] ?? 'bg-slate-100 text-slate-800';

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
                    <div key={submission.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors group"
                      onClick={() => setDetailSubmission(submission)}>
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
                      <Eye className="size-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
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

      {awards.length > 0 && (        <Card>
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

      {/* Submission Detail Dialog */}
      <Dialog open={!!detailSubmission} onOpenChange={open => { if (!open) setDetailSubmission(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {detailSubmission && (() => {
            const review = detailSubmission.review;
            const comp = competitions.find(c => c.id === detailSubmission.competitionId);
            const award = awards.find(a => a.submissionId === detailSubmission.id);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{detailSubmission.title}</DialogTitle>
                  <DialogDescription>{comp?.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {detailSubmission.workUrl && <img src={detailSubmission.workUrl} alt={detailSubmission.title} className="w-full h-56 object-cover rounded-lg" />}
                  {award && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-2xl">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span>
                      <div><p className="font-semibold text-yellow-800">{award.awardName}</p><p className="text-xs text-yellow-600">Awarded {new Date(award.awardedDate).toLocaleDateString()}</p></div>
                    </div>
                  )}
                  {detailSubmission.description && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Story</p><p className="text-sm text-slate-700">{detailSubmission.description}</p></div>}
                  {detailSubmission.quotation && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Quotation</p><p className="text-sm italic text-slate-600">"{detailSubmission.quotation}"</p></div>}
                  {review ? (
                    <div className="border rounded-lg p-4 space-y-2 bg-slate-50">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">Staff Review</p>
                        <Badge className={RATING_COLOR[review.ratingLevel] ?? 'bg-slate-100 text-slate-800'}>{review.ratingLevel}</Badge>
                      </div>
                      {review.strengths && <div><p className="text-xs font-semibold text-green-700 mb-1">✅ Strengths</p><p className="text-sm text-slate-700">{review.strengths}</p></div>}
                      {review.weaknesses && <div><p className="text-xs font-semibold text-red-700 mb-1">⚠️ Areas to Improve</p><p className="text-sm text-slate-700">{review.weaknesses}</p></div>}
                      {review.improvements && <div><p className="text-xs font-semibold text-blue-700 mb-1">💡 Suggestions</p><p className="text-sm text-slate-700">{review.improvements}</p></div>}
                      <p className="text-xs text-slate-400">Reviewed: {new Date(review.reviewedAt).toLocaleDateString()}</p>
                    </div>
                  ) : <p className="text-sm text-slate-500 italic">No review yet.</p>}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
