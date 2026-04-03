import { useState, useEffect } from 'react';
import { competitionsApi, type CompetitionDto } from '../../api/competitions';
import { submissionsApi } from '../../api/submissions';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Calendar, Search, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function ViewCompetitions() {
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      competitionsApi.getAll(),
      submissionsApi.getAll(),
    ]).then(([comps, subs]) => {
      setCompetitions(comps);
      const counts: Record<number, number> = {};
      subs.forEach(s => { counts[s.competitionId] = (counts[s.competitionId] ?? 0) + 1; });
      setSubmissionCounts(counts);
    }).catch(() => toast.error('Failed to load competitions'))
      .finally(() => setLoading(false));
  }, []);

  const ongoingCompetitions = competitions.filter(c => c.status === 'Ongoing');
  const upcomingCompetitions = competitions.filter(c => c.status === 'Upcoming');
  const completedCompetitions = competitions.filter(c => c.status === 'Completed');

  const filterCompetitions = (list: CompetitionDto[]) =>
    list.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const CompetitionCard = ({ competition }: { competition: CompetitionDto }) => {
    const statusColors: Record<string, string> = {
      Ongoing:   'bg-green-100 text-green-800',
      Upcoming:  'bg-blue-100 text-blue-800',
      Completed: 'bg-slate-100 text-slate-800',
    };
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/competitions/${competition.id}`)}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold text-lg sm:text-xl">{competition.title}</h3>
                <Badge className={statusColors[competition.status]}>{competition.status}</Badge>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mb-4">{competition.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-slate-500" />
                  <div>
                    <div className="text-slate-600">Start Date</div>
                    <div className="font-medium">{new Date(competition.startDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-slate-500" />
                  <div>
                    <div className="text-slate-600">End Date</div>
                    <div className="font-medium">{new Date(competition.endDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {competition.criteria.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {competition.criteria.map(c => (
                  <Badge key={c.id} variant="outline" className="text-xs">{c.criteriaName} {c.weightPercent}%</Badge>
                ))}
              </div>
            )}
            {competition.awards.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {competition.awards.map(a => (
                  <Badge key={a.id} className="text-xs bg-yellow-100 text-yellow-800">🏆 {a.awardName}</Badge>
                ))}
              </div>
            )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
            <span className="text-sm text-slate-600">{submissionCounts[competition.id] ?? 0} submissions received</span>
            <div className="flex items-center gap-2 flex-wrap">
              {competition.status === 'Ongoing' && (
                <>
                  <Badge variant="outline" className="text-green-600">Accepting Submissions</Badge>
                  {currentUser?.role === 'student' && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/competitions/${competition.id}`); }}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Upload className="size-4 mr-2" />Submit Artwork
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Competitions</h1>
        <p className="text-sm sm:text-base text-slate-600">Browse and participate in art competitions</p>
      </div>
      <div className="flex items-center gap-2">
        <Search className="size-4 text-slate-400" />
        <Input placeholder="Search competitions..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="max-w-md" />
      </div>
      <Tabs defaultValue="ongoing">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="ongoing" className="flex-1 sm:flex-none text-xs sm:text-sm">Ongoing ({ongoingCompetitions.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none text-xs sm:text-sm">Upcoming ({upcomingCompetitions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none text-xs sm:text-sm">Completed ({completedCompetitions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="space-y-3 sm:space-y-4">
          {filterCompetitions(ongoingCompetitions).map(c => <CompetitionCard key={c.id} competition={c} />)}
          {filterCompetitions(ongoingCompetitions).length === 0 && <Card><CardContent className="p-8 text-center text-slate-500">No ongoing competitions found</CardContent></Card>}
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-3 sm:space-y-4">
          {filterCompetitions(upcomingCompetitions).map(c => <CompetitionCard key={c.id} competition={c} />)}
          {filterCompetitions(upcomingCompetitions).length === 0 && <Card><CardContent className="p-8 text-center text-slate-500">No upcoming competitions found</CardContent></Card>}
        </TabsContent>
        <TabsContent value="completed" className="space-y-3 sm:space-y-4">
          {filterCompetitions(completedCompetitions).map(c => <CompetitionCard key={c.id} competition={c} />)}
          {filterCompetitions(completedCompetitions).length === 0 && <Card><CardContent className="p-8 text-center text-slate-500">No completed competitions found</CardContent></Card>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
