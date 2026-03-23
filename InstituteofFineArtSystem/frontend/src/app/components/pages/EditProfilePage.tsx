import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Camera, UserCog, Save } from 'lucide-react';
import { api } from '../../api/client';

export function EditProfilePage() {
  const { currentUser, updateAvatar, updateProfile } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: currentUser?.fullName ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await api.uploadFile(file);
      updateAvatar(url);
    } catch {
      // silently ignore
    }
  };

  const handleSave = () => {
    if (!form.fullName.trim() || !form.email.trim()) return;
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    updateProfile({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      newPassword: form.newPassword || undefined,
    });
    setForm(f => ({ ...f, newPassword: '', confirmPassword: '' }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserCog className="size-7 text-slate-700" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-sm text-slate-500">Manage your personal information</p>
        </div>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-xl border p-6 flex items-center gap-6">
        <div
          className="relative group cursor-pointer shrink-0"
          onClick={() => avatarInputRef.current?.click()}
        >
          {currentUser?.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt="avatar" className="size-24 rounded-full object-cover" />
          ) : (
            <div className="size-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
              {currentUser?.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="size-6 text-white" />
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div>
          <h2 className="text-lg font-semibold">{currentUser?.fullName}</h2>
          <p className="text-sm text-slate-500">{currentUser?.email}</p>
          <Badge variant="secondary" className="capitalize mt-1">{currentUser?.role}</Badge>
          <button
            className="block text-xs text-blue-600 hover:underline mt-2"
            onClick={() => avatarInputRef.current?.click()}
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Info form */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-slate-800">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ep-username">Username</Label>
            <Input id="ep-username" value={currentUser?.username ?? ''} disabled className="bg-slate-50 text-slate-500" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-role">Role</Label>
            <Input id="ep-role" value={currentUser?.role ?? ''} disabled className="bg-slate-50 text-slate-500 capitalize" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ep-fullName">Full Name</Label>
            <Input
              id="ep-fullName"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-email">Email</Label>
            <Input
              id="ep-email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-phone">Phone</Label>
            <Input
              id="ep-phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-slate-800">Change Password <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ep-newpw">New Password</Label>
            <Input
              id="ep-newpw"
              type="password"
              placeholder="Leave blank to keep current"
              value={form.newPassword}
              className={passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
              onChange={e => { setForm(f => ({ ...f, newPassword: e.target.value })); setPasswordMismatch(false); }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-confirmpw">Confirm Password</Label>
            <Input
              id="ep-confirmpw"
              type="password"
              placeholder="Repeat new password"
              value={form.confirmPassword}
              className={passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
              onChange={e => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setPasswordMismatch(false); }}
            />
            {passwordMismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved successfully</span>}
      </div>
    </div>
  );
}
