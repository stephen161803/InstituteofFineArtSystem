import { useState, useEffect } from 'react';
import { competitionsApi, CompetitionDto, CriteriaDto } from '../../api/competitions';
import { awardsApi, AwardDto } from '../../api/awards';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import { Plus, Edit, Trash2, Search, X, Loader2, AlertTriangle, Trophy, Eye } from 'lucide-react';
import { toast } from 'sonner';

type CompetitionStatus = 'Upcoming' | 'Ongoing' | 'Completed';

interface CriteriaWeight { criteriaId: number; weightPercent: number; }
interface AwardEntry { awardName: string; description: string; }

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  criteria: CriteriaWeight[];
  awards: AwardEntry[];
}

const defaultForm: FormData = {
  title: '', description: '', startDate: '', endDate: '', criteria: [], awards: [],
};

export function ManageCompetitions() {
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [allCriteria, setAllCriteria] = useState<CriteriaDto[]>([]);
  const [allAwards, setAllAwards] = useState<AwardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Ongoing' | 'Upcoming' | 'Completed'>('Ongoing');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<CompetitionDto | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [showNewCriteria, setShowNewCriteria] = useState(false);
  const [newCriteriaName, setNewCriteriaName] = useState('');
  const [creatingCriteria, setCreatingCriteria] = useState(false);
  const [showNewAward, setShowNewAward] = useState(false);
  const [newAwardName, setNewAwardName] = useState('');
  const [newAwardDesc, setNewAwardDesc] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CompetitionDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detailCompetition, setDetailCompetition] = useState<CompetitionDto | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compsRes, subsRes, criteriaRes, awardsRes] = await Promise.all([
        competitionsApi.getAll(),
        submissionsApi.getAll(),
        competitionsApi.getCriteria(),
        awardsApi.getAwards(),
      ]);
      setCompetitions(compsRes);
      setSubmissions(subsRes);
      setAllCriteria(criteriaRes);
      setAllAwards(awardsRes);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetitions = competitions.filter(
    (c) =>
      c.status === statusFilter &&
      (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Criteria helpers
  const totalWeight = formData.criteria.reduce((s, c) => s + c.weightPercent, 0);
  const unusedCriteria = allCriteria.filter(c => !formData.criteria.find(fc => fc.criteriaId === c.id));

  // Awards helpers
  const unusedAwards = allAwards.filter(a => !formData.awards.find(fa => fa.awardName === a.awardName));

  const addAwardFromTemplate = (awardName: string) => {
    const template = allAwards.find(a => a.awardName === awardName);
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { awardName, description: template?.description ?? '' }],
    }));
  };

  const addCriteria = (criteriaId: number) => {
    const remaining = 100 - totalWeight;
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { criteriaId, weightPercent: remaining > 0 ? remaining : 0 }],
    }));
  };

  const removeCriteria = (criteriaId: number) => {
    setFormData(prev => ({ ...prev, criteria: prev.criteria.filter(c => c.criteriaId !== criteriaId) }));
  };

  const updateWeight = (criteriaId: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.criteriaId === criteriaId ? { ...c, weightPercent: value } : c),
    }));
  };

  const handleCreateCriteria = async () => {
    if (!newCriteriaName.trim()) return;
    setCreatingCriteria(true);
    try {
      const created = await competitionsApi.createCriteria(newCriteriaName.trim());
      setAllCriteria(prev => [...prev, created]);
      // Auto-add to form
      const remaining = 100 - totalWeight;
      setFormData(prev => ({
        ...prev,
        criteria: [...prev.criteria, { criteriaId: created.id, weightPercent: remaining > 0 ? remaining : 0 }],
      }));
      setNewCriteriaName('');
      setShowNewCriteria(false);
      toast.success(`Criteria "${created.criteriaName}" created and added`);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create criteria');
    } finally {
      setCreatingCriteria(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.criteria.length > 0 && totalWeight !== 100) {
      toast.error(`Total weight must be 100% (currently ${totalWeight}%)`);
      return;
    }
    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      toast.error('End date must be after start date');
      return;
    }
    try {
      if (editingCompetition) {
        await competitionsApi.update(editingCompetition.id, formData);
        toast.success('Competition updated successfully');
      } else {
        await competitionsApi.create(formData);
        toast.success('Competition created successfully');
      }
      await loadData();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save competition');
    }
  };

  const handleEdit = (competition: CompetitionDto) => {
    setEditingCompetition(competition);
    setFormData({
      title: competition.title,
      description: competition.description ?? '',
      startDate: competition.startDate.slice(0, 10),
      endDate: competition.endDate.slice(0, 10),
      criteria: competition.criteria.map(c => ({ criteriaId: c.criteriaId, weightPercent: c.weightPercent })),
      awards: competition.awards.map(a => ({ awardName: a.awardName, description: a.description ?? '' })),
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await competitionsApi.delete(deleteTarget.id);
      await loadData();
      toast.success('Competition deleted successfully');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete competition');
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingCompetition(null);
    setIsDialogOpen(false);
    setShowNewCriteria(false);
    setNewCriteriaName('');
    setShowNewAward(false);
    setNewAwardName('');
    setNewAwardDesc('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing':   return 'bg-green-100 text-green-800';
      case 'Upcoming':  return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-slate-100 text-slate-800';
      default:          return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Competitions</h1>
          <p className="text-slate-600">Create and manage art competitions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="size-4 mr-2" />Add Competition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompetition ? 'Edit Competition' : 'Create New Competition'}</DialogTitle>
              <DialogDescription>
                {editingCompetition ? 'Update competition details' : 'Enter details for the new competition'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} rows={3}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" type="date" required value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                  {formData.startDate && new Date(formData.startDate) < new Date(new Date().toDateString()) && (
                    <p className="text-xs text-amber-600">⚠️ Start date is in the past.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input id="endDate" type="date" required value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>

              {/* Criteria section */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Scoring Criteria</Label>
                  <span className={`text-xs font-medium ${totalWeight === 100 ? 'text-green-600' : totalWeight > 100 ? 'text-red-600' : 'text-slate-500'}`}>
                    Total: {totalWeight}% {totalWeight === 100 ? '✓' : `(need ${100 - totalWeight}% more)`}
                  </span>
                </div>

                {/* Added criteria */}
                {formData.criteria.map(fc => {
                  const crit = allCriteria.find(c => c.id === fc.criteriaId);
                  return (
                    <div key={fc.criteriaId} className="flex items-center gap-2">
                      <span className="flex-1 text-sm font-medium">{crit?.criteriaName ?? fc.criteriaId}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number" min={1} max={100} className="w-20 h-8 text-sm text-center"
                          value={fc.weightPercent}
                          onChange={e => updateWeight(fc.criteriaId, Number(e.target.value))}
                        />
                        <span className="text-sm text-slate-500">%</span>
                      </div>
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeCriteria(fc.criteriaId)}>
                        <X className="size-3 text-red-500" />
                      </Button>
                    </div>
                  );
                })}

                {/* Add criteria dropdown */}
                {unusedCriteria.length > 0 && (
                  <Select onValueChange={v => addCriteria(Number(v))} value="">
                    <SelectTrigger className="h-8 text-sm border-dashed">
                      <SelectValue placeholder="+ Add criteria..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unusedCriteria.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.criteriaName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {formData.criteria.length === 0 && (
                  <p className="text-xs text-slate-400">No criteria added. Criteria are optional.</p>
                )}

                {/* Inline create new criteria */}
                {!showNewCriteria ? (
                  <button type="button" onClick={() => setShowNewCriteria(true)}
                    className="text-xs text-purple-600 hover:underline mt-1">
                    + Create new criteria
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      autoFocus
                      placeholder="Criteria name (e.g. Originality)"
                      value={newCriteriaName}
                      onChange={e => setNewCriteriaName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCriteria(); } }}
                      className="h-8 text-sm flex-1"
                    />
                    <Button type="button" size="sm" onClick={handleCreateCriteria} disabled={creatingCriteria || !newCriteriaName.trim()}>
                      {creatingCriteria ? <Loader2 className="size-3 animate-spin" /> : 'Add'}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowNewCriteria(false); setNewCriteriaName(''); }}>
                      <X className="size-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Awards section */}
              <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Label className="font-semibold flex items-center gap-1.5">
                  <Trophy className="size-4 text-yellow-600" />Awards
                </Label>

                {formData.awards.map((aw, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-medium">🏆 {aw.awardName}</span>
                    <span className="text-xs text-slate-500 flex-1 truncate">{aw.description}</span>
                    <Button type="button" size="sm" variant="ghost"
                      onClick={() => setFormData(prev => ({ ...prev, awards: prev.awards.filter((_, i) => i !== idx) }))}>
                      <X className="size-3 text-red-500" />
                    </Button>
                  </div>
                ))}

                {formData.awards.length === 0 && (
                  <p className="text-xs text-slate-400">No awards added.</p>
                )}

                {/* Pick from existing awards */}
                {unusedAwards.length > 0 && (
                  <Select onValueChange={v => addAwardFromTemplate(v)} value="">
                    <SelectTrigger className="h-8 text-sm border-dashed">
                      <SelectValue placeholder="+ Pick existing award..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unusedAwards.map(a => (
                        <SelectItem key={a.id} value={a.awardName}>🏆 {a.awardName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Create new award */}
                {!showNewAward ? (
                  <button type="button" onClick={() => setShowNewAward(true)}
                    className="text-xs text-yellow-700 hover:underline mt-1">
                    + Create new award
                  </button>
                ) : (
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Input
                        autoFocus
                        placeholder="Award name (e.g. Best Artwork)"
                        value={newAwardName}
                        onChange={e => setNewAwardName(e.target.value)}
                        className="h-8 text-sm flex-1"
                      />
                      <Button type="button" size="sm" variant="ghost"
                        onClick={() => { setShowNewAward(false); setNewAwardName(''); setNewAwardDesc(''); }}>
                        <X className="size-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Description (optional)"
                        value={newAwardDesc}
                        onChange={e => setNewAwardDesc(e.target.value)}
                        className="h-8 text-sm flex-1"
                      />
                      <Button type="button" size="sm"
                        disabled={!newAwardName.trim() || !!formData.awards.find(a => a.awardName === newAwardName.trim())}
                        onClick={() => {
                          const name = newAwardName.trim();
                          if (!name) return;
                          setFormData(prev => ({ ...prev, awards: [...prev.awards, { awardName: name, description: newAwardDesc }] }));
                          setNewAwardName(''); setNewAwardDesc(''); setShowNewAward(false);
                        }}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingCompetition ? 'Update' : 'Create'} Competition</Button>
              </div>            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Competitions</CardTitle>
          <CardDescription>Create and manage art competitions</CardDescription>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {(['Ongoing', 'Upcoming', 'Completed'] as const).map((s) => (
              <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => setStatusFilter(s)} className={statusFilter === s ? '' : 'text-slate-600'}>
                {s}
                <span className="ml-1.5 text-xs opacity-70">({competitions.filter(c => c.status === s).length})</span>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Search className="size-4" />
            <Input placeholder="Search competitions..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompetitions.map((competition) => {
              const submissionCount = submissions.filter((s) => s.competitionId === competition.id).length;
              return (
                <Card key={competition.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{competition.title}</h3>
                          <Badge className={getStatusColor(competition.status)}>{competition.status}</Badge>
                        </div>
                        {competition.description && (
                          <p className="text-sm text-slate-600 mb-3">{competition.description}</p>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-slate-600">Start:</span>{' '}
                            <span className="font-medium">{new Date(competition.startDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">End:</span>{' '}
                            <span className="font-medium">{new Date(competition.endDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Submissions:</span>{' '}
                            <span className="font-medium">{submissionCount}</span>
                          </div>
                        </div>
                        {competition.criteria.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competition.criteria.map(c => (
                              <Badge key={c.id} variant="outline" className="text-xs">
                                {c.criteriaName} {c.weightPercent}%
                              </Badge>
                            ))}
                          </div>
                        )}
                        {competition.awards.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competition.awards.map(a => (
                              <Badge key={a.id} className="text-xs bg-yellow-100 text-yellow-800">
                                🏆 {a.awardName}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setDetailCompetition(competition)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(competition)}>
                          <Edit className="size-4" />
                        </Button>
                        {competition.status === 'Upcoming' && (
                          <Button size="sm" variant="outline" onClick={() => setDeleteTarget(competition)}>
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredCompetitions.length === 0 && (
            <p className="text-center text-slate-500 py-8">No competitions found</p>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailCompetition} onOpenChange={(open) => { if (!open) setDetailCompetition(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailCompetition?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge className={getStatusColor(detailCompetition?.status ?? '')}>{detailCompetition?.status}</Badge>
              <span>{detailCompetition && new Date(detailCompetition.startDate).toLocaleDateString()} — {detailCompetition && new Date(detailCompetition.endDate).toLocaleDateString()}</span>
            </DialogDescription>
          </DialogHeader>
          {detailCompetition && (
            <div className="space-y-4">
              {detailCompetition.description && (
                <p className="text-sm text-slate-600">{detailCompetition.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Submissions</p>
                  <p className="font-bold text-lg">{submissions.filter(s => s.competitionId === detailCompetition.id).length}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Awards</p>
                  <p className="font-bold text-lg">{detailCompetition.awards.length}</p>
                </div>
              </div>
              {detailCompetition.criteria.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Scoring Criteria</p>
                  <div className="space-y-1">
                    {detailCompetition.criteria.map(c => (
                      <div key={c.id} className="flex justify-between text-sm p-2 bg-slate-50 rounded">
                        <span>{c.criteriaName}</span>
                        <span className="font-medium text-purple-600">{c.weightPercent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {detailCompetition.awards.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Awards</p>
                  <div className="space-y-1">
                    {detailCompetition.awards.map(a => (
                      <div key={a.id} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                        <span>🏆</span>
                        <div>
                          <p className="text-sm font-medium">{a.awardName}</p>
                          {a.description && <p className="text-xs text-slate-500">{a.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDetailCompetition(null)}>Close</Button>
                <Button onClick={() => { setDetailCompetition(null); handleEdit(detailCompetition); }}>
                  <Edit className="size-4 mr-2" />Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <DialogTitle>Delete Competition</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">"{deleteTarget?.title}"</span>?
              <br />
              <span className="text-red-600 text-xs mt-1 block">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
