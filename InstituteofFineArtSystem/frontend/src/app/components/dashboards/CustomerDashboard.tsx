import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Package, Eye, Calendar, DollarSign, User } from 'lucide-react';

export function CustomerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mock purchase history (in real app, this would come from database)
  const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]').filter(
    (purchase: any) => purchase.customerId === currentUser?.id
  );

  const totalSpent = purchaseHistory.reduce((sum: number, purchase: any) => sum + (purchase.amount || 0), 0);
  const totalPurchases = purchaseHistory.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {currentUser?.name}!
        </h2>
        <p className="text-slate-600">
          Explore exhibitions and discover amazing artworks
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Artworks purchased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentUser?.registeredDate ? formatDate(currentUser.registeredDate) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registration date
            </p>
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
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() => navigate('/exhibitions')}
          >
            <Eye className="size-4 mr-2" />
            Browse Exhibitions
          </Button>
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() => navigate('/')}
          >
            <Package className="size-4 mr-2" />
            View Home Gallery
          </Button>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>
            {totalPurchases === 0 
              ? 'You haven\'t made any purchases yet' 
              : `${totalPurchases} artwork${totalPurchases > 1 ? 's' : ''} purchased`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <ShoppingBag className="size-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Purchases Yet</h3>
              <p className="text-slate-500 mb-4">Start exploring exhibitions to find your perfect artwork</p>
              <Button onClick={() => navigate('/exhibitions')}>
                Browse Exhibitions
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchaseHistory.map((purchase: any) => (
                <div 
                  key={purchase.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {/* Artwork Image */}
                  <div className="size-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={purchase.artworkImage} 
                      alt={purchase.artworkTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Purchase Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1">{purchase.artworkTitle}</h4>
                    <p className="text-sm text-slate-600 mb-2">By {purchase.artistName}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="size-3" />
                      <span>{formatDate(purchase.purchaseDate)}</span>
                    </div>
                  </div>

                  {/* Price & Status */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {formatPrice(purchase.amount)}
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
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
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Full Name</label>
              <p className="text-base text-slate-900">{currentUser?.name}</p>
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
              <label className="text-sm font-medium text-slate-500">Customer ID</label>
              <p className="text-base text-slate-900">{currentUser?.customerId || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Account Type</label>
              <Badge className="bg-purple-100 text-purple-800">
                <User className="size-3 mr-1" />
                {currentUser?.role}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Member Since</label>
              <p className="text-base text-slate-900">
                {currentUser?.registeredDate ? formatDate(currentUser.registeredDate) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
