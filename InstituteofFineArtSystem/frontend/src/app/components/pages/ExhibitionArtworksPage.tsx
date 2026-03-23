import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import svgPaths from '../../../imports/svg-dh8fahrk4q';
import { ArrowLeft, Calendar, MapPin, FileText, DollarSign, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { exhibitionsApi, ExhibitionDto } from '../../api/exhibitions';
import { toast } from 'sonner';

export function ExhibitionArtworksPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [exhibition, setExhibition] = useState<ExhibitionDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exhibitionsApi.getById(Number(id))
      .then(setExhibition)
      .catch(() => toast.error('Failed to load exhibition'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAuthAction = () => navigate(isAuthenticated ? '/dashboard' : '/login');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleBuyClick = (es: any) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('intendedPurchase', JSON.stringify({ artworkId: es.submissionId, exhibitionId: id, returnUrl: `/exhibitions/${id}` }));
      navigate('/register', { state: { message: 'Create an account to purchase this amazing artwork!' } });
    } else {
      sessionStorage.setItem('purchaseArtwork', JSON.stringify({
        id: es.submissionId,
        exhibitionSubmissionId: es.id,
        title: es.submissionTitle,
        workUrl: es.workUrl,
        price: es.proposedPrice,
        isSold: es.status === 'Sold',
        student: { name: es.studentName },
      }));
      navigate(`/purchase/${es.submissionId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Exhibition Not Found</h2>
          <Button onClick={() => navigate('/exhibitions')}>Back to Exhibitions</Button>
        </div>
      </div>
    );
  }

  const artworks = exhibition.submissions;
  const soldCount = artworks.filter((a) => a.status === 'Sold').length;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[rgba(0,0,0,0.1)] bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px] py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 sm:size-10 rounded-[10px] bg-gradient-to-br from-[#9810fa] to-[#155dfc] p-2">
                <div className="size-4 sm:size-6 relative">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.992 22">
                    <path d={svgPaths.p333cc080} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-[#0a0a0a]">Institute of Fine Arts</h1>
                <p className="text-xs text-[#4a5565]">Fine Arts Institute</p>
              </div>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <Link to="/" className="hidden md:block text-sm text-[#0a0a0a] hover:text-[#9810fa]">Home</Link>
              <Link to="/exhibitions" className="hidden md:block text-sm text-[#0a0a0a] hover:text-[#9810fa]">Exhibitions</Link>
              <Button onClick={handleAuthAction} className="bg-[#030213] text-white rounded-lg px-3 sm:px-4 h-7 sm:h-8 text-xs sm:text-sm hover:bg-[#030213]/90">
                {isAuthenticated ? 'Dashboard' : 'Login'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] py-8 sm:py-12">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <Button variant="ghost" onClick={() => navigate('/exhibitions')} className="mb-4 text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft className="size-4 mr-2" />Back to Exhibitions
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-3">{exhibition.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm sm:text-base mb-4">
            {exhibition.location && <div className="flex items-center gap-2 text-white"><MapPin className="size-4 sm:size-5" /><span>{exhibition.location}</span></div>}
            {exhibition.startDate && exhibition.endDate && (
              <div className="flex items-center gap-2 text-white"><Calendar className="size-4 sm:size-5" /><span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span></div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-xl sm:text-2xl font-bold text-white">{artworks.length}</div><div className="text-xs sm:text-sm text-white/90">Total Artworks</div></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-xl sm:text-2xl font-bold text-white">{soldCount}</div><div className="text-xs sm:text-sm text-white/90">Sold</div></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"><div className="text-xl sm:text-2xl font-bold text-white">{artworks.length - soldCount}</div><div className="text-xs sm:text-sm text-white/90">Available</div></div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a]">Featured Artworks</h3>
            <div className="text-sm text-[#4a5565]">{artworks.length} {artworks.length === 1 ? 'piece' : 'pieces'}</div>
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
                      {es.status === 'Sold' ? <Badge className="bg-gray-900 text-white">SOLD</Badge> : <Badge className="bg-yellow-400 text-gray-900">For Sale</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{es.submissionTitle}</h3>
                      <p className="text-sm text-slate-600">By {es.studentName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Price:</span>
                      <div className="flex items-center gap-1 font-semibold text-sm sm:text-base text-[#9810fa]">
                        <DollarSign className="size-4" />{es.proposedPrice.toLocaleString()}
                      </div>
                    </div>
                    {es.status === 'Sold' ? (
                      <Badge className="w-full justify-center bg-gray-600 text-white">Sold Out</Badge>
                    ) : (
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBuyClick(es)}>
                        <ShoppingCart className="size-4 mr-2" />Buy Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-12 sm:py-16 bg-gradient-to-r from-[#9810fa] to-[#155dfc]">
          <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px] text-center">
            <h3 className="text-2xl sm:text-3xl font-medium text-white mb-3">Ready to Purchase?</h3>
            <p className="text-base sm:text-lg text-[#f3e8ff] mb-6">Register an account to buy artworks and support our talented students</p>
            <Button onClick={() => navigate('/login')} className="bg-white text-[#9810fa] rounded-lg px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-medium hover:bg-white/90">Register / Login</Button>
          </div>
        </section>
      )}

      <footer className="bg-[#1a1a1a] text-white py-8 sm:py-12">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div><h4 className="font-bold mb-3 sm:mb-4">Institute of Fine Arts</h4><p className="text-xs sm:text-sm text-gray-400 leading-relaxed">Specialized training institution for fine arts and digital media.</p></div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/exhibitions" className="text-gray-400 hover:text-white">Exhibitions</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div><h4 className="font-bold mb-3 sm:mb-4">Contact</h4><ul className="space-y-2 text-xs sm:text-sm text-gray-400"><li>Email: contact@ifa.edu</li><li>Phone: +1 123 456 7890</li></ul></div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">© 2026 Institute of Fine Arts. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
