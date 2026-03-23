import { useState, useEffect } from 'react';
import { awardsApi, type AwardDto, type StudentAwardDto } from '../../api/awards';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const resetForm = () => {
    setFormData({ competitionId: '', submissionId: '', awardId: '' });
    setIsDialogOpen(false);
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
                    {competitions.map(c => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentAwards.map((award) => (
          <Card key={award.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Trophy className="size-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{award.awardName}</h3>
                  <p className="text-sm text-slate-600 mb-1">Winner: <span className="font-medium">{award.studentName ?? '—'}</span></p>
                  <p className="text-sm text-slate-600 mb-2">Competition: {award.competitionTitle ?? '—'}</p>
                  <p className="text-xs text-slate-500">Awarded on {new Date(award.awardedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {studentAwards.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="size-12 mx-auto mb-4 text-slate-400" />
            <h3 className="font-semibold mb-2">No Awards Issued Yet</h3>
            <p className="text-slate-600">Start recognizing outstanding student work</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
