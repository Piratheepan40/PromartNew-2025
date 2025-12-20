import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500/30 overflow-x-hidden">
      <Navbar />

      {/* 🔹 HERO SECTION - Split Layout */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 sm:py-32">
        {/* Textured Background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          {/* Abstract Glows */}
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                The #1 Marketplace for Professionals
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Connecting <br className="hidden lg:block" />
                <span className="text-white">Construction &</span> <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Engineering</span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed font-light">
                ProMart connects contractors, applicators, and engineers to real opportunities. Build trust, close deals, and grow with a
                network that speaks your language. solid, secure, and professional.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/listings">
                  <Button size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all">
                    Explore Professionals
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
                    List Your Business
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-medium">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 aspect-[4/5] transform rotate-1 hover:rotate-0 transition-transform duration-700">
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>

                {/* Hero Image */}
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                  alt="ProMart Construction & Engineering"
                  className="w-full h-full object-cover"
                />

                {/* Floating UI Card Overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Active Projects</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800"></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ delay: 1.5, duration: 1.5 }}
                      className="h-full bg-amber-500"
                    ></motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-10 right-10 w-full h-full border border-slate-800 rounded-2xl opacity-50 translate-x-4 translate-y-4"></div>
            </motion.div>
          </div>

          {/* Scroll Down Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest opacity-50">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* 🔹 ABOUT PROMART */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display">
                Building Connections. <br /><span className="text-amber-500">Powering Progress.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  At ProMart, we believe construction is more than bricks and beams—it’s people. Our platform connects skilled professionals across the construction and engineering industries, making collaboration simple, transparent, and effective.
                </p>
                <p>
                  Whether you’re hiring talent or showcasing your expertise, ProMart gives you the digital tools to move faster and build smarter.
                </p>
              </div>
            </motion.div>

            {/* Visual/Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                <Building2 className="w-32 h-32 text-slate-700 opacity-50" />
              </div>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔹 OUR MISSION */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-amber-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Our Purpose</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-slate-400">To transform how construction and engineering professionals connect.</p>
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
              <motion.div key={i} variants={cardVariant} className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors group">
                <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-slate-300 group-hover:text-amber-400" />
                </div>
                <span className="text-lg font-medium text-slate-200">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🔹 WHAT WE OFFER - Core Features */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need. One Platform.</h2>
            <p className="text-slate-400">Comprehensive tools for the modern builder.</p>
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
                className="group p-8 rounded-3xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="w-10 h-10 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 WHY CHOOSE PROMART */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Professionals Choose ProMart</h2>
            <p className="text-xl text-slate-400">ProMart respects the old-school values of craftsmanship—while giving you modern digital power.</p>
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
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 shadow-xl relative">
                  <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse"></div>
                  <item.icon className="w-8 h-8 text-white relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA SECTION */}
      <section className="py-32 bg-gradient-to-b from-slate-900 to-amber-950/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Build Your Next Opportunity?
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              Whether you’re looking to hire or be hired, ProMart puts the right tools in your hands.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full w-full sm:w-auto">
                    Join ProMart Today
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
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
