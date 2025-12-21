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
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-amber-500/30">
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
              className="hover:text-amber-500 cursor-pointer transition-colors"
              onClick={() => navigate('/listings')}
            >
              Listings
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-amber-500 font-medium truncate max-w-[200px]">{listing?.category}</span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                  {listing.category}
                </Badge>
                {listing.status === 'approved' && (
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10 gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Listing
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight font-display">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-white">{listing.companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <span>{listing.location || "Remote / Flexible"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span>Posted {new Date(listing.createdAt || Date.now()).toLocaleDateString()}</span>
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
              <Card className="rounded-2xl border-border shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-1 border-b border-amber-500/20">
                  <div className="px-6 py-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-amber-700 dark:text-amber-500 text-sm uppercase tracking-wide">Key Highlights</span>
                  </div>
                </div>
                <div className="p-8 bg-card">
                  {(() => {
                    let features: string[] = [];
                    if (listing?.keyFeatures && Array.isArray(listing.keyFeatures) && listing.keyFeatures.length > 0) {
                      const firstItem = listing.keyFeatures[0];
                      if (typeof firstItem === "string" && firstItem.startsWith("[")) {
                        try { features = JSON.parse(firstItem); } catch (e) { features = [firstItem]; }
                      } else if (Array.isArray(firstItem)) { features = firstItem; }
                      else if (typeof firstItem === "string") { features = [firstItem]; }
                    } else if (Array.isArray(listing?.keyFeatures)) { features = listing.keyFeatures; }

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
              <Card className="p-8 rounded-2xl border-border shadow-sm">
                <h2 className="text-2xl font-bold font-display text-foreground mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                  About this Listing
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {listing.description}
                  </p>
                  <p className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5 text-foreground italic mt-6 rounded-r-lg">
                    "{listing.companyName} is committed to delivering excellence in {listing.category}."
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Gallery (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-8 rounded-2xl border-border shadow-sm">
                <h2 className="text-2xl font-bold font-display text-foreground mb-6">Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video rounded-xl bg-muted overflow-hidden group cursor-pointer relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={`https://source.unsplash.com/random/800x600?construction,building,${i}`}
                        alt="Gallery"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  ))}
                  {listing.attachments && listing.attachments.length > 0 && listing.attachments.map((att, i) => (
                    <div key={`att-${i}`} className="aspect-video rounded-xl bg-muted overflow-hidden group cursor-pointer relative">
                      <img src={att.url} alt={att.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Admin Verification (Conditional) */}
            {isAdmin && listing.verificationDocuments && listing.verificationDocuments.length > 0 && (
              <Card className="p-8 rounded-2xl border-2 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-amber-600" />
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

              {/* CTA Card (Replaces "Actions") */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 rounded-2xl border-border shadow-xl bg-card relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                  <h3 className="font-bold text-xl text-foreground mb-2">Interested?</h3>
                  <p className="text-muted-foreground mb-6">Connect with {listing.companyName} directly to discuss your project.</p>

                  <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12 text-lg shadow-lg hover:shadow-amber-500/25 transition-all mb-3">
                        Contact Company <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Contact {listing.companyName}</DialogTitle>
                        <DialogDescription>Send a message directly to their team.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleInquirySubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input name="name" required value={inquiryForm.name} onChange={handleInquiryChange} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" required value={inquiryForm.email} onChange={handleInquiryChange} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea name="message" required rows={4} value={inquiryForm.message} onChange={handleInquiryChange} placeholder="Describe your project..." />
                        </div>
                        <Button type="submit" disabled={submittingInquiry} className="w-full bg-amber-500 text-slate-950 font-bold">
                          {submittingInquiry ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 h-12">
                    <Share2 className="w-4 h-4 mr-2" /> Share Listing
                  </Button>
                </Card>
              </motion.div>

              {/* Company Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 rounded-2xl border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-4 pb-4 border-b border-border">Company Details</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">{listing.location || "Headquarters: Colombo, LK"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">contact@{listing.companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Website</p>
                        <a href="#" className="text-sm text-amber-600 hover:underline">Visit Website</a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* REMOVED: Verified & Trusted / Trust Score Card */}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetails;
