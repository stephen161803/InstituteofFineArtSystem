import { useState, useEffect, useMemo } from 'react';
import { awardsApi, type StudentAwardDto, type CompetitionAwardDto } from '../../api/awards';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto, type CompetitionCriteriaDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Trophy, Loader2, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const AWARD_ICON: Record<string, string> = {
  'First Prize': '🥇', 'Second Prize': '🥈', 'Third Prize': '🥉',
  'Honorable Mention': '🏅', 'Best Use of Color': '🎨',
};

type SortKey = 'totalScore' | string;
type PendingMap = Record<number, Set<number>>;

export function ManageAwards() {
  const navigate = useNavigate();
  const [studentAwards, setStudentAwards] = useState<StudentAwardDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('totalScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [pending, setPending] = useState<PendingMap>({});
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; ungrantedNames: string[]; entries: [number, number][] }>({
    open: false, ungrantedNames: [], entries: [],
  });
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; id: number; awardName: string }>({
    open: false, id: 0, awardName: '',
  });

  useEffect(() => {
    Promise.all([
      awardsApi.getStudentAwards(),
      submissionsApi.getAll(),
      competitionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([sa, subs, comps, studs]) => {
      setStudentAwards(sa); setSubmissions(subs);
      setCompetitions(comps); setStudents(studs);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const comp = competitions.find(c => c.id === Number(selectedCompetitionId));
  const awards: CompetitionAwardDto[] = comp?.awards ?? [];
  const criteria: CompetitionCriteriaDto[] = comp?.criteria ?? [];

  const unreviewedCount = useMemo(() => {
    if (!selectedCompetitionId) return 0;
    return submissions.filter(s =>
      s.competitionId === Number(selectedCompetitionId) && !s.review
    ).length;
  }, [submissions, selectedCompetitionId]);

  const rows = useMemo(() => {
    if (!selectedCompetitionId) return [];
    return submissions
      .filter(s => s.competitionId === Number(selectedCompetitionId))
      .map(s => {
        const scores: Record<number, number> = {};
        s.review?.gradeDetails?.forEach(g => { scores[g.criteriaId] = g.rawScore; });
        const total = criteria.length > 0
          ? criteria.reduce((sum, c) => sum + (scores[c.criteriaId] ?? 0) * c.weightPercent / 100, 0)
          : 0;
        const student = students.find(st => st.userId === s.studentId);
        const grantedAwards = studentAwards.filter(a => a.submissionId === s.id);
        return { s, student, scores, total, grantedAwards };
      });
  }, [submissions, selectedCompetitionId, students, criteria, studentAwards]);

  const sorted = useMemo(() => [...rows].sort((a, b) => {
    const va = sortKey === 'totalScore' ? a.total : (a.scores[Number(sortKey)] ?? 0);
    const vb = sortKey === 'totalScore' ? b.total : (b.scores[Number(sortKey)] ?? 0);
    return sortDir === 'desc' ? vb - va : va - vb;
  }), [rows, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)}
      className={`flex items-center gap-0.5 hover:text-purple-600 ${sortKey === k ? 'text-purple-600 font-semibold' : ''}`}>
      {label}
      {sortKey === k ? (sortDir === 'desc' ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />) : null}
    </button>
  );

  const awardGrantedTo = (awardId: number) =>
    studentAwards.find(a => a.competitionAwardId === awardId);

  const togglePending = (submissionId: number, awardId: number) => {
    const existing = awardGrantedTo(awardId);
    if (existing && existing.submissionId !== submissionId) {
      toast.error(`"${existing.awardName}" already granted to ${existing.studentName}`);
      return;
    }
    setPending(prev => {
      const set = new Set(prev[submissionId] ?? []);
      if (set.has(awardId)) set.delete(awardId); else set.add(awardId);
      return { ...prev, [submissionId]: set };
    });
  };

  const pendingCount = Object.values(pending).reduce((sum, s) => sum + s.size, 0);

  const handleGrantAll = () => {
    const entries: [number, number][] = [];
    Object.entries(pending).forEach(([subId, awardSet]) => {
      awardSet.forEach(awardId => entries.push([Number(subId), awardId]));
    });
    if (entries.length === 0) return toast.error('No awards selected');

    const awardCounts: Record<number, number> = {};
    for (const [, awardId] of entries) {
      awardCounts[awardId] = (awardCounts[awardId] ?? 0) + 1;
      if (awardCounts[awardId] > 1) {
        const a = awards.find(x => x.id === awardId);
        return toast.error(`"${a?.awardName}" selected for multiple students`);
      }
    }

    const selectedAwardIds = new Set(entries.map(([, aid]) => aid));
    const ungrantedAfter = awards.filter(a =>
      !studentAwards.some(sa => sa.competitionAwardId === a.id) && !selectedAwardIds.has(a.id)
    );

    if (ungrantedAfter.length > 0) {
      setConfirmDialog({ open: true, ungrantedNames: ungrantedAfter.map(a => a.awardName), entries });
    } else {
      doGrant(entries);
    }
  };

  const doGrant = async (entries: [number, number][]) => {
    setConfirmDialog(d => ({ ...d, open: false }));
    setSaving(true);
    let success = 0;
    for (const [subId, awardId] of entries) {
      try {
        await awardsApi.grantAward(subId, awardId);
        success++;
      } catch (err: any) {
        toast.error(err.message ?? 'Failed');
      }
    }
    const updated = await awardsApi.getStudentAwards();
    setStudentAwards(updated);
    setPending({});
    setSaving(false);
    if (success > 0) toast.success(`${success} award(s) issued`);
  };

  const handleRevoke = async (id: number, awardName: string) => {
    setRevokeDialog({ open: true, id, awardName });
  };

  const doRevoke = async () => {
    const { id } = revokeDialog;
    setRevokeDialog(d => ({ ...d, open: false }));
    try {
      await awardsApi.revokeAward(id);
      setStudentAwards(prev => prev.filter(a => a.id !== id));
      toast.success('Award revoked');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Manage Awards</h1>
        <p className="text-slate-600">Click award badges to select, then grant all at once</p>
      </div>

      <Select value={selectedCompetitionId} onValueChange={v => { setSelectedCompetitionId(v); setPending({}); setSortKey('totalScore'); }}>
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select competition..." />
        </SelectTrigger>
        <SelectContent>
          {competitions.filter(c => c.status === 'Completed' && c.awards.length > 0).map(c => (
            <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {unreviewedCount > 0 && (
        <div className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <span>⚠️ {unreviewedCount} submission{unreviewedCount > 1 ? 's' : ''} not reviewed yet. Awards cannot be granted until all are reviewed.</span>
          <Button size="sm" variant="outline" className="shrink-0 text-amber-700 border-amber-300 hover:bg-amber-100"
            onClick={() => navigate(`/dashboard/submissions?competitionId=${selectedCompetitionId}`)}>
            Go to Review
          </Button>
        </div>
      )}

      {!selectedCompetitionId && (
        <Card><CardContent className="p-12 text-center">
          <Trophy className="size-10 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500">Select a completed competition to issue awards</p>
        </CardContent></Card>
      )}

      {selectedCompetitionId && sorted.length === 0 && (
        <p className="text-slate-500 text-sm">No submissions found for this competition.</p>
      )}

      {selectedCompetitionId && sorted.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base">{comp?.title} — {sorted.length} submissions</CardTitle>
              <Button disabled={pendingCount === 0 || saving || unreviewedCount > 0} onClick={handleGrantAll} className="gap-2">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Trophy className="size-4" />}
                Grant Selected ({pendingCount})
              </Button>
            </div>
            {/* Warning: ungranted awards */}
            {(() => {
              const ungrantedAwards = awards.filter(a => !studentAwards.some(sa => sa.competitionAwardId === a.id));
              if (ungrantedAwards.length === 0) return null;
              return (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ {ungrantedAwards.length} award{ungrantedAwards.length > 1 ? 's' : ''} not yet granted:{' '}
                  {ungrantedAwards.map(a => a.awardName).join(', ')}
                </p>
              );
            })()}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold">#</th>
                    <th className="p-3 text-left font-semibold">Student</th>
                    <th className="p-3 text-left font-semibold">Submission</th>
                    <th className="p-3 text-left font-semibold"><SortBtn k="totalScore" label="Total" /></th>
                    {criteria.map(c => (
                      <th key={c.criteriaId} className="p-3 text-left font-semibold whitespace-nowrap">
                        <SortBtn k={String(c.criteriaId)} label={`${c.criteriaName ?? c.criteriaCode} (${c.weightPercent}%)`} />
                      </th>
                    ))}
                    <th className="p-3 text-left font-semibold">Rating</th>
                    <th className="p-3 text-left font-semibold">Awards</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, idx) => {
                    const pendingSet = pending[row.s.id] ?? new Set<number>();
                    const pendingList = awards.filter(a => pendingSet.has(a.id));
                    return (
                      <tr key={row.s.id} className={`border-b hover:bg-slate-50 ${row.grantedAwards.length > 0 || pendingSet.size > 0 ? 'bg-yellow-50/30' : ''}`}>
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-medium">{row.student?.fullName ?? row.s.studentName ?? '—'}</td>
                        <td className="p-3 text-slate-600 max-w-[140px] truncate">{row.s.title ?? '—'}</td>
                        <td className="p-3 font-bold text-purple-700">
                          {criteria.length > 0 ? row.total.toFixed(1) : '—'}
                        </td>
                        {criteria.map(c => (
                          <td key={c.criteriaId} className="p-3 text-center">
                            {row.scores[c.criteriaId] ?? <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                        <td className="p-3">
                          {row.s.review ? (
                            <Badge className={
                              row.s.review.ratingLevel === 'Best' ? 'bg-green-100 text-green-800' :
                              row.s.review.ratingLevel === 'Better' ? 'bg-blue-100 text-blue-800' :
                              row.s.review.ratingLevel === 'Good' ? 'bg-purple-100 text-purple-800' :
                              'bg-slate-100 text-slate-800'
                            }>{row.s.review.ratingLevel}</Badge>
                          ) : <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Already granted badges */}
                            {row.grantedAwards.map(g => (
                              <span key={g.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-300 whitespace-nowrap">
                                {AWARD_ICON[g.awardName ?? ''] ?? '🏆'} {g.awardName}
                                <button onClick={() => handleRevoke(g.id, g.awardName ?? '')} className="ml-0.5 text-red-400 hover:text-red-600">×</button>
                              </span>
                            ))}
                            {/* Pending badges */}
                            {pendingList.map(a => (
                              <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-300 whitespace-nowrap">
                                {AWARD_ICON[a.awardName] ?? '🏆'} {a.awardName}
                                <button onClick={() => togglePending(row.s.id, a.id)} className="ml-0.5 text-purple-400 hover:text-red-500">×</button>
                              </span>
                            ))}
                            {/* Dropdown to add more */}
                            <Select value="" onValueChange={v => togglePending(row.s.id, Number(v))}>
                              <SelectTrigger className="h-6 w-32 text-xs border-dashed">
                                <SelectValue placeholder="+ Add award" />
                              </SelectTrigger>
                              <SelectContent>
                                {awards
                                  .filter(a => !row.grantedAwards.find(g => g.competitionAwardId === a.id) && !pendingSet.has(a.id))
                                  .map(a => {
                                    const taken = awardGrantedTo(a.id);
                                    const takenByOther = taken && taken.submissionId !== row.s.id;
                                    // Also check if pending for another submission
                                    const pendingByOther = !takenByOther && Object.entries(pending).some(
                                      ([sid, set]) => Number(sid) !== row.s.id && set.has(a.id)
                                    );
                                    const disabled = !!takenByOther || pendingByOther;
                                    return (
                                      <SelectItem key={a.id} value={String(a.id)} disabled={disabled}>
                                        {AWARD_ICON[a.awardName] ?? '🏆'} {a.awardName}
                                        {takenByOther ? ` (→ ${taken!.studentName?.split(' ').pop()})` : ''}
                                        {pendingByOther ? ' (selected)' : ''}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revoke confirm dialog */}
      <Dialog open={revokeDialog.open} onOpenChange={open => setRevokeDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-xs p-5">
          <DialogHeader>
            <DialogTitle className="text-base">Revoke award?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 mt-1">
            Remove <span className="font-medium text-slate-700">{revokeDialog.awardName}</span> from this student.
          </p>
          <DialogFooter className="mt-4 gap-2">
            <Button size="sm" variant="ghost" onClick={() => setRevokeDialog(d => ({ ...d, open: false }))}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={doRevoke}>
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog for ungranted awards */}
      <Dialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="size-5 text-amber-500" />
              <DialogTitle>Some awards not assigned</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              The following awards will <span className="font-semibold text-slate-800">not</span> be granted:
              <ul className="mt-2 space-y-1">
                {confirmDialog.ungrantedNames.map(name => (
                  <li key={name} className="text-sm text-amber-700">• {name}</li>
                ))}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog(d => ({ ...d, open: false }))}>
              Go back
            </Button>
            <Button onClick={() => doGrant(confirmDialog.entries)}>
              Continue anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
