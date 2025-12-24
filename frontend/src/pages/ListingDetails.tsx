import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types";
import {
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  MapPin,
  Globe,
  Users,
  CheckCircle2,
  Star,
  Download,
  Shield,
  ArrowRight,
  Share2,
  ChevronRight,
  FileText,
  Award,
  Calendar
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getApprovedListings } from "@/services/listingService";
import { sendInquiry } from "@/services/inquiryService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: user?.companyName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
  });

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setSubmittingInquiry(true);
    try {
      await sendInquiry({
        listingId: listing._id,
        ...inquiryForm,
        subject: inquiryForm.subject || `Inquiry about ${listing.title}`,
      });
      toast.success("Inquiry sent successfully!");
      setIsContactModalOpen(false);
      setInquiryForm({
        ...inquiryForm,
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const listings = await getApprovedListings();
      const found = listings.find((l) => String(l._id) === id);
      setListing(found || null);
    } catch (error) {
      console.error("Failed to load listing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            <p className="text-muted-foreground animate-pulse">Loading Listing...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="mb-6 h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              Listing Not Found
            </h2>
            <p className="text-muted-foreground mb-8">
              The listing you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Button
              onClick={() => navigate("/listings")}
              className="bg-blue-600 hover:bg-blue-700 text-slate-950 font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar />

      {/* 🔹 HERO SECTION - Immersive Header */}
      <section className="relative w-full bg-slate-950 text-white pt-24 pb-32 lg:pb-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        <div className="container relative mx-auto px-4 z-10">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400"
          >
            <span
              className="hover:text-blue-500 cursor-pointer transition-colors"
              onClick={() => navigate('/listings')}
            >
              Listings
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-blue-500 font-medium truncate max-w-[200px]">{listing?.category}</span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors backdrop-blur-md">
                  {listing.category}
                </Badge>
                {listing.status === 'approved' && (
                  <Badge variant="outline" className="px-3 py-1 rounded-full text-emerald-400 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Listing
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-sm">
                {listing.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-slate-400 mb-8 border-l-2 border-blue-500/30 pl-4 md:border-0 md:pl-0">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 transition-colors">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-lg">{listing.companyName}</span>
                </div>
                <div className="w-px h-8 bg-slate-800 hidden md:block"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <MapPin className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="font-medium">{listing.location || "Remote / Flexible"}</span>
                </div>
                <div className="w-px h-8 bg-slate-800 hidden md:block"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <Calendar className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="font-medium">Posted {new Date(listing.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔹 MAIN CONTENT - Overlapping Design */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Key Features Card (Highlighted) */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-1 border-b border-blue-600/20">
                  <div className="px-6 py-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-700 dark:text-blue-500 text-sm uppercase tracking-wide">Key Highlights</span>
                  </div>
                </div>
                <div className="p-8 bg-card">
                  {(() => {
                    let features: string[] = [];
                    // Robust handling of keyFeatures
                    if (listing?.keyFeatures) {
                      if (Array.isArray(listing.keyFeatures)) {
                        // Handle legacy case where first element is a JSON string of array
                        if (listing.keyFeatures.length > 0 && typeof listing.keyFeatures[0] === 'string' && listing.keyFeatures[0].startsWith('[')) {
                          try {
                            const parsed = JSON.parse(listing.keyFeatures[0]);
                            if (Array.isArray(parsed)) features = parsed;
                            else features = [listing.keyFeatures[0]]; // Fallback
                          } catch {
                            features = listing.keyFeatures;
                          }
                        } else {
                          // Normal array of strings
                          features = listing.keyFeatures;
                        }
                      } else if (typeof listing.keyFeatures === 'string') {
                        try {
                          // Attempt to parse stringified array (fixes legacy double-stringified data)
                          const parsed = JSON.parse(listing.keyFeatures);
                          if (Array.isArray(parsed)) features = parsed;
                          else features = [listing.keyFeatures];
                        } catch {
                          features = [listing.keyFeatures];
                        }
                      }
                    }

                    features = features.filter((f) => f && typeof f === "string");

                    if (features.length === 0) return <p className="text-muted-foreground">No specific features highlighted.</p>;

                    return (
                      <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="h-6 w-6 mt-0.5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-foreground font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </Card>
            </motion.div>

            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 rounded-3xl border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                <h2 className="text-2xl font-bold font-display text-foreground mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                  About this Listing
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {listing.description}
                  </p>
                  <p className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/5 text-foreground italic mt-6 rounded-r-lg">
                    "{listing.companyName} is committed to delivering excellence in {listing.category}."
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Gallery */}
            {listing.attachments && listing.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-8 rounded-3xl border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                  <h2 className="text-2xl font-bold font-display text-foreground mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.attachments.map((att, i) => (
                      <div key={`att-${i}`} className="aspect-video rounded-2xl bg-muted overflow-hidden group cursor-pointer relative">
                        <img src={att.url} alt={att.name || 'Gallery Image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Admin Verification (Conditional) */}
            {isAdmin && listing.verificationDocuments && listing.verificationDocuments.length > 0 && (
              <Card className="p-8 rounded-3xl border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-foreground">Admin Verification Documents</h3>
                </div>
                <div className="space-y-3">
                  {listing.verificationDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download>Download</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* ACTION CARD: Contact & Share */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                  {/* Decorative Background Blur */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl rounded-bl-none"></div>

                  <div className="p-8 relative z-10">
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                        Interested?
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Connect with <span className="font-semibold text-slate-700 dark:text-slate-300">{listing.companyName}</span> to discuss your project requirements.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Mail className="w-5 h-5 mr-2" /> Contact Company
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-0 shadow-2xl rounded-2xl">
                          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-foreground">Contact {listing.companyName}</DialogTitle>
                              <DialogDescription>Send a detailed message to start a conversation.</DialogDescription>
                            </DialogHeader>
                          </div>
                          <div className="p-6">
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-foreground">Your Name</label>
                                  <Input name="name" required value={inquiryForm.name} onChange={handleInquiryChange} className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-foreground">Email Address</label>
                                  <Input name="email" type="email" required value={inquiryForm.email} onChange={handleInquiryChange} className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-11" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Message</label>
                                <Textarea name="message" required rows={4} value={inquiryForm.message} onChange={handleInquiryChange} placeholder="I'm interested in your listing because..." className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 resize-none" />
                              </div>
                              <Button type="submit" disabled={submittingInquiry} className="w-full bg-blue-600 hover:bg-blue-700 text-slate-950 font-bold h-12 rounded-xl text-base">
                                {submittingInquiry ? "Sending..." : "Send Message"}
                              </Button>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" className="w-full h-12 border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all">
                        <Share2 className="w-4 h-4 mr-2" /> Share Listing
                      </Button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>Verified & Secure Communication</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* COMPANY INFO CARD */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="rounded-3xl border-0 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-0">
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">Company Details</h3>
                    <Badge variant="secondary" className="bg-white dark:bg-slate-800 shadow-sm text-xs font-normal">Active</Badge>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                        <p className="text-base font-medium text-slate-900 dark:text-white">{listing.location || "Headquarters"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-base font-medium text-slate-900 dark:text-white truncate max-w-[200px]" title={listing.companyId?.email || listing.email}>
                          {listing.companyId?.email || listing.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Website</p>
                        <a href="#" className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors">
                          Visit Website <ArrowRight className="w-3 h-3 -rotate-45" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetails;
