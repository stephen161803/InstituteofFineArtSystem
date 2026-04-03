import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { exhibitionsApi, ExhibitionSubmissionDto } from '../../api/exhibitions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';import { Edit, Trash2, Upload as UploadIcon, Image as ImageIcon, X, Download, Trophy, Star, Eye, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { toast } from 'sonner';

const RATING_COLOR: Record<string, string> = {
  Best:     'bg-green-100 text-green-800',
  Better:   'bg-blue-100 text-blue-800',
  Good:     'bg-purple-100 text-purple-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  Normal:   'bg-slate-100 text-slate-800',
};

const AWARD_ICON: Record<string, string> = {
  'First Prize': '🥇', 'Second Prize': '🥈', 'Third Prize': '🥉',
  'Honorable Mention': '🏅', 'Best Use of Color': '🎨',
};

const SALE_STATUS_COLOR: Record<string, string> = {
  Available: 'bg-blue-100 text-blue-800',
  Sold:      'bg-green-100 text-green-800',
  Returned:  'bg-slate-100 text-slate-800',
};

export function StudentSubmissions() {
  const { currentUser } = useAuth();

  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [myAwards, setMyAwards] = useState<StudentAwardDto[]>([]);
  const [exhibitedItems, setExhibitedItems] = useState<ExhibitionSubmissionDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<SubmissionDto | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [detailSubmission, setDetailSubmission] = useState<SubmissionDto | null>(null);
  const [selectedAward, setSelectedAward] = useState<StudentAwardDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '', workUrl: '', fileName: '',
    proposedPrice: 0, description: '', quotation: '', poem: '',
  });

  useEffect(() => {
    loadAll();
  }, [currentUser]);

  const loadAll = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [subs, comps, awards, allExhibitions] = await Promise.all([
        submissionsApi.getAll(),
        competitionsApi.getAll(),
        awardsApi.getStudentAwards({ studentId: currentUser.id }),
        exhibitionsApi.getAll(),
      ]);
      setSubmissions(subs.filter((s) => s.studentId === currentUser.id));
      setCompetitions(comps);
      setMyAwards(awards);
      // Flatten all exhibition submissions for this student
      const mySubIds = new Set(subs.filter((s) => s.studentId === currentUser.id).map((s) => s.id));
      const exhibited = allExhibitions.flatMap((e) => e.submissions).filter((es) => mySubIds.has(es.submissionId));
      setExhibitedItems(exhibited);
    } catch {
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const mySubmissions = submissions;

  const competitionGroups = competitions
    .map((comp) => ({
      competition: comp,
      submissions: mySubmissions.filter((s) => s.competitionId === comp.id),
    }))
    .filter((g) => g.submissions.length > 0);

  const canEdit = (sub: SubmissionDto) => {
    if (currentUser?.role !== 'student') return false;
    const comp = competitions.find((c) => c.id === sub.competitionId);
    return comp ? new Date() <= new Date(comp.endDate) : false;
  };

  const handleEdit = (sub: SubmissionDto) => {
    if (!canEdit(sub)) { toast.error('Cannot edit after competition end date'); return; }
    setEditingSubmission(sub);
    setFormData({
      title: sub.title ?? '', workUrl: sub.workUrl ?? '',
      fileName: sub.fileName ?? '', proposedPrice: sub.proposedPrice,
      description: sub.description ?? '', quotation: sub.quotation ?? '', poem: sub.poem ?? '',
    });
    setImagePreview(sub.workUrl ?? '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const sub = submissions.find((s) => s.id === id);
    if (sub && !canEdit(sub)) { toast.error('Cannot delete after competition end date'); return; }
    try {
      await submissionsApi.delete(id);
      await loadAll();
      toast.success('Submission deleted');
    } catch {
      toast.error('Failed to delete submission');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;
    setSaving(true);
    try {
      await submissionsApi.update(editingSubmission.id, {
        title: formData.title,
        workUrl: formData.workUrl || null,
        fileName: formData.fileName || null,
        proposedPrice: formData.proposedPrice,
        description: formData.description || null,
        quotation: formData.quotation || null,
        poem: formData.poem || null,
      });
      await loadAll();
      toast.success('Artwork updated successfully');
      resetForm();
    } catch {
      toast.error('Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', workUrl: '', fileName: '', proposedPrice: 0, description: '', quotation: '', poem: '' });
    setEditingSubmission(null); setIsDialogOpen(false); setImagePreview('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await api.uploadFile(file);
      setImagePreview(url);
      setFormData((p) => ({ ...p, workUrl: url, fileName: file.name }));
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <p className="text-slate-600">All your submissions, reviews, exhibition status, and awards</p>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>Update your competition entry</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Artwork File</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50" onClick={() => document.getElementById('imgUpload')?.click()}>
                {uploading ? (
                  <div className="py-4"><Loader2 className="size-8 mx-auto mb-2 animate-spin text-slate-400" /><p className="text-sm text-slate-500">Uploading...</p></div>
                ) : (imagePreview || formData.workUrl) ? (
                  <div className="space-y-2">
                    <img src={imagePreview || formData.workUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <p className="text-xs text-slate-500 truncate">{formData.fileName || 'Current image'}</p>
                    <div className="flex gap-2 justify-center">
                      <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); document.getElementById('imgUpload')?.click(); }}><ImageIcon className="size-3 mr-1" /> Change</Button>
                      {formData.workUrl && <a href={formData.workUrl} download={formData.fileName || 'artwork'} onClick={(e) => e.stopPropagation()}><Button type="button" size="sm" variant="outline"><Download className="size-3 mr-1" /> Download</Button></a>}
                      <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setImagePreview(''); setFormData((p) => ({ ...p, workUrl: '', fileName: '' })); }}><X className="size-3 mr-1" /> Remove</Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4"><ImageIcon className="size-8 mx-auto mb-2 text-slate-400" /><p className="text-sm text-slate-600">Click to select image</p></div>
                )}
              </div>
              <input type="file" id="imgUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="space-y-2">
              <Label>Proposed Price (USD)</Label>
              <Input type="number" min={0} value={formData.proposedPrice || ''} onChange={(e) => setFormData({ ...formData, proposedPrice: Number(e.target.value) })} placeholder="e.g. 2000000" />
            </div>
            <div className="space-y-2">
              <Label>Story / Reason for Entering</Label>
              <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Share the story behind your artwork..." />
            </div>
            <div className="space-y-2">
              <Label>Quotation / Motto</Label>
              <Input value={formData.quotation} onChange={(e) => setFormData({ ...formData, quotation: e.target.value })} placeholder="An inspiring quote..." />
            </div>
            <div className="space-y-2">
              <Label>Poem / Creative Writing</Label>
              <Textarea rows={3} value={formData.poem} onChange={(e) => setFormData({ ...formData, poem: e.target.value })} placeholder="A poem or creative text..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <UploadIcon className="size-4 mr-2" />}
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailSubmission} onOpenChange={(open) => { if (!open) setDetailSubmission(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailSubmission && (() => {
            const review = detailSubmission.review;
            const comp = competitions.find((c) => c.id === detailSubmission.competitionId);
            const award = myAwards.find((a) => a.submissionId === detailSubmission.id);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{detailSubmission.title}</DialogTitle>
                  <DialogDescription>{comp?.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {detailSubmission.workUrl && <img src={detailSubmission.workUrl} alt={detailSubmission.title} className="w-full h-56 object-cover rounded-lg" />}
                  {award && <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"><span className="text-2xl">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span><div><p className="font-semibold text-yellow-800">{award.awardName}</p><p className="text-xs text-yellow-600">Awarded {new Date(award.awardedDate).toLocaleDateString()}</p></div></div>}
                  {detailSubmission.description && <div className="space-y-1"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Story</p><p className="text-sm text-slate-700">{detailSubmission.description}</p></div>}
                  {detailSubmission.quotation && <div className="space-y-1"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quotation</p><p className="text-sm italic text-slate-600">"{detailSubmission.quotation}"</p></div>}
                  {detailSubmission.poem && <div className="space-y-1"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Poem / Creative Writing</p><p className="text-sm text-slate-700 whitespace-pre-line">{detailSubmission.poem}</p></div>}
                  {review ? (
                    <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
                      <div className="flex items-center gap-2"><Star className="size-4 text-yellow-500" /><p className="font-semibold text-sm">Staff Review</p><Badge className={RATING_COLOR[review.ratingLevel]}>{review.ratingLevel}</Badge></div>
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

      <Tabs defaultValue="by-competition">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="by-competition">By Competition</TabsTrigger>
          <TabsTrigger value="best-rated">Best Rated</TabsTrigger>
          <TabsTrigger value="exhibitions">Exhibition Status</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>

        {/* TAB 1: By competition */}
        <TabsContent value="by-competition" className="space-y-6 mt-4">
          {competitionGroups.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><UploadIcon className="size-12 mx-auto mb-4 text-slate-400" /><h3 className="font-semibold mb-2">No Submissions Yet</h3><p className="text-slate-600">Go to Competitions to submit your artwork.</p></CardContent></Card>
          ) : competitionGroups.map(({ competition, submissions: subs }) => (
            <Card key={competition.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{competition.title}</CardTitle>
                  <Badge className={competition.status === 'Ongoing' ? 'bg-green-100 text-green-800' : competition.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}>{competition.status}</Badge>
                </div>
                <p className="text-xs text-slate-500">{new Date(competition.startDate).toLocaleDateString()} – {new Date(competition.endDate).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subs.map((sub) => {
                    const review = sub.review;
                    const award = myAwards.find((a) => a.submissionId === sub.id);
                    const editable = canEdit(sub);
                    return (
                      <div key={sub.id} className="border rounded-lg overflow-hidden">
                        {sub.workUrl && <img src={sub.workUrl} alt={sub.title} className="w-full h-40 object-cover" />}
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{sub.title}</h4>
                            {award && <span className="text-lg shrink-0">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span>}
                          </div>
                          {sub.quotation && <p className="text-xs italic text-slate-500">"{sub.quotation}"</p>}
                          <div className="flex flex-wrap gap-1">
                            {review ? <Badge className={`text-xs ${RATING_COLOR[review.ratingLevel]}`}>{review.ratingLevel}</Badge> : <Badge variant="outline" className="text-xs">Pending Review</Badge>}
                            {!editable && <Badge variant="secondary" className="text-xs">Closed</Badge>}
                          </div>
                          {review?.strengths && <p className="text-xs text-slate-600 line-clamp-2">✅ {review.strengths}</p>}
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => setDetailSubmission(sub)}><Eye className="size-3 mr-1" />View Details</Button>
                            {editable && <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(sub)}><Edit className="size-3" /></Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete(sub.id)}><Trash2 className="size-3 text-red-600" /></Button>
                            </>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* TAB 2: Best rated */}
        <TabsContent value="best-rated" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="size-5 text-yellow-500" />Best Rated Artworks</CardTitle></CardHeader>
            <CardContent>
              {(() => {
                const bestSubs = mySubmissions.filter((s) => s.review?.ratingLevel === 'Best');
                if (bestSubs.length === 0) return <p className="text-slate-500 text-sm py-6 text-center">No "Best" rated submissions yet.</p>;
                return (
                  <div className="space-y-4">
                    {bestSubs.map((sub) => {
                      const review = sub.review!;
                      const comp = competitions.find((c) => c.id === sub.competitionId);
                      return (
                        <div key={sub.id} className="flex gap-4 p-4 border rounded-lg bg-green-50/50">
                          {sub.workUrl && <img src={sub.workUrl} alt={sub.title} className="size-24 object-cover rounded-lg shrink-0" />}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div><h4 className="font-semibold">{sub.title}</h4><p className="text-xs text-slate-500">{comp?.title}</p></div>
                              <Badge className="bg-green-100 text-green-800 shrink-0">Best</Badge>
                            </div>
                            {sub.poem && <p className="text-xs text-slate-600 italic line-clamp-2">{sub.poem}</p>}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              {review.strengths && <div className="bg-white rounded p-2 border"><p className="font-semibold text-green-700 mb-1">✅ Strengths</p><p className="text-slate-600">{review.strengths}</p></div>}
                              {review.weaknesses && <div className="bg-white rounded p-2 border"><p className="font-semibold text-red-700 mb-1">⚠️ Weaknesses</p><p className="text-slate-600">{review.weaknesses}</p></div>}
                              {review.improvements && <div className="bg-white rounded p-2 border"><p className="font-semibold text-blue-700 mb-1">💡 Suggestions</p><p className="text-slate-600">{review.improvements}</p></div>}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setDetailSubmission(sub)}><Eye className="size-3 mr-1" />Full Details</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Exhibition status */}
        <TabsContent value="exhibitions" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Exhibition & Sales Status</CardTitle></CardHeader>
            <CardContent>
              {exhibitedItems.length === 0 ? (
                <p className="text-slate-500 text-sm py-6 text-center">None of your artworks have been sent to exhibitions yet.</p>
              ) : (
                <div className="space-y-3">
                  {exhibitedItems.map((es) => (
                    <div key={es.id} className="flex gap-4 p-4 border rounded-lg items-start">
                      {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle} className="size-20 object-cover rounded shrink-0" />}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm">{es.submissionTitle}</h4>
                          <Badge className={`text-xs shrink-0 ${SALE_STATUS_COLOR[es.status]}`}>{es.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">Proposed price: ${es.proposedPrice.toLocaleString('en-US')}</p>
                        {es.status === 'Sold' && es.sale ? (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs space-y-0.5">
                            <p className="font-semibold text-green-800">Sold ✓</p>
                            <p className="text-slate-600">Sold price: <span className="font-semibold">${es.sale.soldPrice.toLocaleString('en-US')}</span></p>
                            <p className="text-slate-600">Buyer: {es.sale.customerName}</p>
                            <p className="text-slate-600">Date: {new Date(es.sale.soldDate).toLocaleDateString()}</p>
                          </div>
                        ) : es.status === 'Returned' ? (
                          <p className="text-xs text-slate-500 italic mt-1">Artwork was returned from exhibition.</p>
                        ) : (
                          <p className="text-xs text-blue-600 mt-1">Currently on display — available for purchase.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Awards */}
        <TabsContent value="awards" className="mt-4">
          {myAwards.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><Trophy className="size-12 mx-auto mb-4 text-yellow-400" /><h3 className="font-semibold mb-2">No Awards Yet</h3><p className="text-slate-600">Keep participating to earn awards!</p></CardContent></Card>
          ) : (
            <div className="space-y-4">
              {competitions.filter((c) => myAwards.some((a) => a.competitionTitle === c.title)).map((comp) => {
                const compAwards = myAwards.filter((a) => a.competitionTitle === comp.title);
                return (
                  <Card key={comp.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{comp.title}</CardTitle>
                        <Badge className="bg-slate-100 text-slate-700">{comp.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {compAwards.map((award) => {
                          const sub = mySubmissions.find((s) => s.id === award.submissionId);
                          return (
                            <div key={award.id} onClick={() => setSelectedAward(award)}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50 cursor-pointer hover:shadow-md transition-shadow">
                              <span className="text-3xl shrink-0">{AWARD_ICON[award.awardName ?? ''] ?? '🏆'}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{award.awardName}</p>
                                {sub && <p className="text-xs text-slate-600">Artwork: {sub.title}</p>}
                                <p className="text-xs text-slate-500">{new Date(award.awardedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Award Detail Dialog */}
      <Dialog open={!!selectedAward} onOpenChange={open => { if (!open) setSelectedAward(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{AWARD_ICON[selectedAward?.awardName ?? ''] ?? '🏆'}</span>
              {selectedAward?.awardName}
            </DialogTitle>
            <DialogDescription>{selectedAward?.competitionTitle}</DialogDescription>
          </DialogHeader>
          {selectedAward && (() => {
            const sub = mySubmissions.find(s => s.id === selectedAward.submissionId);
            return (
              <div className="space-y-4">
                {sub?.workUrl && (
                  <img src={sub.workUrl} alt={sub.title ?? ''} className="w-full h-52 object-cover rounded-lg" />
                )}
                <div className="space-y-1.5 text-sm">
                  <p><span className="font-medium text-slate-600">Artwork:</span> {selectedAward.submissionTitle ?? '—'}</p>
                  <p><span className="font-medium text-slate-600">Competition:</span> {selectedAward.competitionTitle ?? '—'}</p>
                  <p><span className="font-medium text-slate-600">Award:</span> {selectedAward.awardName}</p>
                  {selectedAward.awardDescription && <p><span className="font-medium text-slate-600">Description:</span> {selectedAward.awardDescription}</p>}
                  <p><span className="font-medium text-slate-600">Date:</span> {new Date(selectedAward.awardedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  {sub?.description && <p className="text-slate-500 italic text-xs mt-2">{sub.description}</p>}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
