import { useState, useEffect } from 'react';
import { awardsApi, type AwardDto, type StudentAwardDto } from '../../api/awards';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trophy, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const AWARD_ICON: Record<string, string> = {
  'First Prize': '🥇', 'Second Prize': '🥈', 'Third Prize': '🥉',
  'Honorable Mention': '🏅', 'Best Use of Color': '🎨',
};

export function ManageAwards() {
  const [studentAwards, setStudentAwards] = useState<StudentAwardDto[]>([]);
  const [awards, setAwards] = useState<AwardDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ competitionId: '', submissionId: '', awardId: '' });
  const [filterCompetitionId, setFilterCompetitionId] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      awardsApi.getStudentAwards(),
      awardsApi.getAwards(),
      submissionsApi.getAll(),
      competitionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([sa, a, subs, comps, studs]) => {
      setStudentAwards(sa);
      setAwards(a);
      setSubmissions(subs);
      setCompetitions(comps);
      setStudents(studs);
    }).catch(() => toast.error('Failed to load awards'))
      .finally(() => setLoading(false));
  }, []);

  const selectedCompetitionSubmissions = formData.competitionId
    ? submissions.filter(s => s.competitionId === Number(formData.competitionId))
    : [];

  // Competitions that have at least one award
  const competitionsWithAwards = competitions.filter(c =>
    studentAwards.some(a => {
      const sub = submissions.find(s => s.id === a.submissionId);
      return sub?.competitionId === c.id;
    })
  );

  const filteredAwards = filterCompetitionId === 'all'
    ? studentAwards
    : studentAwards.filter(a => {
        const sub = submissions.find(s => s.id === a.submissionId);
        return sub ? sub.competitionId === Number(filterCompetitionId) : false;
      });

  const resetForm = () => {
    setFormData({ competitionId: '', submissionId: '', awardId: '' });
    setIsDialogOpen(false);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm('Revoke this award?')) return;
    try {
      await awardsApi.revokeAward(id);
      setStudentAwards(prev => prev.filter(a => a.id !== id));
      toast.success('Award revoked');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to revoke award');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.submissionId || !formData.awardId) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await awardsApi.grantAward(Number(formData.submissionId), Number(formData.awardId));
      const updated = await awardsApi.getStudentAwards();
      setStudentAwards(updated);
      toast.success('Award issued successfully');
      resetForm();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to issue award');
    } finally {
      setSaving(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Awards</h1>
          <p className="text-slate-600">Issue and track competition awards</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="size-4 mr-2" />Issue Award
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Issue New Award</DialogTitle>
              <DialogDescription>Issue a new award to a student submission.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Competition *</Label>
                <Select value={formData.competitionId}
                  onValueChange={(v) => setFormData({ ...formData, competitionId: v, submissionId: '' })}>
                  <SelectTrigger><SelectValue placeholder="Select competition" /></SelectTrigger>
                  <SelectContent>
                    {competitions.filter(c => c.status === 'Completed').map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.competitionId && (
                <div className="space-y-2">
                  <Label>Submission *</Label>
                  <Select value={formData.submissionId}
                    onValueChange={(v) => setFormData({ ...formData, submissionId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select submission" /></SelectTrigger>
                    <SelectContent>
                      {selectedCompetitionSubmissions.map(s => {
                        const student = students.find(st => st.userId === s.studentId);
                        return (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.title} — {student?.fullName ?? s.studentName ?? 'Unknown'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Award *</Label>
                <Select value={formData.awardId}
                  onValueChange={(v) => setFormData({ ...formData, awardId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select award" /></SelectTrigger>
                  <SelectContent>
                    {awards.map(a => (
                      <SelectItem key={a.id} value={String(a.id)}>{a.awardName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Issue Award
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Label className="shrink-0">Filter by Competition:</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filterCompetitionId === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterCompetitionId('all')}
          >
            All ({studentAwards.length})
          </Button>
          {competitionsWithAwards.map(c => (
            <Button
              key={c.id}
              size="sm"
              variant={filterCompetitionId === String(c.id) ? 'default' : 'outline'}
              onClick={() => setFilterCompetitionId(String(c.id))}
            >
              {c.title}
              <span className="ml-1.5 text-xs opacity-70">
                ({studentAwards.filter(a => {
                  const sub = submissions.find(s => s.id === a.submissionId);
                  return sub?.competitionId === c.id;
                }).length})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Awards grouped by competition */}
      {filterCompetitionId === 'all' ? (
        competitionsWithAwards.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="size-12 mx-auto mb-4 text-slate-400" />
              <h3 className="font-semibold mb-2">No Awards Issued Yet</h3>
              <p className="text-slate-600">Start recognizing outstanding student work</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {competitionsWithAwards.map(comp => {
              const compAwards = studentAwards.filter(a => {
                const sub = submissions.find(s => s.id === a.submissionId);
                return sub?.competitionId === comp.id;
              });
              return (
                <Card key={comp.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="size-4 text-yellow-600" />{comp.title}
                      </CardTitle>
                      <Badge variant="secondary">{compAwards.length} award{compAwards.length > 1 ? 's' : ''}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {compAwards.map(award => (
                        <div key={award.id} className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50">
                          <span className="text-2xl shrink-0">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{award.awardName}</p>
                            <p className="text-xs text-slate-600 truncate">{award.studentName ?? '—'}</p>
                            <p className="text-xs text-slate-500 truncate">{award.submissionTitle ?? '—'}</p>
                            <p className="text-xs text-slate-400">{new Date(award.awardedDate).toLocaleDateString()}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleRevoke(award.id)} className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAwards.map(award => (
            <Card key={award.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{award.awardName}</p>
                    <p className="text-sm text-slate-600">{award.studentName ?? '—'}</p>
                    <p className="text-xs text-slate-500">{award.submissionTitle ?? '—'}</p>
                    <p className="text-xs text-slate-400">{new Date(award.awardedDate).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleRevoke(award.id)} className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredAwards.length === 0 && (
            <p className="text-slate-500 text-sm col-span-2 text-center py-8">No awards for this competition</p>
          )}
        </div>
      )}
    </div>
  );
}