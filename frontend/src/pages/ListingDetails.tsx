import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import mockApi from "@/services/mockApi";
import { Listing } from "@/types";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Tag,
  FileText,
  ArrowLeft,
  MapPin,
  Globe,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Star,
  Download,
  Shield,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
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
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            <p className="text-slate-600">Loading...</p>
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
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Listing Not Found
            </h2>
            <Button
              onClick={() => navigate("/listings")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold"
            >
              Browse Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative border-b bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 -ml-2 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={listing.status} />
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {listing.category}
                  </Badge>
                </div>

                <h1
                  className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {listing.title}
                </h1>

                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Posted{" "}
                    {formatDistanceToNow(new Date(listing.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
                    >
                      Contact Company
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] border-slate-200 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Contact {listing.companyName}
                      </DialogTitle>
                      <DialogDescription className="text-slate-600">
                        Interested in this listing? Send a direct inquiry to the company.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInquirySubmit} className="space-y-5 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Name</label>
                          <Input
                            name="name"
                            required
                            placeholder="Your Name"
                            value={inquiryForm.name}
                            onChange={handleInquiryChange}
                            className="border-slate-200 focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Email</label>
                          <Input
                            name="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={inquiryForm.email}
                            onChange={handleInquiryChange}
                            className="border-slate-200 focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone (Optional)</label>
                        <Input
                          name="phone"
                          placeholder="Your Phone Number"
                          value={inquiryForm.phone}
                          onChange={handleInquiryChange}
                          className="border-slate-200 focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Subject</label>
                        <Input
                          name="subject"
                          placeholder={`Inquiry about ${listing.title}`}
                          value={inquiryForm.subject}
                          onChange={handleInquiryChange}
                          className="border-slate-200 focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Message</label>
                        <Textarea
                          name="message"
                          required
                          placeholder="Tell the company what you're interested in..."
                          rows={4}
                          value={inquiryForm.message}
                          onChange={handleInquiryChange}
                          className="border-slate-200 focus:border-amber-500 min-h-[100px]"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submittingInquiry}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold h-12 text-lg shadow-lg"
                      >
                        {submittingInquiry ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background"
          >
            <path
              d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Description */}
              <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <FileText className="h-5 w-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Description
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-base leading-relaxed text-slate-600">
                    {listing.description}
                  </p>
                </div>
              </Card>

              {/* Key Features */}
              <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Key Features
                  </h2>
                </div>

                {(() => {
                  let features: string[] = [];

                  // Handle the specific format where keyFeatures is an array with one JSON string
                  if (
                    listing?.keyFeatures &&
                    Array.isArray(listing.keyFeatures) &&
                    listing.keyFeatures.length > 0
                  ) {
                    const firstItem = listing.keyFeatures[0];

                    if (
                      typeof firstItem === "string" &&
                      firstItem.startsWith("[")
                    ) {
                      try {
                        // Parse the JSON string array
                        features = JSON.parse(firstItem);
                      } catch (e) {
                        console.error("Failed to parse keyFeatures:", e);
                        // Fallback: try to extract features from the string
                        features = firstItem
                          .replace(/[\[\]"]/g, "")
                          .split(",")
                          .map((item) => item.trim());
                      }
                    } else if (Array.isArray(firstItem)) {
                      // If it's already a nested array
                      features = firstItem;
                    } else if (typeof firstItem === "string") {
                      // If it's a simple string, use it as a single feature
                      features = [firstItem];
                    }
                  } else if (Array.isArray(listing?.keyFeatures)) {
                    // If it's already a proper array
                    features = listing.keyFeatures;
                  }

                  // Filter out any empty strings and ensure all items are strings
                  features = features.filter(
                    (feature) => feature && typeof feature === "string"
                  );

                  if (features.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground">
                        No features listed yet.
                      </p>
                    );
                  }

                  return (
                    <div className="grid gap-4 md:grid-cols-2">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.03 }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                            <CheckCircle2 className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="font-medium text-slate-700">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </Card>

              {/* Admin Feedback */}
              {listing.adminComment && (
                <Card className="rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/50 p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Admin Feedback
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {listing.adminComment}
                  </p>
                </Card>
              )}

              {/* Attachments (Company Images Only) */}
              {listing.attachments && listing.attachments.length > 0 && (
                <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Company Images
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listing.attachments
                      .filter(
                        (file) =>
                          file.url?.toLowerCase().endsWith(".jpg") ||
                          file.url?.toLowerCase().endsWith(".jpeg") ||
                          file.url?.toLowerCase().endsWith(".png")
                      )
                      .map((image, index) => (
                        <motion.div
                          key={index}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md"
                        >
                          <img
                            src={
                              image?.url?.startsWith("http")
                                ? image.url
                                : `http://localhost:5000${image.url}`
                            }
                            alt={image.name || `Company Image ${index + 1}`}
                            className="h-48 w-full object-cover"
                          />
                        </motion.div>
                      ))}
                  </div>
                </Card>
              )}

              {/* Verification Documents (Admin Only) */}
              {isAdmin &&
                listing.verificationDocuments &&
                listing.verificationDocuments.length > 0 && (
                  <Card className="rounded-2xl border-2 border-amber-500/20 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="rounded-lg bg-amber-500/10 p-2">
                        <Shield className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                          Verification Documents
                        </h2>
                        <p className="text-sm text-slate-600">
                          Admin-only view
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {listing.verificationDocuments
                        .filter((doc) =>
                          doc.url?.toLowerCase().endsWith(".pdf")
                        )
                        .map((doc) => (
                          <Card
                            key={doc.id}
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                                  <FileText className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-slate-600">
                                    {(doc.size / 1024).toFixed(2)} KB • Uploaded{" "}
                                    {new Date(
                                      doc.uploadedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-amber-500 text-amber-600 hover:bg-amber-50"
                              >
                                <a href={doc.url} download={doc.name}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </Card>
                )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Company Card */}
              <Card className="rounded-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Posted by</p>
                      <h3 className="text-xl font-bold">
                        {listing.companyName}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <h4 className="mb-4 font-semibold text-slate-800">
                      Company Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-slate-700">
                            {listing.companyId.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Phone className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="font-medium text-slate-700">
                            {listing.companyId.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500">Location</p>
                          <p className="font-medium text-slate-700">
                            {listing.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Globe className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500">Website</p>
                          <Link
                            to="#"
                            className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
                          >
                            {listing.website}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  <div>
                    <h4 className="mb-4 font-semibold text-slate-800">
                      Company Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-amber-500/5 p-4 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-amber-500">3</p>
                        <p className="text-xs text-slate-600">
                          Active Listings
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-500/5 p-4 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <Users className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-amber-500">50+</p>
                        <p className="text-xs text-slate-600">Clients Served</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
                    size="lg"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    Contact Company
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>

              {/* Trust Badges */}
              <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h4 className="mb-4 font-semibold text-slate-800">
                  Verified & Trusted
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-medium text-slate-700">
                      Admin Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <Award className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-medium text-slate-700">
                      Premium Member
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-medium text-slate-700">
                      5 Star Rating
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-4 text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to List Your Business?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of businesses already growing with ProMart.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              onClick={() => navigate("/register")}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ListingDetails;
