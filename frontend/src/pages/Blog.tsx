import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import { getBlogs } from "@/services/blogService";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("https://assets3.lottiefiles.com/packages/lf20_w98qte06.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => console.log("Animation loading failed"));
  }, []);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs(selectedCategory);
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  const categories = [
    "All",
    "Tips & Tricks",
    "Industry Insights",
    "Guides",
    "Success Stories",
    "Business Finance",
    "Relationships",
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
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
                ProMart Blog
              </h1>
              <p className="text-xl text-slate-300">
                Insights, tips, and success stories from the B2B marketplace
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
      </section>

      {/* Categories */}
      <section className="border-b bg-gradient-to-br from-slate-50 to-amber-50/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  category === selectedCategory
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold border-0"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-0">
                Featured Post
              </Badge>
              <Card className="rounded-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-80 md:h-auto">
                    <img
                      src={blogPosts[0].image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                      alt={blogPosts[0].title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <Badge
                      variant="secondary"
                      className="mb-4 w-fit bg-slate-100 text-slate-700"
                    >
                      {blogPosts[0].category}
                    </Badge>
                    <h2 className="mb-4 text-3xl font-bold text-slate-800">
                      {blogPosts[0].title}
                    </h2>
                    <p className="mb-6 text-slate-600">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(blogPosts[0].date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                    <Link to={`/blog/${blogPosts[0].id}`}>
                      <Button className="w-fit bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2
            className="mb-8 text-3xl font-bold text-slate-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Latest Articles
          </h2>
          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm">
              <p className="text-slate-600">
                No articles found in this category
              </p>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.slice(1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group h-full rounded-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <Badge
                        variant="secondary"
                        className="mb-3 bg-slate-100 text-slate-700"
                      >
                        {post.category}
                      </Badge>
                      <h3 className="mb-3 text-xl font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                        {post.excerpt}
                      </p>
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <Button
                          variant="ghost"
                          className="group -ml-4 p-0 text-amber-600 hover:text-amber-700 hover:bg-transparent"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t bg-gradient-to-br from-slate-50 to-amber-50/20 py-16 ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2
              className="mb-4 text-3xl font-bold text-slate-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay Updated
            </h2>
            <p className="mb-6 text-slate-600">
              Subscribe to our newsletter for the latest B2B insights and
              success stories
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-xl border-slate-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:ring-amber-500 sm:w-80"
              />
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/40"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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
              Ready to Grow Your Business?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of businesses already succeeding with ProMart.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              onClick={() => (window.location.href = "/register")}
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

export default Blog;
