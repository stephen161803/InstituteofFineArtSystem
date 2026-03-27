import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { competitionsApi, type CompetitionDto } from '../../api/competitions';
import { submissionsApi, type SubmissionDto } from '../../api/submissions';
import { awardsApi, type AwardDto } from '../../api/awards';
import { api } from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Trophy, Upload, ArrowLeft, Image as ImageIcon, Users, Medal, Download, Edit, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function StudentCompetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [competition, setCompetition] = useState<CompetitionDto | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<SubmissionDto[]>([]);
  const [awards, setAwards] = useState<AwardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<SubmissionDto | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const emptyForm = { title: '', workUrl: '', fileName: '', proposedPrice: '', description: '', quotation: '', poem: '' };
  const [submissionForm, setSubmissionForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = () => {
    Promise.all([
      competitionsApi.getById(Number(id)),
      submissionsApi.getAll(Number(id)),
      awardsApi.getAwards(),
    ]).then(([comp, subs, awds]) => {
      setCompetition(comp);
      setAllSubmissions(subs);
      setAwards(awds);
    }).catch(() => toast.error('Failed to load competition'))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="size-4 mr-2" />Back</Button>
        <Card><CardContent className="p-12 text-center"><p className="text-slate-500">Competition not found</p></CardContent></Card>
      </div>
    );
  }

  const mySubmissions = allSubmissions.filter(s => s.studentId === currentUser?.id);
  const criteria = competition.criteria ?? [];

  const prizeList = [
    { award: awards.find(a => a.awardName === 'First Prize'),       color: 'bg-yellow-50 border-yellow-300', badge: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
    { award: awards.find(a => a.awardName === 'Second Prize'),      color: 'bg-slate-50 border-slate-300',   badge: 'bg-slate-100 text-slate-700',   icon: '🥈' },
    { award: awards.find(a => a.awardName === 'Third Prize'),       color: 'bg-orange-50 border-orange-300', badge: 'bg-orange-100 text-orange-800', icon: '🥉' },
    { award: awards.find(a => a.awardName === 'Honorable Mention'), color: 'bg-purple-50 border-purple-300', badge: 'bg-purple-100 text-purple-800', icon: '🏅' },
  ].filter(p => p.award);

  const statusColors: Record<string, string> = {
    Ongoing:   'bg-green-100 text-green-800',
    Upcoming:  'bg-blue-100 text-blue-800',
    Completed: 'bg-slate-100 text-slate-800',
  };

  const isCompetitionOpen = competition.status === 'Ongoing' && new Date() <= new Date(competition.endDate);
  const isStudent = currentUser?.role === 'student';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const url = await api.uploadFile(file);
      if (target === 'new') {
        setSubmissionForm(prev => ({ ...prev, workUrl: url, fileName: file.name }));
        setFormErrors(p => ({ ...p, workUrl: '' }));
      } else if (editingSubmission) {
        setEditingSubmission(prev => prev ? { ...prev, workUrl: url, fileName: file.name } : prev);
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to upload file');
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!submissionForm.title.trim()) errors.title = 'Please enter the artwork title';
    if (!submissionForm.workUrl) errors.workUrl = 'Please upload an artwork file';
    return errors;
  };

  const handleSubmitArtwork = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!currentUser) return;
    setSaving(true);
    try {
      await submissionsApi.create({
        competitionId: competition.id,
        title: submissionForm.title,
        workUrl: submissionForm.workUrl || undefined,
        fileName: submissionForm.fileName || undefined,
        proposedPrice: Number(submissionForm.proposedPrice) || 0,
        description: submissionForm.description || undefined,
        quotation: submissionForm.quotation || undefined,
        poem: submissionForm.poem || undefined,
      });
      await Promise.all([
        submissionsApi.getAll(competition.id),
      ]).then(([subs]) => setAllSubmissions(subs));
      toast.success('Artwork submitted successfully!');
      setIsSubmitDialogOpen(false);
      setSubmissionForm(emptyForm);
      setFormErrors({});
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to submit artwork');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubmission = async () => {
    if (!editingSubmission) return;
    if (!editingSubmission.title?.trim()) {
      setFormErrors({ editTitle: 'Please enter the artwork title' });
      return;
    }
    setSaving(true);
    try {
      await submissionsApi.update(editingSubmission.id, {
        title: editingSubmission.title,
        workUrl: editingSubmission.workUrl,
        fileName: editingSubmission.fileName,
        proposedPrice: editingSubmission.proposedPrice,
        description: editingSubmission.description,
        quotation: editingSubmission.quotation,
        poem: editingSubmission.poem,
      });
      await submissionsApi.getAll(competition!.id).then(subs => setAllSubmissions(subs));
      toast.success('Artwork updated successfully!');
      setEditingSubmission(null);
      setFormErrors({});
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update artwork');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="size-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{competition.title}</h1>
            <p className="text-sm sm:text-base text-slate-600">Competition Details</p>
          </div>
        </div>
        <Badge className={`${statusColors[competition.status] ?? 'bg-slate-100 text-slate-800'} whitespace-nowrap`}>
          {competition.status}
        </Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>About This Competition</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700">{competition.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="size-5 text-slate-500" />
              <div><div className="text-sm text-slate-600">Start Date</div><div className="font-semibold">{new Date(competition.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="size-5 text-slate-500" />
              <div><div className="text-sm text-slate-600">End Date</div><div className="font-semibold">{new Date(competition.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="size-5 text-purple-600" />
              <div><div className="text-sm text-purple-600">Total Submissions</div><div className="font-semibold text-purple-900">{allSubmissions.length}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <ImageIcon className="size-5 text-blue-600" />
              <div><div className="text-sm text-blue-600">Your Submissions</div><div className="font-semibold text-blue-900">{mySubmissions.length}</div></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {prizeList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="size-5 text-yellow-600" />Award Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prizeList.map(({ award, color, badge, icon }) => award && (
                <div key={award.id} className={`flex items-start gap-3 p-3 rounded-lg border ${color}`}>
                  <span className="text-2xl shrink-0">{icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{award.awardName}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{award.description}</p>
                  </div>
                  <Badge className={`ml-auto shrink-0 text-xs ${badge}`}>{award.awardName}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {criteria.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Medal className="size-5 text-blue-600" />Scoring Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criteria.map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{c.criteriaName}</span>
                    <span className="text-slate-600 font-semibold">{c.weightPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: `${c.weightPercent}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-500 pt-1">Total: {criteria.reduce((s, c) => s + c.weightPercent, 0)}%</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit Artwork Section */}
      {isCompetitionOpen && isStudent && (
        <Card className="border-2 border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ready to participate?</h3>
                <p className="text-sm text-slate-600">Submit your artwork to this competition</p>
              </div>
              <Dialog open={isSubmitDialogOpen} onOpenChange={(open) => { setIsSubmitDialogOpen(open); if (!open) { setSubmissionForm(emptyForm); setFormErrors({}); } }}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 shrink-0">
                    <Upload className="size-4 mr-2" />Submit Artwork
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Submit Artwork</DialogTitle>
                    <DialogDescription>Submit your artwork to {competition.title}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1">
                      <Label>Artwork Title *</Label>
                      <Input placeholder="Enter artwork title" value={submissionForm.title}
                        onChange={(e) => { setSubmissionForm({ ...submissionForm, title: e.target.value }); setFormErrors(p => ({ ...p, title: '' })); }}
                        className={formErrors.title ? 'border-red-500' : ''} />
                      {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label>Artwork File *</Label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors ${formErrors.workUrl ? 'border-red-400' : 'border-slate-300'}`}
                        onClick={() => fileInputRef.current?.click()}>
                        {submissionForm.workUrl ? (
                          <div className="space-y-2">
                            <img src={submissionForm.workUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                            <p className="text-xs text-slate-500 truncate">{submissionForm.fileName}</p>
                            <div className="flex gap-2 justify-center">
                              <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}><ImageIcon className="size-3 mr-1" />Change</Button>
                              <a href={submissionForm.workUrl} download={submissionForm.fileName} onClick={(e) => e.stopPropagation()}><Button type="button" size="sm" variant="outline"><Download className="size-3 mr-1" />Download</Button></a>
                              <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSubmissionForm(p => ({ ...p, workUrl: '', fileName: '' })); }}><X className="size-3 mr-1" />Remove</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4"><ImageIcon className="size-8 mx-auto mb-2 text-slate-400" /><p className="text-sm text-slate-600">Click to select an image file</p><p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF, WEBP</p></div>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'new')} />
                      {formErrors.workUrl && <p className="text-xs text-red-500">{formErrors.workUrl}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label>Proposed Price (VND)</Label>
                      <Input type="number" min={0} placeholder="e.g. 2000000" value={submissionForm.proposedPrice}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, proposedPrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Story / Reason for Entering</Label>
                      <Textarea placeholder="Share the story behind your artwork..." rows={3} value={submissionForm.description}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Quotation / Motto</Label>
                      <Input placeholder="An inspiring quote..." value={submissionForm.quotation}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, quotation: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Poem / Creative Writing</Label>
                      <Textarea placeholder="A poem or creative text..." rows={3} value={submissionForm.poem}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, poem: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => { setIsSubmitDialogOpen(false); setSubmissionForm(emptyForm); setFormErrors({}); }}>Cancel</Button>
                    <Button onClick={handleSubmitArtwork} className="bg-purple-600 hover:bg-purple-700" disabled={saving}>
                      {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
                      Submit Artwork
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Submission Dialog */}
      <Dialog open={!!editingSubmission} onOpenChange={(open) => { if (!open) { setEditingSubmission(null); setFormErrors({}); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Artwork</DialogTitle>
            <DialogDescription>Update your artwork details</DialogDescription>
          </DialogHeader>
          {editingSubmission && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input value={editingSubmission.title ?? ''} onChange={(e) => { setEditingSubmission(p => p ? { ...p, title: e.target.value } : p); setFormErrors(p => ({ ...p, editTitle: '' })); }}
                  className={formErrors.editTitle ? 'border-red-500' : ''} />
                {formErrors.editTitle && <p className="text-xs text-red-500">{formErrors.editTitle}</p>}
              </div>
              <div className="space-y-1">
                <Label>Artwork File</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => editFileInputRef.current?.click()}>
                  {editingSubmission.workUrl ? (
                    <div className="space-y-2">
                      <img src={editingSubmission.workUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <p className="text-xs text-slate-500 truncate">{editingSubmission.fileName ?? 'Current image'}</p>
                      <div className="flex gap-2 justify-center">
                        <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); editFileInputRef.current?.click(); }}><ImageIcon className="size-3 mr-1" />Change</Button>
                        <a href={editingSubmission.workUrl} download={editingSubmission.fileName ?? 'artwork'} onClick={(e) => e.stopPropagation()}><Button type="button" size="sm" variant="outline"><Download className="size-3 mr-1" />Download</Button></a>
                        <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditingSubmission(p => p ? { ...p, workUrl: undefined, fileName: undefined } : p); }}><X className="size-3 mr-1" />Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4"><ImageIcon className="size-8 mx-auto mb-2 text-slate-400" /><p className="text-sm text-slate-600">Click to select an image file</p></div>
                  )}
                </div>
                <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'edit')} />
              </div>
              <div className="space-y-1">
                <Label>Proposed Price (VND)</Label>
                <Input type="number" min={0} value={editingSubmission.proposedPrice || ''}
                  onChange={(e) => setEditingSubmission(p => p ? { ...p, proposedPrice: Number(e.target.value) } : p)} />
              </div>
              <div className="space-y-1">
                <Label>Story / Reason for Entering</Label>
                <Textarea rows={3} value={editingSubmission.description ?? ''}
                  onChange={(e) => setEditingSubmission(p => p ? { ...p, description: e.target.value } : p)} />
              </div>
              <div className="space-y-1">
                <Label>Quotation / Motto</Label>
                <Input value={editingSubmission.quotation ?? ''}
                  onChange={(e) => setEditingSubmission(p => p ? { ...p, quotation: e.target.value } : p)} />
              </div>
              <div className="space-y-1">
                <Label>Poem / Creative Writing</Label>
                <Textarea rows={3} value={editingSubmission.poem ?? ''}
                  onChange={(e) => setEditingSubmission(p => p ? { ...p, poem: e.target.value } : p)} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setEditingSubmission(null); setFormErrors({}); }}>Cancel</Button>
            <Button onClick={handleUpdateSubmission} className="bg-purple-600 hover:bg-purple-700" disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
              Update Artwork
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Submissions */}
      {mySubmissions.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Your Submissions ({mySubmissions.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg overflow-hidden">
                  {submission.workUrl && <img src={submission.workUrl} alt={submission.title ?? ''} className="w-full h-48 object-cover" />}
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold">{submission.title}</h4>
                    {submission.description && <p className="text-xs text-slate-600 line-clamp-2">{submission.description}</p>}
                    {submission.quotation && <p className="text-xs italic text-slate-500">"{submission.quotation}"</p>}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Submitted</Badge>
                      <span className="text-xs text-slate-500">{new Date(submission.submittedAt).toLocaleDateString('en-US')}</span>
                    </div>
                    {isCompetitionOpen && isStudent && (
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setEditingSubmission({ ...submission })}>
                        <Edit className="size-3 mr-1" />Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Submissions Preview */}
      <Card>
        <CardHeader><CardTitle>All Submissions ({allSubmissions.length})</CardTitle></CardHeader>
        <CardContent>
          {allSubmissions.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allSubmissions.slice(0, 8).map((submission) => (
                <div key={submission.id} className="border rounded-lg overflow-hidden">
                  {submission.workUrl && <img src={submission.workUrl} alt={submission.title ?? ''} className="w-full h-32 object-cover" />}
                  <div className="p-2"><p className="text-sm font-medium truncate">{submission.title}</p></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No submissions yet. Be the first to submit!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
