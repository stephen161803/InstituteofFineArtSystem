import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { exhibitionsApi, ExhibitionDto, ExhibitionSubmissionDto } from '../../api/exhibitions';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, DollarSign, Calendar, MapPin, FileText, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ExhibitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<ExhibitionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<ExhibitionSubmissionDto | null>(null);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saleForm, setSaleForm] = useState({ soldPrice: '', customerName: '', customerContact: '', remarks: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setSaleForm({ soldPrice: es.proposedPrice.toString(), customerName: '', customerContact: '', remarks: '' });
    setErrors({});
    setIsSaleDialogOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!saleForm.soldPrice || isNaN(Number(saleForm.soldPrice)) || Number(saleForm.soldPrice) <= 0) errs.soldPrice = 'Enter a valid price';
    if (!saleForm.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!saleForm.customerContact.trim()) errs.customerContact = 'Contact is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleMarkAsSold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork || !validate()) return;
    setSaving(true);
    try {
      // In a real app, we'd look up the customer by contact. For now use customerId=1 as placeholder.
      await exhibitionsApi.createSale({
        exhibitionSubmissionId: selectedArtwork.id,
        customerId: 1,
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-xl sm:text-2xl font-bold">{totalRevenue.toLocaleString()} VND</div><div className="text-xs sm:text-sm opacity-90">Total Revenue</div></div>
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
            <Card key={es.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                <div className="absolute top-3 right-3">
                  {es.status === 'Sold' ? <Badge className="bg-green-600 text-white">SOLD</Badge> : es.status === 'Returned' ? <Badge variant="secondary">Returned</Badge> : <Badge variant="secondary">Available</Badge>}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{es.submissionTitle}</h3>
                  <p className="text-sm text-slate-600">By {es.studentName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Price:</span>
                  <div className="flex items-center gap-1 font-semibold text-sm sm:text-base">
                    <DollarSign className="size-4" />{es.proposedPrice.toLocaleString()} VND
                  </div>
                </div>
                {es.status === 'Available' && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openSaleDialog(es)}>
                    <ShoppingCart className="size-4 mr-2" />Mark as Sold
                  </Button>
                )}
                {es.status === 'Sold' && <Badge className="w-full justify-center bg-green-600 text-white">Sold Out</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              <Label>Sold Price *</Label>
              <Input type="number" placeholder="Enter sold price" value={saleForm.soldPrice} onChange={(e) => setSaleForm({ ...saleForm, soldPrice: e.target.value })} className={errors.soldPrice ? 'border-red-500' : ''} />
              {errors.soldPrice && <p className="text-xs text-red-500">{errors.soldPrice}</p>}
            </div>
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input placeholder="Enter customer name" value={saleForm.customerName} onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })} className={errors.customerName ? 'border-red-500' : ''} />
              {errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}
            </div>
            <div className="space-y-2">
              <Label>Customer Contact *</Label>
              <Input placeholder="Phone or email" value={saleForm.customerContact} onChange={(e) => setSaleForm({ ...saleForm, customerContact: e.target.value })} className={errors.customerContact ? 'border-red-500' : ''} />
              {errors.customerContact && <p className="text-xs text-red-500">{errors.customerContact}</p>}
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea placeholder="Any additional notes..." value={saleForm.remarks} onChange={(e) => setSaleForm({ ...saleForm, remarks: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsSaleDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Confirm Sale
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
