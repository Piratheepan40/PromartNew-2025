import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Listing } from '@/types';
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Filter,
  Briefcase,
  CheckCircle2,
  LayoutGrid,
  List as ListIcon,
  X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getApprovedListings } from '@/services/listingService';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const PublicListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await getApprovedListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Data for Filters
  // Derived Data for Filters
  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    listings.forEach(l => {
      if (l.category) counts.set(l.category, (counts.get(l.category) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  }, [listings]);

  const locationsWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    listings.forEach(l => {
      if (l.location) counts.set(l.location, (counts.get(l.location) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  }, [listings]);

  // Filtering Logic
  const filteredListings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return listings.filter(listing => {
      // 1. Search Query Matching
      let matchesSearch = true;

      if (query) {
        const title = listing.title?.toLowerCase() || '';
        const company = listing.companyName?.toLowerCase() || '';
        const description = listing.description?.toLowerCase() || '';
        const category = listing.category?.toLowerCase() || '';
        const location = listing.location?.toLowerCase() || '';

        // Robust Key Features Search
        let featuresStr = "";
        const rawFeatures = listing.keyFeatures;
        if (rawFeatures) {
          if (Array.isArray(rawFeatures)) {
            // Handle nested stringified array case safely for search too
            if (rawFeatures.length > 0 && typeof rawFeatures[0] === 'string' && rawFeatures[0].startsWith('[')) {
              featuresStr = rawFeatures[0].toLowerCase();
            } else {
              featuresStr = rawFeatures.join(" ").toLowerCase();
            }
          } else if (typeof rawFeatures === 'string') {
            featuresStr = (rawFeatures as string).toLowerCase();
          }
        }

        matchesSearch =
          title.includes(query) ||
          company.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          location.includes(query) ||
          featuresStr.includes(query);
      }

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(listing.category);
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(listing.location);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [listings, searchQuery, selectedCategories, selectedLocations]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* 🔹 HEADER & SEARCH */}
      <div className="bg-slate-900 border-b border-white/10 pt-28 pb-12 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Discover Verified <span className="text-blue-400">Construction Partners</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Browse top-rated professionals and companies for your next project. Quality connections start here.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-white rounded-xl shadow-xl overflow-hidden p-1.5 ring-1 ring-slate-900/5">
                <Search className="ml-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search services, companies, or keywords..."
                  className="border-0 shadow-none focus-visible:ring-0 text-base py-6 bg-transparent placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium transition-all">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 🔹 SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" /> Filters
                  </h3>
                  {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="p-5 space-y-8">
                  {/* Category Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">By Category</h4>
                    <ScrollArea className="h-[240px] pr-3 -mr-3">
                      <div className="space-y-1">
                        {categoriesWithCounts.map(({ value, count }) => (
                          <label
                            key={value}
                            className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`cat-${value}`}
                                checked={selectedCategories.includes(value)}
                                onCheckedChange={() => toggleCategory(value)}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                                {value}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium group-hover:bg-slate-200 transition-colors">
                              {count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Location Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">By Location</h4>
                    <ScrollArea className="h-[240px] pr-3 -mr-3">
                      <div className="space-y-1">
                        {locationsWithCounts.map(({ value, count }) => (
                          <label
                            key={value}
                            className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`loc-${value}`}
                                checked={selectedLocations.includes(value)}
                                onCheckedChange={() => toggleLocation(value)}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                                {value}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium group-hover:bg-slate-200 transition-colors">
                              {count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              {/* Promo Card Stickied */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative group">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Join ProMart</h4>
                  <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                    Are you a construction professional? List your business today and reach more clients.
                  </p>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="secondary"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none font-bold shadow-sm"
                  >
                    Register Now
                  </Button>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-500"></div>
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-12 -mb-12"></div>
              </div>
            </div>
          </aside>

          {/* 🔹 MAIN LIST */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {filteredListings.length} {filteredListings.length === 1 ? 'Listing' : 'Listings'} Found
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map(c => (
                    <Badge key={c} variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md">
                      {c} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleCategory(c)} />
                    </Badge>
                  ))}
                  {selectedLocations.map(l => (
                    <Badge key={l} variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md">
                      {l} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleLocation(l)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden h-9 border-slate-300">
                      <Filter className="w-4 h-4 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[540px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search results.</SheetDescription>
                    </SheetHeader>
                    {/* Mobile Filter Content - reusing logic */}
                    <div className="space-y-8 pr-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-blue-500" /> Categories
                        </h4>
                        <div className="space-y-1">
                          {categoriesWithCounts.map(({ value, count }) => (
                            <label key={value} className="flex items-center justify-between p-2 rounded-lg active:bg-slate-50">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`m-cat-${value}`}
                                  checked={selectedCategories.includes(value)}
                                  onCheckedChange={() => toggleCategory(value)}
                                />
                                <span className="text-sm font-medium text-slate-700">{value}</span>
                              </div>
                              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{count}</Badge>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" /> Locations
                        </h4>
                        <div className="space-y-1">
                          {locationsWithCounts.map(({ value, count }) => (
                            <label key={value} className="flex items-center justify-between p-2 rounded-lg active:bg-slate-50">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`m-loc-${value}`}
                                  checked={selectedLocations.includes(value)}
                                  onCheckedChange={() => toggleLocation(value)}
                                />
                                <span className="text-sm font-medium text-slate-700">{value}</span>
                              </div>
                              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{count}</Badge>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="bg-white border border-slate-200 rounded-lg p-1 hidden sm:flex items-center">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === 'grid' ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === 'list' ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[340px] rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  We couldn't find any listings matching your current filters. Try adjusting your search or clearing filters.
                </p>
                <Button onClick={clearFilters} variant="outline" size="lg" className="border-slate-300">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                <AnimatePresence>
                  {filteredListings.map((listing, index) => (
                    <motion.div
                      key={listing._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className={cn(
                        "group h-full flex flex-col bg-white hover:shadow-2xl hover:shadow-blue-900/5 border-slate-200 transition-all duration-300 overflow-hidden",
                        viewMode === 'grid' ? "rounded-2xl border hover:-translate-y-1" : "flex-col sm:flex-row rounded-xl border"
                      )}>

                        {/* Image Section */}
                        <div className={cn(
                          "relative overflow-hidden bg-slate-100",
                          viewMode === 'grid' ? "aspect-[4/3] w-full border-b border-slate-100" : "h-48 sm:h-auto sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-100"
                        )}>
                          {listing.attachments?.[0]?.url ? (
                            <img
                              src={listing.attachments[0].url}
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 pattern-grid-lg">
                              <Building2 className="w-12 h-12 mb-2 opacity-50" />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <Badge className="bg-white/95 text-slate-900 backdrop-blur-md shadow-sm border-0 font-semibold hover:bg-white text-xs px-2.5 py-1">
                              {listing.category}
                            </Badge>
                            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white/50 border border-white/20">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          {/* Bottom Info on Image (Grid View Only) */}
                          {viewMode === 'grid' && (
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full w-fit">
                                <MapPin className="w-3 h-3" />
                                {listing.location || "Remote"}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col flex-1 relative">
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> {listing.companyName}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                              {listing.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                              {listing.description}
                            </p>
                          </div>

                          {/* Features Parsed Safely */}
                          {(() => {
                            let features: string[] = [];
                            const rawFeatures = listing.keyFeatures;

                            if (rawFeatures) {
                              if (Array.isArray(rawFeatures)) {
                                if (rawFeatures.length > 0 && typeof rawFeatures[0] === 'string' && rawFeatures[0].startsWith('[')) {
                                  try {
                                    const parsed = JSON.parse(rawFeatures[0]);
                                    if (Array.isArray(parsed)) features = parsed;
                                    else features = rawFeatures;
                                  } catch {
                                    features = rawFeatures;
                                  }
                                } else {
                                  features = rawFeatures;
                                }
                              } else if (typeof rawFeatures === 'string') {
                                try {
                                  const parsed = JSON.parse(rawFeatures);
                                  if (Array.isArray(parsed)) features = parsed;
                                  else features = [rawFeatures];
                                } catch {
                                  features = [rawFeatures];
                                }
                              }
                            }
                            if (features.length === 0) return null;
                            return (
                              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                {features.slice(0, 3).map((feature, i) => (
                                  <span key={i} className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                                    {feature}
                                  </span>
                                ))}
                                {features.length > 3 && (
                                  <span className="text-[10px] font-semibold text-slate-400 px-1 py-1">+ {features.length - 3}</span>
                                )}
                              </div>
                            );
                          })()}

                          {/* Footer Action */}
                          <div className={cn("mt-auto flex items-center justify-between pt-4 border-t border-slate-100", viewMode === 'list' && "sm:border-t-0 sm:pt-0 sm:mt-0 sm:pl-6 sm:border-l sm:w-48 sm:flex-col sm:justify-center sm:gap-3")}>
                            {viewMode === 'list' && (
                              <div className="hidden sm:block text-center flex-1">
                                <div className="text-sm font-semibold text-slate-900 mb-1">{listing.location}</div>
                                <div className="text-xs text-slate-500">View to contact</div>
                              </div>
                            )}

                            <div className={cn("w-full", viewMode === 'list' ? "sm:w-auto" : "")}>
                              <Button
                                onClick={() => navigate(`/listings/${listing._id}`)}
                                className={cn(
                                  "w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 font-semibold shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600",
                                  viewMode === 'list' && "sm:w-full"
                                )}
                              >
                                View Details <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>

                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination (Placeholder for now as current API returns all) */}
            {/* 
            <div className="mt-12 flex justify-center">
               <Pagination /> 
            </div> 
            */}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicListings;