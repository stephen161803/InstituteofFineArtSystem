import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { exhibitionsApi, ExhibitionSubmissionDto } from '../../api/exhibitions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Trophy, Calendar, User, Palette, DollarSign, MapPin, Star, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionDto | null>(null);
  const [awards, setAwards] = useState<StudentAwardDto[]>([]);
  const [exhibitionSub, setExhibitionSub] = useState<ExhibitionSubmissionDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const sub = await submissionsApi.getById(Number(id));
        setSubmission(sub);
        const [aw, allExhibitions] = await Promise.all([
          awardsApi.getStudentAwards({ submissionId: sub.id }),
          exhibitionsApi.getAll(),
        ]);
        setAwards(aw);
        const es = allExhibitions.flatMap((e) => e.submissions).find((es) => es.submissionId === sub.id) ?? null;
        setExhibitionSub(es);
      } catch {
        toast.error('Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'Best':     return 'bg-purple-100 text-purple-700';
      case 'Better':   return 'bg-blue-100 text-blue-700';
      case 'Good':     return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      default:         return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 mb-4">Artwork not found</p>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const review = submission.review;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="size-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{submission.title}</h1>
            <p className="text-slate-600 mt-1">by {submission.studentName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {submission.workUrl && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative bg-gray-100">
                    <img src={submission.workUrl} alt={submission.title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}
            {review && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Star className="size-5 text-yellow-600" />Evaluation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-600 mb-2">Rating</h3>
                    <Badge className={`${getRatingColor(review.ratingLevel)} text-base px-3 py-1`}>{review.ratingLevel}</Badge>
                  </div>
                  {review.strengths && <div><h3 className="font-semibold text-sm text-green-700 mb-1">✓ Strengths</h3><p className="text-slate-700">{review.strengths}</p></div>}
                  {review.weaknesses && <div><h3 className="font-semibold text-sm text-orange-700 mb-1">⚠ Weaknesses</h3><p className="text-slate-700">{review.weaknesses}</p></div>}
                  {review.improvements && <div><h3 className="font-semibold text-sm text-blue-700 mb-1">→ Improvements</h3><p className="text-slate-700">{review.improvements}</p></div>}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="size-5 text-slate-400 mt-0.5" />
                  <div><p className="text-sm text-slate-600">Artist</p><p className="font-semibold">{submission.studentName}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-slate-400 mt-0.5" />
                  <div><p className="text-sm text-slate-600">Submitted</p><p className="font-semibold">{new Date(submission.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Palette className="size-5 text-slate-400 mt-0.5" />
                  <div><p className="text-sm text-slate-600">Proposed Price</p><p className="font-semibold">{submission.proposedPrice.toLocaleString()} VND</p></div>
                </div>
              </CardContent>
            </Card>

            {awards.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50/30">
                <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                  <CardTitle className="flex items-center gap-2 text-yellow-900"><Award className="size-5" />Awards Received</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {awards.map((award) => (
                      <div key={award.id} className="bg-white border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1"><Trophy className="size-4 text-yellow-600" /><h4 className="font-semibold text-yellow-900">{award.awardName}</h4></div>
                        <p className="text-sm text-slate-600 mb-1">{award.competitionTitle}</p>
                        <p className="text-xs text-slate-500">{new Date(award.awardedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {exhibitionSub && (
              <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader className="bg-purple-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-2 text-purple-900"><MapPin className="size-5" />Exhibition</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="pt-3 border-t border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Price</span>
                      <span className="text-lg font-bold text-purple-900">{exhibitionSub.proposedPrice.toLocaleString()} VND</span>
                    </div>
                    {exhibitionSub.status === 'Sold' ? (
                      <Badge className="bg-green-100 text-green-700 mt-2 w-full justify-center">Sold</Badge>
                    ) : (
                      <Button className="w-full mt-2 bg-purple-600 hover:bg-purple-700" onClick={() => navigate(`/purchase/${exhibitionSub.submissionId}`)}>
                        <DollarSign className="size-4 mr-2" />Purchase Artwork
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
