import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { usersApi, type StudentDto } from '../../api/users';
import { Search, Plus, Edit, Trash2, Eye, UserPlus, Calendar, GraduationCap, Phone, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageStudents() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', username: '', password: '', confirmPassword: '',
    admissionDate: today, admissionNumber: '', dateOfBirth: '', address: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setLoading(true);
    usersApi.getStudents()
      .then(setStudents)
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(s =>
      s.fullName.toLowerCase().includes(q) ||
      (s.email ?? '').toLowerCase().includes(q) ||
      (s.phone ?? '').includes(q) ||
      s.admissionNumber.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fullName: '', email: '', phone: '', username: '', password: '', confirmPassword: '', admissionDate: today, admissionNumber: '', dateOfBirth: '', address: '' });
    setFormErrors({});
  };

  const validate = (requirePassword = false) => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.admissionNumber.trim()) errors.admissionNumber = 'Admission number is required';
    if (requirePassword && !formData.username.trim()) errors.username = 'Username is required';
    if (requirePassword && !formData.password.trim()) errors.password = 'Password is required';
    else if (requirePassword && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (requirePassword && formData.password && formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleAdd = () => { resetForm(); setIsAddDialogOpen(true); };

  const handleEdit = (s: StudentDto) => {
    setSelectedStudent(s);
    setFormData({
      fullName: s.fullName, email: s.email ?? '', phone: s.phone ?? '',
      username: '', password: '', confirmPassword: '',
      admissionDate: s.admissionDate ?? '', admissionNumber: s.admissionNumber,
      dateOfBirth: s.dateOfBirth ?? '', address: s.address ?? '',
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleView = (s: StudentDto) => { setSelectedStudent(s); setIsViewDialogOpen(true); };
  const handleDeleteClick = (s: StudentDto) => { setSelectedStudent(s); setDeleteError(''); setIsDeleteDialogOpen(true); };

  const handleSubmitAdd = async () => {
    const errors = validate(true);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      await usersApi.createStudent({
        username: formData.username, password: formData.password,
        fullName: formData.fullName, email: formData.email, phone: formData.phone || undefined,
        admissionNumber: formData.admissionNumber,
        admissionDate: formData.admissionDate || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
      });
      await loadStudents();
      toast.success('Student added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedStudent) return;
    const errors = validate(false);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      await usersApi.updateStudent(selectedStudent.userId, {
        fullName: formData.fullName, email: formData.email, phone: formData.phone || undefined,
        admissionNumber: formData.admissionNumber,
        admissionDate: formData.admissionDate || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
        ...(formData.password ? { newPassword: formData.password } : {}),
      });
      await loadStudents();
      toast.success('Student updated successfully');
      setIsEditDialogOpen(false);
      setSelectedStudent(null);
      resetForm();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    setDeleteError('');
    try {
      const res = await usersApi.deleteStudent(selectedStudent.userId);
      await loadStudents();
      toast.success(res.message ?? 'Student removed');
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    } catch (err: any) {
      setDeleteError(err.message ?? 'Failed to delete student');
    } finally {
      setSaving(false);
    }
  };

  const getYearsEnrolled = (admissionDate?: string) => {
    if (!admissionDate) return 'N/A';
    const admitted = new Date(admissionDate);
    const now = new Date();
    const years = now.getFullYear() - admitted.getFullYear();
    const months = now.getMonth() - admitted.getMonth();
    if (years === 0) return `${Math.max(1, months)} months`;
    if (months < 0) return `${years - 1} years, ${12 + months} months`;
    return `${years} years, ${months} months`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Manage Students</h1>
          <p className="text-sm sm:text-base text-slate-600">Add, edit, delete and search student records</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="size-4 mr-2" />Add New Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search by name, email, phone, or admission number..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Total Students</p><p className="text-xl sm:text-2xl font-bold text-blue-600">{students.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Search Results</p><p className="text-xl sm:text-2xl font-bold text-purple-600">{filteredStudents.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Active</p><p className="text-xl sm:text-2xl font-bold text-green-600">{students.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Student Records ({filteredStudents.length})</CardTitle>
          <CardDescription>View and manage all student records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Admission</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-500">No students found</TableCell></TableRow>
                ) : filteredStudents.map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.avatarUrl
                          ? <img src={student.avatarUrl} alt={student.fullName} className="size-10 rounded-full object-cover" />
                          : <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">{student.fullName?.charAt(0) ?? '?'}</div>
                        }
                        <div><p className="font-medium">{student.fullName}</p><p className="text-xs text-slate-500">{student.admissionNumber}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex items-center gap-1"><Mail className="size-3 text-slate-400" /><span>{student.email}</span></div>
                        {student.phone && <div className="flex items-center gap-1"><Phone className="size-3 text-slate-400" /><span>{student.phone}</span></div>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1"><GraduationCap className="size-3 text-slate-400" /><span>{student.admissionNumber}</span></div>
                        {student.admissionDate && <div className="flex items-center gap-1"><Calendar className="size-3 text-slate-400" /><span>{new Date(student.admissionDate).toLocaleDateString()}</span></div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(student)} className="size-8 p-0"><Eye className="size-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(student)} className="size-8 p-0"><Edit className="size-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(student)} className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="size-5" />Add New Student</DialogTitle>
            <DialogDescription>Fill in the details to add a new student</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 text-purple-700">Login Details</h3></div>
            <div className="space-y-1">
              <Label>Username *</Label>
              <Input autoComplete="off" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Enter username" className={formErrors.username ? 'border-red-500' : ''} />
              {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
            </div>
            <div className="space-y-1">
              <Label>Password *</Label>
              <Input type="password" autoComplete="new-password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" className={formErrors.password ? 'border-red-500' : ''} />
              {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
            </div>
            <div className="space-y-1">
              <Label>Confirm Password *</Label>
              <Input type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" className={formErrors.confirmPassword ? 'border-red-500' : ''} />
              {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-blue-700">Personal Details</h3></div>
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter full name" className={formErrors.fullName ? 'border-red-500' : ''} />
              {formErrors.fullName && <p className="text-xs text-red-500">{formErrors.fullName}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className={formErrors.email ? 'border-red-500' : ''} />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-1"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1-555-0000" /></div>
            <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-green-700">Admission Details</h3></div>
            <div className="space-y-1">
              <Label>Admission Number *</Label>
              <Input value={formData.admissionNumber} onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })} placeholder="e.g., A006" className={formErrors.admissionNumber ? 'border-red-500' : ''} />
              {formErrors.admissionNumber && <p className="text-xs text-red-500">{formErrors.admissionNumber}</p>}
            </div>
            <div className="space-y-1"><Label>Admission Date</Label><Input type="date" value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} /></div>
            <div className="space-y-1 col-span-full"><Label>Address</Label><Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Home address" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitAdd} disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="size-5" />Edit Student</DialogTitle>
            <DialogDescription>Update the details of the student</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 text-purple-700">Login Details</h3></div>
            <div className="space-y-1 col-span-full">
              <Label>New Password (optional)</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Leave empty to keep current" />
            </div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-blue-700">Personal Details</h3></div>
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={formErrors.fullName ? 'border-red-500' : ''} />
              {formErrors.fullName && <p className="text-xs text-red-500">{formErrors.fullName}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={formErrors.email ? 'border-red-500' : ''} />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-1"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
            <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-green-700">Admission Details</h3></div>
            <div className="space-y-1">
              <Label>Admission Number *</Label>
              <Input value={formData.admissionNumber} onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })} className={formErrors.admissionNumber ? 'border-red-500' : ''} />
              {formErrors.admissionNumber && <p className="text-xs text-red-500">{formErrors.admissionNumber}</p>}
            </div>
            <div className="space-y-1"><Label>Admission Date</Label><Input type="date" value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} /></div>
            <div className="space-y-1 col-span-full"><Label>Address</Label><Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Edit className="size-4 mr-2" />}
              Update Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="size-5" />Student Details</DialogTitle>
            <DialogDescription>View complete information about this student</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                {selectedStudent.avatarUrl
                  ? <img src={selectedStudent.avatarUrl} alt={selectedStudent.fullName} className="size-16 rounded-full object-cover" />
                  : <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">{selectedStudent.fullName?.charAt(0) ?? '?'}</div>
                }
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                  <p className="text-sm text-slate-600">{selectedStudent.admissionNumber}</p>
                  <Badge className="mt-1">{getYearsEnrolled(selectedStudent.admissionDate)} enrolled</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2"><Mail className="size-4" />Contact Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-600 mb-1">Email</p><p className="font-medium">{selectedStudent.email ?? '—'}</p></div>
                  <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-600 mb-1">Phone</p><p className="font-medium">{selectedStudent.phone ?? '—'}</p></div>
                  {selectedStudent.address && <div className="bg-blue-50 p-3 rounded-lg col-span-2"><p className="text-xs text-blue-600 mb-1">Address</p><p className="font-medium">{selectedStudent.address}</p></div>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2"><GraduationCap className="size-4" />Admission Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Admission Number</p><p className="font-medium">{selectedStudent.admissionNumber}</p></div>
                  <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Admission Date</p><p className="font-medium">{selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : '—'}</p></div>
                  {selectedStudent.dateOfBirth && <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Date of Birth</p><p className="font-medium">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p></div>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedStudent) handleEdit(selectedStudent); }}><Edit className="size-4 mr-2" />Edit Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{selectedStudent?.fullName}</strong>? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{deleteError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
