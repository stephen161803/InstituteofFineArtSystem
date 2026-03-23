import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Eye, Package, DollarSign, User, Loader2 } from 'lucide-react';
import { exhibitionsApi, type SaleDto } from '../../api/exhibitions';
import { toast } from 'sonner';

export function CustomerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    exhibitionsApi.getMySales()
      .then(setSales)
      .catch(() => toast.error('Failed to load purchase history'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const totalSpent = sales.reduce((sum, s) => sum + s.soldPrice, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

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
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {currentUser?.fullName}!
        </h2>
        <p className="text-slate-600">Explore exhibitions and discover amazing artworks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Artworks purchased</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Explore and purchase artworks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/exhibitions')}>
            <Eye className="size-4 mr-2" />Browse Exhibitions
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/')}>
            <Package className="size-4 mr-2" />View Home Gallery
          </Button>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>
            {sales.length === 0 ? "You haven't made any purchases yet" : `${sales.length} artwork${sales.length > 1 ? 's' : ''} purchased`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <ShoppingBag className="size-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Purchases Yet</h3>
              <p className="text-slate-500 mb-4">Start exploring exhibitions to find your perfect artwork</p>
              <Button onClick={() => navigate('/exhibitions')}>Browse Exhibitions</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="size-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {sale.workUrl
                      ? <img src={sale.workUrl} alt={sale.submissionTitle} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag className="size-6" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1">{sale.submissionTitle ?? 'Artwork'}</h4>
                    <p className="text-sm text-slate-600 mb-1">{sale.exhibitionTitle}</p>
                    <p className="text-xs text-slate-500">{formatDate(sale.soldDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-green-600 mb-1">{formatPrice(sale.soldPrice)}</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Full Name</label>
              <p className="text-base text-slate-900">{currentUser?.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Email</label>
              <p className="text-base text-slate-900">{currentUser?.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Username</label>
              <p className="text-base text-slate-900">{currentUser?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Account Type</label>
              <Badge className="bg-purple-100 text-purple-800">
                <User className="size-3 mr-1" />{currentUser?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
