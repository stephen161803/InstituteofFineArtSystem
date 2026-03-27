import { useState, useEffect } from 'react';
import { usersApi, AdminUserDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const defaultForm = { username: '', password: '', fullName: '', email: '', phone: '', role: 'Manager' };

export function ManageAdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

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

  const handleDelete = async (user: AdminUserDto) => {
    if (user.id === currentUser?.id) {
      toast.error('Cannot deactivate your own account');
      return;
    }
    if (!confirm(`Deactivate ${user.fullName}?`)) return;
    try {
      await usersApi.deleteAdminUser(user.id);
      toast.success('User deactivated');
      await loadUsers();
    } catch {
      toast.error('Failed to deactivate user');
    }
  };

  const admins = users.filter(u => u.role === 'Admin');
  const managers = users.filter(u => u.role === 'Manager');

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
              <Input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
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
    </div>
  );
}
