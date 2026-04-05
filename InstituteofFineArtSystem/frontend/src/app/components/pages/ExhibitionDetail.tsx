import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { exhibitionsApi, ExhibitionDto, ExhibitionSubmissionDto } from '../../api/exhibitions';
import { usersApi, CustomerDto } from '../../api/users';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, DollarSign, Calendar, MapPin, FileText, ShoppingCart, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function ExhibitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<ExhibitionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<ExhibitionSubmissionDto | null>(null);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [detailArtwork, setDetailArtwork] = useState<ExhibitionSubmissionDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [saleForm, setSaleForm] = useState({ soldPrice: '', customerId: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    exhibitionsApi.getById(Number(id))
      .then(setExhibition)
      .catch(() => toast.error('Failed to load exhibition'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-700">Exhibition Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/dashboard/exhibitions')}>Back to Exhibitions</Button>
      </div>
    );
  }

  const artworks = exhibition.submissions;
  const soldCount = artworks.filter((a) => a.status === 'Sold').length;
  const totalRevenue = artworks.filter((a) => a.sale).reduce((sum, a) => sum + (a.sale?.soldPrice ?? 0), 0);

  const openSaleDialog = (es: ExhibitionSubmissionDto) => {
    setSelectedArtwork(es);
    setSaleForm({ soldPrice: es.proposedPrice.toString(), customerId: '' });
    setErrors({});
    setIsSaleDialogOpen(true);
    // Load customers when dialog opens
    setLoadingCustomers(true);
    usersApi.getCustomers()
      .then(setCustomers)
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoadingCustomers(false));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const price = Number(saleForm.soldPrice);
    const proposed = selectedArtwork?.proposedPrice ?? 0;
    if (!saleForm.soldPrice || isNaN(price) || price <= 0)
      errs.soldPrice = 'Enter a valid price';
    else if (price < proposed)
      errs.soldPrice = `Sold price must be at least $${proposed.toLocaleString('en-US')}`;
    if (!saleForm.customerId)
      errs.customerId = 'Please select a customer';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleMarkAsSold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork || !validate()) return;
    setSaving(true);
    try {
      await exhibitionsApi.createSale({
        exhibitionSubmissionId: selectedArtwork.id,
        customerId: Number(saleForm.customerId),
        soldPrice: Number(saleForm.soldPrice),
      });
      // Refresh exhibition data
      const updated = await exhibitionsApi.getById(Number(id));
      setExhibition(updated);
      toast.success('Artwork marked as sold');
      setIsSaleDialogOpen(false);
      setSelectedArtwork(null);
    } catch {
      toast.error('Failed to record sale');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('/dashboard/exhibitions')} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />Back to Exhibitions
        </Button>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{exhibition.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm sm:text-base mb-4">
            {exhibition.location && <div className="flex items-center gap-2"><MapPin className="size-4 sm:size-5" /><span>{exhibition.location}</span></div>}
            {exhibition.startDate && exhibition.endDate && (
              <div className="flex items-center gap-2"><Calendar className="size-4 sm:size-5" /><span>{new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</span></div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-2xl sm:text-3xl font-bold">{artworks.length}</div><div className="text-xs sm:text-sm opacity-90">Total Artworks</div></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-2xl sm:text-3xl font-bold">{soldCount}</div><div className="text-xs sm:text-sm opacity-90">Sold</div></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-2xl sm:text-3xl font-bold">{artworks.length - soldCount}</div><div className="text-xs sm:text-sm opacity-90">Available</div></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-xl sm:text-2xl font-bold">${totalRevenue.toLocaleString('en-US')}</div><div className="text-xs sm:text-sm opacity-90">Total Revenue</div></div>
          </div>
        </div>
      </div>

      {artworks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="size-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Artworks Yet</h3>
            <p className="text-slate-500">This exhibition doesn't have any artworks added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {artworks.map((es) => (
            <Card key={es.id} className="overflow-hidden group cursor-pointer" onClick={() => setDetailArtwork(es)}>
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                <div className="absolute top-3 right-3">
                  {es.status === 'Sold' ? <Badge className="bg-green-600 text-white">SOLD</Badge> : es.status === 'Returned' ? <Badge variant="secondary">Returned</Badge> : <Badge variant="secondary">Available</Badge>}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Eye className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <div>
                  <h3 className="font-semibold text-base mb-0.5 line-clamp-1">{es.submissionTitle}</h3>
                  <p className="text-sm text-slate-600">By {es.studentName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Price:</span>
                  <div className="flex items-center gap-1 font-semibold text-sm">
                    <DollarSign className="size-4" />${es.proposedPrice.toLocaleString('en-US')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detailArtwork} onOpenChange={open => { if (!open) setDetailArtwork(null); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {detailArtwork && (
            <>
              {detailArtwork.workUrl && (
                <div className="relative h-72 bg-slate-100">
                  <img src={detailArtwork.workUrl} alt={detailArtwork.submissionTitle ?? ''} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    {detailArtwork.status === 'Sold' ? <Badge className="bg-green-600 text-white">SOLD</Badge>
                      : detailArtwork.status === 'Returned' ? <Badge variant="secondary">Returned</Badge>
                      : <Badge variant="secondary">Available</Badge>}
                  </div>
                </div>
              )}
              <div className="p-5 space-y-4">
                <DialogHeader>
                  <DialogTitle>{detailArtwork.submissionTitle}</DialogTitle>
                  <DialogDescription>By {detailArtwork.studentName}</DialogDescription>
                </DialogHeader>
                <div className="rounded-lg bg-slate-50 border p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proposed price</span>
                    <span className="font-semibold">${detailArtwork.proposedPrice.toLocaleString('en-US')}</span>
                  </div>
                  {detailArtwork.sale && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sold price</span>
                        <span className="font-semibold text-green-700">${detailArtwork.sale.soldPrice.toLocaleString('en-US')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer</span>
                        <span className="font-medium">{detailArtwork.sale.customerName ?? '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sale date</span>
                        <span>{new Date(detailArtwork.sale.soldDate).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setDetailArtwork(null)}>Close</Button>
                  {detailArtwork.status === 'Available' && (
                    <Button onClick={() => { setDetailArtwork(null); openSaleDialog(detailArtwork); }}>
                      <ShoppingCart className="size-4 mr-2" />Mark as Sold
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Artwork as Sold</DialogTitle>
            <DialogDescription>Confirm the sale details for this artwork.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMarkAsSold} className="space-y-4">
            <div className="space-y-2">
              <Label>Artwork</Label>
              <Input value={selectedArtwork?.submissionTitle || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Customer *</Label>
              {loadingCustomers ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="size-4 animate-spin" />Loading customers...
                </div>
              ) : customers.length === 0 ? (
                <p className="text-sm text-amber-600 p-2 bg-amber-50 rounded">
                  ⚠️ No customers found. Please add customers in Manage Customers first.
                </p>
              ) : (
                <Select value={saleForm.customerId} onValueChange={v => setSaleForm({ ...saleForm, customerId: v })}>
                  <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.fullName}{c.phone ? ` — ${c.phone}` : ''}{c.email ? ` (${c.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Sold Price *</Label>
              <p className="text-xs text-slate-500">
                Proposed price: <span className="font-semibold text-purple-600">${Number(selectedArtwork?.proposedPrice ?? 0).toLocaleString('en-US')}</span>
                {' '}— sold price must be at least this amount.
              </p>
              <Input
                type="number"
                placeholder={`Min: $${Number(selectedArtwork?.proposedPrice ?? 0).toLocaleString('en-US')}`}
                min={selectedArtwork?.proposedPrice}
                value={saleForm.soldPrice}
                onChange={(e) => setSaleForm({ ...saleForm, soldPrice: e.target.value })}
                className={errors.soldPrice ? 'border-red-500' : ''}
              />
              {errors.soldPrice && <p className="text-xs text-red-500">{errors.soldPrice}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsSaleDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving || customers.length === 0}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Confirm Sale
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
