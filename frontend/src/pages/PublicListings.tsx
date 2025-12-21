import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types';
import { Search, MapPin, Building2, ArrowRight, Filter, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getApprovedListings } from '@/services/listingService';

const PublicListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredListings = listings.filter(
    listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-amber-500/30">
      <Navbar />

      {/* 🔹 HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Verified Opportunities
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Construction Partner
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Browse hundreds of verified listings from top professionals in the industry. Connect, collaborate, and build something great.
            </p>

            {/* Premium Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden p-2 ring-1 ring-white/10 focus-within:ring-amber-500/50 focus-within:border-amber-500/50 transition-all">
                <Search className="ml-4 h-6 w-6 text-slate-400" />
                <Input
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0 text-lg h-12"
                  placeholder="Search by keyword, company, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="h-10 md:h-12 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-all">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🔹 LISTINGS CONTENT */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">

          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Available Listings</h2>
              <p className="text-muted-foreground mt-1">
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[300px] rounded-2xl bg-muted/50 animate-pulse border border-border/50"></div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground">No listings found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                We couldn't find any listings matching "{searchTerm}". Try adjusting your search keywords.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group h-full flex flex-col overflow-hidden border-border/50 bg-card hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 rounded-2xl">
                    <div className="p-6 flex flex-col h-full relative">
                      {/* Top highlight bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                          <Building2 className="w-6 h-6 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                        </div>
                        <Badge variant="secondary" className="bg-secondary/50 font-medium text-xs px-3 py-1">
                          {listing.category}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-amber-500 transition-colors mb-1 line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                          {listing.companyName}
                        </p>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {listing.description}
                      </p>

                      {/* Footer */}
                      <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {listing.location ? (
                            <>
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{listing.location}</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Remote / Flexible</span>
                            </>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/listings/${listing._id}`)}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 p-0 h-auto font-semibold px-3 py-1.5 rounded-full"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-blue-600/10 opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Expand Your Reach?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Join thousands of construction and engineering professionals using ProMart to connect, hire, and grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-amber-500/25 transition-all"
                onClick={() => navigate('/register')}
              >
                List Your Business
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-white/10 h-12 px-8 rounded-full"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicListings;