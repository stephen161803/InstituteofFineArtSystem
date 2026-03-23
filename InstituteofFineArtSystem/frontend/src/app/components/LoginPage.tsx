import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Palette, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      toast.success('Login successful!');
      
      // Check if there's an intended purchase
      const intendedPurchase = sessionStorage.getItem('intendedPurchase');
      if (intendedPurchase) {
        const { returnUrl } = JSON.parse(intendedPurchase);
        sessionStorage.removeItem('intendedPurchase');
        navigate(returnUrl || '/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <Palette className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Competition Management System</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-slate-600 mb-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-slate-500 mb-2">Demo accounts (password: <code className="bg-slate-100 px-1 rounded">password123</code>):</p>
            <div className="space-y-1 text-xs">
              <p className="text-slate-600">👨‍💼 Manager: <code className="bg-slate-100 px-1 rounded">manager</code></p>
              <p className="text-slate-600">🔧 Admin: <code className="bg-slate-100 px-1 rounded">admin</code></p>
              <p className="text-slate-600">👨‍🏫 Staff: <code className="bg-slate-100 px-1 rounded">staff</code> / <code className="bg-slate-100 px-1 rounded">staff2</code> / <code className="bg-slate-100 px-1 rounded">staff3</code></p>
              <p className="text-slate-600">🎨 Student: <code className="bg-slate-100 px-1 rounded">alice</code> / <code className="bg-slate-100 px-1 rounded">bob</code> / <code className="bg-slate-100 px-1 rounded">carol</code> / <code className="bg-slate-100 px-1 rounded">diana</code> / <code className="bg-slate-100 px-1 rounded">emma</code> / <code className="bg-slate-100 px-1 rounded">charlie</code></p>
              <p className="text-slate-600">🛒 Customer: <code className="bg-slate-100 px-1 rounded">customer1</code> / <code className="bg-slate-100 px-1 rounded">customer2</code> / <code className="bg-slate-100 px-1 rounded">michael</code> / <code className="bg-slate-100 px-1 rounded">jessica</code></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}