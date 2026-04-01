import { useState, useEffect } from 'react';
import { usersApi, CustomerDto } from '../../api/users';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Edit, Trash2, Search, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageCustomers() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      setCustomers(await usersApi.getCustomers());
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone ?? '').includes(searchQuery)
  );

  const handleEdit = (c: CustomerDto) => {
    setEditingCustomer(c);
    setFormData({ fullName: c.fullName, email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '', notes: c.notes ?? '' });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSaving(true);
    try {
      await usersApi.updateCustomer(editingCustomer.id, formData);
      toast.success('Customer updated');
      setEditingCustomer(null);
      await loadCustomers();
    } catch {
      toast.error('Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this customer?')) return;
    try {
      await usersApi.deleteCustomer(id);
      toast.success('Customer deactivated');
      await loadCustomers();
    } catch {
      toast.error('Failed to deactivate customer');
    }
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
        <h1 className="text-3xl font-bold">Manage Customers</h1>
        <p className="text-slate-600">View and manage registered customers</p>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={(open) => { if (!open) setEditingCustomer(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Users className="size-5" />All Customers</CardTitle>
              <CardDescription>{customers.length} registered customers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Search className="size-4 text-slate-400" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="max-w-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{c.fullName}</h4>
                    <Badge variant="secondary" className="text-xs">Customer</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-sm text-slate-600">
                    {c.email && <span>{c.email}</span>}
                    {c.phone && <span>{c.phone}</span>}
                    {c.address && <span className="truncate">{c.address}</span>}
                  </div>
                  {c.notes && <p className="text-xs text-slate-500 mt-1 italic">{c.notes}</p>}
                  <div className="flex items-center gap-4 mt-1">
                    {c.createdAt && <p className="text-xs text-slate-400">Joined: {new Date(c.createdAt).toLocaleDateString()}</p>}
                    {(c.purchaseCount ?? 0) > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        {c.purchaseCount} purchase{(c.purchaseCount ?? 0) > 1 ? 's' : ''} · {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c.totalSpent ?? 0)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(c)}><Edit className="size-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}><Trash2 className="size-4 text-red-600" /></Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-slate-500 py-8">No customers found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
