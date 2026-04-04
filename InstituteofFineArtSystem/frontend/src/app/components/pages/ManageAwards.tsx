import { useState, useEffect, useMemo, useRef } from 'react';
import { awardsApi, type StudentAwardDto, type CompetitionAwardDto } from '../../api/awards';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { competitionsApi, type CompetitionDto, type CompetitionCriteriaDto } from '../../api/competitions';
import { usersApi, type StudentDto } from '../../api/users';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Trophy, Loader2, ChevronUp, ChevronDown, Search, ArrowUpRight, X } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'progress'>('progress');
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

  const completedWithAwards = competitions.filter(c => c.status === 'Completed' && c.awards.length > 0);
  const ungrantedCompetitions = completedWithAwards.filter(c =>
    c.awards.some(a => !studentAwards.some(sa => sa.competitionAwardId === a.id))
  );
  const fullyGranted = completedWithAwards.filter(c =>
    c.awards.every(a => studentAwards.some(sa => sa.competitionAwardId === a.id))
  );

  const filteredCompetitions = completedWithAwards
    .filter(c => {
      if (statusFilter === 'pending') return ungrantedCompetitions.some(u => u.id === c.id);
      if (statusFilter === 'done') return fullyGranted.some(f => f.id === c.id);
      return true;
    })
    .filter(c => !searchQuery.trim() || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      const pA = a.awards.filter(aw => studentAwards.some(sa => sa.competitionAwardId === aw.id)).length / (a.awards.length || 1);
      const pB = b.awards.filter(aw => studentAwards.some(sa => sa.competitionAwardId === aw.id)).length / (b.awards.length || 1);
      return pA - pB;
    });

  const unreviewedCount = useMemo(() => {
    if (!selectedCompetitionId) return 0;
    return submissions.filter(s => s.competitionId === Number(selectedCompetitionId) && !s.review).length;
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
      className={`flex items-center gap-0.5 hover:text-purple-600 transition-colors ${sortKey === k ? 'text-purple-600 font-semibold' : ''}`}>
      {label}
      {sortKey === k ? (sortDir === 'desc' ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />) : null}
    </button>
  );

  const awardGrantedTo = (awardId: number) => studentAwards.find(a => a.competitionAwardId === awardId);

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
      try { await awardsApi.grantAward(subId, awardId); success++; }
      catch (err: any) { toast.error(err.message ?? 'Failed'); }
    }
    const updated = await awardsApi.getStudentAwards();
    setStudentAwards(updated);
    setPending({});
    setSaving(false);
    if (success > 0) toast.success(`${success} award(s) issued`);
  };

  const doRevoke = async () => {
    const { id } = revokeDialog;
    setRevokeDialog(d => ({ ...d, open: false }));
    try {
      await awardsApi.revokeAward(id);
      setStudentAwards(prev => prev.filter(a => a.id !== id));
      toast.success('Award revoked');
    } catch (err: any) { toast.error(err.message ?? 'Failed'); }
  };

  const [dialogSize, setDialogSize] = useState({ width: 900, height: 700 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, dir: '' });

  const startResize = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: dialogSize.width, h: dialogSize.height, dir };
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = ev.clientX - resizeStart.current.x;
      const dy = ev.clientY - resizeStart.current.y;
      setDialogSize(prev => ({
        width: dir.includes('e') ? Math.max(500, resizeStart.current.w + dx)
             : dir.includes('w') ? Math.max(500, resizeStart.current.w - dx)
             : prev.width,
        height: dir.includes('s') ? Math.max(300, resizeStart.current.h + dy)
              : dir.includes('n') ? Math.max(300, resizeStart.current.h - dy)
              : prev.height,
      }));
    };
    const onUp = () => { isResizing.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const openComp = (id: string) => {
    setSelectedCompetitionId(id);
    setPending({});
    setSortKey('totalScore');
  };

  const closeComp = () => {
    setSelectedCompetitionId('');
    setPending({});
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="size-8 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Awards</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {completedWithAwards.length} competitions · {ungrantedCompetitions.length} pending
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400 inline-block" /> Pending</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-green-500 inline-block" /> Done</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input placeholder="Search competition..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
        </div>
        <div className="flex rounded-lg border overflow-hidden text-sm">
          {([['all', 'All'], ['pending', 'Pending'], ['done', 'Done']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)}
              className={`px-3 py-1.5 transition-colors ${statusFilter === val ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {label}
              <span className={`ml-1.5 text-xs ${statusFilter === val ? 'text-slate-300' : 'text-slate-400'}`}>
                {val === 'all' ? completedWithAwards.length : val === 'pending' ? ungrantedCompetitions.length : fullyGranted.length}
              </span>
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="h-9 border rounded-lg px-3 text-sm bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200">
          <option value="progress">Sort: Progress</option>
          <option value="date">Sort: Date</option>
          <option value="title">Sort: Title A–Z</option>
        </select>
      </div>

      {/* Competition grid */}
      {filteredCompetitions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Trophy className="size-10 mb-3 text-slate-300" />
          <p className="text-sm">No competitions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitions.map(c => {
            const granted = c.awards.filter(a => studentAwards.some(sa => sa.competitionAwardId === a.id)).length;
            const total = c.awards.length;
            const pct = total > 0 ? (granted / total) * 100 : 0;
            const done = granted === total;
            return (
              <button key={c.id} onClick={() => openComp(String(c.id))}
                className="group text-left rounded-xl border bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{c.title}</h3>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {done ? 'Done' : 'Pending'}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{granted}/{total} awarded</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${done ? 'bg-green-500' : 'bg-amber-400'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {c.awards.map(a => {
                    const isGranted = studentAwards.some(sa => sa.competitionAwardId === a.id);
                    return (
                      <span key={a.id} className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${isGranted ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {AWARD_ICON[a.awardName] ?? '🏆'} {a.awardName}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(c.endDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Grant awards <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Award dialog */}
      <Dialog open={!!selectedCompetitionId} onOpenChange={open => { if (!open) closeComp(); }}>
        <DialogContent style={{ width: dialogSize.width, maxWidth: '95vw', height: dialogSize.height, maxHeight: '95vh' }} className="flex flex-col p-0 gap-0 overflow-visible [&>button:last-of-type]:hidden">
          {/* Resize handles */}
          <div onMouseDown={e => startResize(e, 'e')} className="absolute right-0 top-4 bottom-4 w-1.5 cursor-ew-resize hover:bg-purple-300/50 rounded-full z-50" />
          <div onMouseDown={e => startResize(e, 'w')} className="absolute left-0 top-4 bottom-4 w-1.5 cursor-ew-resize hover:bg-purple-300/50 rounded-full z-50" />
          <div onMouseDown={e => startResize(e, 's')} className="absolute bottom-0 left-4 right-4 h-1.5 cursor-ns-resize hover:bg-purple-300/50 rounded-full z-50" />
          <div onMouseDown={e => startResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end pr-1 pb-1">
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-slate-400"><path d="M7 1L1 7M7 4L4 7M7 7L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-semibold truncate">{comp?.title}</DialogTitle>
                <p className="text-sm text-slate-500 mt-0.5">{sorted.length} submissions</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {unreviewedCount > 0 && (
                  <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50 text-xs"
                    onClick={() => navigate(`/dashboard/submissions?competitionId=${selectedCompetitionId}`)}>
                    {unreviewedCount} unreviewed — Go review
                  </Button>
                )}
                <Button disabled={pendingCount === 0 || saving || unreviewedCount > 0} onClick={handleGrantAll} size="sm"
                  className={`gap-1.5 transition-colors ${pendingCount > 0 && unreviewedCount === 0 ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Trophy className="size-3.5" />}
                  Grant {pendingCount > 0 ? `(${pendingCount})` : 'Selected'}
                </Button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button onClick={closeComp} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="size-4" />
                </button>
              </div>
            </div>
            {/* Ungranted awards summary */}
            {(() => {
              const ungranted = awards.filter(a => !studentAwards.some(sa => sa.competitionAwardId === a.id));
              if (ungranted.length === 0) return null;
              return (
                <p className="text-xs text-slate-400 mt-2">
                  Not yet granted: {ungranted.map(a => a.awardName).join(', ')}
                </p>
              );
            })()}
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <p className="text-sm">No submissions for this competition</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-8">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Submission</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <SortBtn k="totalScore" label="Score" />
                    </th>
                    {criteria.map(c => (
                      <th key={c.criteriaId} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        <SortBtn k={String(c.criteriaId)} label={`${c.criteriaName ?? c.criteriaCode} (${c.weightPercent}%)`} />
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-[200px]">Awards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((row, idx) => {
                    const pendingSet = pending[row.s.id] ?? new Set<number>();
                    const pendingList = awards.filter(a => pendingSet.has(a.id));
                    const hasActivity = row.grantedAwards.length > 0 || pendingSet.size > 0;
                    return (
                      <tr key={row.s.id} className={`hover:bg-slate-50/80 transition-colors ${hasActivity ? 'bg-purple-50/30' : ''}`}>
                        <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{row.student?.fullName ?? row.s.studentName ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{row.s.title ?? '—'}</td>
                        <td className="px-4 py-3 font-bold text-purple-700">
                          {criteria.length > 0 ? row.total.toFixed(1) : '—'}
                        </td>
                        {criteria.map(c => (
                          <td key={c.criteriaId} className="px-4 py-3 text-center text-slate-600">
                            {row.scores[c.criteriaId] ?? <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          {row.s.review ? (
                            <Badge className={
                              row.s.review.ratingLevel === 'Best' ? 'bg-green-100 text-green-800 border-0' :
                              row.s.review.ratingLevel === 'Better' ? 'bg-blue-100 text-blue-800 border-0' :
                              row.s.review.ratingLevel === 'Good' ? 'bg-purple-100 text-purple-800 border-0' :
                              'bg-slate-100 text-slate-600 border-0'
                            }>{row.s.review.ratingLevel}</Badge>
                          ) : <span className="text-xs text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {row.grantedAwards.map(g => (
                              <span key={g.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 whitespace-nowrap">
                                {AWARD_ICON[g.awardName ?? ''] ?? '🏆'} {g.awardName}
                                <button onClick={() => setRevokeDialog({ open: true, id: g.id, awardName: g.awardName ?? '' })}
                                  className="ml-0.5 text-yellow-500 hover:text-red-500 transition-colors">×</button>
                              </span>
                            ))}
                            {pendingList.map(a => (
                              <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">
                                {AWARD_ICON[a.awardName] ?? '🏆'} {a.awardName}
                                <button onClick={() => togglePending(row.s.id, a.id)}
                                  className="ml-0.5 text-purple-400 hover:text-red-500 transition-colors">×</button>
                              </span>
                            ))}
                            <Select value="" onValueChange={v => togglePending(row.s.id, Number(v))}>
                              <SelectTrigger className="h-6 w-28 text-xs border-dashed border-slate-300 text-slate-400 hover:border-purple-400 hover:text-purple-600 transition-colors">
                                <SelectValue placeholder="+ Award" />
                              </SelectTrigger>
                              <SelectContent>
                                {awards
                                  .filter(a => !row.grantedAwards.find(g => g.competitionAwardId === a.id) && !pendingSet.has(a.id))
                                  .map(a => {
                                    const taken = awardGrantedTo(a.id);
                                    const takenByOther = taken && taken.submissionId !== row.s.id;
                                    const pendingByOther = !takenByOther && Object.entries(pending).some(
                                      ([sid, set]) => Number(sid) !== row.s.id && set.has(a.id)
                                    );
                                    return (
                                      <SelectItem key={a.id} value={String(a.id)} disabled={!!takenByOther || pendingByOther}>
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
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke dialog */}
      <Dialog open={revokeDialog.open} onOpenChange={open => setRevokeDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Revoke award?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Remove <span className="font-medium text-slate-700">{revokeDialog.awardName}</span> from this student.
          </p>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="ghost" onClick={() => setRevokeDialog(d => ({ ...d, open: false }))}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={doRevoke}>Revoke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm partial grant dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Proceed without all awards?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Not assigned: <span className="font-medium text-slate-700">{confirmDialog.ungrantedNames.join(', ')}</span>
          </p>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="ghost" onClick={() => setConfirmDialog(d => ({ ...d, open: false }))}>Go back</Button>
            <Button size="sm" onClick={() => doGrant(confirmDialog.entries)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
