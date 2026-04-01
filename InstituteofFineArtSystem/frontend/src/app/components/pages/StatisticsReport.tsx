import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Award, Users, Trophy, Image as ImageIcon, Download, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { awardsApi, StudentAwardDto } from '../../api/awards';
import { exhibitionsApi, ExhibitionDto } from '../../api/exhibitions';
import { usersApi, StudentDto } from '../../api/users';
import { toast } from 'sonner';

export function StatisticsReport() {
  const [timeRange, setTimeRange] = useState('all');
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [studentAwards, setStudentAwards] = useState<StudentAwardDto[]>([]);
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      competitionsApi.getAll(),
      submissionsApi.getAll(),
      awardsApi.getStudentAwards(),
      exhibitionsApi.getAll(),
      usersApi.getStudents(),
    ]).then(([c, s, a, e, st]) => {
      setCompetitions(c); setSubmissions(s); setStudentAwards(a);
      setExhibitions(e); setStudents(st);
    }).catch(() => toast.error('Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const allExhibitionSubs = exhibitions.flatMap((e) => e.submissions);
  const allSales = allExhibitionSubs.filter((es) => es.sale).map((es) => es.sale!);

  const totalCompetitions = competitions.length;
  const ongoingCompetitions = competitions.filter((c) => c.status === 'Ongoing').length;
  const completedCompetitions = competitions.filter((c) => c.status === 'Completed').length;
  const totalSubmissions = submissions.length;
  const totalAwards = studentAwards.length;
  const totalExhibitions = exhibitions.length;
  const totalStudents = students.length;

  const ratingCounts = {
    Best:    submissions.filter((s) => s.review?.ratingLevel === 'Best').length,
    Better:  submissions.filter((s) => s.review?.ratingLevel === 'Better').length,
    Good:    submissions.filter((s) => s.review?.ratingLevel === 'Good').length,
    pending: submissions.filter((s) => !s.review).length,
  };

  const competitionData = competitions.map((comp) => ({
    name: comp.title.substring(0, 20) + (comp.title.length > 20 ? '...' : ''),
    submissions: submissions.filter((s) => s.competitionId === comp.id).length,
    awards: studentAwards.filter((a) => a.competitionTitle === comp.title).length,
  }));

  const ratingData = [
    { name: 'Best',    value: ratingCounts.Best,    color: '#10b981' },
    { name: 'Better',  value: ratingCounts.Better,  color: '#3b82f6' },
    { name: 'Good',    value: ratingCounts.Good,    color: '#f59e0b' },
    { name: 'Pending', value: ratingCounts.pending, color: '#94a3b8' },
  ];

  const studentPerformance = students.map((student) => {
    const studentSubs = submissions.filter((s) => s.studentId === student.userId);
    const studentAwardCount = studentAwards.filter((a) => studentSubs.some((s) => s.id === a.submissionId)).length;
    const bestRatings = studentSubs.filter((s) => s.review?.ratingLevel === 'Best').length;
    return {
      name: student.fullName,
      submissions: studentSubs.length,
      awards: studentAwardCount,
      bestRatings,
      email: student.email,
    };
  }).sort((a, b) => b.awards - a.awards);

  const exhibitionSales = exhibitions.map((exh) => {
    const exhSubs = exh.submissions;
    const sold = exhSubs.filter((es) => es.status === 'Sold').length;
    const totalRevenue = exhSubs.filter((es) => es.sale).reduce((sum, es) => sum + (es.sale?.soldPrice ?? 0), 0);
    return {
      name: exh.title.substring(0, 20) + (exh.title.length > 20 ? '...' : ''),
      artworks: exhSubs.length,
      sold,
      revenue: totalRevenue / 1000000,
    };
  });

  const monthlyTrend = (() => {
    const counts: Record<string, number> = {};
    submissions.forEach((s) => {
      const d = new Date(s.submittedAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([month, count]) => ({ month, submissions: count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  })();

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: { totalCompetitions, ongoingCompetitions, completedCompetitions, totalSubmissions, totalAwards, totalExhibitions, totalStudents },
      competitionData, studentPerformance, exhibitionSales, ratingDistribution: ratingCounts,
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `competition-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Statistics & Reports</h1>
          <p className="text-sm sm:text-base text-slate-600">Comprehensive analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline" className="shrink-0">
            <Download className="size-4 mr-2" />Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Competitions</p>
                <p className="text-xl sm:text-2xl font-bold">{totalCompetitions}</p>
                <p className="text-xs text-green-600 mt-1">{ongoingCompetitions} ongoing</p>
              </div>
              <Trophy className="size-8 sm:size-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Submissions</p>
                <p className="text-xl sm:text-2xl font-bold">{totalSubmissions}</p>
                <p className="text-xs text-blue-600 mt-1">{ratingCounts.Best} best rated</p>
              </div>
              <ImageIcon className="size-8 sm:size-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Awards Given</p>
                <p className="text-xl sm:text-2xl font-bold">{totalAwards}</p>
                <p className="text-xs text-yellow-600 mt-1">Across {completedCompetitions} comps</p>
              </div>
              <Award className="size-8 sm:size-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Active Students</p>
                <p className="text-xl sm:text-2xl font-bold">{totalStudents}</p>
                <p className="text-xs text-green-600 mt-1">{totalExhibitions} exhibitions</p>
              </div>
              <Users className="size-8 sm:size-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="competitions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="competitions" className="text-xs sm:text-sm"><BarChart3 className="size-3 sm:size-4 mr-1 sm:mr-2" />Competitions</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm"><Users className="size-3 sm:size-4 mr-1 sm:mr-2" />Students</TabsTrigger>
          <TabsTrigger value="exhibitions" className="text-xs sm:text-sm"><DollarSign className="size-3 sm:size-4 mr-1 sm:mr-2" />Exhibitions</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm"><TrendingUp className="size-3 sm:size-4 mr-1 sm:mr-2" />Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="competitions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Competition Performance</CardTitle>
                <CardDescription>Submissions and awards by competition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip /><Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="submissions" fill="#3b82f6" name="Submissions" />
                    <Bar dataKey="awards" fill="#f59e0b" name="Awards" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Rating Distribution</CardTitle>
                <CardDescription>Submission quality breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={ratingData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {ratingData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base sm:text-lg">Competition Status Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitions.map((comp) => {
                  const subs = submissions.filter((s) => s.competitionId === comp.id).length;
                  const awards = studentAwards.filter((a) => a.competitionTitle === comp.title).length;
                  return (
                    <div key={comp.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">{comp.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-600">{new Date(comp.startDate).toLocaleDateString()} - {new Date(comp.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-center"><p className="text-lg sm:text-xl font-bold text-blue-600">{subs}</p><p className="text-xs text-slate-600">Submissions</p></div>
                        <div className="text-center"><p className="text-lg sm:text-xl font-bold text-yellow-600">{awards}</p><p className="text-xs text-slate-600">Awards</p></div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${comp.status === 'Ongoing' ? 'bg-green-100 text-green-800' : comp.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>{comp.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Top Performing Students</CardTitle>
              <CardDescription>Students ranked by awards and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={studentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip /><Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="submissions" fill="#8b5cf6" name="Submissions" />
                  <Bar dataKey="awards" fill="#f59e0b" name="Awards" />
                  <Bar dataKey="bestRatings" fill="#10b981" name="Best Ratings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base sm:text-lg">Student Performance Details</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Student</th>
                      <th className="text-center p-2 font-semibold">Submissions</th>
                      <th className="text-center p-2 font-semibold">Awards</th>
                      <th className="text-center p-2 font-semibold">Best Ratings</th>
                      <th className="text-center p-2 font-semibold">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformance.map((student, idx) => {
                      const successRate = student.submissions > 0 ? ((student.awards / student.submissions) * 100).toFixed(0) : '0';
                      return (
                        <tr key={idx} className="border-b hover:bg-slate-50">
                          <td className="p-2"><div className="font-medium">{student.name}</div><div className="text-xs text-slate-500">{student.email}</div></td>
                          <td className="text-center p-2">{student.submissions}</td>
                          <td className="text-center p-2"><span className="inline-flex items-center gap-1 text-yellow-700"><Trophy className="size-3" />{student.awards}</span></td>
                          <td className="text-center p-2"><span className="inline-flex items-center gap-1 text-green-700"><Award className="size-3" />{student.bestRatings}</span></td>
                          <td className="text-center p-2"><span className={`font-medium ${parseInt(successRate) >= 50 ? 'text-green-600' : parseInt(successRate) >= 25 ? 'text-blue-600' : 'text-slate-600'}`}>{successRate}%</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exhibitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Exhibition Sales Performance</CardTitle>
              <CardDescription>Artwork sales and revenue by exhibition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={exhibitionSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip /><Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar yAxisId="left" dataKey="artworks" fill="#8b5cf6" name="Total Artworks" />
                  <Bar yAxisId="left" dataKey="sold" fill="#10b981" name="Sold" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" name="Revenue (M USD)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {exhibitions.map((exh) => {
              const exhSubs = exh.submissions;
              const sold = exhSubs.filter((es) => es.status === 'Sold').length;
              const available = exhSubs.filter((es) => es.status === 'Available').length;
              const totalRevenue = exhSubs.filter((es) => es.sale).reduce((sum, es) => sum + (es.sale?.soldPrice ?? 0), 0);
              return (
                <Card key={exh.id}>
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-base">{exh.title}</CardTitle>
                    <CardDescription className="text-xs">{exh.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 p-3 rounded-lg"><p className="text-xs text-purple-600 mb-1">Total Artworks</p><p className="text-xl font-bold text-purple-900">{exhSubs.length}</p></div>
                      <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Sold</p><p className="text-xl font-bold text-green-900">{sold}</p></div>
                      <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-600 mb-1">Available</p><p className="text-xl font-bold text-blue-900">{available}</p></div>
                      <div className="bg-yellow-50 p-3 rounded-lg"><p className="text-xs text-yellow-600 mb-1">Revenue</p><p className="text-lg font-bold text-yellow-900">{(totalRevenue / 1000000).toFixed(1)}M</p></div>
                    </div>
                    {exh.startDate && exh.endDate && (
                      <p className="text-xs text-slate-500 mt-3">{new Date(exh.startDate).toLocaleDateString()} - {new Date(exh.endDate).toLocaleDateString()}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Submission Trends</CardTitle>
              <CardDescription>Monthly submission activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip /><Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="submissions" stroke="#8b5cf6" strokeWidth={2} name="Submissions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base sm:text-lg">Key Insights</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="size-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-green-900 mb-1">High Engagement</h4>
                    <p className="text-xs sm:text-sm text-green-800">Average {totalCompetitions > 0 ? (totalSubmissions / totalCompetitions).toFixed(1) : 0} submissions per competition shows strong student participation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="size-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-blue-900 mb-1">Quality Submissions</h4>
                    <p className="text-xs sm:text-sm text-blue-800">{ratingCounts.Best} submissions ({totalSubmissions > 0 ? ((ratingCounts.Best / totalSubmissions) * 100).toFixed(0) : 0}%) received "Best" rating</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="size-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-yellow-900 mb-1">Award Distribution</h4>
                    <p className="text-xs sm:text-sm text-yellow-800">{totalAwards} awards distributed across {completedCompetitions} completed competitions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <ImageIcon className="size-5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-purple-900 mb-1">Exhibition Success</h4>
                    <p className="text-xs sm:text-sm text-purple-800">{allExhibitionSubs.filter((es) => es.status === 'Sold').length} artworks sold across {totalExhibitions} exhibitions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
