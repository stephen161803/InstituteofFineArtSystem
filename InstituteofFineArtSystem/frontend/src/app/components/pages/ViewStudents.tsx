import { useState, useEffect } from 'react';
import { usersApi, StudentDto } from '../../api/users';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search, Eye, Trophy, Upload, Phone, Mail, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export function ViewStudents() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [studentAwards, setStudentAwards] = useState<StudentAwardDto[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
  const [selectedAward, setSelectedAward] = useState<StudentAwardDto | null>(null);

  useEffect(() => {
    Promise.all([
      usersApi.getStudents(),
      submissionsApi.getAll(),
      awardsApi.getStudentAwards(),
      competitionsApi.getAll(),
    ]).then(([st, subs, aw, comps]) => {
      setStudents(st); setSubmissions(subs); setStudentAwards(aw); setCompetitions(comps);
    }).catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentStats = (userId: number) => {
    const subs = submissions.filter((s) => s.studentId === userId);
    const awards = studentAwards.filter((a) => subs.some((s) => s.id === a.submissionId));
    return {
      totalSubmissions: subs.length,
      totalAwards: awards.length,
    };
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
        <h1 className="text-3xl font-bold">View Students</h1>
        <p className="text-slate-600">View student details, submissions, and academic records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>View personal and admission details of all students</CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Search className="size-4" />
            <Input
              placeholder="Search by name, email, or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const stats = getStudentStats(student.userId);
              return (
                <Card key={student.userId} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl
                          ? <img src={student.avatarUrl} alt={student.fullName} className="size-12 rounded-full object-cover shrink-0" />
                          : <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">{student.fullName?.charAt(0) ?? '?'}</div>
                        }
                        <div>
                          <h3 className="font-semibold text-base">{student.fullName}</h3>
                          <p className="text-sm text-slate-600">{student.admissionNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="size-4" /><span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="size-4" /><span>{student.phone}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-slate-50 p-2 rounded">
                        <div className="text-slate-600">Submissions</div>
                        <div className="font-semibold text-base">{stats.totalSubmissions}</div>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <div className="text-slate-600">Awards</div>
                        <div className="font-semibold text-base text-yellow-700">{stats.totalAwards}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setSelectedStudent(student)}>
                      <Eye className="size-4 mr-2" />View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredStudents.length === 0 && (
            <p className="text-center text-slate-500 py-8">No students found</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Complete information about the student</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal & Admission</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="awards">Awards</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {selectedStudent.avatarUrl
                        ? <img src={selectedStudent.avatarUrl} alt={selectedStudent.fullName} className="size-16 rounded-full object-cover shrink-0" />
                        : <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">{selectedStudent.fullName?.charAt(0) ?? '?'}</div>
                      }
                      <div>
                        <CardTitle className="text-lg">{selectedStudent.fullName}</CardTitle>
                        <p className="text-sm text-slate-500">{selectedStudent.admissionNumber}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-slate-600">Full Name</label><p className="font-semibold">{selectedStudent.fullName}</p></div>
                    <div><label className="text-sm font-medium text-slate-600">Email</label><p className="font-semibold">{selectedStudent.email}</p></div>
                    <div><label className="text-sm font-medium text-slate-600">Phone</label><p className="font-semibold">{selectedStudent.phone}</p></div>
                    <div><label className="text-sm font-medium text-slate-600">Admission Number</label><p className="font-semibold">{selectedStudent.admissionNumber}</p></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Admission Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Admission Date</label>
                      <p className="font-semibold">{selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : '—'}</p>
                    </div>
                    {selectedStudent.dateOfBirth && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                        <p className="font-semibold">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedStudent.address && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-slate-600">Address</label>
                        <p className="font-semibold">{selectedStudent.address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="submissions" className="space-y-4">
                {(() => {
                  const studentSubs = submissions.filter((s) => s.studentId === selectedStudent.userId);
                  return studentSubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {studentSubs.map((submission) => {
                        const competition = competitions.find((c) => c.id === submission.competitionId);
                        const review = submission.review;
                        return (
                          <Card key={submission.id} className="overflow-hidden">
                            {submission.workUrl && <img src={submission.workUrl} alt={submission.title} className="w-full h-48 object-cover" />}
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1">{submission.title}</h4>
                              <p className="text-sm text-slate-600 mb-2">{competition?.title}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-slate-500">{new Date(submission.submittedAt).toLocaleDateString()}</div>
                                {review ? (
                                  <Badge className={review.ratingLevel === 'Best' ? 'bg-green-100 text-green-800' : review.ratingLevel === 'Better' ? 'bg-blue-100 text-blue-800' : review.ratingLevel === 'Good' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}>{review.ratingLevel}</Badge>
                                ) : <Badge variant="outline">Pending</Badge>}
                              </div>
                              {review?.strengths && (
                                <div className="mt-3 p-2 bg-slate-50 rounded text-xs">
                                  <p className="font-medium text-slate-700">Strengths:</p>
                                  <p className="text-slate-600">{review.strengths}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Upload className="size-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="font-semibold text-slate-700 mb-2">No Submissions Yet</h3>
                        <p className="text-slate-500 text-sm">This student hasn't submitted any artwork yet</p>
                      </CardContent>
                    </Card>
                  );
                })()}
              </TabsContent>

              <TabsContent value="awards" className="space-y-4">
                {(() => {
                  const studentSubs = submissions.filter((s) => s.studentId === selectedStudent.userId);
                  const awards = studentAwards.filter((a) => studentSubs.some((s) => s.id === a.submissionId));
                  return awards.length > 0 ? (
                    <div className="space-y-3">
                      {awards.map((award) => {
                        const sub = submissions.find(s => s.id === award.submissionId);
                        return (
                          <Card key={award.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedAward(award)}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                {sub?.workUrl && (
                                  <img src={sub.workUrl} alt={sub.title ?? ''} className="size-16 object-cover rounded-lg shrink-0" />
                                )}
                                {!sub?.workUrl && (
                                  <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                                    <Trophy className="size-6 text-yellow-600" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1">{award.awardName}</h4>
                                  <p className="text-sm text-slate-600 mb-1">Competition: {award.competitionTitle}</p>
                                  {award.submissionTitle && <p className="text-xs text-slate-500 mb-1">Artwork: {award.submissionTitle}</p>}
                                  <p className="text-xs text-slate-500">Awarded on {new Date(award.awardedDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Trophy className="size-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="font-semibold text-slate-700 mb-2">No Awards Yet</h3>
                        <p className="text-slate-500 text-sm">This student hasn't received any awards yet</p>
                      </CardContent>
                    </Card>
                  );
                })()}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Award Detail Dialog */}
      <Dialog open={!!selectedAward} onOpenChange={open => { if (!open) setSelectedAward(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-yellow-600" />
              {selectedAward?.awardName}
            </DialogTitle>
            <DialogDescription>{selectedAward?.competitionTitle}</DialogDescription>
          </DialogHeader>
          {selectedAward && (() => {
            const sub = submissions.find(s => s.id === selectedAward.submissionId);
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
