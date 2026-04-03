import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto, type CompetitionCriteriaDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { awardsApi } from '../../api/awards';
import { exhibitionsApi } from '../../api/exhibitions';
import { RatingLevel } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Star, Loader2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

// Calculate rating level from weighted score
function calcRatingFromScore(score: number): RatingLevel {
  if (score >= 90) return 'Best';
  if (score >= 80) return 'Better';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Normal';
}

export function ManageSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [awardedSubmissionIds, setAwardedSubmissionIds] = useState<Set<number>>(new Set());
  const [exhibitedSubmissionIds, setExhibitedSubmissionIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [competitionFilter, setCompetitionFilter] = useState<string>(
    searchParams.get('competitionId') ?? 'all'
  );
  const [ratingFilter, setRatingFilter] = useState<RatingLevel | 'all' | 'unrated'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDto | null>(null);
  const [ratingLevel, setRatingLevel] = useState<RatingLevel | ''>('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [improvements, setImprovements] = useState('');
  const [criteriaScores, setCriteriaScores] = useState<Record<number, number>>({});
  const [competitionCriteria, setCompetitionCriteria] = useState<CompetitionCriteriaDto[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      submissionsApi.getAll(),
      competitionsApi.getAll(),
      usersApi.getStudents(),
      awardsApi.getStudentAwards(),
      exhibitionsApi.getAll(),
    ]).then(([subs, comps, studs, awards, exhibitions]) => {
      setSubmissions(subs);
      setCompetitions(comps);
      setStudents(studs);
      setAwardedSubmissionIds(new Set(awards.map(a => a.submissionId)));
      const exhibitedIds = new Set(exhibitions.flatMap(e => e.submissions.map(es => es.submissionId)));
      setExhibitedSubmissionIds(exhibitedIds);
    }).catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false));
  }, []);

  // Calculate total weighted score from criteriaScores
  const calcWeightedScore = (scores: Record<number, number>, criteria: CompetitionCriteriaDto[]) => {
    if (criteria.length === 0) return 0;
    return criteria.reduce((sum, c) => {
      const score = scores[c.criteriaId] ?? 0;
      return sum + (score * c.weightPercent / 100);
    }, 0);
  };

  const weightedScore = calcWeightedScore(criteriaScores, competitionCriteria);
  const autoRating = competitionCriteria.length > 0 ? calcRatingFromScore(weightedScore) : null;

  const filteredSubmissions = submissions.filter((s) => {
    const student = students.find(st => st.userId === s.studentId);
    const competition = competitions.find(c => c.id === s.competitionId);
    const matchesSearch =
      (s.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student?.fullName ?? s.studentName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (competition?.title ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompetition = competitionFilter === 'all' || s.competitionId === Number(competitionFilter);
    const matchesRating =
      ratingFilter === 'all' ||
      (ratingFilter === 'unrated' ? !s.review : s.review?.ratingLevel === ratingFilter);
    return matchesSearch && matchesCompetition && matchesRating;
  });

  const openReviewDialog = (submission: SubmissionDto) => {
    setSelectedSubmission(submission);
    setRatingLevel((submission.review?.ratingLevel as RatingLevel) ?? '');
    setStrengths(submission.review?.strengths ?? '');
    setWeaknesses(submission.review?.weaknesses ?? '');
    setImprovements(submission.review?.improvements ?? '');

    // Load criteria for this competition
    const comp = competitions.find(c => c.id === submission.competitionId);
    const criteria = comp?.criteria ?? [];
    setCompetitionCriteria(criteria);

    // Fill existing scores if available
    const existingScores: Record<number, number> = {};
    if (submission.review?.gradeDetails) {
      for (const g of submission.review.gradeDetails) {
        existingScores[g.criteriaId] = g.rawScore;
      }
    } else {
      // Default 0 for all criteria
      for (const c of criteria) {
        existingScores[c.criteriaId] = 0;
      }
    }
    setCriteriaScores(existingScores);
  };

  const handleScoreChange = (criteriaId: number, value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    const newScores = { ...criteriaScores, [criteriaId]: clamped };
    setCriteriaScores(newScores);
    // Auto-update rating level from score (skip if Disqualified)
    if (competitionCriteria.length > 0 && ratingLevel !== 'Disqualified') {
      const score = calcWeightedScore(newScores, competitionCriteria);
      setRatingLevel(calcRatingFromScore(score));
    }
  };

  const handleSaveReview = async () => {
    if (!selectedSubmission || !ratingLevel) {
      toast.error('Please select a rating');
      return;
    }
    setSaving(true);
    try {
      // If Disqualified: do not send grade details
      const gradeDetails = ratingLevel === 'Disqualified'
        ? []
        : competitionCriteria.map(c => ({
            criteriaId: c.criteriaId,
            rawScore: criteriaScores[c.criteriaId] ?? 0,
          }));
      await submissionsApi.createReview(selectedSubmission.id, {
        ratingLevel, strengths, weaknesses, improvements,
        gradeDetails,
      });
      const updated = await submissionsApi.getAll();
      setSubmissions(updated);
      toast.success('Review saved successfully');
      setSelectedSubmission(null);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'Best':         return 'bg-green-100 text-green-800';
      case 'Better':       return 'bg-blue-100 text-blue-800';
      case 'Good':         return 'bg-purple-100 text-purple-800';
      case 'Moderate':     return 'bg-yellow-100 text-yellow-800';
      case 'Normal':       return 'bg-slate-100 text-slate-800';
      case 'Disqualified': return 'bg-red-100 text-red-800';
      default:             return 'bg-slate-100 text-slate-800';
    }
  };

  const getLockReason = (submissionId: number): string | null => {
    if (awardedSubmissionIds.has(submissionId)) return 'Awarded';
    if (exhibitedSubmissionIds.has(submissionId)) return 'In Exhibition';
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Submissions</h1>
        <p className="text-slate-600">Evaluate and rate student submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>View and evaluate all artwork submissions</CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Search className="size-4" />
            <Input placeholder="Search submissions..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Label>Competition</Label>
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="w-56"><SelectValue placeholder="All competitions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {competitions.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {competitionFilter !== 'all' && (
              <Button size="sm" variant="ghost" className="text-xs text-slate-500 h-8"
                onClick={() => setCompetitionFilter('all')}>
                Clear ×
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Label>Rating</Label>
            <Select value={ratingFilter} onValueChange={(v: any) => setRatingFilter(v)}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Select rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unrated">⏳ Not Rated Yet</SelectItem>
                <SelectItem value="Best">Best</SelectItem>
                <SelectItem value="Better">Better</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Disqualified">Disqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions.map((submission) => {
              const student = students.find(s => s.userId === submission.studentId);
              const competition = competitions.find(c => c.id === submission.competitionId);
              const review = submission.review;
              return (
                <Card key={submission.id} className="overflow-hidden">
                  {submission.workUrl && (
                    <img src={submission.workUrl} alt={submission.title ?? ''} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{submission.title}</h3>
                    <p className="text-sm text-slate-600 mb-1">By {student?.fullName ?? submission.studentName}</p>
                    <p className="text-xs text-slate-500 mb-2">{competition?.title}</p>
                    {review?.gradeDetails && review.gradeDetails.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {review.gradeDetails.map(g => (
                          <div key={g.id} className="flex justify-between text-xs text-slate-500">
                            <span>{g.criteriaName ?? g.criteriaCode}</span>
                            <span className="font-medium">{g.rawScore}/100</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {review ? (
                        <Badge className={getRatingColor(review.ratingLevel)}>{review.ratingLevel}</Badge>
                      ) : (
                        <Badge variant="outline">Not Rated</Badge>
                      )}
                      {(() => {
                        const lockReason = getLockReason(submission.id);
                        return lockReason ? (
                          <span className="text-xs text-slate-400 italic">🔒 {lockReason}</span>
                        ) : (
                          <Button size="sm" onClick={() => openReviewDialog(submission)}>
                            <Star className="size-4 mr-1" />{review ? 'Update' : 'Rate'}
                          </Button>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredSubmissions.length === 0 && <p className="text-center text-slate-500 py-8">No submissions found</p>}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Submission</DialogTitle>
            <DialogDescription>Evaluate and score this artwork</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-5">
              {/* Artwork preview */}
              <div className="flex gap-4">
                {selectedSubmission.workUrl && (
                  <img src={selectedSubmission.workUrl} alt={selectedSubmission.title ?? ''} className="w-40 h-40 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{selectedSubmission.title}</h3>
                  <p className="text-sm text-slate-500 mb-1">
                    By {students.find(s => s.userId === selectedSubmission.studentId)?.fullName ?? selectedSubmission.studentName}
                  </p>
                  <p className="text-sm text-slate-500 mb-1">
                    {competitions.find(c => c.id === selectedSubmission.competitionId)?.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    Proposed: ${selectedSubmission.proposedPrice.toLocaleString('en-US')}
                  </p>
                </div>
              </div>

              {/* Criteria scoring — hidden when Disqualified */}
              {competitionCriteria.length > 0 && ratingLevel !== 'Disqualified' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <Calculator className="size-4" />Criteria Scoring
                    </Label>
                    {autoRating && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Total:</span>
                        <span className="font-bold text-slate-800">{weightedScore.toFixed(1)}/100</span>
                        <Badge className={getRatingColor(autoRating)}>{autoRating}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {competitionCriteria.map(c => (
                      <div key={c.criteriaId} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{c.criteriaName ?? c.criteriaCode}</span>
                          <span className="text-slate-500 text-xs">Weight: {c.weightPercent}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={criteriaScores[c.criteriaId] ?? 0}
                            onChange={e => handleScoreChange(c.criteriaId, Number(e.target.value))}
                            className="flex-1 h-2 accent-purple-600"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={criteriaScores[c.criteriaId] ?? 0}
                            onChange={e => handleScoreChange(c.criteriaId, Number(e.target.value))}
                            className="w-16 h-8 text-center text-sm"
                          />
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${criteriaScores[c.criteriaId] ?? 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-xs text-slate-400">Scale:</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">Best ≥90</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Better ≥80</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Good ≥70</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">Moderate ≥60</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Normal &lt;60</span>
                  </div>
                </div>
              )}

              {/* Rating level */}
              <div className="space-y-2">
                <Label>Rating Level *</Label>
                {competitionCriteria.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-2 border rounded-md bg-slate-50 flex items-center gap-2">
                      <span className="text-sm text-slate-500">Rating:</span>
                      {ratingLevel && ratingLevel !== 'Disqualified'
                        ? <Badge className={getRatingColor(ratingLevel)}>{ratingLevel}</Badge>
                        : ratingLevel === 'Disqualified'
                          ? <Badge className="bg-red-100 text-red-800">Disqualified</Badge>
                          : <span className="text-xs text-slate-400">Score criteria above</span>}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={ratingLevel === 'Disqualified' ? 'destructive' : 'outline'}
                      onClick={() => {
                        if (ratingLevel === 'Disqualified') {
                          const score = calcWeightedScore(criteriaScores, competitionCriteria);
                          setRatingLevel(calcRatingFromScore(score));
                        } else {
                          setRatingLevel('Disqualified');
                        }
                      }}
                    >
                      {ratingLevel === 'Disqualified' ? 'Undo Disqualify' : 'Disqualify'}
                    </Button>
                  </div>
                ) : (
                  <Select value={ratingLevel} onValueChange={(v: any) => setRatingLevel(v)}>
                    <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Best">Best (≥90)</SelectItem>
                      <SelectItem value="Better">Better (≥80)</SelectItem>
                      <SelectItem value="Good">Good (≥70)</SelectItem>
                      <SelectItem value="Moderate">Moderate (≥60)</SelectItem>
                      <SelectItem value="Normal">Normal (&lt;60)</SelectItem>
                      <SelectItem value="Disqualified">Disqualified</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-green-700">✅ Strengths</Label>
                  <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} placeholder="What did the student do well?" className="border-green-200 focus:border-green-400" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-red-700">⚠️ Weaknesses</Label>
                  <Textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={2} placeholder="Areas that need attention" className="border-red-200 focus:border-red-400" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-blue-700">💡 Improvements</Label>
                  <Textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} rows={2} placeholder="Suggestions for improvement" className="border-blue-200 focus:border-blue-400" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>Cancel</Button>
                <Button onClick={handleSaveReview} disabled={saving}>
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Save Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}