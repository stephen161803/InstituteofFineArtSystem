import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { exhibitionsApi, type ExhibitionDto, type ExhibitionSubmissionDto } from '../../api/exhibitions';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { usersApi, type StudentDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, FileText, DollarSign, Eye, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export function ManageExhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SubmissionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExhibitionDialogOpen, setIsExhibitionDialogOpen] = useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exhibitionStatusFilter, setExhibitionStatusFilter] = useState<string>('all');
  const [artworkStatusFilter, setArtworkStatusFilter] = useState<string>('all');
  const [exhibitionForm, setExhibitionForm] = useState({ title: '', location: '', startDate: '', endDate: '' });
  const [submissionForm, setSubmissionForm] = useState({ submissionId: '', exhibitionId: '', proposedPrice: '' });

  useEffect(() => {
    Promise.all([
      exhibitionsApi.getAll(),
      submissionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([exhs, subs, studs]) => {
      setExhibitions(exhs);
      setAllSubmissions(subs);
      setStudents(studs);
    }).catch(() => toast.error('Failed to load exhibitions'))
      .finally(() => setLoading(false));
  }, []);

  // All exhibition submissions flattened
  const allExhibitionSubmissions: ExhibitionSubmissionDto[] = exhibitions.flatMap(e => e.submissions);

  const filteredExhibitions = exhibitionStatusFilter === 'all'
    ? exhibitions
    : exhibitions.filter(e => (e.status ?? '').toLowerCase() === exhibitionStatusFilter.toLowerCase());

  const filteredArtworks = artworkStatusFilter === 'all'
    ? allExhibitionSubmissions
    : allExhibitionSubmissions.filter(es => es.status === artworkStatusFilter);

  // Best-rated submissions (have a 'Best' review)
  const bestSubmissions = allSubmissions.filter(s => s.review?.ratingLevel === 'Best');

  const handleExhibitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await exhibitionsApi.create({
        title: exhibitionForm.title,
        location: exhibitionForm.location || undefined,
        startDate: exhibitionForm.startDate || undefined,
        endDate: exhibitionForm.endDate || undefined,
      });
      const updated = await exhibitionsApi.getAll();
      setExhibitions(updated);
      toast.success('Exhibition added successfully');
      setExhibitionForm({ title: '', location: '', startDate: '', endDate: '' });
      setIsExhibitionDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add exhibition');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionForm.submissionId || !submissionForm.exhibitionId) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await exhibitionsApi.addSubmission(
        Number(submissionForm.exhibitionId),
        Number(submissionForm.submissionId),
        parseFloat(submissionForm.proposedPrice) || 0,
      );
      const updated = await exhibitionsApi.getAll();
      setExhibitions(updated);
      toast.success('Artwork added to exhibition');
      setSubmissionForm({ submissionId: '', exhibitionId: '', proposedPrice: '' });
      setIsSubmissionDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add artwork');
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
      <div>
        <h1 className="text-3xl font-bold">Manage Exhibitions</h1>
        <p className="text-slate-600">Organize exhibitions and track artwork sales</p>
      </div>

      <Tabs defaultValue="exhibitions">
        <TabsList>
          <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          <TabsTrigger value="exhibited-works">Exhibited Artworks</TabsTrigger>
        </TabsList>

        <TabsContent value="exhibitions" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'Ongoing', 'Upcoming', 'Completed'] as const).map(s => (
                <Button key={s} size="sm"
                  variant={exhibitionStatusFilter === s ? 'default' : 'outline'}
                  onClick={() => setExhibitionStatusFilter(s)}>
                  {s === 'all' ? 'All' : s}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({s === 'all' ? exhibitions.length : exhibitions.filter(e => (e.status ?? '') === s).length})
                  </span>
                </Button>
              ))}
            </div>
            <Dialog open={isExhibitionDialogOpen} onOpenChange={setIsExhibitionDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="size-4 mr-2" />Add Exhibition</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Exhibition</DialogTitle>
                  <DialogDescription>Fill in the details for the new exhibition.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleExhibitionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input required value={exhibitionForm.title} onChange={(e) => setExhibitionForm({ ...exhibitionForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={exhibitionForm.location} onChange={(e) => setExhibitionForm({ ...exhibitionForm, location: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" value={exhibitionForm.startDate} onChange={(e) => setExhibitionForm({ ...exhibitionForm, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={exhibitionForm.endDate} onChange={(e) => setExhibitionForm({ ...exhibitionForm, endDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsExhibitionDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                      Add Exhibition
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExhibitions.map((exhibition) => {
              const artworkCount = exhibition.submissions.length;
              const thumbnails = exhibition.submissions.slice(0, 4);
              return (
                <Card key={exhibition.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-3 rounded-full shrink-0">
                          <FileText className="size-6 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{exhibition.title}</h3>
                          <p className="text-sm text-slate-600 mb-1">{exhibition.location}</p>
                          <div className="text-xs text-slate-500">
                            {exhibition.startDate && new Date(exhibition.startDate).toLocaleDateString()} -{' '}
                            {exhibition.endDate && new Date(exhibition.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Artworks:</span>
                          <Badge variant="secondary">{artworkCount} {artworkCount === 1 ? 'piece' : 'pieces'}</Badge>
                        </div>
                        {thumbnails.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {thumbnails.map((es, idx) => (
                              <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                {es.workUrl && (
                                  <img src={es.workUrl} alt={es.submissionTitle ?? ''} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <FileText className="size-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">No artworks yet</p>
                          </div>
                        )}
                        {artworkCount > 4 && (
                          <p className="text-xs text-slate-500 mt-2 text-center">+{artworkCount - 4} more artwork{artworkCount - 4 > 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/exhibitions/${exhibition.id}`)} disabled={artworkCount === 0}>
                        <Eye className="size-4 mr-2" />View All Artworks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="exhibited-works" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'Available', 'Sold', 'Returned'] as const).map(s => (
                <Button key={s} size="sm"
                  variant={artworkStatusFilter === s ? 'default' : 'outline'}
                  onClick={() => setArtworkStatusFilter(s)}>
                  {s === 'all' ? 'All' : s}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({s === 'all' ? allExhibitionSubmissions.length : allExhibitionSubmissions.filter(es => es.status === s).length})
                  </span>
                </Button>
              ))}
            </div>
            <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="size-4 mr-2" />Add Artwork to Exhibition</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Artwork to Exhibition</DialogTitle>
                  <DialogDescription>Select a best-rated artwork to add to an exhibition.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmissionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Exhibition *</Label>
                    <Select value={submissionForm.exhibitionId}
                      onValueChange={(v) => setSubmissionForm({ ...submissionForm, exhibitionId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select exhibition" /></SelectTrigger>
                      <SelectContent>
                        {exhibitions.map(e => (
                          <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Artwork (Best Rated Only) *</Label>
                    <Select value={submissionForm.submissionId}
                      onValueChange={(v) => {
                        const sub = bestSubmissions.find(s => String(s.id) === v);
                        setSubmissionForm({
                          ...submissionForm,
                          submissionId: v,
                          proposedPrice: sub ? String(sub.proposedPrice) : submissionForm.proposedPrice,
                        });
                      }}>
                      <SelectTrigger><SelectValue placeholder="Select artwork" /></SelectTrigger>
                      <SelectContent>
                        {bestSubmissions.map(s => {
                          const student = students.find(st => st.userId === s.studentId);
                          return (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.title} by {student?.fullName ?? s.studentName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Proposed Price (VND) *</Label>
                    <Input type="number" required placeholder="Enter price" value={submissionForm.proposedPrice}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, proposedPrice: e.target.value })} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                      Add to Exhibition
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtworks.map((es) => {
              const exhibition = exhibitions.find(e => e.id === es.exhibitionId);
              return (
                <Card key={es.id} className="overflow-hidden">
                  {es.workUrl && (
                    <img src={es.workUrl} alt={es.submissionTitle ?? ''} className="w-full h-40 object-cover" />
                  )}
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{es.submissionTitle}</h4>
                    <p className="text-sm text-slate-600 mb-1">By {es.studentName}</p>
                    <p className="text-sm text-slate-600 mb-2">{exhibition?.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-4" />
                      <span className="font-semibold">{es.proposedPrice.toLocaleString()} VND</span>
                    </div>
                    <Badge variant={es.status === 'Sold' ? 'default' : 'secondary'}>{es.status}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
