import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import svgPaths from '../../imports/svg-dh8fahrk4q';
import { Calendar, MapPin, Eye, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { exhibitionsApi, ExhibitionDto } from '../api/exhibitions';
import { toast } from 'sonner';

export function ExhibitionPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<ExhibitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [exhibitionFilter, setExhibitionFilter] = useState<'ongoing' | 'upcoming' | 'completed'>('ongoing');

  useEffect(() => {
    exhibitionsApi.getAll()
      .then(setExhibitions)
      .catch(() => toast.error('Failed to load exhibitions'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthAction = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatus = (startDate?: string, endDate?: string): 'upcoming' | 'ongoing' | 'completed' => {
    if (!startDate || !endDate) return 'completed';
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (today < start) return 'upcoming';
    if (today <= end) return 'ongoing';
    return 'completed';
  };

  const filteredExhibitions = useMemo(
    () => exhibitions.filter((e) => getStatus(e.startDate, e.endDate) === exhibitionFilter),
    [exhibitions, exhibitionFilter]
  );

  const counts = useMemo(() => ({
    ongoing:   exhibitions.filter((e) => getStatus(e.startDate, e.endDate) === 'ongoing').length,
    upcoming:  exhibitions.filter((e) => getStatus(e.startDate, e.endDate) === 'upcoming').length,
    completed: exhibitions.filter((e) => getStatus(e.startDate, e.endDate) === 'completed').length,
  }), [exhibitions]);

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
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" className="border-[#030213] text-[#030213] rounded-lg px-3 sm:px-4 h-7 sm:h-8 text-xs sm:text-sm hover:bg-[#030213]/10">Register</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] py-10 sm:py-12 md:py-16">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-3 sm:mb-4">Art Exhibitions</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#f3e8ff]">Discover and acquire outstanding artworks from our talented students</p>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a]">Exhibitions</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {(['ongoing', 'upcoming', 'completed'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={exhibitionFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExhibitionFilter(filter)}
                  className={exhibitionFilter === filter
                    ? filter === 'ongoing' ? 'bg-[#030213] text-white hover:bg-[#030213]/90'
                      : filter === 'upcoming' ? 'bg-blue-600 text-white hover:bg-blue-600/90'
                      : 'bg-[#eceef2] text-[#030213] hover:bg-[#eceef2]/90'
                    : filter === 'ongoing' ? 'border-[#030213] text-[#030213] hover:bg-[#030213]/10'
                      : filter === 'upcoming' ? 'border-blue-600 text-blue-600 hover:bg-blue-600/10'
                      : 'border-slate-400 text-slate-600 hover:bg-slate-100'}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} ({counts[filter]})
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </div>
          ) : filteredExhibitions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <p className="text-slate-500">No {exhibitionFilter} exhibitions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredExhibitions.map((exhibition) => {
                const artworkCount = exhibition.submissions.length;
                const thumbnails = exhibition.submissions.slice(0, 4);
                const status = getStatus(exhibition.startDate, exhibition.endDate);
                return (
                  <div key={exhibition.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 sm:p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <h4 className="text-sm sm:text-base font-medium text-[#0a0a0a] pr-2">{exhibition.title}</h4>
                      <Badge className={`${status === 'ongoing' ? 'bg-[#030213] text-white' : status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-[#eceef2] text-[#030213]'} rounded-lg px-2 sm:px-3 py-1 text-xs font-medium shrink-0`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a5565]">
                        <Calendar className="size-3 sm:size-4" />
                        <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a5565]">
                        <MapPin className="size-3 sm:size-4" /><span>{exhibition.location}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-[#4a5565]">Artworks:</span>
                        <Badge variant="secondary" className="text-xs">{artworkCount} {artworkCount === 1 ? 'piece' : 'pieces'}</Badge>
                      </div>
                      {thumbnails.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {thumbnails.map((es, idx) => (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              {es.workUrl && <img src={es.workUrl} alt={es.submissionTitle || 'Artwork'} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                          <FileText className="size-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-xs text-slate-500">No artworks yet</p>
                        </div>
                      )}
                      {artworkCount > 4 && <p className="text-xs text-slate-500 mt-2 text-center">+{artworkCount - 4} more artwork{artworkCount - 4 > 1 ? 's' : ''}</p>}
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-[#9810fa] hover:text-white border-[#9810fa] hover:bg-[#9810fa]" onClick={() => navigate(`/exhibitions/${exhibition.id}`)} disabled={artworkCount === 0}>
                      <Eye className="size-4 mr-2" />View All Artworks
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#9810fa] to-[#155dfc]">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px] text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-3 sm:mb-4">Interested in an Artwork?</h3>
          <p className="text-base sm:text-lg md:text-xl text-[#f3e8ff] mb-6 sm:mb-8">Contact us to learn more about purchasing these beautiful artworks</p>
          <Button onClick={() => navigate('/login')} className="bg-white text-[#9810fa] rounded-lg px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-medium hover:bg-white/90 w-full sm:w-auto">Contact Now</Button>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] text-white py-8 sm:py-12">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[79px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Institute of Fine Arts</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">Specialized training institution for fine arts and digital media.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/exhibitions" className="text-gray-400 hover:text-white">Exhibitions</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Contact</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>Email: contact@ifa.edu</li>
                <li>Phone: +1 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
            © 2026 Institute of Fine Arts. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
