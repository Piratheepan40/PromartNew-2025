import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import aboutVisual from "@/assets/about_visual.svg";
import constructionAnimationData from "@/assets/construction-animation.json";
import Lottie from "lottie-react";

import {
  Building2,
  HardHat,
  Newspaper,
  Megaphone,
  Search,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };



  // useEffect removed as we are importing directly

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* 🔹 HERO SECTION - Split Layout */}
      <section className="relative flex justify-center overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-background">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-background"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
          {/* Abstract Glows */}
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Column: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-muted-foreground text-sm mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                The #1 Marketplace for Professionals
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
                Connecting <br className="hidden lg:block" />
                <span>Construction &</span> <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Engineering</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed font-light">
                ProMart connects contractors, applicators, and engineers to real opportunities. Build trust, close deals, and grow with a
                network that speaks your language. solid, secure, and professional.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/listings">
                  <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all">
                    Explore Professionals
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border text-foreground hover:bg-secondary rounded-lg transition-all">
                    List Your Business
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> <span>Verified Pros</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" /> <span>Secure Deals</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] perspective-1000">
                {/* Hero Lottie Animation */}
                <div className="w-full h-full flex items-center justify-center p-4">
                  {/* Clean background for Lottie to pop */}
                  {constructionAnimationData ? (
                    <div className="relative w-full h-full transform transition-transform duration-700 hover:scale-105">
                      <Lottie animationData={constructionAnimationData} loop={true} className="w-full h-full drop-shadow-2xl" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-3xl">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>

                {/* Glassmorphism Floating Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="absolute bottom-10 left-10 right-10 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Active Projects</span>
                      <div className="text-2xl font-bold text-foreground mt-1">1,240+</div>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white dark:border-slate-800 shadow-sm"></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative background blob behind image */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-600/10 to-blue-500/10 rounded-full blur-[80px]"></div>
            </motion.div>
          </div>

          {/* Scroll Down Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest opacity-50 font-medium">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* 🔹 ABOUT PROMART */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-display">
                Building Connections. <br /><span className="text-blue-500">Powering Progress.</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  At ProMart, we believe construction is more than bricks and beams—it’s people. Our platform connects skilled professionals across the construction and engineering industries, making collaboration simple, transparent, and effective.
                </p>
                <p>
                  Whether you’re hiring talent or showcasing your expertise, ProMart gives you the digital tools to move faster and build smarter.
                </p>
              </div>
            </motion.div>

            {/* Visual/Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              <img
                src={aboutVisual}
                alt="ProMart Construction Connections"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔹 OUR MISSION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-blue-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Our Purpose</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground">To transform how construction and engineering professionals connect.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-8 text-left"
          >
            {[
              { icon: Megaphone, text: "Showcase services professionally" },
              { icon: Search, text: "Discover new projects and partners" },
              { icon: Newspaper, text: "Stay informed with industry insights" },
              { icon: ShieldCheck, text: "Build long-term credibility in a trusted network" }
            ].map((item, i) => (
              <motion.div key={i} variants={cardVariant} className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-blue-500/30 transition-colors group shadow-sm hover:shadow-md">
                <div className="p-3 rounded-xl bg-secondary group-hover:bg-blue-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-blue-400" />
                </div>
                <span className="text-lg font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🔹 WHAT WE OFFER - Core Features */}
      <section className="py-24 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything You Need. One Platform.</h2>
            <p className="text-muted-foreground">Comprehensive tools for the modern builder.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Business Listings", desc: "Find verified contractors, applicators, and service providers you can rely on.", icon: Building2 },
              { title: "Project Applications", desc: "Apply for opportunities, connect with companies, and expand your professional reach.", icon: HardHat },
              { title: "Industry News", desc: "Stay ahead with the latest construction and engineering trends.", icon: Newspaper },
              { title: "Advertisement", desc: "Promote your services directly to a targeted, relevant audience.", icon: Megaphone },
              { title: "Easy Search", desc: "Smart filters help you find the right people—fast, no headache.", icon: Search },
              { title: "Verified Network", desc: "Work with contractors and subcontractors you can actually trust.", icon: CheckCircle },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-card border border-border hover:bg-card/80 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 WHY CHOOSE PROMART */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Professionals Choose ProMart</h2>
            <p className="text-xl text-muted-foreground">ProMart respects the old-school values of craftsmanship—while giving you modern digital power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: "Simplified Discovery", desc: "No noise. No clutter. Just the right professionals, when you need them.", icon: Search },
              { title: "Verified Network", desc: "Work with contractors and subcontractors you can actually trust.", icon: ShieldCheck },
              { title: "Seamless Experience", desc: "Clean design. Fast navigation. Zero confusion.", icon: Zap },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mb-6 shadow-xl relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
                  <item.icon className="w-8 h-8 text-foreground relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA SECTION */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Ready to Build Your Next Opportunity?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Whether you’re looking to hire or be hired, ProMart puts the right tools in your hands.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full w-full sm:w-auto">
                    Join ProMart Today
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg border border-border text-foreground hover:bg-background rounded-full w-full sm:w-auto">
                    Register Your Business
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
