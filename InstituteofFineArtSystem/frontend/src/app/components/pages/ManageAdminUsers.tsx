import { useState, useEffect } from 'react';
import { usersApi, AdminUserDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, ShieldCheck, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const defaultForm = { username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '', role: 'Manager' };

export function ManageAdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserDto | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await usersApi.getAdminUsers());
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) { toast.error('Full name is required'); return; }
    if (!formData.username.trim()) { toast.error('Username is required'); return; }
    if (!formData.password.trim()) { toast.error('Password is required'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error('Invalid email address'); return; }
    setSaving(true);
    try {
      await usersApi.createAdminUser(formData);
      toast.success(`${formData.role} account created`);
      setIsDialogOpen(false);
      setFormData(defaultForm);
      await loadUsers();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: AdminUserDto) => {
    if (user.id === currentUser?.id) {
      toast.error('Cannot delete your own account');
      return;
    }
    setDeleteTarget(user);
    setDeleteError('');
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await usersApi.deleteAdminUser(deleteTarget.id);
      toast.success('User deleted');
      setDeleteTarget(null);
      await loadUsers();
    } catch (err: any) {
      setDeleteError(err.message ?? 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const admins = users.filter(u => u.role === 'Admin' &&
    (!searchQuery.trim() || u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (u.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const managers = users.filter(u => u.role === 'Manager' &&
    (!searchQuery.trim() || u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (u.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admins & Managers</h1>
          <p className="text-slate-600">Manage administrator and manager accounts</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="size-4 mr-2" />Add Account
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search by name, username, or email..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-600 mb-1">Total</p><p className="text-2xl font-bold text-slate-700">{users.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-600 mb-1">Admins</p><p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'Admin').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-600 mb-1">Managers</p><p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'Manager').length}</p></CardContent></Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Admin / Manager Account</DialogTitle>
            <DialogDescription>New account will have full access based on role</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input required type="password" autoComplete="new-password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password *</Label>
              <Input required type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-red-600" />Administrators
          </CardTitle>
          <CardDescription>{admins.length} admin account{admins.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{u.fullName}</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
                    {u.id === currentUser?.id && <Badge variant="outline" className="text-xs">You</Badge>}
                  </div>
                  <p className="text-sm text-slate-500">@{u.username}{u.email ? ` · ${u.email}` : ''}</p>
                </div>
                {u.id !== currentUser?.id && (
                  <Button size="sm" variant="outline" onClick={() => handleDelete(u)}>
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
            {admins.length === 0 && <p className="text-slate-500 text-sm py-4 text-center">No admins found</p>}
          </div>
        </CardContent>
      </Card>

      {/* Managers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-600" />Managers
          </CardTitle>
          <CardDescription>{managers.length} manager account{managers.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{u.fullName}</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Manager</Badge>
                  </div>
                  <p className="text-sm text-slate-500">@{u.username}{u.email ? ` · ${u.email}` : ''}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDelete(u)}>
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            ))}
            {managers.length === 0 && <p className="text-slate-500 text-sm py-4 text-center">No managers found</p>}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.role})?
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{deleteError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={doDelete} disabled={deleting}>
              {deleting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
