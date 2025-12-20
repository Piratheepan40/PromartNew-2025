import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [heroAnimation, setHeroAnimation] = useState<any>(null);
  const [networkAnimation, setNetworkAnimation] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // Trim whitespace in URLs
    fetch("https://assets5.lottiefiles.com/packages/lf20_uu0x8lqv.json")
      .then((res) => res.json())
      .then(setHeroAnimation)
      .catch(console.warn);

    fetch("https://assets4.lottiefiles.com/private_files/lf30_WdTEui.json")
      .then((res) => res.json())
      .then(setNetworkAnimation)
      .catch(console.warn);
  }, []);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenSignupPopup");

    if (!hasSeenPopup) {
      setShowPopup(true); // show popup only first time
    } else {
      setShowPopup(false); // never show again
    }
  }, []);

  const features = [
    {
      icon: Building2,
      title: "List Your Business",
      description: "Create professional listings and reach qualified clients.",
    },
    {
      icon: TrendingUp,
      title: "Promoted Ads",
      description: "Amplify visibility with premium ad placements.",
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Trusted by clients—every listing is manually verified.",
    },
    {
      icon: Users,
      title: "B2B Network",
      description: "Forge partnerships across industries and borders.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Connect. <span className="text-amber-400">Trade.</span> Grow.
              </motion.h1>
              <p className="mb-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0">
                The premier B2B marketplace for discerning businesses to
                showcase expertise and unlock high-value opportunities.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/30 transition-all duration-300 px-8"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-500 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 backdrop-blur-sm bg-white/5 shadow-lg"
                  >
                    Browse Listings
                  </Button>
                </Link>
              </div>
            </motion.div>

            {heroAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-md lg:max-w-lg">
                  <Lottie animationData={heroAnimation} loop={true} />
                </div>
              </motion.div>
            )}
          </div>
        </div>

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
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="mb-4 text-4xl font-bold text-slate-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Why ProMart?
              </h2>
              <p className="text-lg text-slate-600 max-w-xl">
                A curated B2B ecosystem built for trust, visibility, and
                growth—designed for businesses that demand excellence.
              </p>
            </motion.div>

            {networkAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-md">
                  <Lottie animationData={networkAnimation} loop={true} />
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="mb-4 h-10 w-10 text-amber-500" />
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-amber-50/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2
              className="mb-4 text-4xl font-bold text-slate-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              By the Numbers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join a thriving network of forward-thinking businesses.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "500+", label: "Active Businesses", icon: Building2 },
              { number: "10K+", label: "Monthly Visitors", icon: Users },
              { number: "95%", label: "Client Satisfaction", icon: TrendingUp },
              { number: "2.5K+", label: "Successful Deals", icon: CheckCircle },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <stat.icon className="mx-auto mb-4 h-10 w-10 text-amber-500" />
                    <div className="mb-2 text-3xl font-bold text-slate-800">
                      {stat.number}
                    </div>
                    <p className="text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
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
              Ready to Expand Your Reach?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join hundreds of elite businesses already growing with ProMart.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Signup Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8 text-center relative"
          >
            <h2
              className="text-2xl font-bold text-slate-800 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Join ProMart Today
            </h2>
            <p className="text-slate-600 mb-8">
              Create your free account and start connecting with businesses
              instantly.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                to="/register"
                onClick={() =>
                  localStorage.setItem("hasSeenSignupPopup", "true")
                }
              >
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-5 text-lg shadow-md">
                  Sign Up
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  localStorage.setItem("hasSeenSignupPopup", "true");
                  setShowPopup(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
