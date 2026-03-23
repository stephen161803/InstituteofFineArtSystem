import { useState, useEffect } from 'react';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { RatingLevel } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingLevel | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDto | null>(null);
  const [ratingLevel, setRatingLevel] = useState<RatingLevel | ''>('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [improvements, setImprovements] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      submissionsApi.getAll(),
      competitionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([subs, comps, studs]) => {
      setSubmissions(subs);
      setCompetitions(comps);
      setStudents(studs);
    }).catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false));
  }, []);

  const filteredSubmissions = submissions.filter((s) => {
    const student = students.find(st => st.userId === s.studentId);
    const competition = competitions.find(c => c.id === s.competitionId);
    const matchesSearch =
      (s.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student?.fullName ?? s.studentName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (competition?.title ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || s.review?.ratingLevel === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const openReviewDialog = (submission: SubmissionDto) => {
    setSelectedSubmission(submission);
    setRatingLevel((submission.review?.ratingLevel as RatingLevel) ?? '');
    setStrengths(submission.review?.strengths ?? '');
    setWeaknesses(submission.review?.weaknesses ?? '');
    setImprovements(submission.review?.improvements ?? '');
  };

  const handleSaveReview = async () => {
    if (!selectedSubmission || !ratingLevel) {
      toast.error('Please select a rating');
      return;
    }
    setSaving(true);
    try {
      await submissionsApi.createReview(selectedSubmission.id, {
        ratingLevel, strengths, weaknesses, improvements,
      });
      // Refresh submissions to get updated review
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
            <Label>Filter by Rating</Label>
            <Select value={ratingFilter} onValueChange={(v: any) => setRatingFilter(v)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Select rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
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
                    <div className="flex items-center justify-between mt-3">
                      {review ? (
                        <Badge className={getRatingColor(review.ratingLevel)}>{review.ratingLevel}</Badge>
                      ) : (
                        <Badge variant="outline">Not Rated</Badge>
                      )}
                      <Button size="sm" onClick={() => openReviewDialog(submission)}>
                        <Star className="size-4 mr-1" />{review ? 'Update' : 'Rate'}
                      </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader><DialogTitle>Rate Submission</DialogTitle></DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedSubmission.workUrl && (
                  <img src={selectedSubmission.workUrl} alt={selectedSubmission.title ?? ''} className="w-48 h-48 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{selectedSubmission.title}</h3>
                  <p className="text-sm text-slate-500">Proposed price: {selectedSubmission.proposedPrice.toLocaleString()} VND</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rating Level *</Label>
                <Select value={ratingLevel} onValueChange={(v: any) => setRatingLevel(v)}>
                  <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Best">Best</SelectItem>
                    <SelectItem value="Better">Better</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Disqualified">Disqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Strengths</Label>
                <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} placeholder="What did the student do well?" />
              </div>
              <div className="space-y-2">
                <Label>Weaknesses</Label>
                <Textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={2} placeholder="Areas that need attention" />
              </div>
              <div className="space-y-2">
                <Label>Improvements</Label>
                <Textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} rows={2} placeholder="Suggestions for improvement" />
              </div>
              <div className="flex justify-end gap-2">
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
