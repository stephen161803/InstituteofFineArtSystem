import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ArrowLeft, ShoppingCart, DollarSign, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { exhibitionsApi } from '../../api/exhibitions';

export function PurchaseForm() {
  const navigate = useNavigate();
  const { artworkId } = useParams();
  const { currentUser } = useAuth();
  const [artworkData, setArtworkData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    offeredPrice: '', // Customer's offered price
  });

  useEffect(() => {
    // Try to get artwork data from sessionStorage
    const storedArtwork = sessionStorage.getItem('purchaseArtwork');
    if (storedArtwork) {
      try {
        const artwork = JSON.parse(storedArtwork);
        setArtworkData(artwork);
        // Pre-fill form with currentUser info + suggested price
        setFormData(prev => ({
          ...prev,
          fullName: currentUser?.fullName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          address: currentUser?.address || '',
          offeredPrice: artwork.price?.toString() || '',
        }));
      } catch (error) {
        console.error('Error parsing artwork data:', error);
      }
    }
  }, [artworkId, currentUser]);

  if (!artworkData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="size-12 mx-auto mb-4 text-slate-400" />
            <h3 className="font-semibold mb-2">No Artwork Selected</h3>
            <p className="text-slate-600 mb-4">Please select an artwork from the exhibitions page.</p>
            <Button onClick={() => navigate('/exhibitions')}>
              Browse Artworks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const offeredPrice = parseFloat(formData.offeredPrice);
    if (isNaN(offeredPrice) || offeredPrice < artworkData.price) {
      toast.error(`Offered price must be at least ${formatPrice(artworkData.price)}`);
      return;
    }

    try {
      await exhibitionsApi.purchase({
        exhibitionSubmissionId: artworkData.exhibitionSubmissionId,
        soldPrice: offeredPrice,
      });

      toast.success('Purchase request submitted successfully! We will contact you soon.');
      sessionStorage.removeItem('purchaseArtwork');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      toast.error('Failed to submit purchase. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/exhibitions')}
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Exhibitions
            </Button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold">Purchase Artwork</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Artwork Details - Left Column */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Artwork Details</CardTitle>
                <CardDescription>Review the artwork you want to purchase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <img 
                    src={artworkData.workUrl} 
                    alt={artworkData.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{artworkData.title}</h3>
                    <p className="text-sm text-slate-600">
                      by {artworkData.student?.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-b">
                    <span className="text-sm text-slate-600">Price</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-green-600" />
                      <span className="font-bold text-lg text-green-600">
                        {formatPrice(artworkData.price)}
                      </span>
                    </div>
                  </div>

                  {artworkData.description && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Description</h4>
                      <p className="text-sm text-slate-600">{artworkData.description}</p>
                    </div>
                  )}

                  {artworkData.competition && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Competition</h4>
                      <Badge variant="outline">{artworkData.competition.title}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Form - Right Column */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Fill in your details to complete the purchase request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="size-4" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          required
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="size-4" />
                      Delivery Address
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        placeholder="Enter your street address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Offered Price */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="size-4" />
                      Your Offer
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="offeredPrice">Offered Price (VND) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id="offeredPrice"
                          name="offeredPrice"
                          type="number"
                          required
                          min={artworkData.price}
                          step="1000"
                          placeholder={`Minimum: ${formatPrice(artworkData.price)}`}
                          value={formData.offeredPrice}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Suggested price: <span className="font-semibold text-green-600">{formatPrice(artworkData.price)}</span>
                        {parseFloat(formData.offeredPrice) > artworkData.price && (
                          <span className="ml-2 text-blue-600">
                            (Your offer is {formatPrice(parseFloat(formData.offeredPrice) - artworkData.price)} higher)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requests or questions?"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold">Order Summary</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Suggested Price</span>
                      <span className="text-slate-400 line-through">{formatPrice(artworkData.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Your Offered Price</span>
                      <span className="font-semibold text-blue-600">
                        {formData.offeredPrice ? formatPrice(parseFloat(formData.offeredPrice)) : '—'}
                      </span>
                    </div>
                    {formData.offeredPrice && parseFloat(formData.offeredPrice) > artworkData.price && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Additional Offer</span>
                        <span className="font-semibold">
                          +{formatPrice(parseFloat(formData.offeredPrice) - artworkData.price)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Processing Fee</span>
                      <span>Included</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-green-600">
                        {formData.offeredPrice ? formatPrice(parseFloat(formData.offeredPrice)) : formatPrice(artworkData.price)}
                      </span>
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> This is a purchase request. Our team will contact you within 24 hours to confirm the order and arrange payment and delivery details.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/exhibitions')}
                      className="sm:flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="sm:flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="size-4 mr-2" />
                      Submit Purchase Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}