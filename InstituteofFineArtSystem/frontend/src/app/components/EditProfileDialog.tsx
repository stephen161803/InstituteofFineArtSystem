import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Camera, UserCog } from 'lucide-react';
import { api } from '../api/client';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { currentUser, updateAvatar, updateProfile } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Sync form when dialog opens
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setProfileForm({
        fullName: currentUser?.fullName ?? '',
        email: currentUser?.email ?? '',
        phone: currentUser?.phone ?? '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMismatch(false);
    }
    onOpenChange(val);
  };

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
    if (!profileForm.fullName.trim() || !profileForm.email.trim()) return;
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    updateProfile({
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      newPassword: profileForm.newPassword || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="size-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>Update your personal information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="avatar" className="size-20 rounded-full object-cover" />
              ) : (
                <div className="size-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {currentUser?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-5 text-white" />
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ep-fullName">Full Name</Label>
            <Input
              id="ep-fullName"
              value={profileForm.fullName}
              onChange={e => setProfileForm(f => ({ ...f, fullName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-email">Email</Label>
            <Input
              id="ep-email"
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-phone">Phone</Label>
            <Input
              id="ep-phone"
              value={profileForm.phone}
              onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>

          <div className="border-t pt-3 space-y-3">
            <p className="text-xs text-slate-500 font-medium">Change Password (optional)</p>
            <div className="space-y-2">
              <Label htmlFor="ep-newpw">New Password</Label>
              <Input
                id="ep-newpw"
                type="password"
                value={profileForm.newPassword}
                placeholder="Leave blank to keep current"
                className={passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
                onChange={e => { setProfileForm(f => ({ ...f, newPassword: e.target.value })); setPasswordMismatch(false); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-confirmpw">Confirm Password</Label>
              <Input
                id="ep-confirmpw"
                type="password"
                value={profileForm.confirmPassword}
                placeholder="Repeat new password"
                className={passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
                onChange={e => { setProfileForm(f => ({ ...f, confirmPassword: e.target.value })); setPasswordMismatch(false); }}
              />
              {passwordMismatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
