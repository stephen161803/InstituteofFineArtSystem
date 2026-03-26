import { useState, useEffect } from 'react';
import { competitionsApi, CompetitionDto } from '../../api/competitions';
import { submissionsApi, SubmissionDto } from '../../api/submissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

type CompetitionStatus = 'Upcoming' | 'Ongoing' | 'Completed';

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: CompetitionStatus;
}

const defaultForm: FormData = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'Upcoming',
};

export function ManageCompetitions() {
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Ongoing' | 'Upcoming' | 'Completed'>('Ongoing');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<CompetitionDto | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compsRes, subsRes] = await Promise.all([
        competitionsApi.getAll(),
        submissionsApi.getAll(),
      ]);
      setCompetitions(compsRes);
      setSubmissions(subsRes);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch {
      toast.error('Failed to save competition');
    }
  };

  const handleEdit = (competition: CompetitionDto) => {
    setEditingCompetition(competition);
    setFormData({
      title: competition.title,
      description: competition.description ?? '',
      startDate: competition.startDate.slice(0, 10),
      endDate: competition.endDate.slice(0, 10),
      status: competition.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await competitionsApi.delete(id);
      await loadData();
      toast.success('Competition deleted successfully');
    } catch {
      toast.error('Failed to delete competition');
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingCompetition(null);
    setIsDialogOpen(false);
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
              <Plus className="size-4 mr-2" />
              Add Competition
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
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as CompetitionStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingCompetition ? 'Update' : 'Create'} Competition</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Competitions</CardTitle>
          <CardDescription>Create and manage art competitions</CardDescription>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {(['Ongoing', 'Upcoming', 'Completed'] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? '' : 'text-slate-600'}
              >
                {s}
                <span className="ml-1.5 text-xs opacity-70">
                  ({competitions.filter(c => c.status === s).length})
                </span>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Search className="size-4" />
            <Input
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
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
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Start Date:</span>{' '}
                            <span className="font-medium">{new Date(competition.startDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">End Date:</span>{' '}
                            <span className="font-medium">{new Date(competition.endDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Submissions:</span>{' '}
                            <span className="font-medium">{submissionCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(competition)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(competition.id)}>
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
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
    </div>
  );
}
