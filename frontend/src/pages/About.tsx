import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp, Shield, Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import aboutUsAnimation from '@/assets/About us.json';

const About = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const values = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'Every contractor, applicator, and subcontractor is verified for trust and reliability.',
    },
    {
      icon: Users,
      title: 'Industry Community',
      description: 'Connect with construction & engineering professionals who understand your challenges.',
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'We prioritize excellence in every listing, application, and partnership.',
    },
    {
      icon: Heart,
      title: 'Dedicated Support',
      description: 'Our team is here to help you succeed—before, during, and after your project.',
    },
  ];



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Using Index page dark gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1
                className="mb-6 text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About ProMart
              </h1>
              <p className="text-xl text-slate-300">
                Connecting Construction & Engineering Professionals for Success
              </p>
            </motion.div>
            {animationData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Lottie animationData={animationData} loop={true} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Wave divider like Index page */}
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

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="mb-4 text-lg leading-relaxed text-slate-600">
                We aim to transform the way construction and engineering professionals interact.
                Our digital marketplace provides businesses and individuals with the tools to
                showcase their services, explore new opportunities, and stay updated on the latest
                industry trends.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">What We Offer</h2>
              </div>
              <ul className="space-y-3 text-lg leading-relaxed text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✅</span>
                  <span><strong>Business Listings:</strong> Discover trusted contractors, applicators, and service providers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✅</span>
                  <span><strong>Applications:</strong> Apply for projects and grow your professional network.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✅</span>
                  <span><strong>Industry News:</strong> Stay updated with the latest insights and trends.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✅</span>
                  <span><strong>Advertisement:</strong> Promote your services to a targeted audience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✅</span>
                  <span><strong>Easy Search:</strong> Find the right professionals effortlessly.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              className="mb-4 text-4xl font-bold text-slate-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Why Choose ProMart?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              We're passionate about laying the foundation for your success
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-500/10">
                    <value.icon className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-800">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t bg-gradient-to-br from-slate-50 to-blue-50/20 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h2
                className="mb-6 text-4xl font-bold text-slate-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Story
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-slate-600">
                Founded in 2020, ProMart was born from a simple observation: construction and
                engineering professionals needed a better way to find reliable partners.
                Traditional methods were slow, risky, and inefficient.
              </p>
              <p className="mb-4 text-lg leading-relaxed text-slate-600">
                We built ProMart to solve this—creating a verified, easy-to-use platform where
                contractors, applicators, and subcontractors can connect with confidence.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                Today, we empower thousands of professionals worldwide to win projects,
                build networks, and grow their businesses on a foundation of trust.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-lg mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full"></div>
                <Lottie animationData={aboutUsAnimation} loop={true} className="relative z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white relative mb-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0f172a,_#1e293b)]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-4 text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Build Your Success?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of construction professionals already growing with ProMart.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 group"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;