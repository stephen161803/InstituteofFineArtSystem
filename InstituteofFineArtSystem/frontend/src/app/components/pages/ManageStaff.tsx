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
import { usersApi, type StaffDto } from '../../api/users';
import { Search, Plus, Edit, Trash2, Eye, UserPlus, Briefcase, Phone, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageStaff() {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', username: '', password: '', confirmPassword: '',
    dateJoined: today, subjectHandled: '', remarks: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    setLoading(true);
    usersApi.getStaff()
      .then(setStaff)
      .catch(() => toast.error('Failed to load staff'))
      .finally(() => setLoading(false));
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staff;
    const q = searchQuery.toLowerCase();
    return staff.filter(s =>
      s.fullName.toLowerCase().includes(q) ||
      (s.email ?? '').toLowerCase().includes(q) ||
      (s.phone ?? '').includes(q) ||
      (s.subjectHandled ?? '').toLowerCase().includes(q)
    );
  }, [staff, searchQuery]);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fullName: '', email: '', phone: '', username: '', password: '', confirmPassword: '', dateJoined: today, subjectHandled: '', remarks: '' });
    setFormErrors({});
  };

  const validate = (requirePassword = false) => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (requirePassword && !formData.username.trim()) errors.username = 'Username is required';
    if (requirePassword && !formData.password.trim()) errors.password = 'Password is required';
    else if (requirePassword && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (requirePassword && formData.password && formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleAdd = () => { resetForm(); setIsAddDialogOpen(true); };

  const handleEdit = (s: StaffDto) => {
    setSelectedStaff(s);
    setFormData({
      fullName: s.fullName, email: s.email ?? '', phone: s.phone ?? '',
      username: '', password: '', confirmPassword: '',
      dateJoined: s.dateJoined ?? '', subjectHandled: s.subjectHandled ?? '', remarks: s.remarks ?? '',
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleView = (s: StaffDto) => { setSelectedStaff(s); setIsViewDialogOpen(true); };
  const handleDeleteClick = (s: StaffDto) => { setSelectedStaff(s); setIsDeleteDialogOpen(true); };

  const handleSubmitAdd = async () => {
    const errors = validate(true);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      await usersApi.createStaff({
        username: formData.username, password: formData.password,
        fullName: formData.fullName, email: formData.email, phone: formData.phone,
        dateJoined: formData.dateJoined || undefined,
        subjectHandled: formData.subjectHandled || undefined,
        remarks: formData.remarks || undefined,
      });
      await loadStaff();
      toast.success('Staff member added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add staff');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedStaff) return;
    const errors = validate(false);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      await usersApi.updateStaff(selectedStaff.userId, {
        fullName: formData.fullName, email: formData.email, phone: formData.phone,
        dateJoined: formData.dateJoined || undefined,
        subjectHandled: formData.subjectHandled || undefined,
        remarks: formData.remarks || undefined,
        ...(formData.password ? { newPassword: formData.password } : {}),
      });
      await loadStaff();
      toast.success('Staff member updated successfully');
      setIsEditDialogOpen(false);
      setSelectedStaff(null);
      resetForm();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update staff');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    setSaving(true);
    try {
      await usersApi.deleteStaff(selectedStaff.userId);
      await loadStaff();
      toast.success('Staff member deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedStaff(null);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to delete staff');
    } finally {
      setSaving(false);
    }
  };

  const getYearsOfService = (dateJoined: string) => {
    const joined = new Date(dateJoined);
    const now = new Date();
    const years = now.getFullYear() - joined.getFullYear();
    const months = now.getMonth() - joined.getMonth();
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Manage Staff</h1>
          <p className="text-sm sm:text-base text-slate-600">Add, edit, delete and search staff members</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="size-4 mr-2" />Add New Staff
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search by name, email, phone, or subject..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Total Staff</p><p className="text-xl sm:text-2xl font-bold text-purple-600">{staff.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Search Results</p><p className="text-xl sm:text-2xl font-bold text-blue-600">{filteredStaff.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs sm:text-sm text-slate-600 mb-1">Art & Design</p><p className="text-xl sm:text-2xl font-bold text-green-600">{staff.filter(s => (s.subjectHandled ?? '').includes('Art')).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Staff Members ({filteredStaff.length})</CardTitle>
          <CardDescription>View and manage all staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead className="hidden lg:table-cell">Date Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">No staff members found</TableCell></TableRow>
                ) : filteredStaff.map((s) => (
                  <TableRow key={s.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">{s.fullName?.charAt(0) ?? '?'}</div>
                        <div><p className="font-medium">{s.fullName}</p><p className="text-xs text-slate-500 lg:hidden">{s.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex items-center gap-1"><Mail className="size-3 text-slate-400" /><span>{s.email}</span></div>
                        <div className="flex items-center gap-1"><Phone className="size-3 text-slate-400" /><span>{s.phone}</span></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-xs"><Briefcase className="size-3 text-slate-400" /><span>{s.subjectHandled ?? '—'}</span></div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {s.dateJoined ? (
                        <div className="text-xs space-y-1">
                          <p>{new Date(s.dateJoined).toLocaleDateString()}</p>
                          <Badge variant="outline" className="text-xs">{getYearsOfService(s.dateJoined)}</Badge>
                        </div>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(s)} className="size-8 p-0"><Eye className="size-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} className="size-8 p-0"><Edit className="size-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(s)} className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="size-4" /></Button>
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
            <DialogTitle className="flex items-center gap-2"><UserPlus className="size-5" />Add New Staff Member</DialogTitle>
            <DialogDescription>Fill in the details to add a new staff member</DialogDescription>
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
            <div className="space-y-1">
              <Label>Phone *</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1-555-0000" className={formErrors.phone ? 'border-red-500' : ''} />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>
            <div className="space-y-1">
              <Label>Date Joined</Label>
              <Input type="date" value={formData.dateJoined} onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })} />
            </div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-green-700">Work Details</h3></div>
            <div className="space-y-1">
              <Label>Subject Handled</Label>
              <Input value={formData.subjectHandled} onChange={(e) => setFormData({ ...formData, subjectHandled: e.target.value })} placeholder="e.g., Art & Design" />
            </div>
            <div className="space-y-1 col-span-full">
              <Label>Remarks</Label>
              <Textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Additional notes or remarks" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitAdd} disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="size-5" />Edit Staff Member</DialogTitle>
            <DialogDescription>Update the details of the staff member</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 text-purple-700">Login Details</h3></div>
            <div className="space-y-1">
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
            <div className="space-y-1">
              <Label>Phone *</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={formErrors.phone ? 'border-red-500' : ''} />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>
            <div className="space-y-1">
              <Label>Date Joined</Label>
              <Input type="date" value={formData.dateJoined} onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })} />
            </div>
            <div className="col-span-full"><h3 className="text-sm font-semibold mb-3 mt-2 text-green-700">Work Details</h3></div>
            <div className="space-y-1">
              <Label>Subject Handled</Label>
              <Input value={formData.subjectHandled} onChange={(e) => setFormData({ ...formData, subjectHandled: e.target.value })} />
            </div>
            <div className="space-y-1 col-span-full">
              <Label>Remarks</Label>
              <Textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={saving}>
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Edit className="size-4 mr-2" />}
              Update Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="size-5" />Staff Member Details</DialogTitle>
            <DialogDescription>View complete information about this staff member</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">{selectedStaff.fullName?.charAt(0) ?? '?'}</div>
                <div>
                  <h3 className="text-xl font-bold">{selectedStaff.fullName}</h3>
                  <p className="text-sm text-slate-600">{selectedStaff.subjectHandled}</p>
                  {selectedStaff.dateJoined && <Badge className="mt-1">{getYearsOfService(selectedStaff.dateJoined)} of service</Badge>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2"><Mail className="size-4" />Contact Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-600 mb-1">Email</p><p className="font-medium">{selectedStaff.email ?? '—'}</p></div>
                  <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-600 mb-1">Phone</p><p className="font-medium">{selectedStaff.phone ?? '—'}</p></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2"><Briefcase className="size-4" />Work Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Date Joined</p><p className="font-medium">{selectedStaff.dateJoined ? new Date(selectedStaff.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p></div>
                  <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-green-600 mb-1">Subject Handled</p><p className="font-medium">{selectedStaff.subjectHandled ?? '—'}</p></div>
                </div>
              </div>
              {selectedStaff.remarks && (
                <div><h4 className="font-semibold text-slate-700 mb-2">Remarks</h4><div className="bg-slate-50 p-3 rounded-lg text-sm">{selectedStaff.remarks}</div></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedStaff) handleEdit(selectedStaff); }}>
              <Edit className="size-4 mr-2" />Edit Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="size-5" />Delete Staff Member</DialogTitle>
            <DialogDescription>Are you sure you want to delete <span className="font-semibold">{selectedStaff?.fullName}</span>? This action cannot be undone.</DialogDescription>
          </DialogHeader>
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
