import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { exhibitionsApi, type ExhibitionDto, type ExhibitionSubmissionDto } from '../../api/exhibitions';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { usersApi, type StudentDto } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Plus, FileText, DollarSign, Eye, Loader2, Search, Pencil, Trash2, MapPin, Calendar, ExternalLink, ChevronsUpDown, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

const STATUS_COLOR: Record<string, string> = {
  Ongoing: 'bg-green-100 text-green-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Planned: 'bg-slate-100 text-slate-600',
  Completed: 'bg-purple-100 text-purple-700',
};

const emptyForm = { title: '', location: '', startDate: '', endDate: '' };

export function ManageExhibitions() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'manager';
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SubmissionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // filters
  const [exhibitionStatusFilter, setExhibitionStatusFilter] = useState('all');
  const [artworkStatusFilter, setArtworkStatusFilter] = useState('all');
  const [exhibitionSearch, setExhibitionSearch] = useState('');
  const [artworkSearch, setArtworkSearch] = useState('');

  // dialogs
  const [exhibitionDialog, setExhibitionDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; exhibition?: ExhibitionDto }>({ open: false, mode: 'add' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; exhibition?: ExhibitionDto }>({ open: false });
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [exhibitionComboOpen, setExhibitionComboOpen] = useState(false);
  const [artworkDetail, setArtworkDetail] = useState<ExhibitionSubmissionDto | null>(null);

  // forms
  const [exhibitionForm, setExhibitionForm] = useState(emptyForm);
  const [submissionForm, setSubmissionForm] = useState({ submissionId: '', exhibitionId: '', proposedPrice: '' });

  useEffect(() => {
    Promise.all([
      exhibitionsApi.getAll(),
      submissionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([exhs, subs, studs]) => {
      setExhibitions(exhs); setAllSubmissions(subs); setStudents(studs);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const allExhibitionSubmissions: ExhibitionSubmissionDto[] = exhibitions.flatMap(e => e.submissions);
  const soldSubmissionIds = new Set(allExhibitionSubmissions.filter(es => es.status === 'Sold').map(es => es.submissionId));
  const bestSubmissions = allSubmissions.filter(s => s.review?.ratingLevel === 'Best' && !soldSubmissionIds.has(s.id));

  const filteredExhibitions = useMemo(() => exhibitions
    .filter(e => exhibitionStatusFilter === 'all' || (e.status ?? '').toLowerCase() === exhibitionStatusFilter.toLowerCase())
    .filter(e => !exhibitionSearch.trim() || e.title.toLowerCase().includes(exhibitionSearch.toLowerCase()) || (e.location ?? '').toLowerCase().includes(exhibitionSearch.toLowerCase())),
    [exhibitions, exhibitionStatusFilter, exhibitionSearch]);

  const filteredArtworks = useMemo(() => allExhibitionSubmissions
    .filter(es => artworkStatusFilter === 'all' || es.status === artworkStatusFilter)
    .filter(es => !artworkSearch.trim() ||
      (es.submissionTitle ?? '').toLowerCase().includes(artworkSearch.toLowerCase()) ||
      (es.studentName ?? '').toLowerCase().includes(artworkSearch.toLowerCase())),
    [allExhibitionSubmissions, artworkStatusFilter, artworkSearch]);

  const canDelete = (ex: ExhibitionDto) => {
    if (ex.status === 'Ongoing') return false;
    if (ex.submissions.some(s => s.status === 'Sold')) return false;
    return true;
  };

  const canEdit = (ex: ExhibitionDto) => ex.status !== 'Completed';

  const openAdd = () => {
    setExhibitionForm(emptyForm);
    setExhibitionDialog({ open: true, mode: 'add' });
  };

  const openEdit = (ex: ExhibitionDto) => {
    setExhibitionForm({
      title: ex.title,
      location: ex.location ?? '',
      startDate: ex.startDate ? ex.startDate.slice(0, 10) : '',
      endDate: ex.endDate ? ex.endDate.slice(0, 10) : '',
    });
    setExhibitionDialog({ open: true, mode: 'edit', exhibition: ex });
  };

  const handleExhibitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: exhibitionForm.title,
        location: exhibitionForm.location || undefined,
        startDate: exhibitionForm.startDate || undefined,
        endDate: exhibitionForm.endDate || undefined,
      };
      if (exhibitionDialog.mode === 'edit' && exhibitionDialog.exhibition) {
        await exhibitionsApi.update(exhibitionDialog.exhibition.id, payload);
        toast.success('Exhibition updated');
      } else {
        await exhibitionsApi.create(payload);
        toast.success('Exhibition added');
      }
      setExhibitions(await exhibitionsApi.getAll());
      setExhibitionDialog({ open: false, mode: 'add' });
    } catch (err: any) {
      toast.error(err.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.exhibition) return;
    setSaving(true);
    try {
      await exhibitionsApi.delete(deleteDialog.exhibition.id);
      setExhibitions(prev => prev.filter(e => e.id !== deleteDialog.exhibition!.id));
      toast.success('Exhibition deleted');
      setDeleteDialog({ open: false });
    } catch (err: any) {
      toast.error(err.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionForm.submissionId || !submissionForm.exhibitionId) {
      toast.error('Please fill in all required fields'); return;
    }
    const selectedEx = exhibitions.find(ex => String(ex.id) === submissionForm.exhibitionId);
    if (selectedEx?.status === 'Completed') {
      toast.error('Cannot add artwork to a completed exhibition'); return;
    }
    setSaving(true);
    try {
      await exhibitionsApi.addSubmission(
        Number(submissionForm.exhibitionId),
        Number(submissionForm.submissionId),
        parseFloat(submissionForm.proposedPrice) || 0,
      );
      setExhibitions(await exhibitionsApi.getAll());
      toast.success('Artwork added to exhibition');
      setSubmissionForm({ submissionId: '', exhibitionId: '', proposedPrice: '' });
      setIsSubmissionDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="size-8 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Exhibitions</h1>
        <p className="text-slate-600">Organize exhibitions and track artwork sales</p>
      </div>

      <Tabs defaultValue="exhibitions">
        <TabsList>
          <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          <TabsTrigger value="exhibited-works">Exhibited Artworks</TabsTrigger>
        </TabsList>

        {/* ── EXHIBITIONS TAB ── */}
        <TabsContent value="exhibitions" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input placeholder="Search title or location..." value={exhibitionSearch}
                onChange={e => setExhibitionSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            {/* Status filter */}
            <div className="flex rounded-lg border overflow-hidden text-sm">
              {(['all', 'Ongoing', 'Upcoming', 'Planned', 'Completed'] as const).map(s => (
                <button key={s} onClick={() => setExhibitionStatusFilter(s)}
                  className={`px-3 py-1.5 transition-colors ${exhibitionStatusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s === 'all' ? 'All' : s}
                  <span className={`ml-1 text-xs ${exhibitionStatusFilter === s ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({s === 'all' ? exhibitions.length : exhibitions.filter(e => (e.status ?? '') === s).length})
                  </span>
                </button>
              ))}
            </div>
            {!isManager && (
            <Button onClick={openAdd} className="ml-auto">
              <Plus className="size-4 mr-2" />Add Exhibition
            </Button>
            )}
          </div>

          {filteredExhibitions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText className="size-10 mb-3 text-slate-300" />
              <p className="text-sm">No exhibitions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExhibitions.map(ex => {
                const artworkCount = ex.submissions.length;
                const thumbnails = ex.submissions.slice(0, 4);
                const deletable = canDelete(ex);
                const editable = canEdit(ex);
                return (
                  <Card key={ex.id}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-3 rounded-full shrink-0">
                          <FileText className="size-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-base truncate">{ex.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[ex.status] ?? 'bg-slate-100 text-slate-600'}`}>
                              {ex.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{ex.location}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {ex.startDate && new Date(ex.startDate).toLocaleDateString()} –{' '}
                            {ex.endDate && new Date(ex.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {thumbnails.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {thumbnails.map((es, idx) => (
                            <div key={idx} className="aspect-square rounded-md overflow-hidden bg-slate-100">
                              {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle ?? ''} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                          <p className="text-sm text-slate-400">No artworks yet</p>
                        </div>
                      )}
                      {artworkCount > 4 && (
                        <p className="text-xs text-slate-400 text-center">+{artworkCount - 4} more</p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/dashboard/exhibitions/${ex.id}`)} disabled={artworkCount === 0}>
                          <Eye className="size-3.5 mr-1.5" />View ({artworkCount})
                        </Button>
                        {!isManager && (
                          <Button variant="outline" size="sm" onClick={() => openEdit(ex)} disabled={!editable}
                            title={!editable ? 'Cannot edit a completed exhibition' : ''}>
                            <Pencil className="size-3.5" />
                          </Button>
                        )}
                        {!isManager && (
                          <Button variant="outline" size="sm"
                            className={deletable ? 'text-red-500 hover:bg-red-50 hover:border-red-300' : 'opacity-40 cursor-not-allowed'}
                            onClick={() => deletable && setDeleteDialog({ open: true, exhibition: ex })}
                            title={!deletable ? (ex.status === 'Ongoing' ? 'Cannot delete an ongoing exhibition' : 'Cannot delete: has sold artworks') : 'Delete exhibition'}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── EXHIBITED ARTWORKS TAB ── */}
        <TabsContent value="exhibited-works" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input placeholder="Search artwork or student..." value={artworkSearch}
                onChange={e => setArtworkSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <div className="flex rounded-lg border overflow-hidden text-sm">
              {(['all', 'Available', 'Sold', 'Returned'] as const).map(s => (
                <button key={s} onClick={() => setArtworkStatusFilter(s)}
                  className={`px-3 py-1.5 transition-colors ${artworkStatusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s === 'all' ? 'All' : s}
                  <span className={`ml-1 text-xs ${artworkStatusFilter === s ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({s === 'all' ? allExhibitionSubmissions.length : allExhibitionSubmissions.filter(es => es.status === s).length})
                  </span>
                </button>
              ))}
            </div>
            {!isManager && (
            <Button onClick={() => setIsSubmissionDialogOpen(true)} className="ml-auto">
              <Plus className="size-4 mr-2" />Add Artwork
            </Button>
            )}
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-sm">No artworks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtworks.map(es => {
                const exhibition = exhibitions.find(e => e.id === es.exhibitionId);
                return (
                  <Card key={es.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setArtworkDetail(es)}>
                    {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle ?? ''} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-0.5">{es.submissionTitle}</h4>
                      <p className="text-sm text-slate-500">By {es.studentName}</p>
                      <p className="text-sm text-slate-400 mb-2">{exhibition?.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <DollarSign className="size-4" />{es.proposedPrice.toLocaleString('en-US')}
                        </div>
                        <Badge variant={es.status === 'Sold' ? 'default' : 'secondary'}>{es.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── ADD / EDIT EXHIBITION DIALOG ── */}
      <Dialog open={exhibitionDialog.open} onOpenChange={open => setExhibitionDialog(d => ({ ...d, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{exhibitionDialog.mode === 'edit' ? 'Edit Exhibition' : 'Add New Exhibition'}</DialogTitle>
            <DialogDescription>{exhibitionDialog.mode === 'edit' ? 'Update exhibition details.' : 'Fill in the details for the new exhibition.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExhibitionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input required value={exhibitionForm.title} onChange={e => setExhibitionForm({ ...exhibitionForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={exhibitionForm.location} onChange={e => setExhibitionForm({ ...exhibitionForm, location: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={exhibitionForm.startDate} onChange={e => setExhibitionForm({ ...exhibitionForm, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={exhibitionForm.endDate} onChange={e => setExhibitionForm({ ...exhibitionForm, endDate: e.target.value })} />
              </div>
            </div>
            {exhibitionForm.startDate && exhibitionForm.endDate && exhibitionForm.endDate < exhibitionForm.startDate && (
              <p className="text-xs text-red-500">End date must be after start date.</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setExhibitionDialog(d => ({ ...d, open: false }))}>Cancel</Button>
              <Button type="submit" disabled={saving || (!!exhibitionForm.startDate && !!exhibitionForm.endDate && exhibitionForm.endDate < exhibitionForm.startDate)}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                {exhibitionDialog.mode === 'edit' ? 'Save Changes' : 'Add Exhibition'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM DIALOG ── */}
      <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete exhibition?</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-medium text-slate-700">"{deleteDialog.exhibition?.title}"</span> and all its artworks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── ADD ARTWORK DIALOG ── */}
      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Artwork to Exhibition</DialogTitle>
            <DialogDescription>Select a best-rated artwork to add to an exhibition.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmissionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Exhibition *</Label>
              <Popover open={exhibitionComboOpen} onOpenChange={setExhibitionComboOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={exhibitionComboOpen}
                    className="w-full justify-between font-normal">
                    {submissionForm.exhibitionId
                      ? exhibitions.find(e => String(e.id) === submissionForm.exhibitionId)?.title
                      : 'Select exhibition...'}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search exhibition..." />
                    <CommandList>
                      <CommandEmpty>No exhibition found.</CommandEmpty>
                      <CommandGroup>
                        {exhibitions.map(e => {
                          const isCompleted = e.status === 'Completed';
                          return (
                            <CommandItem key={e.id} value={e.title}
                              disabled={isCompleted}
                              onSelect={() => {
                                if (isCompleted) return;
                                setSubmissionForm({ ...submissionForm, exhibitionId: String(e.id) });
                                setExhibitionComboOpen(false);
                              }}>
                              <Check className={`mr-2 size-4 ${submissionForm.exhibitionId === String(e.id) ? 'opacity-100' : 'opacity-0'}`} />
                              <span className={isCompleted ? 'text-slate-400' : ''}>{e.title}</span>
                              <span className={`ml-auto text-xs ${isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>{e.status}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Artwork (Best Rated Only) *</Label>
              <Select value={submissionForm.submissionId} onValueChange={v => {
                const sub = bestSubmissions.find(s => String(s.id) === v);
                setSubmissionForm({ ...submissionForm, submissionId: v, proposedPrice: sub ? String(sub.proposedPrice) : submissionForm.proposedPrice });
              }}>
                <SelectTrigger><SelectValue placeholder="Select artwork" /></SelectTrigger>
                <SelectContent>
                  {bestSubmissions.map(s => {
                    const student = students.find(st => st.userId === s.studentId);
                    return <SelectItem key={s.id} value={String(s.id)}>{s.title} — {student?.fullName ?? s.studentName}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Proposed Price *</Label>
              <Input type="number" required placeholder="Enter price" value={submissionForm.proposedPrice}
                onChange={e => setSubmissionForm({ ...submissionForm, proposedPrice: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Add to Exhibition
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* ── ARTWORK DETAIL DIALOG ── */}
      {artworkDetail && (() => {
        const ex = exhibitions.find(e => e.id === artworkDetail.exhibitionId);
        return (
          <Dialog open={!!artworkDetail} onOpenChange={open => { if (!open) setArtworkDetail(null); }}>
            <DialogContent className="max-w-lg p-0 overflow-hidden">
              {artworkDetail.workUrl && (
                <div className="relative h-64 bg-slate-100">
                  <img src={artworkDetail.workUrl} alt={artworkDetail.submissionTitle ?? ''} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge className={artworkDetail.status === 'Sold' ? 'bg-green-600 text-white' : artworkDetail.status === 'Returned' ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white'}>
                      {artworkDetail.status}
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-5 space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-xl">{artworkDetail.submissionTitle}</DialogTitle>
                  <DialogDescription>By {artworkDetail.studentName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-sm">
                  {ex && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="size-4 shrink-0 text-purple-500" />
                      <span>{ex.title}</span>
                    </div>
                  )}
                  {ex?.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="size-4 shrink-0 text-slate-400" />
                      <span>{ex.location}</span>
                    </div>
                  )}
                  {ex?.startDate && ex?.endDate && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="size-4 shrink-0 text-slate-400" />
                      <span>{new Date(ex.startDate).toLocaleDateString()} – {new Date(ex.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 border p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proposed price</span>
                    <span className="font-semibold">${artworkDetail.proposedPrice.toLocaleString('en-US')}</span>
                  </div>
                  {artworkDetail.sale && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sold price</span>
                        <span className="font-semibold text-green-700">${artworkDetail.sale.soldPrice.toLocaleString('en-US')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer</span>
                        <span className="font-medium">{artworkDetail.sale.customerName ?? '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sale date</span>
                        <span>{new Date(artworkDetail.sale.soldDate).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setArtworkDetail(null)}>Close</Button>
                  {ex && (
                    <Button onClick={() => { setArtworkDetail(null); navigate(`/dashboard/exhibitions/${ex.id}`); }}>
                      <ExternalLink className="size-4 mr-2" />View Exhibition
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
